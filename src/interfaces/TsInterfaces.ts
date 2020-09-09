import { Image } from '@/interfaces/GeneralInterfaces'

export enum TsUserRole {
  manager,
  rater,
  ratee
}

export interface TsAbstractUser {
  id: number
  fullName: string
  email: string
}

export interface TsManager extends TsAbstractUser {}
export interface TsRatee extends TsAbstractUser {}
export interface TsRater extends TsAbstractUser {}

export interface TsSurveyDto {
}

export interface TsRateeUser {
  id: number
  fullName: string
  email: string
  image: Image | null
  isLive: boolean
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
