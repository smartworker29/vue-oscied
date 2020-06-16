import { Module } from 'vuex'
import { RootState } from '@/store'
import { Image } from '@/interfaces/GeneralInterfaces'

export interface MainLogoState {
  logos: Image[]
  type: string | null
}

const mainLogo: Module<MainLogoState, RootState> = {
  namespaced: true,

  state: {
    logos: [],
    type: null
  },

  getters: {
    getLogos (state: MainLogoState) : Image[] {
      return state.logos
    },
    getType (state: MainLogoState) : string | null {
      return state.type
    }
  },

  mutations: {
    setLogos (state: MainLogoState, logos: Image[]) : void {
      state.logos = logos
    },
    setType (state: MainLogoState, type: string) : void {
      state.type = type
    },
    clearLogos (state: MainLogoState) : void {
      state.type = null
      state.logos = []
    }
  }
}

export default mainLogo
