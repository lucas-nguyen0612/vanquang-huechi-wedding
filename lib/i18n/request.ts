/**
 * Server request configuration for next-intl
 * Sets up locale detection and request handling
 */
import { getRequestConfig as nextIntlConfig } from 'next-intl/server'
import { defaultLocale } from './index'

export default nextIntlConfig(async ({ requestLocale }) => {
  // Detect locale from Accept-Language header or cookie
  // Filled in Epic 7
  const locale = (await requestLocale) ?? defaultLocale

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
