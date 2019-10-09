import {
  CompletedSectionStatement,
  CompletedSurveySectionData,
  CurrentSurveyData,
  UncompletedSurveyData
} from '@/interfaces/LocalStorageInterfaces'
import {Statement, CompleteSectionData} from '@/interfaces/SurveyInterfaces'

class SurveyHelper {
  private currentSurveyKey: string = 'currentSurvey'

  private getUncompletedSurveyKey (surveyProductType: string, surveyProductId: number) : string {
    return `s_${surveyProductType}_${surveyProductId}`
  }

  private setData(key: string, data: any) : void {
    window.localStorage.setItem(key, JSON.stringify(data))
  }

  private getData(key: string) : any {
    const data: string | null = window.localStorage.getItem(key)
    return data !== null ? JSON.parse(data) : null
  }

  private processSectionData (section: CompleteSectionData) : CompletedSurveySectionData {
    const statements: CompletedSectionStatement[] = section.statements.map(
        (statement: Statement, index: number) : CompletedSectionStatement => {
          return {
            id: statement.id,
            sortPosition: index
          }
        }
    )

    return {
      id: section.section.id,
      number: section.sectionNumber,
      statements: statements
    }
  }

  setCurrentSurveyData (surveyProductType: string, surveyAccessCode: string, surveyProductId: number) : void {
    const currentSurveyData: CurrentSurveyData = {
      surveyProductType,
      surveyAccessCode,
      surveyProductId
    }

    this.setData(this.currentSurveyKey, currentSurveyData)
  }

  getCurrentSurveyData () : CurrentSurveyData | null {
    return this.getData(this.currentSurveyKey)
  }

  removeCurrentSurveyData () : void {
    const surveyData: CurrentSurveyData | null = this.getCurrentSurveyData()

    if (null === surveyData) {
      return
    }

    this.removeUncompletedSurvey(surveyData.surveyProductType, surveyData.surveyProductId)
    window.localStorage.removeItem(this.currentSurveyKey)
  }

  hasUncompletedSurvey (surveyProductType: string, surveyProductId: number) : boolean {
    return null !== window.localStorage.getItem(this.getUncompletedSurveyKey(surveyProductType, surveyProductId))
  }

  getUncompletedSurvey (surveyProductType: string, surveyProductId: number) : UncompletedSurveyData {
    return this.getData(this.getUncompletedSurveyKey(surveyProductType, surveyProductId))
  }

  addSectionToUncompletedSurvey(surveyProductType: string, surveyProductId: number, sectionData: CompleteSectionData) : void {
    let survey: UncompletedSurveyData | null = null
    if (this.hasUncompletedSurvey(surveyProductType, surveyProductId)) {
      survey = this.getUncompletedSurvey(surveyProductType, surveyProductId)
    } else {
      survey = { sections: [] }
    }

    const sectionAlreadyExist: CompletedSurveySectionData | undefined = survey.sections.find(
        (section: CompletedSurveySectionData) : boolean => {
          return section.id === sectionData.section.id
        }
    )

    if (sectionAlreadyExist) {
      throw new Error('This section is already complete')
    }

    survey.sections.push(this.processSectionData(sectionData))

    this.setData(this.getUncompletedSurveyKey(surveyProductType, surveyProductId), survey)
  }

  removeUncompletedSurvey (surveyProductType: string, surveyProductId: number) : void {
    if (this.hasUncompletedSurvey(surveyProductType, surveyProductId)) {
      window.localStorage.removeItem(this.getUncompletedSurveyKey(surveyProductType, surveyProductId))
    }
  }

  hasCompletedSectioninUncompletedSurvey (surveyProductType: string, surveyProductId: number, checkedSectionNumber: number) : boolean {
    const survey: UncompletedSurveyData = this.getUncompletedSurvey(surveyProductType, surveyProductId)

    if (survey === null) {
      return false
    }

    const completedSection: CompletedSurveySectionData | undefined = survey.sections.find(
        (section: CompletedSurveySectionData) : boolean => {
          return section.number === checkedSectionNumber
        }
    )

    return !!completedSection
  }

  getNextNumberSectionUncompletedSurvey (
      surveyProductType: string,
      surveyProductId: number,
      sectionsCount: number
  ) : number | false {
    const survey: UncompletedSurveyData = this.getUncompletedSurvey(surveyProductType, surveyProductId)
    const existSectionNumber: number[] = survey.sections.map(
        (section: CompletedSurveySectionData) : number => {
          return section.number
        }
    )

    for (let sectionNumber = 1; sectionNumber <= sectionsCount; sectionNumber++) {
      if (existSectionNumber.indexOf(sectionNumber) === -1) {
        return sectionNumber
      }
    }

    return false
  }
}

export default new SurveyHelper()
