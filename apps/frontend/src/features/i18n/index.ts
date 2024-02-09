import * as i18n from '@solid-primitives/i18n';
import { createResource, createSignal } from 'solid-js';
import type en from './locales/en.json';

export type Locale = 'en' | 'no';
export type RawDictionary = typeof en;
export type Dictionary = i18n.Flatten<RawDictionary>;

/**
 * Fetches the dictionary for the given locale
 * @param locale the locale to fetch
 * @returns a promise that resolves to the dictionary for the given locale
 */
async function fetchDictionary(locale: Locale): Promise<Dictionary> {
  const module = await import(`./locales/${locale}.json`);
  const dict: RawDictionary = module.default;

  return i18n.flatten(dict);
}

const [locale, setLocale] = createSignal<Locale>('en');
const [dict] = createResource(locale, fetchDictionary);

dict();

const t = i18n.translator(dict);

/**
 * Switches the current locale
 * @param locale the locale to switch to
 */
export function switchLocale(locale: Locale) {
  setLocale(locale);
}

export { i18n, t };
