<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <current-survey v-if="displaySurvey"
                        :surveyProduct="surveyProduct"
                        :surveyProductId="surveyProductId"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import CurrentSurvey from '@/components/survey/CurrentSurvey.vue'
import SurveyHelper from '@/utils/SurveyHelper'
import { CurrentSurveyData } from '@/interfaces/LocalStorageInterfaces'
import SurveyService from '@/services/SurveyService'
import { ResponseProductSurveyInfo } from '@/interfaces/SurveyInterfaces'

@Component({
  components: {
    CurrentSurvey
  }
})
export default class CurrentSurveyPage extends Vue {
  @Prop({})
  surveyProduct!: string
  @Prop({})
  surveyProductId!: number

  displaySurvey: boolean = false

  async created () {
    const currentSurveyData: CurrentSurveyData | null = SurveyHelper.getCurrentSurveyData()
    if (currentSurveyData !== null && !await this.$store.getters['survey/isCurrentSurveyInitiated']) {
      await this.uploadSurveyInfo(currentSurveyData.surveyAccessCode)
    }

    this.displaySurvey = true
  }

  async uploadSurveyInfo (accessCode: string) : Promise<void> {
    try {
      const response: ResponseProductSurveyInfo = await SurveyService.getProductSurveyInfo(
        this.surveyProduct,
        accessCode
      )

      await this.$store.commit('survey/setCurrentSurveyData', {
        productSurveyId: response.surveyProductId,
        productSurveyType: this.surveyProduct,
        surveyInfo: response.survey
      })
    } catch (error) {
      console.log(error)// TODO::add handler to process for errors(go to 404)
    }
  }
}
</script>
