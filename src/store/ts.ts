import { Module } from 'vuex'
import { RootState } from '@/store'
import { TsSurveyDto, TsUserDto } from '@/interfaces'

export interface TsState {
  survey: TsSurveyDto | null,
  user: TsUserDto | null
}

const ts: Module<TsState, RootState> = {
  namespaced: true,

  state: {
    survey: null,
    user: null
  },

  getters: {
    getSurvey (state: TsState) {
      return state.survey
    },
    getUser (state: TsState) {
      return state.user
    }
  },

  mutations: {
    setSurvey (state: TsState, tsSurveyInfo: TsSurveyDto) : void {
      state.survey = tsSurveyInfo
    },
    setTsUser (state: TsState, tsUser: TsUserDto) : void {
      state.user = tsUser
    }
  }
}

export default ts
