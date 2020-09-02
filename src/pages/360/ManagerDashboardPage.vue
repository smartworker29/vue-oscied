<template>
  <div class="survey">
    <div class="survey-header">
      <h1 class="survey-title">{{ $t('welcome_to_survey', { surveyName: (surveyInfo) ? surveyInfo.title : '' }) }}</h1>
    </div>
    <div class="survey-content ts-survey">
      <button class="btn btn-primary btn-primary-active" @click="addNewRatee">
        {{ $t('button_g.add_new_rating_team') }}
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { SurveyInfo, TsUserDto } from '@/interfaces'
import { Getter } from 'vuex-class'

@Component({
  name: 'ManagerDashboardPage'
})
export default class ManagerDashboardPage extends Vue {
  @Prop()
  surveyUserId !: number

  @Getter('user/isAuthenticated')
  isAuthenticated!: boolean

  @Getter('survey/getDisplayedBaseSurveyInfo')
  surveyInfo!: SurveyInfo

  @Getter('ts/getUser')
  tsUser!: TsUserDto

  addNewRatee () {}

  created () {
    if (!this.isAuthenticated) {
      this.$router.push({ name: 'notFound' })
    }
  }
}
</script>
