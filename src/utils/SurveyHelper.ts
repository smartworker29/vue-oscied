import { ResponseProductSurveyInfo, SurveyUserInfo } from '@/interfaces/SurveyInterfaces'
import SurveyLocalStorageHelper from '@/utils/SurveyLocalStorageHelper'
import store from '@/store'
import SurveyService from '@/services/SurveyService'
import { SurveyData } from '@/interfaces/LocalStorageInterfaces'

class SurveyHelper {
  public readonly DP = 'discovery-process'

  isSurveyUserAvailable (surveyUser: SurveyUserInfo | null) : boolean {
    return surveyUser !== null && !surveyUser.isCompleted && surveyUser.isAuthorised
  }

  completeSurvey (surveyProductType: string, surveyProductId: number | null, surveyUserId: number | null) : void {
    store.commit('survey/clearTakenSurveyData')
    if (surveyProductId) {
      SurveyLocalStorageHelper.removeBegunSurvey(surveyProductType, surveyProductId)
    }
    if (surveyUserId) {
      const surveyUserInfo = SurveyLocalStorageHelper.getSurveyUser(surveyProductType, surveyUserId)
      if (surveyUserInfo && surveyUserInfo.dpSurveyId === null) {
        SurveyLocalStorageHelper.removeSurveyUser(surveyProductType, surveyUserId)
      }
    }
  }

  async uploadDpSurveyDataByChild (childSurveyUserData: SurveyData  | null) : Promise<boolean | number> {
    if (!childSurveyUserData || !childSurveyUserData.dpSurveyId) {
      return false
    }

    const uploadResult = await this.uploadDpSurveyDataFromLocalStorage(childSurveyUserData.dpSurveyId)
    if (!uploadResult) {
      return false
    }

    if (childSurveyUserData.surveyUserId !== uploadResult && typeof uploadResult === 'number') {
      childSurveyUserData.dpSurveyId = uploadResult
      SurveyLocalStorageHelper.beginSurvey(childSurveyUserData)
    }

    return uploadResult
  }

  async uploadDpSurveyDataFromLocalStorage (dpSurveyUserId: number) : Promise<number | boolean> {
    if (!SurveyLocalStorageHelper.hasSurveyUser(this.DP, dpSurveyUserId)) {
      return false
    }
    try{
      const dpSurveyUserInfo = SurveyLocalStorageHelper.getSurveyUser(this.DP, dpSurveyUserId)
      if (!dpSurveyUserInfo ||
        dpSurveyUserInfo.surveyProductType !== this.DP ||
        !dpSurveyUserInfo.surveyAccessCode ||
        dpSurveyUserInfo.dpSurveyId !== null
      ) {
        throw new Error()
      }

      const surveyProductInfo: ResponseProductSurveyInfo = await SurveyService.getProductSurveyInfo(
        dpSurveyUserInfo.surveyProductType,
        dpSurveyUserInfo.surveyAccessCode
      )

      const surveyUserInfo = await SurveyService.getSurveyUser(
        this.DP,
        surveyProductInfo.surveyProductId,
        dpSurveyUserInfo.surveyAccessCode
      )

      if (!surveyUserInfo) {
        throw new Error()
      }

      if (surveyUserInfo.surveyUserId !== dpSurveyUserId) {
        SurveyLocalStorageHelper.removeSurveyUser(this.DP, dpSurveyUserId)

        SurveyLocalStorageHelper.beginSurvey({
          surveyProductType: this.DP,
          surveyAccessCode: dpSurveyUserInfo.surveyAccessCode,
          surveyProductId: surveyProductInfo.surveyProductId,
          surveyUserId: surveyUserInfo.surveyUserId,
          dpSurveyId: null,
          dpChildSurveys: []
        })
      }

      store.commit('survey/setTakenSurveyUserId', {
        productSurveyType: this.DP,
        surveyUserId: surveyUserInfo.surveyUserId
      })

      store.commit('survey/setTakenSurveyData', {
        productSurveyId: surveyProductInfo.surveyProductId,
        productSurveyType: this.DP,
        surveyInfo: surveyProductInfo.survey
      })

      return surveyUserInfo.surveyUserId
    } catch (error) {
      SurveyLocalStorageHelper.removeSurveyUser(this.DP, dpSurveyUserId)

      return false
    }
  }
}

export default new SurveyHelper()
