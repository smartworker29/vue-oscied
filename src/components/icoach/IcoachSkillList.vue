<template>
  <div class="icoach-categories">
    <ul class="icoach-category-list hide">
      <li
        v-for="(skill, key) in icoachDashboardInfo[icoachSkill.category]"
        :class="{ 'active': icoachSkill.id === skill.id }"
        :key="key"
      >
        <router-link
          :to="{ name: 'icoach.skill', params: { icoachUserId: icoachUserData.icoachUserId, skillId: skill.id, stepId: 1 } }"
        >
          <span>{{ skill.name }}</span>
        </router-link>
      </li>
    </ul>
    <ul class="icoach-category-list">
      <li
        v-for="(_, key) in icoachSkill.icoachSkillContents"
        :class="{ 'active': icoachSkillCurrentStep - 1 === parseInt(key) }"
        @click="goToStep(key + 1)"
        :key="key"
      >
        step {{ key + 1 }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { IcoachDashboardInfo, IcoachSkill } from '@/interfaces/IcoachInterfaces'
import { IcoachData } from '@/interfaces/LocalStorageInterfaces'
import { Getter } from 'vuex-class'

@Component
export default class IcoachSkillList extends Vue {
  @Getter('icoach/getIcoachSkillStepId')
  icoachSkillCurrentStep!: number

  @Prop({})
  icoachSkill!: IcoachSkill

  @Prop({})
  icoachUserData!: IcoachData

  @Prop({})
  icoachDashboardInfo!: IcoachDashboardInfo

  goToStep (index: number) {
    this.$store.commit('icoach/setIcoachSkillStepId', index)

    this.$emit('changeStep', index)

    this.$router.push({
      name: 'icoach.skill',
      params: {
        icoachUserId: this.icoachUserData.icoachUserId.toString(),
        skillId: this.icoachSkill.id.toString(),
        stepId: index.toString()
      }
    })
  }
}
</script>

<style lang="scss">
  .hide {
    display: none;
  }
</style>
