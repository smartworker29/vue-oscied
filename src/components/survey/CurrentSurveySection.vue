<template>
  <div class="container">
    <section v-if="statements">
      <DragAndDropSortingStatement v-if="isWideScreen" :options="sortingOptions" @updateOrder="completeSection"/>
      <TapSortingStatement v-else :options="sortingOptions" @updateOrder="completeSection"/>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import SurveyService from '@/services/SurveyService'
import { Section, Statement } from '@/interfaces/SurveyInterfaces'
import { StatementSortingOptions } from '@/interfaces/SortingInterfaces'
import DragAndDropSortingStatement from '@/components/common/sorting/DragAndDropSortingStatement.vue'
import TapSortingStatement from '@/components/common/sorting/TapSortingStatement.vue'
import SurveyHelper from '@/utils/SurveyHelper'

@Component({
  components: {
    DragAndDropSortingStatement,
    TapSortingStatement
  }
})
export default class CurrentSurveySection extends Vue {
  @Prop({})
  sectionNumber!: number
  @Prop({})
  surveyProduct!: string
  @Prop({})
  surveyProductId!: number

  isWideScreen: boolean = window.innerWidth > 768;
  statements: Statement[] | null = null
  sortingOptions: StatementSortingOptions = {
    list: [],
    displayOption: 'statement'
  }

  async created () {
    const sectionNumber: number = parseInt(this.sectionNumber.toString())

    if (!this.validateSectionNumber(sectionNumber)) {
      throw new Error('Section number in unavailable')
    }

    if (SurveyHelper.hasCompletedSectioninUncompletedSurvey(this.surveyProduct, this.surveyProductId, sectionNumber)) {
      const availableSectionNumber: number | boolean = SurveyHelper.getNextNumberSectionUncompletedSurvey(
        this.surveyProduct,
        this.surveyProductId,
        this.$store.getters['survey/getCurrentProductSurveySectionCount']
      )
      if (availableSectionNumber === false) {
        this.$emit('completeSurvey')
      } else {
        this.$emit('pushToAnotherSection', availableSectionNumber)
      }
      return
    }

    this.$store.commit('survey/setCurrentProductSurveySectionNumber', sectionNumber)
    const section: Section = this.$store.getters['survey/getCurrentProductSurveySection']
    this.statements = await SurveyService.getSectionStatements(this.surveyProduct, section.id)

    this.sortingOptions.list = this.statements

    window.addEventListener('resize', () => {
      this.isWideScreen = window.innerWidth > 1024
    })
  }

  async validateSectionNumber (sectionNumber: number) : Promise<boolean> {
    const sectionCount = this.$store.getters['survey/getCurrentProductSurveySectionCount']

    return sectionNumber > 0 && sectionNumber <= sectionCount
  }

  completeSection (data: Statement[]) {
    this.$emit('completeSection', data)
  }
}
</script>
