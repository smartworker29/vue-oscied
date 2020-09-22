import { Image } from '@/interfaces/GeneralInterfaces'

export enum TsUserRole {
  MANAGER = 'manager',
  RATER = 'rater',
  RATEE = 'ratee'
}

export interface TsAbstractUser {
  id: number
  fullName: string
  email: string
}

export interface TsSurveyDto {
}

export interface TsRateeUser {
  id: number
  fullName: string
  email: string
  image: Image | null
  isLive: boolean
  expiryTime: Date | null
}

export interface TsRaterUser {
  id: number
  fullName: string
  email: string
  image: Image | null
}

export interface TsNewUserForm {
  email: string,
  fullName: string
}

export interface TsUserDto {
  roles: TsUserRole[],
  user: TsAbstractUser
}
