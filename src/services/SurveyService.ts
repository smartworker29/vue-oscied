import { BaseApiService } from '@/services/BaseApiService'
import {
  ResponseProductSurveyInfo,
  Section,
  Statement,
  StatementIRI,
  SurveyUser
} from '@/interfaces/SurveyInterfaces'

class SurveyService extends BaseApiService {
  private validateSurveyProductType (surveyProductType: string) : string {
    if (surveyProductType === 'discovery-process') {
      return 'dp'
    }

    return surveyProductType
  }

  private handleStatementsToIRI (surveyProductType: string, statements: Statement[]) : StatementIRI[] {
    return statements.map(function (statement: Statement) : StatementIRI {
      let statementIRIPath: string = ''
      switch (surveyProductType) {
        case 'eq':
          statementIRIPath = 'eq_survey_statements'
          break

        case 'values':
          statementIRIPath = 'values_survey_statements'
          break

        case 'behaviours':
          statementIRIPath = 'behaviours_survey_statements'
          break

        default:
          throw new Error('Unknown survey product type')
      }

      return { statementId: `/api/${statementIRIPath}/${statement.id}` }
    })
  }

  getProductSurveyInfo (surveyProductType: string, accessCode: string) : ResponseProductSurveyInfo {
    surveyProductType = this.validateSurveyProductType(surveyProductType)

    return this.callMethod('get', `/public/${surveyProductType}/survey/access-code/${accessCode}/`)
  }

  getSurveySections (surveyProductType: string, surveyProductId: number) : Section[] {
    surveyProductType = this.validateSurveyProductType(surveyProductType)

    return this.callMethod('get', `/${surveyProductType}/survey/id/${surveyProductId}/sections/`)
  }

  getSectionStatements (surveyProductType: string, surveyProductId: number) : Statement[] {
    surveyProductType = this.validateSurveyProductType(surveyProductType)

    return this.callMethod('get', `/${surveyProductType}/section/id/${surveyProductId}/statements/`)
  }

  getSurveyUser (surveyProductType: string, surveyProductId: number) : SurveyUser | null {
    surveyProductType = this.validateSurveyProductType(surveyProductType)

    return this.callMethod(
      'post',
      `/${surveyProductType}/survey/user/get/`,
      { 'surveyId': surveyProductId }
    )
  }

  createSurveyUser (surveyProductType: string, surveyProductId: number) : SurveyUser {
    surveyProductType = this.validateSurveyProductType(surveyProductType)

    return this.callMethod(
      'post',
      `/${surveyProductType}/survey/user/create/`,
      { 'surveyId': surveyProductId }
    )
  }

  getSurveyProgress (surveyProductType: string, surveyProductUserId: number) : number | null {
    surveyProductType = this.validateSurveyProductType(surveyProductType)

    return this.callMethod(
      'get',
      `/${surveyProductType}/survey/user/${surveyProductUserId}/progress/`,
      null,
      'nextSection'
    )
  }
  /**
   * For statements to be saved, they all must be related to one section.
   * The count of passed statements must be equal to the count of the section's statements
   */
  saveStatements (surveyProductType: string, surveyProductUserId: number, statements: Statement[]) : number | null {
    surveyProductType = this.validateSurveyProductType(surveyProductType)
    let handleStatementsIds = this.handleStatementsToIRI(surveyProductType, statements)

    return this.callMethod(
      'patch',
      `/${surveyProductType}/survey/user/${surveyProductUserId}/submit/`,
      { 'statements': handleStatementsIds },
      'nextSection'
    )
  }
}

export default new SurveyService()
