import { BaseApiService } from '@/services/BaseApiService'
import {
  DpProgress,
  ResponseProductSurveyInfo,
  Section,
  Statement,
  SurveyInfo,
  SurveyUserInfo
} from '@/interfaces/SurveyInterfaces'

class SurveyService extends BaseApiService {
  private validateSurveyProductType (surveyProductType: string) : string {
    if (surveyProductType === 'discovery-process') {
      return 'dp'
    }

    return surveyProductType
  }

  getProductSurveyInfo (surveyProductType: string, accessCode: string) : ResponseProductSurveyInfo {
    surveyProductType = this.validateSurveyProductType(surveyProductType)

    return this.callMethod('get', `/public/${surveyProductType}/survey/access-code/${accessCode}/`)
  }

  getSurveyInfoById (surveyProductType: string, surveyProductId: number) : SurveyInfo {
    surveyProductType = this.validateSurveyProductType(surveyProductType)

    return this.callMethod('get', `/${surveyProductType}/survey/id/${surveyProductId}/`)
  }

  getSurveySections (surveyProductType: string, surveyProductId: number) : Section[] {
    return this.callMethod('get', `/${surveyProductType}/survey/id/${surveyProductId}/sections/`)
  }

  getSectionStatements (surveyProductType: string, surveyProductId: number) : Statement[] {
    return this.callMethod('get', `/${surveyProductType}/section/id/${surveyProductId}/statements/`)
  }

  getSurveyUser (surveyProductType: string, surveyProductId: number, surveyAccessCode: string) : SurveyUserInfo | null {
    surveyProductType = this.validateSurveyProductType(surveyProductType)

    return this.callMethod(
      'post',
      `/${surveyProductType}/survey/user/get/`,
      { 'surveyId': surveyProductId, 'accessCode': surveyAccessCode }
    )
  }

  getCompletedSurveyUser (surveyProductType: string, surveyProductId: number, surveyAccessCode: string) : SurveyUserInfo | null {
    surveyProductType = this.validateSurveyProductType(surveyProductType)

    return this.callMethod(
      'post',
      `/${surveyProductType}/survey/completed/user/get/`,
      { 'surveyId': surveyProductId, 'accessCode': surveyAccessCode }
    )
  }

  createSurveyUser (surveyProductType: string, surveyProductId: number, surveyAccessCode: string) : SurveyUserInfo {
    surveyProductType = this.validateSurveyProductType(surveyProductType)

    return this.callMethod(
      'post',
      `/${surveyProductType}/survey/user/create/`,
      { 'surveyId': surveyProductId, 'accessCode': surveyAccessCode }
    )
  }

  getSurveyProgress (surveyProductType: string, surveyProductUserId: number) : number | null {
    surveyProductType = this.validateSurveyProductType(surveyProductType)
    if (surveyProductType === 'dp') {
      throw new Error('Use other method (getDpSurveyProgress) for getting the progress of the DP Survey.')
    }

    return this.callMethod(
      'get',
      `/${surveyProductType}/survey/user/${surveyProductUserId}/progress/`,
      null,
      'nextSection'
    )
  }

  getDpSurveyProgress (dpSurveyUserId: number) : DpProgress {
    return this.callMethod('get', `/dp/survey/user/${dpSurveyUserId}/progress/`)
  }

  /**
   * For statements to be saved, they all must be related to one section.
   * The count of passed statements must be equal to the count of the section's statements
   */
  saveStatements (surveyProductType: string, surveyProductUserId: number, statements: Statement[]) : number | null {
    return this.callMethod(
      'patch',
      `/${surveyProductType}/survey/user/${surveyProductUserId}/submit/`,
      { 'statements': statements.map(
        (statement: Statement) : any => { return { statementId: statement.id } }
      ) },
      'nextSection'
    )
  }
}

export default new SurveyService()
