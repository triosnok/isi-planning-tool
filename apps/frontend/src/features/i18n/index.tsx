import * as i18n from '@solid-primitives/i18n';
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
  numberFormats: Accessor<Record<NumberType, Intl.NumberFormat>>;
}

const I18nContext = createContext<I18nContextValue>();

export const I18nProvider: Component<{ children: JSX.Element }> = (props) => {
  const [locale, setLocale] = createSignal<Locale>('en');
  const [dict] = createResource(locale, fetchDictionary);

  const numberFormats = createMemo(() => {
    return {
      [NumberType.INTEGER]: new Intl.NumberFormat(locale(), {
        style: 'decimal',
        maximumFractionDigits: 0,
      }),
      [NumberType.DECIMAL]: new Intl.NumberFormat(locale(), {
        style: 'decimal',
        maximumFractionDigits: 2,
      }),
    };
  });

  return (
    <I18nContext.Provider value={{ locale, setLocale, dict, numberFormats }}>
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

export enum NumberType {
  INTEGER = 'integer',
  DECIMAL = 'decimal',
}

/**
 * Hook for retrieving translation functions for the current locale.
 *
 * @returns an object containing the translation function
 */
export const useTranslations = () => {
  const ctx = useI18n();
  const t = i18n.translator(ctx.dict);

  /**
   * Formats a number according to the current locale.
   *
   * @param value the number value to format
   * @param type the type of number to format, defaults to DECIMAL
   *
   * @returns the formatted number
   */
  const n = (value: number, type?: NumberType) => {
    const numberType = type ?? NumberType.DECIMAL;
    return ctx.numberFormats()[numberType].format(value);
  };

  return { locale: ctx.locale, setLocale: ctx.setLocale, t, n };
};
