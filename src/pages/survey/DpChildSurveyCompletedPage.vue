<template>
  <div class="survey-completed-page">
    <div class="survey-complete-page-progress">
      <div class="survey-complete-page-progress-item" :class="{ 'completed': partCompleted > 0 }">
        <span>{{ $t('eq.title') }}</span>
        <div class="survey-complete-page-circle">
          <div></div>
        </div>
        <!-- <input id="eq_completed" type="radio" name="eq_completed" :checked="partCompleted > 0"> -->
      </div>

      <div class="survey-complete-page-progress-item" :class="{ 'completed': partCompleted > 1, 'next': partCompleted > 0 }">
        <span>{{ $t('values.title') }}</span>
        <div class="survey-complete-page-circle">
          <div></div>
        </div>
        <!-- <input id="values_completed" type="radio" name="values_completed" :checked="partCompleted > 1"> -->
      </div>

      <div class="survey-complete-page-progress-item" :class="{ 'completed': partCompleted > 2, 'next': partCompleted > 1 }">
        <span>{{ $t('behaviours.title') }}</span>
        <div class="survey-complete-page-circle">
          <div></div>
        </div>
        <!-- <input id="behaviours_completed" type="radio" name="behaviours_completed" :checked="partCompleted > 2"> -->
      </div>

    </div>
    <div class="survey-complete-page-action">
      <span>{{ $t('ready_to_start_dp_survey_part', { nextPartNumber: partCompleted + 1 }) }}</span>
      <button class="btn btn-success" type="button" @click="nextDpPart()">{{ $t('continue') }}</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import SurveyService from '@/services/SurveyService'
import SurveyHelper from '@/utils/SurveyHelper'
import SurveyLocalStorageHelper from '@/utils/SurveyLocalStorageHelper'
import { SurveyInfo } from '@/interfaces/SurveyInterfaces'

@Component({ name: 'DpChildSurveyCompletedPage' })
export default class DpChildSurveyCompletedPage extends Vue {
  @Prop({})
  surveyProduct!: string
  @Prop({})
  surveyUserId!: string

  @Getter('survey/isTakenSurveyInitiated')
  isTakenSurveyInitiated!: boolean

  @Getter('survey/isDpTakenSurvey')
  isDpTakenSurvey!: boolean
  @Getter('survey/getDpSurveyUserId')
  dpSurveyUserId!: number

  @Getter('survey/getDisplayedBaseSurveyInfo')
  surveyInfo!: SurveyInfo

  partCompleted = 0

  async created (): Promise<void> {
    if (!this.isTakenSurveyInitiated &&
      SurveyLocalStorageHelper.hasSurveyUser(this.surveyProduct, parseInt(this.surveyUserId)) &&
      !await SurveyHelper.uploadDpSurveyDataByChild(
        SurveyLocalStorageHelper.getSurveyUser(this.surveyProduct, parseInt(this.surveyUserId))
      )
    ) {
      SurveyLocalStorageHelper.removeSurveyUser(this.surveyProduct, parseInt(this.surveyUserId))
    }

    if (!this.isDpTakenSurvey) {
      this.$router.push({ name: 'notFound' })
      return
    }

    this.partCompleted = this.surveyProduct === 'eq' ? 1
      : this.surveyProduct === 'values' ? 2
        : this.surveyProduct === 'behaviours' ? 3
          : 0
  }

  async nextDpPart (): Promise<void> {
    const progress = await SurveyService.getDpSurveyProgress(this.dpSurveyUserId)

    if (progress.isCompleted || !progress.nextSurveyPart) {
      SurveyHelper.completeSurvey(
        'discovery-process',
        await this.$store.getters['survey/getDpSurveyId'],
        this.dpSurveyUserId
      )

      this.$store.commit('survey/clearDpSurveyData')
      this.$router.push({ name: 'survey.complete', params: { title: this.surveyInfo.title } })
      return
    }

    const nextSurveyProductInfo = await SurveyService.getSurveyInfoById(
      progress.nextSurveyPart.product,
      progress.nextSurveyPart.id
    )

    SurveyHelper.checkSurveyInfo(nextSurveyProductInfo)

    await this.$store.commit('survey/setTakenSurveyData', {
      productSurveyId: progress.nextSurveyPart.id,
      productSurveyType: progress.nextSurveyPart.product,
      surveyInfo: nextSurveyProductInfo
    })

    await this.$store.commit('survey/setTakenSurveyUserId', {
      productSurveyType: progress.nextSurveyPart.product,
      surveyUserId: progress.nextSurveyPart.surveyUserId
    })

    SurveyLocalStorageHelper.addDpChildSurveyUser(
      this.dpSurveyUserId,
      progress.nextSurveyPart.product,
      progress.nextSurveyPart.surveyUserId
    )

    this.$router.push({
      name: 'survey.welcome.dp.survey_product',
      params: {
        surveyProduct: progress.nextSurveyPart.product,
        surveyUserId: progress.nextSurveyPart.surveyUserId.toString()
      }
    })
  }
}
</script>

<style lang="scss">
  .survey-completed-page {
    max-width: 1280px;
    margin: 0 auto;
    padding: 40px 5.5%;
  }

  .survey-complete-page-action {
    padding: 40px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 24px 32px 0 rgba(0, 0, 0, 0.1);
    border: solid 1px #bdddff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 18px;
      color: #071012;
    }
  }

  .survey-complete-page-progress {
    margin-bottom: 48px;
    display: flex;
    justify-content: space-between;
    color: #fff;
  }

  .survey-complete-page-progress-item {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 33.333333333%;
    position: relative;
    overflow: hidden;
    &:after {
      content: '';
      position: absolute;
      height: 1px;
      background: rgba(255,255,255, 0.3);
      width: 100%;
      left: calc(50% + 30px);
      bottom: 12px;
    }
    &:before {
      content: '';
      position: absolute;
      height: 1px;
      background: rgba(255,255,255, 0.3);
      width: 100%;
      right: calc(50% + 30px);
      bottom: 12px;
    }
    &:first-child {
      &:before {
        display: none;
      }
    }
    &:last-child {
      &:after {
        display: none;
      }
    }

    &.next {
      &:before {
        background: #fff;
      }
      .survey-complete-page-circle > div {
        background: linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(0, 0, 0, 0.5)), linear-gradient(to bottom, #0085cd, #0085cd);
      }
    }

    &.completed {
      &:after, &:before {
        background: #00cdbf;
      }
      .survey-complete-page-circle > div {
        background: linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(0, 0, 0, 0.5)), linear-gradient(to bottom, #00cdbf, #00cdbf);
      }
    }
    span {
      display: block;
      width: 100%;
      margin-bottom: 8px;
      font-size: 18px;
      font-weight: normal;
      color: #ffffff;
    }
    text-align: center;
  }

  .survey-complete-page-circle {
    width: 24px;
    height: 24px;
    box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.05);
    border: solid 1px #e6f3fa;
    background-color: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    >div {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background-color: #bdddff;
    }
  }
</style>
