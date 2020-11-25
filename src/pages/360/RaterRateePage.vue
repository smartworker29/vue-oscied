<template>
  <div class="survey ts-rater-ratee-page">
    <div class="survey-header">
      <h1 class="survey-title">
        {{
          $t("welcome_to_survey", {
            surveyName: surveyInfo ? surveyInfo.title : ""
          })
        }}
      </h1>
    </div>
    <div class="survey-content" v-if="ratee">
      <!-- <button class="btn-back btn btn-primary btn-primary-active" @click="goToList">
        {{ $t("button_g.back") }}
      </button> -->

      <div class="rater-ratee-wrapper">
        <div class="rater-ratee-mobile-wrapper">
         <div class="header">
            <h2>{{ $t("who_i_rating") }}</h2>
          <button class="rater-ratee-expand-nav" @click="toggleRateeMobileNav">
            <span v-if="!rateeMobileNav"></span>
            <span v-if="!rateeMobileNav"></span>
            <span v-if="!rateeMobileNav"></span>
            <fa v-if="rateeMobileNav" class="icon" icon="arrow-up" />
          </button>
         </div>
          <div class="content rater-ratee-info" :class="{'active': rateeMobileNav}">
              <rater-ratee-card :ts-survey-id="tsSurveyId" :raterRatee="ratee" :hasEveryday="hasRoleManager" />
          </div>
        </div>

        <div class="ratees-block rater-ratee-info">
          <h2>{{ $t("who_i_rating") }}</h2>

          <rater-ratee-card :ts-survey-id="tsSurveyId" :raterRatee="ratee" :hasEveryday="hasRoleManager" />
          <div v-if="myPerformanceManager">
            <h2>{{ $t('my_performance_manager') }}</h2>
            <div class="ratee-items">
              <performance-manager-card :manager="myPerformanceManager" />
            </div>
          </div>
        </div>
        <div class="ratees-block rater-ratee-skills">
          <div v-if="groupedSkillList">
            <div v-for="(group, id) in groupedSkillList" :key="id">
              <h4 class="rater-ratee-skill-title">
                {{ $t(`icoach.categories.${id}`) }}
              </h4>
              <rater-ratee-skill-card v-for="skill in group" :key="skill.id" :skill="skill" @rate="rateSkill" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component,
  Prop,
  Vue
} from 'vue-property-decorator'
import {
  IcoachSkillShortInfo,
  SurveyInfo,
  TsManagerUser,
  TsRateeUser,
  TsUserDto,
  TsUserRole
} from '@/interfaces'
import {
  Getter
} from 'vuex-class'
import RaterRateeCard from '@/components/360/RaterRateeCard.vue'
import TsService from '@/services/TsService'
import RaterRateeSkillCard from '@/components/360/RaterRateeSkillCard.vue'
import PerformanceManagerCard from '@/components/360/PerformanceManagerCard.vue'

  @Component({
    name: 'RaterRateePage',
    components: {
      RaterRateeCard,
      PerformanceManagerCard,
      RaterRateeSkillCard
    }
  })
export default class RaterRateePage extends Vue {
    @Prop()
    tsSurveyId!: number;

    @Prop()
    tsRaterRateeId!: number;

    @Getter('user/isAuthenticated')
    isAuthenticated!: boolean;

    @Getter('survey/getDisplayedBaseSurveyInfo')
    surveyInfo!: SurveyInfo;

    @Getter('ts/hasRoleRatee')
    hasRoleRatee!: boolean;

    @Getter('ts/hasRoleRater')
    hasRoleRater!: boolean

    @Getter('ts/hasRoleManager')
    hasRoleManager!: boolean;

    @Getter('ts/getUsers')
    tsUserInfo!: TsUserDto;
    isMobile: boolean = window.innerWidth < 767;
    ratee: TsRateeUser | null = null;
    skillList: IcoachSkillShortInfo[] | null = null;
    groupedSkillList: {
      [key: number]: IcoachSkillShortInfo[]
    } = {};
    myPerformanceManager: TsManagerUser | null = null;
    rateeMobileNav: boolean = false;

    async toggleRateeMobileNav () {
      this.rateeMobileNav = !this.rateeMobileNav
    }

    async created () {
      if (!this.isAuthenticated) {
        await this.$router.push({
          name: 'notFound'
        })
      }

      if (!this.ratee) {
        this.ratee = await TsService.getRateeInfoById(this.tsRaterRateeId)
      }

      if (!this.skillList) {
        this.skillList = this.hasRoleManager
          ? await TsService.getSkillList(this.tsRaterRateeId)
          : await TsService.getSkillListForUser(this.tsRaterRateeId)
      }

      if (!this.skillList) {
        return
      }

      await this.uploadMyPerformanceManager()
      this.groupedSkillList = this.groupSkills(this.skillList)
    }

    groupSkills (
      skills: IcoachSkillShortInfo[]
    ): {
      [key: number]: IcoachSkillShortInfo[]
    } {
      return skills.reduce((rv: any, skill: IcoachSkillShortInfo) => {
        (rv[skill.category] = rv[skill.category] || []).push(skill)
        return rv
      }, {})
    }

    goToList (): void {
      this.$router.push({
        name: 'survey.ts.dashboard',
        params: {
          tsSurveyId: this.tsSurveyId.toString()
        }
      })
    }

    rateSkill (skill: IcoachSkillShortInfo) {
      this.$router.push({
        name: 'survey.ts.user.ratee.skill',
        params: {
          tsSurveyId: this.tsSurveyId.toString(),
          tsRaterRateeId: this.tsRaterRateeId.toString(),
          skillId: skill.id.toString()
        }
      })
    }

    async uploadMyPerformanceManager () {
      if (this.hasRoleRatee) {
        const currentRatee = this.tsUserInfo.users.find(
          user => user.role === TsUserRole.RATEE
        )
        if (!currentRatee) {
          return
        }
        this.myPerformanceManager = await TsService.getManagerInfo(TsUserRole.RATEE, currentRatee.id)
      } else if (this.hasRoleRater) {
        if (!this.ratee) {
          return
        }

        this.myPerformanceManager = await TsService.getManagerInfo(TsUserRole.RATER, this.ratee.id)
      }
    }
}

</script>

<style lang="scss" scoped>
  .survey {
    &-content {
      padding: 0;
      padding-left: 5%;
      padding-bottom: 60px;
      background-color: #fafdff;

      @media screen and (max-width: 768px) {
        padding-left: 0;
      }
    }

    &-header {
      padding: 32px 5% 32px 5%;

      @media screen and (max-width: 768px) {
        padding: 24px 5% 24px 5%;
      }
    }

    &-title {
      margin-top: 0;
      font-size: 24px;
      font-weight: 300;
      color: #ffffff;
    }
  }

  .ratees-block {
    h2 {
      margin-top: 24px;
      font-weight: bold;
    }
  }

  .ts-rater-ratee-page {

    .rater-ratee-wrapper {

      .rater-ratee-card {
        border-radius: 12px;
        padding: 24px;
        box-sizing: border-box;
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.05);
        border: solid 1px #e6f3fa;
        background-color: #ffffff;

        .actions {
          .btn-primary-active {
            border-radius: 8px;
            background-color: #0085cd;
          }
        }
      }

      .rater-ratee-skills {

        padding-left: 24px;
        padding-right: 80px;
        background: #fff;

        @media screen and (max-width: 768px) {
          padding-left: 5%;
          padding-right: 5%;
        }

        .rater-ratee-skill-title {
          padding-top: 40px;
          font-family: "CerebriSans", sans-serif;
          font-size: 24px;
          font-weight: 600;
          color: #3d5a80;

          @media screen and (max-width: 768px) {
            font-size: 20px;
          }
        }

        .rater-ratee-skill-card-wrapper {
          padding: 27px 0;
        }
      }
    }
  }

  .btn-back {
    margin-top: 24px;
  }

  .rater-ratee-mobile-wrapper {
    position: relative;
    z-index: 9999;
    padding: 16px 5% 18px 5%;
    background-color: #fafdff;
    display: none;

    box-shadow: 0 9px 16px 0 rgba(0, 0, 0, 0.15);

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    h2 {
      font-size: 20px;
      font-weight: bold;
      margin: 0;
    }

    .content {
      display: none;
      padding-top: 5%;
      padding-bottom: 5%;
      background-color: #fafdff;
      position: relative;

      &.active {
        display: block;
      }
    }

    .rater-ratee-expand-nav {
      width: 28px;
      height: 28px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: 16px;
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.08);
      border: solid 1px #d6efff;
      background-color: #ffffff;
      outline: none;
      z-index: 999;

      span {
        display: block;
        width: 12px;
        height: 2px;
        background-color: #0085cd;

        &:not(:last-of-type) {
          margin-bottom: 2px;
        }
      }

      .icon {
        color: #0085cd;
      }
    }
  }

  @media screen and (max-width: 768px) {
    .rater-ratee-info {
      display: none;
    }

    .rater-ratee-mobile-wrapper {
      display: block;
    }
  }

</style>
