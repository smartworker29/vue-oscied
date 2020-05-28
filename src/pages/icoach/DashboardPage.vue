<template>
  <div class="icoach">
    <div class="icoach-header">
      <h1 class="icoach-title">
        <span>{{ icoachTitle }}</span>
      </h1>
    </div>
    <div class="icoach-not-found" v-if="!icoachDashboardInfo || !Object.keys(icoachDashboardInfo).length">
      {{ $t('icoach.no_skills') }}
    </div>
    <div class="icoach-wrapper flex" v-else>
      <div class="icoach-categories">
        <ul class="icoach-category-list">
          <li
            v-for="(category, index) in icoachDashboardInfo" :key="index"
            @click="changeIndex(parseInt(index))"
            :class="{ 'active': activeIndex === parseInt(index) }">
            <p>
              <span>{{ $t(`icoach.categories.${index}`) }}</span>
            </p>
            <span class="icoach-category-item-progress"> {{ completedSkills(category) }}/{{ category.length }} {{ $t('icoach.completed')}}</span>
            <img :src="require('@/assets/icons/arrow-down-xs.svg')">
          </li>
        </ul>
      </div>
      <div class="icoach-content">
        <h2 class="icoach-content-title">
          {{ $t(`icoach.categories.${activeIndex}`) }}
        </h2>
        <p class="icoach-content-subtitle">
          Develop the skills and competencies that are linked to your emotional intelligence.
        </p>
        <div class="icoach-skills">
          <router-link
            v-for="(skill, index) in icoachDashboardInfo[activeIndex]" :key="index"
            @click.native="openSkill"
            class="icoach-skill"
            :to="{ name: 'icoach.skill', params: { icoachUserId: parseInt(icoachUserId), skillId: parseInt(skill.id), stepId: 1 } }"
          >
            <span class="icoach-skill-name">{{ skill.name }}</span>
            <Progress
              :show-title="false"
              :show-percent-inside="false"
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
    padding: 35px 5.5% 0 5.5%;
    flex-wrap: wrap;
  }

  .icoach-categories {
    max-width: 275px;
    width: 100%;
    @media only screen and (max-width: 600px) {
      max-width: 100%;;
    }
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
      position: relative;
      padding: 8px 34px 8px 16px;
      img {
        position: absolute;
        right: 13px;
        top: calc(50% - 13px);
      }
    }

    @media only screen and (max-width: 600px) {
      overflow-x: scroll;
      white-space: nowrap;
      li {
        display: inline-block;
        margin-right: 5px;
        font-size: 14px;
        padding: 8px 11px;
        img {
          display: none;
        }
        .icoach-category-item-progress {
          display: none;
        }
      }
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
    padding: 0 1.4% 0 4.3%;
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

    @media only screen and (max-width: 600px) {
      padding: 8px 0 0 0;
      .icoach-content-title {
        font-size: 24px;
      }
      .icoach-content-subtitle {
        font-size: 18px;
      }
    }
  }

  .icoach-skills {
    justify-content: flex-start;
    display: flex;
    flex-wrap: wrap;
  }

  .icoach-skill {
    width: calc(33% - 27px);
    border-radius: 12px;
    margin-right: 40px;
    border: solid 1px #e6f3fa;
    background-color: #f7fcff;
    font-size: 20px;
    line-height: 1.4;
    letter-spacing: normal;
    color: #071012;
    text-decoration: none;
    padding: 16px 15px;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 16px;

    &:nth-child(3n) {
      margin-right: 0;
    }

    @media only screen and (max-width: 1280px) {
      width: calc(33% - 14px);
      margin-right: 21px;
    }

    @media only screen and (max-width: 980px) {
      width: calc(50% - 14px);
      margin-right: 28px;

      &:nth-child(3n) {
        margin-right: 28px;
      }

      &:nth-child(2n) {
        margin-right: 0px;
      }
    }

    @media only screen and (max-width: 768px) {
      width: 100%;
      margin-right: 0px !important;
    }

    .progress {
      width: calc(100% - 50px);
      background-color: #e6f3fa;
      border-color: transparent;
      margin-right: 10px;
      height: 9px;
      .progress-bar {
        height: 9px;
        border-radius: 5px;
        background: #00cdbf;
        border: none;
        margin-top: -1px;
        margin-left: -1px;
      }
    }

    .progress-wrapper {
      padding-right: 4px;
      width: 100%;
      align-self: flex-end;
    }

    .progress-percentage {
      font-size: 16px;
    }
  }

  .icoach-skill-name {
      font-size: 20px;
      font-weight: 200;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.4;
      letter-spacing: normal;
      color: #071012;
      display: block;
      margin-bottom: 13px;

      @media only screen and (max-width: 1280px) {
        font-size: 16px;
      }

      @media only screen and (max-width: 600px) {
        font-size: 20px;
      }
  }

  .icoach-not-found {
    padding: 1% 5.5% 7px 5.5%;
  }
</style>
