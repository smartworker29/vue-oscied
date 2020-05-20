import { Image } from '@/interfaces/GeneralInterfaces'

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
  icoachSkillArea: IcoachSkillArea,
  isCompleted: boolean
}

export interface IcoachSkillArea {
  title: string,
  isTest: boolean
}

export interface IcoachSkillComment {
  comment: string,
  date: string | null
  user: IcoachCommentUser
}

export interface IcoachSkillQuestion {
  id: number,
  name: string,
  icoachSkillQuestionOptions: IcoachSkillQuestionOption[]
}

export interface IcoachSkillQuestionOption {
  id: number,
  name: string
}

export interface IcoachSkillScore {
  id: number,
  score: number
}

interface IcoachCommentUser {
  fullName: string,
  image: Image
}

export interface IcoachLogo extends Image {}

export interface IcoachUserInfo {
  id: number
  isAuthorised: boolean
}

export interface IcoachGeneralInfo {
  userId: number
  icoachCourse: IcoachCourse
}

export interface IcoachSkillProgressData {
  currentSkill: number,
  currentStep: number
}

export interface IcoachCategorySkill {
  id: number,
  category: number,
  name: string,
  completed: number,
  total: number,
  isCompleted: boolean
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
