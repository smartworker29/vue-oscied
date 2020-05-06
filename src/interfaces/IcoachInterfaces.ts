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

export interface IcoachSkill {
  id: number
  category: number
  name: string,
  icoachSkillContents: IcoachSkillContent[]
}

export interface IcoachSkillContent {
  id: number,
  content: string,
  area: number
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
  icoachCourse: IcoachCourse
}

export interface IcoachCategorySkill {
  id: number,
  category: number,
  name: 'string'
}

export enum IcoachCategoriesEnum {
  SOFT_SKILLS = 1,
  ESSENTIAL_BUSINESS_SKILLS,
  ORGANISATIONAL_SKILLS
}

namespace IcoachCategories {
  export const SoftSkills = 1
  export const EssentialBusinessSkills = 2
  export const OrganisationalSkills = 3
}

export type IcoachCategories = typeof IcoachCategories[keyof typeof IcoachCategories];

export type IcoachDashboardInfo = {
  [key in IcoachCategories]: IcoachCategorySkill[]
}

export enum IcoachSkillDirections {
  PREV = 'prev',
  NEXT = 'next'
}
