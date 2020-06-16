import Vue from 'vue'
import Vuex from 'vuex'

import user, { UserState } from '@/store/user'
import survey, { SurveyState } from '@/store/survey'
import icoach, { IcoachState } from '@/store/icoach'
import mainLogo , { MainLogoState } from '@/store/main-logo'

Vue.use(Vuex)

export { UserState } from '@/store/user'
export { SurveyState } from '@/store/survey'
export { IcoachState } from '@/store/icoach'
export { MainLogoState } from '@/store/main-logo'

export interface RootState {
  user: UserState
  survey: SurveyState
  icoach: IcoachState
  mainLogo: MainLogoState
}

export default new Vuex.Store<RootState>({
  modules: {
    user,
    survey,
    icoach,
    mainLogo
  }
})
