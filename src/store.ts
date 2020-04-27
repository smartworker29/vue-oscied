import Vue from 'vue'
import Vuex from 'vuex'

import user, { UserState } from '@/store/user'
import survey, { SurveyState } from '@/store/survey'
import icoach, { IcoachState } from '@/store/icoach'

Vue.use(Vuex)

export { UserState } from '@/store/user'
export { SurveyState } from '@/store/survey'
export { IcoachState } from '@/store/icoach'

export interface RootState {
  user: UserState
  survey: SurveyState
  icoach: IcoachState
}

export default new Vuex.Store<RootState>({
  modules: {
    user,
    survey,
    icoach
  }
})
