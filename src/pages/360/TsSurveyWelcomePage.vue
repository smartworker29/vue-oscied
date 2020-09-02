<template>
  <div class="survey">
    <div class="survey-header">
      <h1 class="survey-title">{{ $t('welcome_to_survey', { surveyName: (surveyInfo) ? surveyInfo.title : '' }) }}</h1>
    </div>
    <div class="survey-content">
      <p v-html="(surveyInfo) ? surveyInfo.welcomeMessage : ''"></p>
      <button class="btn btn-primary btn-primary-active" @click="beginTsSurvey">
        {{ $t('button_g.start_survey') }}
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { SurveyInfo, User } from '@/interfaces'
import { Getter } from 'vuex-class'
import TsService from '@/services/TsService'

@Component({
  name: 'TsSurveyWelcomePage'
})
export default class TsSurveyWelcomePage extends Vue {
  @Prop()
  surveyId !: number

  @Getter('user/isAuthenticated')
  isAuthenticated!: boolean

  @Getter('survey/getDisplayedBaseSurveyInfo')
  surveyInfo!: SurveyInfo

  @Getter('user/currentUser')
  user!: User

  created () {
    if (!this.isAuthenticated) {
      this.$router.push({ name: 'notFound' })
    }
  }

  async beginTsSurvey () {
    const survey = await TsService.getUser(this.surveyId, this.user.id)

    this.$store.commit('ts/setTsUser', survey)
    this.$router.push({
      name: 'survey.ts.dashboard'
    })
  }
}
</script>
