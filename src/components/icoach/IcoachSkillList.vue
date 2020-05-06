<template>
  <div class="icoach-categories">
    <ul class="icoach-category-list hide">
      <li
        v-for="skill in icoachDashboardInfo[icoachSkill.category]"
        :class="{ 'active': icoachSkill.id === skill.id }"
        :key="skill.id"
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
        :class="{ 'active': stepId - 1 === parseInt(key) }"
        @click="changeStep(key + 1)"
        :key="key"
      >
        step {{ key + 1 }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { IcoachDashboardInfo, IcoachSkill } from '@/interfaces/IcoachInterfaces'
import { IcoachData } from '@/interfaces/LocalStorageInterfaces'

@Component({ name: 'IcoachSkillList' })
export default class IcoachSkillList extends Vue {
  @Prop({ required: true })
  icoachSkill!: IcoachSkill
  @Prop({ required: true })
  icoachUserData!: IcoachData
  @Prop({ required: true })
  icoachDashboardInfo!: IcoachDashboardInfo
  @Prop({ required: true })
  stepId!: number

  @Emit()
  changeStep (index: number) {
    this.$store.commit('icoach/setIcoachSkillStepId', index)

    this.$router.push({
      name: 'icoach.skill',
      params: {
        icoachUserId: this.icoachUserData.icoachUserId.toString(),
        skillId: this.icoachSkill.id.toString(),
        stepId: index.toString()
      }
    })

    return index
  }
}
</script>

<style lang="scss" scoped>
  .hide {
    display: none;
  }
</style>
