import { Module } from 'vuex'
import { RootState } from '@/store'
import { TsAbstractUser, TsSurveyDto, TsUserDto } from '@/interfaces'

export interface TsState {
  survey: TsSurveyDto | null,
  users: TsUserDto | null
  manager: TsAbstractUser | null
}

const ts: Module<TsState, RootState> = {
  namespaced: true,

  state: {
    survey: null,
    users: null,
    manager: null
  },

  getters: {
    getSurvey (state: TsState) {
      return state.survey
    },
    getUsers (state: TsState) {
      return state.users
    },
    getManager (state: TsState) {
      return state.manager
    }
  },

  mutations: {
    setSurvey (state: TsState, tsSurveyInfo: TsSurveyDto) : void {
      state.survey = tsSurveyInfo
    },
    setUsers (state: TsState, tsUser: TsUserDto) : void {
      state.users = tsUser
    },
    setManager (state: TsState, tsManager: TsAbstractUser) : void {
      state.manager = tsManager
    }
  }
}

export default ts
