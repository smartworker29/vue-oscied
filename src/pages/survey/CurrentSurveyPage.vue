<template>
  <current-survey v-if="displaySurvey"
    :surveyProduct="surveyProduct"
    :surveyUserId="surveyUserId"/>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import CurrentSurvey from '@/components/survey/CurrentSurvey.vue'
import SurveyLocalStorageHelper from '@/utils/SurveyLocalStorageHelper'
import SurveyHelper from '@/utils/SurveyHelper'
import SurveyService from '@/services/SurveyService'

@Component({
  components: {
    CurrentSurvey
  }
})
export default class CurrentSurveyPage extends Vue {
  @Prop({})
  surveyProduct!: string
  @Prop({})
  surveyUserId!: number

  displaySurvey: boolean = false

  async created () {
    if (!SurveyLocalStorageHelper.hasSurveyUser(this.surveyProduct, this.surveyUserId)) {
      // todo[m]:: Add handler to process for errors(go to 404)
      this.$router.push({ name: 'notFound' })

      return
    }

    if (!await this.$store.getters['survey/isCurrentSurveyInitiated']) {
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
    if (!surveyUser) {
      throw new Error()
    }

    const response = await SurveyService.getProductSurveyInfo(
      this.surveyProduct,
      surveyUser.surveyAccessCode
    )
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

    this.$store.commit('survey/setCurrentSurveyData', {
      productSurveyId: response.surveyProductId,
      productSurveyType: this.surveyProduct,
      surveyInfo: response,
      surveyUserInfo: surveyUserInfo
    })
  }
}
</script>
