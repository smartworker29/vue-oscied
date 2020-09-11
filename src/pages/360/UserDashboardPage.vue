<template>
  <div class="survey">
    <div class="survey-header">
      <h1 class="survey-title">{{ $t('welcome_to_survey', { surveyName: (surveyInfo) ? surveyInfo.title : '' }) }}</h1>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { SurveyInfo } from '@/interfaces'

@Component({
  name: 'UserDashboardPage'
})
export default class UserDashboardPage extends Vue {
  @Getter('survey/getDisplayedBaseSurveyInfo')
  surveyInfo!: SurveyInfo
}
</script>
