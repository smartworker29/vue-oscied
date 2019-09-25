export interface CurrentSurveyData {
  surveyProductType: string
  surveyAccessCode: string
  surveyProductId: number
}

export interface CompletedSectionStatement {
  id: number
  sortPosition: number
}

export interface CompletedSurveySectionData {
  id: number
  number: number
  statements: CompletedSectionStatement []
}

export interface UncompletedSurveyData {
  sections: CompletedSurveySectionData[]
}
