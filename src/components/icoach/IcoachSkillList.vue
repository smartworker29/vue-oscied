<template>
  <div class="icoach-skills-list">
    <div class="icoach-skills-expand">
      <img :src="require('@/assets/icons/sidebar-expand.svg')">
    </div>
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
          <Progress
            :processed-props-items-count="skill.completed"
            :total-props-progress-items-count="skill.total"
            percentage="true"
          />
        </router-link>
      </li>
    </ul>
    <ul class="icoach-skills-category-list">
      <li
        v-for="(content, key) in icoachSkill.icoachSkillContents"
        :class="{ 'active': stepId - 1 === parseInt(key) }"
        @click="changeStep(key + 1)"
        :key="key"
      >
        {{ content.icoachSkillArea.title }}
        <!-- completed: {{ content.isCompleted }} -->
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { IcoachDashboardInfo, IcoachSkill } from '@/interfaces/IcoachInterfaces'
import { IcoachData } from '@/interfaces/LocalStorageInterfaces'
import Progress from '@/components/common/progressBar/Progress.vue'

@Component({
  name: 'IcoachSkillList',
  components: {
    Progress
  }
})
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
 .icoach-skills-expand {
    position: absolute;
    top: 24px;
    right: -14px;
    cursor: pointer;
    width: 28px;
    height: 28px;
    border-radius: 16px;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.08);
    border: solid 1px #d6efff;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icoach-skills-category-list {
    padding-left: 32px;
    li {
      font-weight: 100;
      padding: 12px 0 10px;
      border-bottom: 1px solid #e6f3fa;
      position: relative;
      &:after {
        content: '';
        position: absolute;
        width: 14px;
        height: 14px;
        border-radius: 8px;
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
        border: solid 1px #e1e6e9;
        background-color: #ffffff;
        left: -33px;
        top: calc(50% - 8px);
      }
      &.active {
        font-weight: 500;
        color: #3d5a80;
        &:after {
          background-color: #00cdbf;
          box-shadow: none;
          border-color: #00cdbf;
        }
      }
    }
  }

  .hide {
    display: none;
  }
</style>
