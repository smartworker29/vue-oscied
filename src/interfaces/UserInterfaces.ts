import { Image } from '@/interfaces/GeneralInterfaces'
import { Vue } from 'vue/types/vue'

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
  locale?: string,
  image: Image
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
export interface RegistrationTsSurveyData extends RegistrationData {
  accessCode: string
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
  accessCode?: string | null
}

export interface LocaleData {
  locale: string
  localeName: string
}

export interface UpdatePasswordData {
  oldPassword: string
  newPassword: string
}

export interface ResetPasswordData {
  newPassword: string
  confirmPassword: string
}

export interface RequestResetPasswordData {
  username: string,
  origin: string
}

export enum ImageActions {
  ADD = 'add',
  CHANGE = 'change'
}

export type Cropper = Vue & {
  setStep: (step: number) => void;
}
