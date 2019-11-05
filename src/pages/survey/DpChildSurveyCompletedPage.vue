<template>
  <div>
    <div>
      <input id="eq_completed" type="radio" name="eq_completed" :checked="partCompleted > 0">
      <label for="eq_completed">{{ $t('eq_title') }}</label>

      <input id="values_completed" type="radio" name="values_completed" :checked="partCompleted > 1">
      <label for="values_completed">{{ $t('values_title') }}</label>

      <input id="behaviours_completed" type="radio" name="behaviours_completed" :checked="partCompleted > 2">
      <label for="behaviours_completed">{{ $t('behaviours_title') }}</label>
    </div>
    <div>
      {{ $t('ready_to_start_dp_survey_part', { nextPartNumber: partCompleted + 1 }) }}
      <button type="button" @click="nextDpPart()">{{ $t('continue') }}</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import SurveyService from '@/services/SurveyService'
import SurveyHelper from '@/utils/SurveyHelper'
import SurveyLocalStorageHelper from '@/utils/SurveyLocalStorageHelper'

@Component({})
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
      this.$router.push({ name: 'survey.complete' })
      return
    }

    const nextSurveyProductInfo = await SurveyService.getSurveyInfoById(
      progress.nextSurveyPart.product,
      progress.nextSurveyPart.id
    )

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
