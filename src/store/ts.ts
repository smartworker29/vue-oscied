import { Module } from 'vuex'
import { RootState } from '@/store'
import { TsAbstractUser, TsUserDto } from '@/interfaces'

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
