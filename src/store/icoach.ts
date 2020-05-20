import { Module } from 'vuex'
import { RootState } from '@/store'
import {
  IcoachCategorySkill,
  IcoachGeneralInfo,
  IcoachSkill,
  IcoachSkillProgressData
} from '@/interfaces/IcoachInterfaces'

export interface IcoachState {
  icoachGeneralInfo: IcoachGeneralInfo | null,
  icoachSkillStepId: number | null,
  icoachSkillInfo: IcoachSkill | null,
  icoachSkillMenuInfo: IcoachCategorySkill[]
}

const icoach: Module<IcoachState, RootState> = {
  namespaced: true,

  state: {
    icoachGeneralInfo: null,
    icoachSkillStepId: null,
    icoachSkillInfo: null,
    icoachSkillMenuInfo: []
  },

  getters: {
    getIcoachInfo (state: IcoachState) : IcoachGeneralInfo | null {
      return state.icoachGeneralInfo
    },
    getIcoachSkillStepId (state: IcoachState) : number | null {
      return state.icoachSkillStepId
    },
    getIcoachSkill (state: IcoachState) : IcoachSkill | null {
      return state.icoachSkillInfo
    },
    getIcoachSkillMenu (state: IcoachState) : IcoachCategorySkill[] | [] {
      return state.icoachSkillMenuInfo
    }
  },

  mutations: {
    setIcoachInfo (state: IcoachState, data: IcoachGeneralInfo) : void {
      state.icoachGeneralInfo = data
    },
    setIcoachSkillStepId (state: IcoachState, step: number) : void {
      state.icoachSkillStepId = step
    },
    setIcoachSkill (state: IcoachState, data: IcoachSkill) : void {
      state.icoachSkillInfo = data
    },
    setIcoachSkillMenu (state: IcoachState, data: IcoachCategorySkill[]) : void {
      state.icoachSkillMenuInfo = data
    },
    clearIcoachInfo (state: IcoachState) : void {
      state.icoachGeneralInfo = null
    },
    updateIcoachProgress (state: IcoachState, data: IcoachSkillProgressData) : void {
      if (!state.icoachSkillInfo ||
        !state.icoachSkillMenuInfo ||
        state.icoachSkillInfo.icoachSkillContents[data.currentStep - 1].isCompleted
      ) {
        return
      }

      state.icoachSkillInfo.icoachSkillContents[data.currentStep - 1].isCompleted = true

      state.icoachSkillMenuInfo.map((skill: IcoachCategorySkill) => {
        if (skill.id === data.currentSkill) {
          skill.completed = Number(skill.completed) + 1
        }

        return skill
      })
    }
  }
}

export default icoach
