interface FormGender {
  label: string,
  value: string
}

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  gender: string
  phone?: string
  locale?: string
}

export interface UpdateUserData {
  firstName: string
  lastName: string
  email: string
  gender?: string | null
  phone?: string
  locale?: string
}

export interface UpdateUserDataForm {
  firstName: string
  lastName: string
  email: string
  gender?: FormGender | null
  phone?: string
  locale?: string
}

export interface RegistrationData {
  email: string
  firstName: string
  lastName: string
  gender?: string | null
  phone?: string
  locale?: string | null
}

export interface RegistrationFormData {
  email: string
  firstName: string
  lastName: string
  gender: FormGender | null
  phone: string
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

export interface UpdatePasswordData {
  oldPassword: string
  newPassword: string
}
