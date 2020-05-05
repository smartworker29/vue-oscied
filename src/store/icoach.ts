import { Module } from 'vuex'
import { RootState, SurveyState } from '@/store'
import { IcoachGeneralInfo } from '@/interfaces/IcoachInterfaces'

export interface IcoachState {
  icoachGeneralInfo: IcoachGeneralInfo | null,
  icoachSkillStepId: number | null
}

const survey: Module<IcoachState, RootState> = {
  namespaced: true,

  state: {
    icoachGeneralInfo: null,
    icoachSkillStepId: null
  },

  getters: {
    getIcoachInfo (state: IcoachState) : IcoachGeneralInfo | null {
      return state.icoachGeneralInfo
    },
    getIcoachSkillStepId (state: IcoachState) : number | null {
      return state.icoachSkillStepId
    }
  },

  mutations: {
    setIcoachInfo (state: IcoachState, data: IcoachGeneralInfo) : void {
      state.icoachGeneralInfo = data
    },
    setIcoachSkillStepId(state: IcoachState, step: number) : void {
      state.icoachSkillStepId = step
    },
    clearIcoachInfo (state: IcoachState) : void {
      state.icoachGeneralInfo = null
    }
  }
}

export default survey
