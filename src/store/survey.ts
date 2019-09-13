import { Module } from 'vuex'
import { RootState } from '@/store'
import { Survey, Section, Statement } from '@/interfaces/SurveyInterfaces'
import LocaleHelper from '@/utils/LocaleHelper'

export interface SurveyState {
  currentSurvey: Survey | null,
  totalSections: number,
  countCompletedSections: number
}

const survey: Module<SurveyState, RootState> = {
  namespaced: true,

  state: {
    currentSurvey: null,
    totalSections: 2,
    countCompletedSections: 0
  },

  getters: {
    currentSurvey (state: SurveyState): Survey | null {
      let sections: Section[] = []
      let statement = 'Statement'
      let section = 'Section'
      let instructions = 'Instructions of section'

      if ('de' === LocaleHelper.getUserLocale()) {
        statement = 'Aussage'
        section = 'Sektion'
        instructions = 'Anweisungen des Abschnitts'
      }

      for (let iter = 0; iter < state.totalSections; iter++) {
        sections[iter] = {
          title: `${section} ${iter + 1}`,
          instructions: `${instructions} ${iter + 1}`,
          statements: (new Array(20)).fill(0).map((item: any, index: number) : Statement => {
            index++
            return { id: index, title: `${section} ${iter + 1}, ${statement} ${index}` }
          })
        }
      }
      return { sections: sections }
    },
    totalSurveySection (state: SurveyState): Number {
      return state.totalSections
    },
    countCompletedSurveySection (state: SurveyState): Number {
      return state.countCompletedSections
    }
  },

  mutations: {
    addOneCompletedSection (state: SurveyState): void {
      state.countCompletedSections++
    }
  }
}

export default survey
