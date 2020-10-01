<template>
  <div class="survey ts-rater-ratee-page">
    <div class="survey-header">
      <h1 class="survey-title">{{ $t('welcome_to_survey', { surveyName: (surveyInfo) ? surveyInfo.title : '' }) }}</h1>
    </div>
    <div class="survey-content" v-if="ratee">
      <button class="btn btn-primary btn-primary-active" @click="goToList">
        {{ $t('button_g.back') }}
      </button>

      <div class="rater-ratee-wrapper">
        <div class="ratees-block rater-ratee-info">
          <h2>{{ $t('who_i_rating') }}</h2>
          <rater-ratee-card :ts-survey-id="tsSurveyId" :raterRatee="ratee" />
        </div>
        <div class="ratees-block rater-ratee-skills">
          <div v-if="groupedSkillList">
            <div v-for="(group, id) in groupedSkillList" :key="id">
              <h4 class="rater-ratee-skill-title">
                {{ $t(`icoach.categories.${id}`) }}
              </h4>
              <rater-ratee-skill-card
                v-for="skill in group"
                :key="skill.id"
                :skill="skill"
                @rate="rateSkill"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import {
  IcoachSkillShortInfo,
  SurveyInfo,
  TsRateeUser
} from '@/interfaces'
import { Getter } from 'vuex-class'
import RaterRateeCard from '@/components/360/RaterRateeCard.vue'
import TsService from '@/services/TsService'
import RaterRateeSkillCard from '@/components/360/RaterRateeSkillCard.vue'

@Component({
  name: 'RaterRateePage',
  components: {
    RaterRateeCard,
    RaterRateeSkillCard
  }
})
export default class RaterRateePage extends Vue {
  @Prop()
  tsSurveyId !: number

  @Prop()
  tsRaterRateeId !: number

  @Getter('user/isAuthenticated')
  isAuthenticated!: boolean

  @Getter('survey/getDisplayedBaseSurveyInfo')
  surveyInfo!: SurveyInfo

  ratee: TsRateeUser | null = null
  skillList: IcoachSkillShortInfo[] | null = null
  groupedSkillList: { [key: number]: IcoachSkillShortInfo[] } = {}

  async created () {
    if (!this.isAuthenticated) {
      await this.$router.push({ name: 'notFound' })
    }

    if (!this.ratee) {
      this.ratee = await TsService.getRateeInfoById(this.tsRaterRateeId)
    }

    if (!this.skillList) {
      this.skillList = await TsService.getSkillListForUser(this.tsRaterRateeId)
    }

    if (!this.skillList) {
      return
    }

    this.groupedSkillList = this.groupSkills(this.skillList)
  }

  groupSkills (skills: IcoachSkillShortInfo[]) : { [key: number]: IcoachSkillShortInfo[] } {
    return skills.reduce((rv: any, skill: IcoachSkillShortInfo) => {
      (rv[skill.category] = rv[skill.category] || []).push(skill)
      return rv
    }, {})
  }

  goToList (): void {
    this.$router.push({
      name: 'survey.ts.user.dashboard',
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
}
</script>
