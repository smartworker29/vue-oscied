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
    <div class="icoach-wrapper flex" v-else>
      <div class="icoach-categories">
        <ul class="icoach-category-list">
          <li
            v-for="(category, index) in icoachDashboardInfo" :key="index"
            @click="changeIndex(parseInt(index))"
            :class="{ 'active': activeIndex === parseInt(index) }">
            <p>
              <span>{{ $t(`skills.categories.${index}`) }}</span>
            </p>
            <span class="icoach-category-item-progress">
              0/2 Skills completed
            </span>
            <span>{{ $t(`skills.categories.${index}`) }}</span>
            <span> {{ completedSkills(category) }}/{{ category.length }} {{ $t('skills.completed')}}</span>
          </li>
        </ul>
      </div>
      <div class="icoach-content">
        <h2 class="icoach-content-title">
          {{ $t(`skills.categories.${activeIndex}`) }}
        </h2>
        <p class="icoach-content-subtitle">
          Develop the skills and competencies that are linked to your emotional intelligence.
        </p>
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
    this.icoachDashboardInfo = await IcoachService.getIcoachDashboardInfo(icoachUser.icoachAccessCode, icoachUser.icoachUserId)
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
    padding: 35px 5.5% 0 5.5%;
    flex-wrap: wrap;
  }

  .icoach-categories {
    max-width: 275px;
    width: 100%;
  }

  .icoach-category-list {
    font-weight: 100;
    li, button {
      cursor: pointer;
      margin: 5px 0 11px;
      font-size: 16px;
      align-items: center;
      transition: 0.2s all;
      &:hover {
        background: #bdddff;
      }
    }

    li {
      padding: 8px 16px;
    }
    .icoach-category-item-progress {
      font-size: 12px;
      color: #3d5a80;
      margin-top: 1px;
      display: block;
    }

    li.active, li:hover, button.active, button:hover {
      border-radius: 10px;
      background: #e6f3fa;
    }
  }

  .icoach-content {
    padding: 0 0 0 4.3%;
    width: 100%;
    justify-content: space-between;

    .icoach-content-title {
      font-size: 32px;
      font-weight: 600;
      color: #3d5a80;
      margin-bottom: 13px;
      margin-top: 3px;
    }

    .icoach-content-subtitle {
      font-size: 20px;
      font-weight: 400;
      margin-bottom: 22px;
      line-height: 1.4;
      color: #071012;
      max-width: 500px;
    }
  }

  .icoach-skills {
    justify-content: space-between;
    display: flex;
    flex-wrap: wrap;
  }

  .icoach-skill {
    width: calc(33% - 27px);
    border-radius: 12px;
    border: solid 1px #e6f3fa;
    background-color: #f7fcff;
    font-size: 20px;
    line-height: 1.4;
    letter-spacing: normal;
    color: #071012;
    text-decoration: none;
    padding: 16px 15px;
  }

  .icoach-not-found {
    padding: 1% 5.5% 7px 5.5%;
  }
</style>
