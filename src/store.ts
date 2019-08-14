import Vue from 'vue'
import Vuex from 'vuex'

import user, { UserState } from '@/store/user'
import survey, { SurveyState } from '@/store/survey'

Vue.use(Vuex)

export { UserState } from '@/store/user'
export { SurveyState } from '@/store/survey'

export interface RootState {
  user: UserState
  survey: SurveyState
}

export default new Vuex.Store<RootState>({
  modules: {
    user,
    survey
  }
})
