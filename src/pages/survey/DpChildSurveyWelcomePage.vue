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
import SurveyService from '@/services/SurveyService'

@Component({ name: 'DpChildSurveyWelcomePage' })
export default class DpChildSurveyWelcomePage extends Vue {
  @Prop({})
  surveyProduct!: string
  @Prop({})
  surveyUserId!: string

  @Getter('survey/getTakenSurveyId')
  takenSurveyProductId!: number
  @Getter('survey/getTakenSurveyType')
  takenSurveyProductType!: string
  @Getter('survey/getTakenSurveyUserId')
  takenSurveyUserId!: number
  @Getter('survey/getDpSurveyUserId')
  dpSurveyUserId!: number

  @Getter('survey/isTakenSurveyInitiated')
  isTakenSurveyInitiated!: boolean
  @Getter('survey/isDpTakenSurvey')
  isDpTakenSurvey!: boolean

  @Getter('survey/getDisplayedBaseSurveyInfo')
  surveyInfo!: SurveyInfo

  isUncompletedSurvey: boolean = false

  async created () {
    if (!this.isTakenSurveyInitiated) {
      const redirect = await this.uploadDpSurveyData()

      if (redirect) {
        return
      }
    }

    if (!this.isDpTakenSurvey) {
      this.$router.push({ name: 'notFound' })
      return
    }

    this.isUncompletedSurvey = SurveyLocalStorageHelper.hasSurveyUser(this.surveyProduct, this.takenSurveyUserId)
  }

  async uploadDpSurveyData () : Promise<boolean> {
    let dpSurveyUserId: boolean | number = false
    if (SurveyLocalStorageHelper.hasSurveyUser(this.surveyProduct, parseInt(this.surveyUserId))) {
      dpSurveyUserId = await SurveyHelper.uploadDpSurveyDataByChild(
        SurveyLocalStorageHelper.getSurveyUser(this.surveyProduct, parseInt(this.surveyUserId))
      )
    } else {
      const parentDpSurveyUserId = SurveyLocalStorageHelper.getParentDpSurveyUserId(this.surveyProduct, parseInt(this.surveyUserId))
      if (parentDpSurveyUserId) {
        dpSurveyUserId = await SurveyHelper.uploadDpSurveyDataFromLocalStorage(parentDpSurveyUserId)
      }
    }

    if (typeof dpSurveyUserId === 'number') {
      const progress = await this.getDpProgress(dpSurveyUserId)
      return progress
    }
    return false
  }

  async getDpProgress (dpSurveyUserId: number) : Promise<boolean> {
    const progress = await SurveyService.getDpSurveyProgress(dpSurveyUserId)

    if (progress.isCompleted || !progress.nextSurveyPart) {
      SurveyHelper.completeSurvey(SurveyHelper.DP, null, dpSurveyUserId)
      this.$router.push({ name: 'survey.complete', params: { title: this.surveyInfo.title } })
      // todo::[m] Add logic for handling completed survey
      // todo::[m] I leave these comments there, because logic of the completed survey is not fully described at moment
      return true
    }

    const nextSurveyProductInfo = await SurveyService.getSurveyInfoById(
      progress.nextSurveyPart.product,
      progress.nextSurveyPart.id
    )

    SurveyHelper.checkSurveyInfo(nextSurveyProductInfo)

    this.$store.commit('survey/setTakenSurveyData', {
      productSurveyId: progress.nextSurveyPart.id,
      productSurveyType: progress.nextSurveyPart.product,
      surveyInfo: nextSurveyProductInfo
    })

    this.$store.commit('survey/setTakenSurveyUserId', {
      productSurveyType: progress.nextSurveyPart.product,
      surveyUserId: progress.nextSurveyPart.surveyUserId
    })

    SurveyLocalStorageHelper.addDpChildSurveyUser(
      dpSurveyUserId,
      progress.nextSurveyPart.product,
      progress.nextSurveyPart.surveyUserId
    )

    if (this.$route.params['surveyProduct'] !== progress.nextSurveyPart.product ||
      this.$route.params['surveyUserId'] !== progress.nextSurveyPart.surveyUserId.toString()
    ) {
      this.$router.push({
        name: 'survey.welcome.dp.survey_product',
        params: {
          surveyProduct: progress.nextSurveyPart.product,
          surveyUserId: progress.nextSurveyPart.surveyUserId.toString()
        }
      })
      return true
    }

    return false
  }

  async beginSurvey () {
    SurveyLocalStorageHelper.beginDpChildSurvey({
      surveyProductType: this.takenSurveyProductType,
      surveyAccessCode: null,
      surveyProductId: this.takenSurveyProductId,
      surveyProductTitle: this.surveyInfo.title,
      surveyUserId: this.takenSurveyUserId,
      dpSurveyId: this.dpSurveyUserId,
      dpChildSurveys: []
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
