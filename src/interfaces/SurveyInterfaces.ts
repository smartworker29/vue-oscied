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

export interface SurveyLogo {
  fileName: string
  filePath: string
  fileURL: string
}

export interface SurveyUserInfo {
  surveyUserId: number
  isAuthorised: boolean
  isCompleted: boolean
}

export interface SurveyUserDto {
  surveyUserId: number
  productSurveyType: string
}

export interface SurveyLogo {
  fileURL: string
  filePath: string
  fileName: string
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
