import { LocaleData } from '@/interfaces/UserInterfaces'

class LocaleHelper {
  readonly localeKey: string = 'user_locale'
  private availableLocales: string[] = []
  availableLocalesData: LocaleData[] = []
  readonly availableVeeValidateLocales: string[] = [
    'en',
    'de'
  ]

  constructor () {
    require('@/available_locales.json').forEach((item: LocaleData) => {
      this.availableLocalesData.push(item)
      this.availableLocales.push(item.locale.toLowerCase())
    })
  }

  getUserLocale () : string | null {
    return (typeof window !== 'undefined' && localStorage[this.localeKey])
      ? localStorage[this.localeKey]
      : process.env.VUE_APP_I18N_FALLBACK_LOCALE
  }

  setUserLocale (locale?: string | null) : void {
    if (!locale || typeof window === 'undefined') {
      return
    }
    localStorage[this.localeKey] = locale
  }

  getLocaleForVeeValidate (locale: string) : string {
    if (this.availableVeeValidateLocales.indexOf(locale) !== -1) {
      return locale
    }

    if (locale.indexOf('-') !== -1) {
      const partOfLocale = locale.substr(0, locale.indexOf('-'))

      if (this.availableVeeValidateLocales.indexOf(partOfLocale) !== -1) {
        return partOfLocale
      }
    }

    if (locale.indexOf('_') !== -1) {
      const partOfLocale = locale.substr(0, locale.indexOf('_'))

      if (this.availableVeeValidateLocales.indexOf(partOfLocale) !== -1) {
        return partOfLocale
      }
    }

    return 'en'
  }
}

export default new LocaleHelper()
