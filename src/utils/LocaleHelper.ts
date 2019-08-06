class LocaleHelper {
  readonly localeKey: string = 'user_locale'
  availableLocales: string[] = []

  constructor () {
    require('@/available_locales.json').forEach((item: string) => {
      this.availableLocales.push(item.toLowerCase())
    })
  }

  getUserLocale () : string | null {
    return localStorage[this.localeKey]
      ? localStorage[this.localeKey]
      : this.checkBrowserLocale()
  }

  setUserLocale (locale: string) : void {
    localStorage[this.localeKey] = locale
  }

  private checkBrowserLocale () : string | null {
    let locale = navigator.language.toLowerCase()
    if (this.availableLocales.indexOf(locale) !== -1) {
      return locale
    }

    if (locale.indexOf('-') === -1) {
      return null
    }

    locale = locale.substr(0, locale.indexOf('-'))
    return this.availableLocales.indexOf(locale) !== -1 ? locale : null
  }
}

export default new LocaleHelper()
