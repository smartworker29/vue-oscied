export interface User {
  firstName: string
  lastName: string
  email: string
  gender: string
  phone?: string
  locale?: string
}

export interface RegistrationData {
  email: string
  firstName: string
  lastName: string
  gender: string
  phone?: string
  locale?: string | null
}

export interface SignInData {
  email: string
  password: string
}

export interface LocaleData {
  locale: string
  localeName: string
}
