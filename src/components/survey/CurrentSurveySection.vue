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
import { EqStatement, Section, BaseStatement } from '@/interfaces/SurveyInterfaces'
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

  statements: BaseStatement[] | null = null
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

    if (this.surveyProduct === 'eq') {
      this.statements = await this.getEqStatements(sectionNumber)
    } else {
      const section: Section = this.$store.getters['survey/getCurrentProductSurveySection']

      this.statements = await SurveyService.getSectionStatements(this.surveyProduct, section.id)
    }

    this.sortingOptions.list = this.statements
  }

  async getEqStatements (sectionNumber: number) : Promise<EqStatement[]> {
    const view = (sectionNumber === 1) ? 'world' : 'self'
    const statements: EqStatement[] = await SurveyService.getEqSectionStatements(view)

    return statements
  }

  async validateSectionNumber (sectionNumber: number) : Promise<boolean> {
    const sectionCount = this.$store.getters['survey/getCurrentProductSurveySectionCount']
    if (sectionNumber < 1 || sectionNumber > sectionCount) {
      return false
    }

    return true
  }

  get isWideScreen () : boolean {
    return window.innerWidth > 768
  }

  completeSection (data: BaseStatement[]) {
    this.$emit('completeSection', data)
  }
}
</script>
