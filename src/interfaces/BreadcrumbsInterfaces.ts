import { LocaleMessages } from 'vue-i18n'
import { RawLocation } from 'vue-router'

export interface BreadcrumbElement {
  name: string | LocaleMessages,
  link?: RawLocation
}
