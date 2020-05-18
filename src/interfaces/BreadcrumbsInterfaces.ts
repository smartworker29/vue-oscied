import { LocaleMessages } from 'vue-i18n'
import { Location, RawLocation, Route } from 'vue-router'

export interface BreadcrumbElement {
  name: string | LocaleMessages,
  link?: RawLocation
}
