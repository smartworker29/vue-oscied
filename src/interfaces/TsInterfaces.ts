import { Image } from '@/interfaces/GeneralInterfaces'

export enum TsUserRole {
  manager,
  rater,
  ratee
}

export interface TsUserUser {
  id: number
  firstName: string
  lastName: string
  email: string
  gender?: string | null
  phone?: string
  locale?: string
}

export interface TsSurveyDto {
}

export interface TsRateeUser {
  fullName: string
  email: string
  image: Image
  isLive: boolean
}

export interface TsUserDto {
  role: TsUserRole,
  user: TsUserUser
}
