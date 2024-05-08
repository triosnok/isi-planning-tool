import * as i18n from '@solid-primitives/i18n';
import dayjs from 'dayjs';
import {
  Accessor,
  Component,
  JSX,
  Resource,
  createContext,
  createMemo,
  createResource,
  createSignal,
  useContext,
} from 'solid-js';
import type en from './locales/en.json';

export type Locale = 'en' | 'no';
export type RawDictionary = typeof en;
export type Dictionary = i18n.Flatten<RawDictionary>;
export type TranslationKey = keyof Dictionary;

/**
 * Fetches the dictionary for the given locale
 *
 * @param locale the locale to fetch
 *
 * @returns a promise that resolves to the dictionary for the given locale
 */
async function fetchDictionary(locale: Locale): Promise<Dictionary> {
  const module = await import(`./locales/${locale}.json`);
  const dict: RawDictionary = module.default;

  return i18n.flatten(dict);
}

export interface I18nContextValue {
  locale: Accessor<Locale>;
  setLocale: (locale: Locale) => void;
  dict: Resource<Dictionary>;
  numberFormats: Accessor<Record<NumberFormat, Intl.NumberFormat>>;
  dateFormats: Accessor<Record<DateFormat, string>>;
}

const I18nContext = createContext<I18nContextValue>();

export const I18nProvider: Component<{ children: JSX.Element }> = (props) => {
  const [locale, setLocale] = createSignal<Locale>('en');
  const [dict] = createResource(locale, fetchDictionary);

  const numberFormats = createMemo(() => {
    return {
      [NumberFormat.INTEGER]: new Intl.NumberFormat(locale(), {
        style: 'decimal',
        maximumFractionDigits: 0,
      }),
      [NumberFormat.DECIMAL]: new Intl.NumberFormat(locale(), {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      [NumberFormat.PERCENTAGE]: new Intl.NumberFormat(locale(), {
        style: 'percent',
        maximumFractionDigits: 0,
      }),
    };
  });

  const dateFormats = createMemo(() => {
    return {
      [DateFormat.MONTH_DAY]: 'MMM D',
      [DateFormat.DATE]: 'L',
      [DateFormat.DATETIME]: 'L LT',
      [DateFormat.TIME]: 'LT',
    };
  });

  return (
    <I18nContext.Provider
      value={{ locale, setLocale, dict, numberFormats, dateFormats }}
    >
      {props.children}
    </I18nContext.Provider>
  );
};

/**
 * Internal hook for using the i18n context, will throw an error in cases where hooks are used outside the provider.
 *
 * @returns the i18n context
 */
const useI18n = () => {
  const ctx = useContext(I18nContext);

  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }

  return ctx;
};

export enum NumberFormat {
  INTEGER = 'integer',
  DECIMAL = 'decimal',
  PERCENTAGE = 'percentage',
}

export enum DateFormat {
  MONTH_DAY = 'month_day',
  DATE = 'date',
  DATETIME = 'datetime',
  TIME = 'time',
}

/**
 * Hook for retrieving translation functions for the current locale.
 *
 * @returns an object containing the translation function
 */
export const useTranslations = () => {
  const ctx = useI18n();
  const t = i18n.translator(ctx.dict, i18n.resolveTemplate);

  /**
   * Formats a number according to the current locale.
   *
   * @param value the number value to format
   * @param format the format to use, defaults to DECIMAL
   *
   * @returns the formatted number
   */
  const n = (value?: number, format?: NumberFormat) => {
    if (value === undefined) return '';
    const numberFormat = format ?? NumberFormat.DECIMAL;
    return ctx.numberFormats()[numberFormat].format(value);
  };

  /**
   * Formats a date according to the current locale.
   *
   * @param value the date value to format
   * @param format the format to use, defaults to DATETIME
   *
   * @returns the formatted date
   */
  const d = (value?: Date | string, format?: DateFormat) => {
    if (value === undefined) return '';

    const dateFormat = format ?? DateFormat.DATETIME;
    const formats = ctx.dateFormats();
    return dayjs(value).format(formats[dateFormat]);
  };

  return { locale: ctx.locale, setLocale: ctx.setLocale, t, n, d };
};
