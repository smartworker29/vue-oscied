<template>
  <div class="icoach">
    <div class="icoach-header">
      <h1 class="icoach-title">
        <span>{{ icoachTitle }}</span>
      </h1>
    </div>
    <div class="icoach-not-found" v-if="!icoachDashboardInfo || !Object.keys(icoachDashboardInfo).length">
      {{ $t('skills.no_skills') }}
    </div>
    <div class="icoach-dashboard" v-else>
      <div class="icoach-categories">
        <ul class="icoach-category-list">
          <li
            v-for="(category, index) in icoachDashboardInfo" :key="index"
            @click="changeIndex(parseInt(index))"
            :class="{ 'active': activeIndex === parseInt(index) }">
            <span>{{ $t(`skills.categories.${index}`) }}</span>
            <span> {{ completedSkills(category) }}/{{ category.length }} {{ $t('skills.completed')}}</span>
          </li>
        </ul>
      </div>
      <div class="icoach-content">
        <h2>
          {{ $t(`skills.categories.${activeIndex}`) }}
        </h2>
        <div class="icoach-skills">
          <router-link
            v-for="(skill, index) in icoachDashboardInfo[activeIndex]" :key="index"
            @click.native="openSkill"
            class="icoach-skill"
            :to="{ name: 'icoach.skill', params: { icoachUserId: icoachUserId, skillId: skill.id, stepId: 1 } }"
          >
            <span>{{ skill.name }}</span>
            <Progress
              :processed-props-items-count="skill.completed"
              :total-props-progress-items-count="skill.total"
              percentage="true"
            />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import {
  IcoachCategories,
  IcoachCategoriesEnum,
  IcoachCategorySkill,
  IcoachDashboardInfo
} from '@/interfaces/IcoachInterfaces'
import IcoachService from '@/services/IcoachService'
import IcoachLocalStorageHelper from '@/utils/IcoachLocalStorageHelper'
import Progress from '@/components/common/progressBar/Progress.vue'

@Component({
  name: 'DashboardPage',
  components: {
    Progress
  }
})
export default class DashboardPage extends Vue {
  @Prop({})
  icoachUserId!: number

  icoachDashboardInfo: IcoachDashboardInfo | null = null
  activeIndex: IcoachCategories = IcoachCategoriesEnum.SOFT_SKILLS
  icoachTitle: string = ''

  async created () {
    if (!IcoachLocalStorageHelper.hasIcoachUser(this.icoachUserId)) {
      this.$router.push({ name: 'notFound' })

      return
    }

    try {
      this.uploadIcoachInfo()
    } catch (error) {
      this.$router.push({ name: 'notFound' })
    }
  }

  async uploadIcoachInfo () {
    const icoachUser = IcoachLocalStorageHelper.getIcoachUser(this.icoachUserId)
    if (icoachUser === null || icoachUser.icoachAccessCode === null) {
      throw new Error()
    }

    this.icoachTitle = icoachUser.icoachCourseTitle
    this.activeIndex = icoachUser.icoachSkillCategoryId
    this.icoachDashboardInfo = await IcoachService.getIcoachDashboardInfo(icoachUser.icoachCourseId, icoachUser.icoachUserId)
  }

  completedSkills (category: IcoachCategorySkill[]) : number {
    let total: number = 0

    category.forEach((skill) => {
      if (skill.isCompleted) {
        total++
      }
    })

    return total
  }

  openSkill () {
    IcoachLocalStorageHelper.updateCurrentCategory(this.icoachUserId, this.activeIndex)
  }

  changeIndex (index: IcoachCategories) {
    this.activeIndex = index
  }
}
</script>

<style lang="scss">
  .icoach-dashboard {
    display: flex;
    flex-wrap: wrap;
  }

  .icoach-categories {
    max-width: 30%;
  }

  .icoach-category-list {
    padding: 10px;

    li, button {
      cursor: pointer;
      padding: 0 24px;
      margin: 5px 0;
      font-size: 16px;
      align-items: center;
      height: 42px;
      display: flex;
      transition: 0.2s all;

      span {
        margin: 0 17px;
      }

      &:hover {
        background: #bdddff;
      }
    }

    li.active, li:hover, button.active, button:hover {
      border: 1px solid #bdddff;
      border-radius: 10px;
      background: #e6f3fa;
    }
  }

  .icoach-content {
    max-width: 70%;
  }

  .icoach-skills {
    display: flex;
    flex-wrap: wrap;
  }

  .icoach-skill {
    flex: 1 0 21%;
    padding: 5px;
    margin: 5px;
    height: 100px;
    background-color: #f7fcff;
    border-radius: 5px;
    border: 1px solid #edf6fb;
    text-decoration: none;
    color: #071012;
    font-size: 16px;
  }

  .icoach-not-found {
    padding: 1% 5.5% 7px 5.5%;
  }
</style>
