import { BaseApiService } from '@/services/BaseApiService'
import { EqStatement, ResponseProductSurveyInfo, Section, SimpleStatement } from '@/interfaces/SurveyInterfaces'

class SurveyService extends BaseApiService {
  private validateSurveyProductType(surveyProductType: string) : string {
    if (surveyProductType === 'discovery-process') {
      return 'dp'
    }

    return surveyProductType
  }

  getProductSurveyInfo (surveyProductType: string, accessCode: string) : ResponseProductSurveyInfo {
    surveyProductType = this.validateSurveyProductType(surveyProductType)

    return this.callMethod('get', `/public/${surveyProductType}/survey/access-code/${accessCode}/`)
  }

  getSurveySections (surveyProductType: string, surveyProductId: number) : Section[] {
    surveyProductType = this.validateSurveyProductType(surveyProductType)

    return this.callMethod('get', `/${surveyProductType}/survey/id/${surveyProductId}/sections/`)
  }

  getSectionStatements (surveyProductType: string, surveyProductId: number) : SimpleStatement[] {
    surveyProductType = this.validateSurveyProductType(surveyProductType)

    return this.callMethod('get', `/${surveyProductType}/section/id/${surveyProductId}/statements/`)
  }

  getEqSectionStatements (view: string) : EqStatement[] {
    return this.callMethod('get', `/eq/section/id/statements/${view}/`)
  }
}

export default new SurveyService()
