<template>
  <div class="survey">
    <div class="survey-header">
      <h1 class="survey-title">{{ $t('welcome_to_survey', { surveyName: (surveyInfo) ? surveyInfo.title : '' }) }}</h1>
    </div>
    <div class="survey-content">
      <p v-html="(surveyInfo) ? surveyInfo.welcomeMessage : ''"></p>
      <button class="btn btn-primary btn-primary-active" @click="beginSurvey">
        {{ isUncompletedSurvey ? $t('button_g.continue_survey') : $t('button_g.start_survey') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { SurveyInfo } from '@/interfaces/SurveyInterfaces'
import SurveyLocalStorageHelper from '@/utils/SurveyLocalStorageHelper'
import SurveyHelper from '@/utils/SurveyHelper'

@Component({})
export default class DpChildSurveyWelcomePage extends Vue {
  @Prop({})
  surveyProduct!: string
  @Prop({})
  surveyProductId!: string

  @Getter('survey/getTakenSurveyId')
  takenSurveyProductId!: number
  @Getter('survey/getTakenSurveyType')
  takenSurveyProductType!: string
  @Getter('survey/getTakenSurveyUserId')
  takenSurveyUserId!: number
  @Getter('survey/getDpSurveyUserId')
  dpSurveyUserId!: number

  @Getter('survey/getDisplayedBaseSurveyInfo')
  surveyInfo!: SurveyInfo

  isUncompletedSurvey: boolean = false

  async created () {
    if (this.surveyProduct !== this.takenSurveyProductType || this.takenSurveyProductId.toString() !== this.surveyProductId) {
      // SurveyHelper.completeSurvey(this.surveyProduct, this.surveyProductId, this.takenSurveyUserId)
      // SurveyHelper.completeSurvey('discovery-process', this.surveyProductId, this.takenSurveyUserId)
      // todo[m]:: add logic for the uncompleted survey
      this.$router.push({ name: 'notFound' })
      return
    }

    this.isUncompletedSurvey = SurveyLocalStorageHelper.hasSurveyUser(this.surveyProduct, this.takenSurveyUserId)
  }

  async beginSurvey () {
    SurveyLocalStorageHelper.beginDpChildSurvey({
      surveyProductType: this.takenSurveyProductType,
      surveyAccessCode: null,
      surveyProductId: this.takenSurveyProductId,
      surveyUserId: this.takenSurveyUserId,
      dpSurveyId: this.dpSurveyUserId
    })

    this.$router.push({
      name: 'survey.dp.page.part',
      params: {
        surveyProduct: this.surveyProduct,
        surveyUserId: this.takenSurveyUserId.toString(),
        sectionNumber: '1'
      }
    })
  }
}
</script>

<style lang="scss">
  .survey {
    background: #fff;
    height: 100%;
    .progress-wrapper.survey-progress {
      @media only screen and (max-width: 768px) {
        display: none;
      }
    }
  }

  .survey-logos {
    display: flex;
    align-items: center;
    margin: 0 24px;
  }

  .survey-logo {
    height: 50px;
    margin-right: 10px;
    @media only screen and (max-width: 768px) {
      width: 100px
    }
    img {
      display: block;
      height: 100%;
    }
  }

  .survey-more {
    color: #0085cd;
    margin-left: 16px;
    @media only screen and (max-width: 768px) {
      display: block;
      width: 100%;
      margin-left: 0px;
      margin-top: 6px;
    }
  }

  .survey-title {
    font-size: 32px;
    font-weight: 300;
    color: #fff;
    display: flex;
    justify-content: space-between;
    @media only screen and (max-width: 768px) {
      margin-bottom: 11px;
    }
    .progress-wrapper {
      display: flex;
      font-size: 12px;
      color: #3d5a80;
      .progress-title {
        color: #fff;
        margin-right: 12px;
      }
    }
  }

  .survey-header {
    background: #0085cd;
    overflow: hidden;
    color: #fff;
    padding: 1% 5.5% 7px 5.5%;
    p {
      margin-bottom: 30px;
    }
  }

  .survey-content {
    color: #071012;
    overflow: hidden;
    padding: 3.1% 39.5% 60px 5.5%;
    @media only screen and (max-width: 1024px) {
      padding: 4.1% 41.5% 60px 3.5%;
    }
    @media only screen and (max-width: 768px) {
      padding: 12px 12px 1px 10px;
      .btn {
        width: 100%;
      }
    }
    h2 {
      font-size: 20px;
      font-weight: 300;
      margin: 0 0 30px 0;
    }
    p {
      margin-bottom: 30px;
      @media only screen and (max-width: 768px) {
        margin-bottom: 19px;
      }
    }
  }
</style>
