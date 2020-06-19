import { LocaleData } from '@/interfaces/UserInterfaces'

class LocaleHelper {
  readonly localeKey = 'user_locale'
  readonly defaultLocaleKey = 'default_locale'
  readonly defaultLocale = 'en'
  availableLocalesData: LocaleData[] = []
  readonly availableVeeValidateLocales: string[] = [
    'en',
    'de',
    'ar',
    'fr',
    'zh_CN', // todo[m]::change to needed dictionary
    'hi',
    'es',
    'ru',
    // 'tl',// todo[m]::search a dictionary for Tagalog
    'tr'
  ]

  constructor () {
    require('@/available_locales.json').forEach((item: LocaleData) => {
      this.availableLocalesData.push(item)
    })
  }

  getUserLocale () : string {
    return localStorage[this.localeKey]
      ? localStorage[this.localeKey]
      : process.env.VUE_APP_I18N_FALLBACK_LOCALE
  }

  setUserLocale (locale?: string | null) : void {
    if (!locale) {
      return
    }
    localStorage[this.localeKey] = locale
  }

  getLocaleForVeeValidate (locale: string) : string {
    if (!locale) {
      return this.defaultLocale
    }

    if (this.availableVeeValidateLocales.includes(locale)) {
      return locale
    }

    const partOfLocale = locale.substr(0, locale.indexOf('_'))
    if (!partOfLocale) {
      return this.defaultLocale
    }

    return this.availableVeeValidateLocales.includes(partOfLocale)
      ? partOfLocale
      : this.availableVeeValidateLocales.find(locale => locale.includes(partOfLocale)) || this.defaultLocale
  }

  getDefaultLocale () : string {
    return localStorage[this.defaultLocaleKey]
  }

  setDefaultLocale (locale?: string | null) : void {
    if (!locale) {
      return
    }
    localStorage[this.defaultLocaleKey] = locale
  }
}

export default new LocaleHelper()
