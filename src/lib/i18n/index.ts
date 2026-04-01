/**
 * next-intl configuration
 * Setup for internationalization — locales: vi (Vietnamese), en (English)
 * Filled in Epic 7
 */
import { getRequestConfig } from 'next-intl/server'

export const locales = ['vi', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'vi'

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? defaultLocale

  return {
    locale: locales.includes(locale as Locale) ? locale : defaultLocale,
    messages: (await import(`./messages/${locale as Locale}.json`)).default,
  }
})
