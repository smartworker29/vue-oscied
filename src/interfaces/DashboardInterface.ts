export interface DashboardBaseItem {
  timeCreated: string
  timeCompleted: string | null
  amountCountProgress: number
  completedCountProgress: number
}

export interface DashboardSurveyItem extends DashboardBaseItem {
  surveyUserId: number
  surveyProduct: {
    id: number
    survey: {
      id: number
      title: string
      accessCode: string
    }
  }
}

export interface DashboardIcoachItem extends DashboardBaseItem {
  id: number
  icoachCourse: {
    id: number
    title: string
    accessCode: string
  }
}

export interface DashboardResponse {
  eq: DashboardSurveyItem[]
  values: DashboardSurveyItem[]
  behaviours: DashboardSurveyItem[]
  dp: DashboardSurveyItem[]
  ipulse: DashboardSurveyItem[]
  icoach: DashboardIcoachItem[]
}
