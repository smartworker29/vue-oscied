<template>
  <div class="survey">
    <div class="survey-header">
      <h1 class="survey-title">
        <span>
          {{ currentSectionData && currentSectionData.title
          ? currentSectionData.title : $t('world_view') }}
        </span>
         <SurveyProgress/>
      </h1>
      <p>
        {{ currentSectionData && currentSectionData.instructions
        ? currentSectionData.instructions : $t('sorting_g.description') }}
         <span class="survey-more">{{ $t('more')}} ></span>
      </p>
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
    await this.getSurveyProgress()
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
    // TODO::add logic if the survey is completed (currentSurveyUserInfo.isCompleted)
    // TODO::add logic if the data is not got
  }

  async getSurveyProgress () : Promise<void> {
    const nextSectionId: number | null = await SurveyService.getSurveyProgress(
      this.surveyProduct,
      this.currentSurveyUserInfo.surveyUserId
    )

    if (nextSectionId === null) {
      // TODO::add logic if the `nextSectionId` is equal to null (it means that the survey doesn't have the uncompleted sections)
      return
    }

    this.$store.commit('survey/setNextSurveySectionId', nextSectionId)
    const nextSectionNumber: number | null = this.$store.getters['survey/getNextProductSurveySectionNumber']

    if (nextSectionNumber !== null && this.$route.params['sectionNumber'] !== nextSectionNumber.toString()) {
      this.pushToAnotherSection(nextSectionNumber)
    } else {
      // TODO::add logic if the `nextSection` is equal to null (it means that the survey doesn't have the uncompleted sections)
    }
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

  async handleCompleteSection (statements: Statement[]) {
    await this.handleSortedSection(statements)

    const nextSectionNumber: number | null = this.$store.getters['survey/getNextProductSurveySectionNumber']
    if (nextSectionNumber !== null) {
      this.pushToAnotherSection(nextSectionNumber)
    } else {
      // TODO::add logic if the `nextSection` is equal to null (it means that the survey doesn't have the uncompleted sections)
    }
  }

  async handleSortedSection (statements: Statement[]) {
    const section: Section = this.$store.getters['survey/getCurrentProductSurveySection']

    // TODO::change logic to handle uncompleted survey
    this.$store.commit('survey/addOneCompletedSection', { sectionNumber: 1, statements, section })
    // SurveyHelper.addSectionToUncompletedSurvey(this.surveyProduct, this.surveyProductId, completeSectionData)

    try {
      const nextSectionId: number | number = await SurveyService.saveStatements(
        this.surveyProduct,
        this.currentSurveyUserInfo.surveyUserId,
        statements
      )

      if (nextSectionId !== null) {
        this.$store.commit('survey/setNextSurveySectionId', nextSectionId)
      } else {
        // TODO::add logic if the `nextSectionId` is equal to null (it means that the survey doesn't have the uncompleted sections)
      }
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
