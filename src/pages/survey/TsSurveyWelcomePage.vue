<template>
  <div class="survey">
    <div class="survey-header">
      <h1 class="survey-title">{{ $t('welcome_to_survey', { surveyName: (surveyInfo) ? surveyInfo.title : '' }) }}</h1>
    </div>
    <div class="survey-content">
      <p v-html="(surveyInfo) ? surveyInfo.welcomeMessage : ''"></p>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { SurveyInfo } from '@/interfaces'
import { Getter } from 'vuex-class'

@Component({
  name: 'TsSurveyWelcomePage'
})
export default class TsSurveyWelcomePage extends Vue {
  @Prop()
  surveyUserId !: number

  @Getter('survey/getDisplayedBaseSurveyInfo')
  surveyInfo!: SurveyInfo
}
</script>
