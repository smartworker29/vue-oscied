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
  role: string
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

export interface TsManagerUser {
  id: number
  fullName: string
  email: string
  image: Image | null
}

export interface TsNewUserForm {
  email: string,
  firstName: string,
  lastName: string
}

export interface TsUserDto {
  roles: TsUserRole[],
  users: TsAbstractUser[]
}

export interface TsRaterRateeSkillRating {
  score: number
  comment: string
}

export interface TsRatingForm {
  score: number
  comment: string
}

export interface TsRateeScore {
  score: number
  timeCreated: string | null
  timeExpiry: string | null
}
