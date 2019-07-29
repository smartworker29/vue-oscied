import { Module } from 'vuex'
import { RootState } from '@/store'
import { User } from '@/interfaces/UserInterfaces'

export interface UserState {
  isAuthenticated: boolean
  user: User | null
}

const user: Module<UserState, RootState> = {
  namespaced: true,

  state: {
    isAuthenticated: false,
    user: null
  },

  getters: {
    isAuthenticated (state: UserState): boolean {
      return state.isAuthenticated
    },
    currentUser (state: UserState): User | null {
      return state.user
    }
  },

  mutations: {
    setUser (state: UserState, user: User): void {
      state.user = user
      if (user) {
        state.isAuthenticated = true
      }
    },
    logout (state: UserState): void {
      state.isAuthenticated = false
      state.user = null
    },
    setIsAuthenticated (state: UserState, isAuthenticated: boolean): void {
      state.isAuthenticated = isAuthenticated
    }
  }
}

export default user
