import { Image } from '@/interfaces/GeneralInterfaces'

export interface Statement {
  id: number
  statement: string
  sectionId: number
}

export interface Section {
  id: number
  title: string
  instructions?: string | null
  position?: number | null
}

export interface SurveyInfo {
  id: number
  title: string
  welcomeMessage: string
  accessCode: string
  defaultLanguage: string
  isUnlimitedAccess: boolean
  logos: SurveyLogo[]
  validFrom: Date | null
  validTo: Date | null
}

export interface TakenSurveyData {
  productSurveyId: number
  productSurveyType: string
  surveyInfo: SurveyInfo
}

export interface ResponseProductSurveyInfo {
  surveyProductId: number
  survey: SurveyInfo
}

export interface SurveyLogo extends Image {}

export interface SurveyUserInfo {
  surveyUserId: number
  isAuthorised: boolean
  isCompleted: boolean
}

export interface SurveyUserDto {
  surveyUserId: number
  productSurveyType: string
}

export interface NextDpSurveyPart {
  id: number
  product: string
  surveyUserId: number
}

export interface DpProgress {
  nextSurveyPart: NextDpSurveyPart | null
  isCompleted: boolean
}
