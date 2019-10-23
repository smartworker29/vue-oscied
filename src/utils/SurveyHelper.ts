import { SurveyUser } from '@/interfaces/SurveyInterfaces'
import SurveyLocalStorageHelper from '@/utils/SurveyLocalStorageHelper'
import store from '@/store'

class SurveyHelper {
  isSurveyUserAvailable (surveyUser: SurveyUser | null) : boolean {
    return surveyUser !== null && !surveyUser.isCompleted && surveyUser.isAuthorised
  }

  completeSurvey (surveyProductType: string, surveyProductId: number | null, surveyUserId: number | null) : void {
    store.commit('survey/clearCurrentSurveyData')
    if (surveyProductId) {
      SurveyLocalStorageHelper.removeBegunSurvey(surveyProductType, surveyProductId)
    }
    if (surveyUserId) {
      SurveyLocalStorageHelper.removeSurveyUser(surveyProductType, surveyUserId)
    }
  }
}

export default new SurveyHelper()
