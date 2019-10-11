<template>
  <div class="survey">
    <div class="survey-header">
        <h1 class="survey-title">
          <span>{{ currentSectionData.title ? currentSectionData.title : $t('world_view') }}</span>
          <SurveyProgress class="survey-progress"/>
        </h1>
        <p>{{ currentSectionData.instructions ? currentSectionData.instructions : $t('sorting_g.description') }} <span class="survey-more">{{ $t('more')}} ></span></p>

    </div>
    <div class="survey-content">
    <router-view v-if="loadSections"
        @completeSection="handleCompleteSection"
        @pushToAnotherSection="pushToAnotherSection"
        :key="sectionKey"/>
     </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { Statement, CompleteSectionData, Section, SurveyInfo, SurveyUserInfo } from '@/interfaces/SurveyInterfaces'
import CurrentSurvey from '@/components/survey/CurrentSurvey.vue'
import SurveyProgress from '@/components/common/progressBar/SurveyProgress.vue'
import SurveyService from '@/services/SurveyService'
import SurveyHelper from '@/utils/SurveyHelper'

@Component({
  components: {
    CurrentSurvey,
    SurveyProgress
  }
})
export default class CurrentSurveyPage extends Vue {
  @Getter('survey/getCurrentSurveyInfo')
  currentSurveyInfo!: SurveyInfo
  @Getter('survey/getCurrentProductSurveyId')
  currentProductSurveyId!: number
  @Getter('survey/getCurrentProductSurveyType')
  currentProductSurveyType!: string
  @Getter('survey/getCurrentProductSurveySection')
  currentSectionData!: Section

  @Prop({})
  surveyProduct!: string
  @Prop({})
  surveyProductId!: number

  loadSections: boolean = false
  countSection: number = 0
  sectionKey: number = 0
  currentSurveyUserInfo!: SurveyUserInfo

  async created () {
    if (this.surveyProduct !== this.currentProductSurveyType ||
      this.surveyProductId.toString() !== this.currentProductSurveyId.toString()) {
      this.loadSections = false
      throw new Error('Unavailable data of the requested survey')// TODO::add handler to process the no correct current survey data
    }

    await this.uploadSurveySections()
    await this.uploadSurveyUserInfo()
    this.loadSections = true
  }

  async uploadSurveySections () : Promise<void> {
    let sections: Section[] = await SurveyService.getSurveySections(
      this.currentProductSurveyType,
      this.surveyProductId
    )

    this.$store.commit('survey/setCurrentSurveySections', sections)
    this.countSection = sections.length
  }

  async uploadSurveyUserInfo () : Promise<void> {
    this.currentSurveyUserInfo = await SurveyService.getSurveyUserInfo(this.surveyProduct, this.surveyProductId)
  }

  pushToAnotherSection (sectionNumber: number) : void {
    this.sectionKey++
    this.$router.push({
      name: 'survey.page.part',
      params: {
        surveyProduct: this.surveyProduct,
        surveyProductId: this.surveyProductId.toString(),
        sectionNumber: sectionNumber.toString()
      }
    })
  }

  handleCompleteSection (statements: Statement[]) {
    const currentSectionNumber: number = this.$store.getters['survey/getCurrentProductSurveySectionNumber']
    this.handleSortedSection(statements, currentSectionNumber)

    if (currentSectionNumber >= this.countSection) {
      this.handleCompleteSurvey()
      return
    }

    this.pushToAnotherSection(currentSectionNumber + 1)
  }

  handleSortedSection (statements: Statement[], currentSectionNumber: number) {
    const section: Section = this.$store.getters['survey/getCurrentProductSurveySection']
    const completeSectionData: CompleteSectionData = { sectionNumber: currentSectionNumber, statements, section }

    this.$store.commit('survey/addOneCompletedSection', completeSectionData)
    SurveyHelper.addSectionToUncompletedSurvey(this.surveyProduct, this.surveyProductId, completeSectionData)

    try {
      const nextSection: number = SurveyService.saveStatements(
        this.surveyProduct,
        this.currentSurveyUserInfo.surveyUserId,
        statements
      )

      console.log(nextSection)
    } catch (error) {
      // TODO::add functionality
    }
  }

  handleCompleteSurvey () {
    // TODO::add functionality to processing survey data(upload the data from localStorage if passing uncompleted survey)
    // TODO::check if all section are completed
    this.$store.commit('survey/clearCurrentSurveyData')
    SurveyHelper.removeCurrentSurveyData()

    this.$router.push({ name: 'survey.complete' })
  }
}
</script>
