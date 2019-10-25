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
import { Statement, Section, SurveyInfo } from '@/interfaces/SurveyInterfaces'
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
  surveyUserId!: number

  loadSections: boolean = false
  countSection: number = 0
  sectionKey: number = 0

  async created () {
    const nextSectionId = await this.getNextSection()
    if (nextSectionId && nextSectionId > 1) {
      this.$store.commit('survey/setCurrentSurveyProgress', nextSectionId - 1)
    }
    if (!nextSectionId) {
      this.handleNullableNextSection()
      return
    }

    await this.uploadSurveySections()
    await this.handleSurveyProgress(nextSectionId)
    this.loadSections = true
  }

  async uploadSurveySections () : Promise<void> {
    let sections: Section[] = await SurveyService.getSurveySections(
      this.currentProductSurveyType,
      this.currentProductSurveyId
    )

    this.$store.commit('survey/setCurrentSurveySections', sections)
    this.countSection = sections.length
  }

  async handleSurveyProgress (nextSectionId: number | null = null) : Promise<void> {
    if (!nextSectionId) {
      nextSectionId = await this.getNextSection()
    }

    if (nextSectionId === null) {
      this.handleNullableNextSection()
      return
    }

    this.$store.commit('survey/setNextSurveySectionId', nextSectionId)
    const nextSectionNumber: number | null = this.$store.getters['survey/getNextSurveySectionNumber']

    if (!nextSectionNumber) {
      this.handleNullableNextSection()
      return
    }

    if (this.$route.params['sectionNumber'] !== nextSectionNumber.toString()) {
      this.pushToAnotherSection(nextSectionNumber)
    }
  }

  async getNextSection () : Promise<number | null> {
    const nextSectionId = await SurveyService.getSurveyProgress(
      this.surveyProduct,
      this.surveyUserId
    )

    return nextSectionId
  }

  handleNullableNextSection () : void {
    // TODO::add logic if the `nextSection` is equal to null (it means that the survey doesn't have the uncompleted sections)
    this.$router.push({ name: 'notFound' })
  }

  pushToAnotherSection (sectionNumber: number) : void {
    this.sectionKey++
    this.$router.push({
      name: 'survey.page.part',
      params: {
        surveyProduct: this.surveyProduct,
        surveyProductId: this.surveyUserId.toString(),
        sectionNumber: sectionNumber.toString()
      }
    })
  }

  async handleCompleteSection (statements: Statement[]) {
    const nextSectionId = await SurveyService.saveStatements(
      this.surveyProduct,
      this.surveyUserId,
      statements
    )
    this.$store.commit('survey/addOneCompletedSection')

    if (!nextSectionId) {
      this.handleCompleteSurvey()
      return
    }

    this.$store.commit('survey/setNextSurveySectionId', nextSectionId)
    const nextSectionNumber: number | null = this.$store.getters['survey/getNextSurveySectionNumber']

    if (!nextSectionNumber) {
      this.handleNullableNextSection()
      return
    }

    this.pushToAnotherSection(nextSectionNumber)
  }

  handleCompleteSurvey () {
    SurveyHelper.completeSurvey(this.surveyProduct, this.currentProductSurveyId, this.surveyUserId)
    this.$router.push({ name: 'survey.complete' })
  }
}
</script>
