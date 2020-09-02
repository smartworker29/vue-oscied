import { UpdateUserData } from '@/interfaces/UserInterfaces'

export enum TsUserRole {
  manager,
  rater,
  ratee
}

export interface TsSurveyDto {
}

export interface TsUserDto {
  role: TsUserRole,
  user: UpdateUserData
}
