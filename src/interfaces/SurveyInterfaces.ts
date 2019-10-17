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
  logos: string[]
  validFrom: Date | null
  validTo: Date | null
}

export interface CurrentSurveyData {
  productSurveyId: number
  productSurveyType: string
  surveyInfo: SurveyInfo
  surveyUserInfo: SurveyUser
}

export interface CompleteSectionData {
  section: Section
  sectionNumber: number
  statements: Statement[]
}

export interface ResponseProductSurveyInfo {
  surveyProductId: number
  survey: SurveyInfo
}


export interface SurveyUser {
  surveyUserId: number
  isAuthorised: boolean
  isCompleted: boolean
}

export interface StatementIRI {
  statementId: string
}
