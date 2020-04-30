export interface SurveyData {
  surveyProductType: string
  surveyAccessCode: string | null
  surveyProductId: number
  surveyUserId: number
  dpSurveyId: number | null
  dpChildSurveys: string[]
}

export interface IcoachData {
  icoachAccessCode: string | null
  icoachCourseId: number
  icoachUserId: number
  icoachCourseTitle: string
}
