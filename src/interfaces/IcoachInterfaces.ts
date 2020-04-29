export interface IcoachCourse {
  id: number
  title: string
  welcomeMessage: string
  accessCode: string
  defaultLanguage: string
  isPublished: boolean
  logos: IcoachLogo[]
  validFrom: Date | null
  validTo: Date | null
}

export interface IcoachLogo {
  fileName: string
  filePath: string
  fileURL: string
}

export interface IcoachUserInfo {
  id: number
  isAuthorised: boolean
}

export interface IcoachGeneralInfo {
  userId: number
  accessCode: string
}

export interface IcoachCategorySkill {
  id: number,
  category: number,
  name: 'string'
}

export enum IcoachCategories {
  SOFT_SKILLS = 1,
  ESSENTIAL_BUSINESS_SKILLS = 2,
  ORGANISATIONAL_SKILLS = 3
}

export type IcoachDashboardInfo = {
  [key in IcoachCategories]: IcoachCategorySkill[]
}
