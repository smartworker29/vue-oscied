import { Module } from 'vuex'
import { RootState, SurveyState } from '@/store'
import { Section, SurveyInfo, TakenSurveyData, NextDpSurveyPart, SurveyUserDto } from '@/interfaces/SurveyInterfaces'

export interface SurveyState {
  displayedBaseSurveyInfo: SurveyInfo | null

  isTakenSurveyInitiated: boolean
  isDpTakenSurvey: boolean

  takenBaseSurveyInfo: SurveyInfo | null
  takenSurveyId: number | null
  takenSurveyType: string | null
  takenSurveyUserId: number | null
  takenSurveySections: Section[]
  takenSurveySection: Section | null
  countCompletedSections: number

  dpBaseSurveyInfo: SurveyInfo | null
  dpSurveyId: number | null
  dpSurveyUserId: number | null
}

const survey: Module<SurveyState, RootState> = {
  namespaced: true,

  state: {
    displayedBaseSurveyInfo: null,

    isTakenSurveyInitiated: false,
    isDpTakenSurvey: false,

    takenBaseSurveyInfo: null,
    takenSurveyId: null,
    takenSurveyType: null,
    takenSurveyUserId: null,
    takenSurveySections: [],
    takenSurveySection: null,
    countCompletedSections: 0,

    dpBaseSurveyInfo: null,
    dpSurveyId: null,
    dpSurveyUserId: null
  },

  getters: {
    getDisplayedBaseSurveyInfo (state: SurveyState) : SurveyInfo | null {
      return state.displayedBaseSurveyInfo
    },
    getTakenSurveyId (state: SurveyState) : number | null {
      return state.takenSurveyId
    },
    getTakenSurveyType (state: SurveyState) : string | null {
      return state.takenSurveyType
    },
    getTakenSurveyUserId (state: SurveyState) : number | null {
      return state.takenSurveyUserId
    },
    getDpSurveyUserId (state: SurveyState) : number | null {
      return state.dpSurveyUserId
    },
    getDpSurveyId (state: SurveyState) : number | null {
      return state.dpSurveyId
    },
    getCurrentProductSurveySectionCount (state: SurveyState): number {
      return state.takenSurveySections.length
    },
    getNextTakenSurveySection (state: SurveyState) : Section | null {
      return state.takenSurveySection
    },
    getCountCompletedSurveySection (state: SurveyState) : Number {
      return state.countCompletedSections
    },
    isTakenSurveyInitiated (state: SurveyState) : boolean {
      return state.isTakenSurveyInitiated
    },
    isDpTakenSurvey (state: SurveyState) : boolean {
      return state.isDpTakenSurvey
    },
    getNextSurveySectionNumber (state: SurveyState) : number | null {
      return state.takenSurveySection && state.takenSurveySection.position != null
        ? state.takenSurveySection.position + 1
        : null
    }
  },

  mutations: {
    setTakenSurveyData (state: SurveyState, surveyData: TakenSurveyData) : void {
      state.takenBaseSurveyInfo = surveyData.surveyInfo
      state.displayedBaseSurveyInfo = state.takenBaseSurveyInfo
      state.takenSurveyId = surveyData.productSurveyId
      state.takenSurveyType = surveyData.productSurveyType

      if (surveyData.productSurveyType === 'discovery-process') {
        state.isDpTakenSurvey = true
        state.dpSurveyId = surveyData.productSurveyId
        state.dpBaseSurveyInfo = state.takenBaseSurveyInfo
      }

      state.isTakenSurveyInitiated = true
    },
    setTakenSurveyUserId (state: SurveyState, surveyUserInfo: SurveyUserDto) : void {
      state.takenSurveyUserId = surveyUserInfo.surveyUserId

      if (surveyUserInfo.productSurveyType === 'discovery-process') {
        state.dpSurveyUserId = surveyUserInfo.surveyUserId
      }
    },
    useDpBaseSurveyInfo (state: SurveyState) : void {
      state.displayedBaseSurveyInfo = state.dpBaseSurveyInfo
    },
    setCurrentSurveyProgress (state: SurveyState, progress: number) : void {
      state.countCompletedSections = progress
    },
    setTakenSurveySections (state: SurveyState, sections: Section[]) : void {
      state.takenSurveySections = sections
      state.takenSurveySection = sections[0] || null
    },
    clearTakenSurveyData (state: SurveyState) : void {
      state.displayedBaseSurveyInfo = state.dpBaseSurveyInfo

      state.takenBaseSurveyInfo = null
      state.takenSurveyId = null
      state.takenSurveyType = null
      state.takenSurveyUserId = null
      state.takenSurveySections = []
      state.takenSurveySection = null
    },
    clearDpSurveyData (state: SurveyState) : void {
      state.displayedBaseSurveyInfo = null
      state.dpBaseSurveyInfo = null
      state.isDpTakenSurvey = false

      state.dpBaseSurveyInfo = null
      state.dpSurveyId = null
      state.dpSurveyUserId = null
      state.countCompletedSections = 0
    },
    setNextSurveySectionId (state: SurveyState, nextSectionId: number) : void {
      const nextSection: Section | undefined = state.takenSurveySections.find((section: Section) => {
        return section.id === nextSectionId
      })

      state.takenSurveySection = nextSection || null
    },
    addOneCompletedSection (state: SurveyState) : void {
      state.countCompletedSections++
    }
  }
}

export default survey
