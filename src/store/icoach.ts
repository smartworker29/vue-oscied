import { Module } from 'vuex'
import { RootState } from '@/store'

export interface IcoachState {
  icoachUserId: number | null
}

const survey: Module<IcoachState, RootState> = {
  namespaced: true,

  state: {
    icoachUserId: null
  },

  getters: {
    getIcoachUserId (state: IcoachState) : number | null {
      return state.icoachUserId
    }
  },

  mutations: {
    setIcoachUserId (state: IcoachState, icoachUserId: number) : void {
      state.icoachUserId = icoachUserId
    }
  }
}

export default survey
