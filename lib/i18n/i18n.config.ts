/**
 * i18n configuration constants
 * Supported locales and default settings
 */
export const supportedLocales = ['vi', 'en'] as const
export type SupportedLocale = (typeof supportedLocales)[number]

export const localeNames: Record<SupportedLocale, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
}

/** Default locale — used when user preference cannot be detected */
export const DEFAULT_LOCALE: SupportedLocale = 'vi'
