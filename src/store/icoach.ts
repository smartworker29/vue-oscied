import { Module } from 'vuex'
import { RootState } from '@/store'
import { IcoachGeneralInfo } from '@/interfaces/IcoachInterfaces'

export interface IcoachState {
  icoachGeneralInfo: IcoachGeneralInfo | null
}

const survey: Module<IcoachState, RootState> = {
  namespaced: true,

  state: {
    icoachGeneralInfo: null
  },

  getters: {
    getIcoachInfo (state: IcoachState) : IcoachGeneralInfo | null {
      return state.icoachGeneralInfo
    }
  },

  mutations: {
    setIcoachInfo (state: IcoachState, data: IcoachGeneralInfo) : void {
      state.icoachGeneralInfo = data
    }
  }
}

export default survey
