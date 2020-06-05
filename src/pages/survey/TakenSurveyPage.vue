<template>
  <taken-survey v-if="displaySurvey"
    :surveyProduct="surveyProduct"
    :surveyUserId="surveyUserId"/>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import TakenSurvey from '@/components/survey/TakenSurvey.vue'
import SurveyLocalStorageHelper from '@/utils/SurveyLocalStorageHelper'
import SurveyHelper from '@/utils/SurveyHelper'
import SurveyService from '@/services/SurveyService'
import { SurveyData } from '@/interfaces/LocalStorageInterfaces'
import { SurveyInfo } from '@/interfaces/SurveyInterfaces'

@Component({
  name: 'TakenSurveyPage',
  components: {
    TakenSurvey
  }
})
export default class TakenSurveyPage extends Vue {
  @Prop({})
  surveyProduct!: string
  @Prop({})
  surveyUserId!: number

  displaySurvey: boolean = false

  @Getter('survey/isTakenSurveyInitiated')
  isTakenSurveyInitiated!: boolean

  @Getter('survey/getDisplayedBaseSurveyInfo')
  surveyInfo!: SurveyInfo

  async created () {
    if (!SurveyLocalStorageHelper.hasSurveyUser(this.surveyProduct, this.surveyUserId)) {
      // todo[m]:: Add handler to process for errors(go to 404)
      this.$router.push({ name: 'notFound' })

      return
    }

    if (!this.isTakenSurveyInitiated) {
      try {
        await this.uploadSurveyInfo()
      } catch (error) {
        // todo[m]:: Add handler to process for errors(go to 404)
        this.$router.push({ name: 'notFound' })

        return
      }
    }

    this.displaySurvey = true
  }

  async uploadSurveyInfo () : Promise<void> {
    const surveyUser = SurveyLocalStorageHelper.getSurveyUser(this.surveyProduct, this.surveyUserId)
    if (surveyUser === null) {
      throw new Error()
    }

    if (surveyUser.dpSurveyId !== null) {
      const dpSurveyUser = SurveyLocalStorageHelper.getSurveyUser('discovery-process', surveyUser.dpSurveyId)
      if (!dpSurveyUser) {
        throw new Error()
      }
      await this.uploadSurveyInfoForDp(surveyUser, dpSurveyUser)
      return
    }

    if (surveyUser.surveyAccessCode === null) {
      throw new Error()
    }

    const response = await SurveyService.getProductSurveyInfo(
      this.surveyProduct,
      surveyUser.surveyAccessCode
    )

    SurveyHelper.checkSurveyInfo(response.survey)

    const surveyUserInfo = await SurveyService.getSurveyUser(
      this.surveyProduct,
      surveyUser.surveyProductId,
      surveyUser.surveyAccessCode
    )

    if (!surveyUserInfo ||
      surveyUserInfo.surveyUserId.toString() !== this.surveyUserId.toString() ||
      !SurveyHelper.isSurveyUserAvailable(surveyUserInfo)) {
      SurveyHelper.completeSurvey(this.surveyProduct, response.surveyProductId, this.surveyUserId)
      throw new Error()
    }

    this.$store.commit('survey/setTakenSurveyData', {
      productSurveyId: response.surveyProductId,
      productSurveyType: this.surveyProduct,
      surveyInfo: response.survey,
      surveyUserInfo: surveyUserInfo
    })
  }

  async uploadSurveyInfoForDp (surveyUser: SurveyData, dpSurveyUser: SurveyData) : Promise<void> {
    if (dpSurveyUser.surveyAccessCode === null) {
      throw new Error()
    }
    const response = await SurveyService.getProductSurveyInfo(
      SurveyHelper.DP,
      dpSurveyUser.surveyAccessCode
    )
    const surveyUserInfo = await SurveyService.getSurveyUser(
      SurveyHelper.DP,
      dpSurveyUser.surveyProductId,
      dpSurveyUser.surveyAccessCode
    )

    if (!surveyUserInfo) {
      throw new Error()
    }

    const progress = await SurveyService.getDpSurveyProgress(dpSurveyUser.surveyUserId)

    if (progress.isCompleted || !progress.nextSurveyPart) {
      this.$router.push({ name: 'survey.complete', params: { title: this.surveyInfo.title } })
      // todo::[m] Add logic for handling completed survey
      // todo::[m] I leave these comments there, because logic of the completed survey is not fully described at moment
      return
    }

    const nextSurveyProductInfo = await SurveyService.getSurveyInfoById(
      progress.nextSurveyPart.product,
      progress.nextSurveyPart.id
    )

    SurveyHelper.checkSurveyInfo(nextSurveyProductInfo)

    this.$store.commit('survey/setTakenSurveyData', {
      productSurveyId: dpSurveyUser.surveyProductId,
      productSurveyType: 'discovery-process',
      surveyInfo: response.survey
    })

    this.$store.commit('survey/setTakenSurveyUserId', {
      productSurveyType: 'discovery-process',
      surveyUserId: dpSurveyUser.surveyUserId
    })

    this.$store.commit('survey/setTakenSurveyData', {
      productSurveyId: progress.nextSurveyPart.id,
      productSurveyType: progress.nextSurveyPart.product,
      surveyInfo: nextSurveyProductInfo
    })

    this.$store.commit('survey/setTakenSurveyUserId', {
      productSurveyType: progress.nextSurveyPart.product,
      surveyUserId: progress.nextSurveyPart.surveyUserId
    })

    if (progress.nextSurveyPart.product !== this.surveyProduct ||
      progress.nextSurveyPart.surveyUserId.toString() !== this.surveyUserId.toString()) {
      this.$router.push({
        name: 'survey.dp.page.part',
        params: {
          surveyProduct: progress.nextSurveyPart.product,
          surveyUserId: progress.nextSurveyPart.surveyUserId.toString(),
          sectionNumber: '1'
        }
      })
    }
  }
}
</script>
