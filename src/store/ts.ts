import { Module } from 'vuex'
import { RootState } from '@/store'
import { TsAbstractUser, TsUserDto, TsUserRole } from '@/interfaces'

export interface TsState {
  users: TsUserDto | null
  manager: TsAbstractUser | null
}

const ts: Module<TsState, RootState> = {
  namespaced: true,

  state: {
    users: null,
    manager: null
  },

  getters: {
    getUsers (state: TsState) {
      return state.users
    },
    getManager (state: TsState) {
      return state.manager
    },
    hasRoleRater (state: TsState) {
      return state.users ? state.users.roles.findIndex((role: string) => role === TsUserRole.RATER) !== -1 : false
    },
    hasRoleRatee (state: TsState) {
      return state.users ? state.users.roles.findIndex((role: string) => role === TsUserRole.RATEE) !== -1 : false
    },
    hasRoleManager (state: TsState) {
      return state.users ? state.users.roles.findIndex((role: string) => role === TsUserRole.MANAGER) !== -1 : false
    }
  },

  mutations: {
    setUsers (state: TsState, tsUser: TsUserDto) : void {
      state.users = tsUser
    },
    setManager (state: TsState, tsManager: TsAbstractUser) : void {
      state.manager = tsManager
    }
  }
}

export default ts
