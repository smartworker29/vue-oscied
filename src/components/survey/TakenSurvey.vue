<template>
  <div class="survey">
    <div class="survey-header">
      <h1 class="survey-title">
        <span>
          {{ currentSectionData && currentSectionData.title
          ? currentSectionData.title : $t('world_view') }}
        </span>
         <Progress/>
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
import { Statement, Section } from '@/interfaces/SurveyInterfaces'
import SurveyService from '@/services/SurveyService'
import SurveyHelper from '@/utils/SurveyHelper'
import SurveyLocalStorageHelper from '@/utils/SurveyLocalStorageHelper'
import Progress from '@/components/common/progressBar/Progress.vue'

@Component({
  name: 'TakenSurvey',
  components: {
    Progress
  }
})
export default class TakenSurvey extends Vue {
  @Getter('survey/getTakenSurveyId')
  currentProductSurveyId!: number
  @Getter('survey/getTakenSurveyType')
  currentProductSurveyType!: string
  @Getter('survey/getNextTakenSurveySection')
  currentSectionData!: Section

  @Getter('survey/isDpTakenSurvey')
  isDpTakenSurvey!: boolean
  @Getter('survey/getDpSurveyUserId')
  dpSurveyUserId!: number
  @Getter('survey/getDpSurveyProductId')
  dpSurveyProductId!: number

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
      await this.handleNullableNextSection()
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

    this.$store.commit('survey/setTakenSurveySections', sections)
    this.countSection = sections.length
  }

  async handleSurveyProgress (nextSectionId: number | null = null) : Promise<void> {
    if (!nextSectionId) {
      nextSectionId = await this.getNextSection()
    }

    if (nextSectionId === null) {
      await this.handleNullableNextSection()
      return
    }

    this.$store.commit('survey/setNextSurveySectionId', nextSectionId)
    const nextSectionNumber: number | null = this.$store.getters['survey/getNextSurveySectionNumber']

    if (!nextSectionNumber) {
      await this.handleNullableNextSection()
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

  async handleNullableNextSection () : Promise<void> {
    // TODO::add logic if the `nextSection` is equal to null (it means that the survey doesn't have the uncompleted sections)
    if (this.isDpTakenSurvey) {
      await this.handleNullableSectionForDp()
      return
    }
    this.$router.push({ name: 'notFound' })
  }

  async handleNullableSectionForDp () : Promise<void> {
    if (this.surveyProduct === 'behaviours') {
      SurveyLocalStorageHelper.removeSurveyUser(SurveyHelper.DP, this.dpSurveyUserId)
      this.$store.commit('survey/clearDpSurveyData')
      this.$router.push({ name: 'survey.complete' })

      return
    }
    this.$router.push({
      name: 'survey.dp.completed.part',
      params: {
        surveyProduct: this.surveyProduct,
        surveyUserId: this.surveyUserId.toString()
      }
    })
  }

  pushToAnotherSection (sectionNumber: number) : void {
    const routeName = this.isDpTakenSurvey ? 'survey.dp.page.part' : 'survey.page.part'
    this.sectionKey++
    this.$router.push({
      name: routeName,
      params: {
        surveyProduct: this.surveyProduct,
        surveyUserId: this.surveyUserId.toString(),
        sectionNumber: sectionNumber.toString()
      }
    })
  }

  async handleCompleteSection (statements: Statement[]) : Promise<void> {
    const nextSectionId = await SurveyService.saveStatements(
      this.surveyProduct,
      this.surveyUserId,
      statements
    )

    this.$store.commit('survey/addOneCompletedSection')

    if (!nextSectionId) {
      await this.handleCompleteSurvey()
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

  async handleCompleteSurvey () : Promise<void> {
    SurveyHelper.completeSurvey(this.surveyProduct, this.currentProductSurveyId, this.surveyUserId)
    if (this.isDpTakenSurvey) {
      await this.handleNullableSectionForDp()
      return
    }
    this.$router.push({ name: 'survey.complete' })
  }
}
</script>
