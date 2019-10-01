export interface BaseStatement {
  id: number
  statement: string
}
export interface SimpleStatement extends BaseStatement {
  sectionId: number
}

export interface EqStatement extends BaseStatement {
  position: number
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
  logos: string[]
  validFrom: Date | null
  validTo: Date | null
}

export interface CurrentSurveyData {
  productSurveyId: number
  productSurveyType: string
  surveyInfo: SurveyInfo
}

export interface CompleteSectionData {
  section: Section
  sectionNumber: number
  statements: BaseStatement[]
}

export interface ResponseProductSurveyInfo {
  surveyProductId: number
  survey: SurveyInfo
}
