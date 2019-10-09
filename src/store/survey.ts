import { Module } from 'vuex'
import { RootState, SurveyState } from '@/store'
import { Section, SurveyInfo, CurrentSurveyData, CompleteSectionData } from '@/interfaces/SurveyInterfaces'

export interface SurveyState {
  isCurrentSurveyInitiated: boolean
  currentSurveyInfo: SurveyInfo | null
  currentProductSurveyId: number | null
  currentProductSurveyType: string | null
  currentProductSurveySections: Section[]
  currentProductSurveySectionNumber: number
  currentProductSurveySection: Section | null
  countCompletedSections: number
}

const survey: Module<SurveyState, RootState> = {
  namespaced: true,

  state: {
    isCurrentSurveyInitiated: false,
    currentSurveyInfo: null,
    currentProductSurveyId: null,
    currentProductSurveyType: null,
    currentProductSurveySections: [],
    currentProductSurveySectionNumber: 0,
    currentProductSurveySection: null,
    countCompletedSections: 0
  },

  getters: {
    getCurrentSurveyInfo (state: SurveyState) : SurveyInfo | null {
      return state.currentSurveyInfo
    },
    getCurrentProductSurveyId (state: SurveyState) : number | null {
      return state.currentProductSurveyId
    },
    getCurrentProductSurveyType (state: SurveyState) : string | null {
      return state.currentProductSurveyType
    },
    getCurrentProductSurveySectionCount (state: SurveyState): number {
      return state.currentProductSurveySections.length
    },
    getCurrentProductSurveySectionNumber (state: SurveyState) : number {
      return state.currentProductSurveySectionNumber
    },
    getCurrentProductSurveySection (state: SurveyState) : Section|null {
      return state.currentProductSurveySection
    },
    getCountCompletedSurveySection (state: SurveyState) : Number {
      return state.countCompletedSections
    },
    isCurrentSurveyInitiated (state: SurveyState) : boolean {
      return state.isCurrentSurveyInitiated
    }
  },

  mutations: {
    setCurrentSurveyData (state: SurveyState, surveyData: CurrentSurveyData) : void {
      state.currentSurveyInfo = surveyData.surveyInfo
      state.currentProductSurveyId = surveyData.productSurveyId
      state.currentProductSurveyType = surveyData.productSurveyType
      state.isCurrentSurveyInitiated = true
    },
    setCurrentSurveySections (state: SurveyState, sections: Section[]) : void {
      state.currentProductSurveySections = sections
      state.currentProductSurveySectionNumber = 1
      state.currentProductSurveySection = sections[0] ? sections[0] : null
    },
    clearCurrentSurveyData (state: SurveyState) : void {
      state.isCurrentSurveyInitiated = false
      state.currentSurveyInfo = null
      state.currentProductSurveyId = null
      state.currentProductSurveyType = null
      state.currentProductSurveySections = []
      state.currentProductSurveySectionNumber = 0
    },
    setCurrentProductSurveySectionNumber(state: SurveyState, sectionNumber: number) : void {
      if (sectionNumber < 1 || sectionNumber > state.currentProductSurveySections.length) {
        throw new Error('Unavailable the section number.')
      }

      state.currentProductSurveySectionNumber = sectionNumber
      state.currentProductSurveySection = state.currentProductSurveySections[sectionNumber - 1]
        ? state.currentProductSurveySections[sectionNumber - 1] : null
    },

    addOneCompletedSection (state: SurveyState, data: CompleteSectionData): void {
      //TODO::add functionality to precessing the `CompleteSectionData`
      state.countCompletedSections++
    }
  }
}

export default survey
