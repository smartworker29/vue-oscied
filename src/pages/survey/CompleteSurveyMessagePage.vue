<template>
  <div class="survey-completed-page-completed">
    <h1> {{ title || 'CCR3 Onesource' }}</h1>
    <div>
      <h2>{{ reason ? $t(reason) : $t('survey_completed_heading') }}</h2>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({ name: 'CompleteSurveyMessagePage' })
export default class CompleteSurveyMessagePage extends Vue {
  @Prop({ default: '' })
  title?: string

  @Prop({ default: null })
  reason?: string | null
}
</script>

<style lang="scss">
.survey-completed-page-completed {
  padding: 30px 5.5%;
  color: #fff;
  h1 {
    margin-bottom: 8px;
    font-size: 32px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;

  }
  h2 {
    font-size: 32px;
    line-height: 32px;
    font-weight: 300;
  }
}
  .survey-completed-page-completed h1 {
    color: #ffffff;
  }
</style>
