import { SurveyData } from '@/interfaces/LocalStorageInterfaces'
import store from '@/store'
import SurveyHelper from '@/utils/SurveyHelper'

class SurveyLocalStorageHelper {
  private setData (key: string, data: any) : void {
    window.localStorage.setItem(key, JSON.stringify(data))
  }

  private getData (key: string) : any {
    const data: string | null = window.localStorage.getItem(key)
    return data !== null ? JSON.parse(data) : null
  }

  private getSurveyUserKey (surveyProductType: string, surveyUserId: number) : string {
    return `s_${surveyProductType}_${surveyUserId}`
  }

  private getSurveyProductKey (surveyProductType: string) : string {
    return `begun_${surveyProductType}`
  }

  private addBegunSurvey (surveyProductType: string, surveyProductId: number) : void {
    let begunSurveys: number[] | null = this.getData(this.getSurveyProductKey(surveyProductType))

    if (begunSurveys === null) {
      begunSurveys = []
    }

    begunSurveys.push(surveyProductId)
    this.setData(this.getSurveyProductKey(surveyProductType), begunSurveys)
  }

  private saveSurveyUser (surveyData: SurveyData) : void {
    this.setData(this.getSurveyUserKey(surveyData.surveyProductType, surveyData.surveyUserId), surveyData)
  }

  public beginSurvey (surveyData: SurveyData) : void {
    this.addBegunSurvey(surveyData.surveyProductType, surveyData.surveyProductId)
    this.saveSurveyUser(surveyData)
  }

  public beginDpChildSurvey (surveyData: SurveyData) : void {
    this.saveSurveyUser(surveyData)
  }

  public hasBegunSurvey (surveyProductType: string, surveyProductId: number) : boolean {
    const begunSurveys: number[] | null = this.getData(this.getSurveyProductKey(surveyProductType))

    return begunSurveys ? begunSurveys.includes(surveyProductId) : false
  }

  public removeBegunSurvey (surveyProductType: string, surveyProductId: number) : void {
    const begunSurveys: number[] | null = this.getData(this.getSurveyProductKey(surveyProductType))

    if (!begunSurveys || !begunSurveys.includes(surveyProductId)) {
      return
    }

    const result: number[] = begunSurveys.filter((storedSurveyProductId) => { return storedSurveyProductId !== surveyProductId })

    this.setData(this.getSurveyProductKey(surveyProductType), result)
  }

  public hasSurveyUser (surveyProductType: string, surveyUserId: number) : boolean {
    return window.localStorage.getItem(this.getSurveyUserKey(surveyProductType, surveyUserId)) !== null
  }

  public removeSurveyUser (surveyProductType: string, surveyUserId: number) : void {
    if (surveyProductType === SurveyHelper.DP) {
      store.commit('survey/clearDpSurveyData')
      const dpSurveyUserInfo = this.getSurveyUser(
        SurveyHelper.DP,
        surveyUserId
      )
      if (dpSurveyUserInfo) {
        this.removeBegunSurvey(SurveyHelper.DP, dpSurveyUserInfo.surveyProductId)
        dpSurveyUserInfo.dpChildSurveys.forEach((childSurveyString: string) => {
          const childSurveyField = childSurveyString.split('_')
          this.removeSurveyUser(childSurveyField[0], parseInt(childSurveyField[1]))
        })
      }
    }

    window.localStorage.removeItem(this.getSurveyUserKey(surveyProductType, surveyUserId))
  }

  public getSurveyUser (surveyProductType: string, surveyUserId: number) : SurveyData | null {
    return this.getData(this.getSurveyUserKey(surveyProductType, surveyUserId))
  }

  public addDpChildSurveyUser (
    dpSurveyUserId: number,
    childSurveyProductType: string,
    childSurveyUserId: number
  ) : void {
    let dpSurveyUser = this.getSurveyUser('discovery-process', dpSurveyUserId)
    if (!dpSurveyUser) {
      return
    }

    if (!dpSurveyUser.dpChildSurveys.includes(`${childSurveyProductType}_${childSurveyUserId}`)) {
      dpSurveyUser.dpChildSurveys.push(`${childSurveyProductType}_${childSurveyUserId}`)
      this.saveSurveyUser(dpSurveyUser)
    }
  }

  public getParentDpSurveyUserId (childSurveyUserProduct: string, childSurveyUserId: number) : number | null {
    let neededKeys: string[] = []
    for (let keyIndex = 0; keyIndex < window.localStorage.length; keyIndex++) {
      const stringKey = window.localStorage.key(keyIndex)

      if (stringKey && stringKey.match(/s_discovery-process_\d/)) {
        neededKeys.push(stringKey)
      }
    }

    let dpSurveyUserId = null
    try {
      neededKeys.forEach((storageKey: string) => {
        const dpSurveyUser: SurveyData = this.getData(storageKey)
        if (dpSurveyUser.dpChildSurveys.includes(`${childSurveyUserProduct}_${childSurveyUserId}`)) {
          dpSurveyUserId = dpSurveyUser.surveyUserId
          throw new Error()
        }
      })
    } catch (error) {}

    return dpSurveyUserId
  }
}

export default new SurveyLocalStorageHelper()
