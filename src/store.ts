import Vue from 'vue'
import Vuex from 'vuex'
import user, { UserState } from '@/store/user'

Vue.use(Vuex)

export { UserState } from '@/store/user'

export interface RootState {
  user: UserState
}

export default new Vuex.Store<RootState>({
  modules: {
    user
  }
})
