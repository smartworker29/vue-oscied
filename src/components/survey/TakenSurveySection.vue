<template>
  <div class="container">
    <div class="survey-section-wrapper">
      <div class="survey-description">
        <p v-html="currentSectionData && currentSectionData.instructions
          ? currentSectionData.instructions : $t('sorting_g.description')">
        </p>
      </div>
      <section class="survey-actions" v-if="statements">
        <DragAndDropSortingStatement v-if="isWideScreen" :options="sortingOptions" :surveyProduct="surveyProduct" @updateOrder="completeSection"/>
        <TapSortingStatement v-else :options="sortingOptions" @updateOrder="completeSection"/>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import SurveyService from '@/services/SurveyService'
import { Section, Statement } from '@/interfaces/SurveyInterfaces'
import { StatementSortingOptions } from '@/interfaces/SortingInterfaces'
import DragAndDropSortingStatement from '@/components/common/sorting/DragAndDropSortingStatement.vue'
import TapSortingStatement from '@/components/common/sorting/TapSortingStatement.vue'

@Component({
  name: 'TakenSurveySection',
  components: {
    DragAndDropSortingStatement,
    TapSortingStatement
  }
})
export default class TakenSurveySection extends Vue {
  @Getter('survey/getNextTakenSurveySection')
  currentSectionData!: Section

  @Prop({})
  surveyProduct!: string

  isWideScreen: boolean = window.innerWidth > 1024;
  statements: Statement[] | null = null
  sortingOptions: StatementSortingOptions = {
    list: [],
    displayOption: 'statement'
  }

  async created () {
    const section: Section | null = this.$store.getters['survey/getNextTakenSurveySection']
    if (!section) {
      throw new Error()
      // todo::[m] if section is null
    }
    this.statements = await SurveyService.getSectionStatements(this.surveyProduct, section.id)
    // todo::[m] if statements don't return

    this.sortingOptions.list = this.statements

    window.addEventListener('resize', () => {
      this.isWideScreen = window.innerWidth > 1024
    })
  }

  completeSection (data: Statement[]) {
    this.$emit('completeSection', data)
  }
}
</script>

<style lang="scss">
  .survey-section-wrapper {
    display: flex;
    justify-content: space-between;
    @media only screen and (max-width: 768px) {
      flex-wrap: wrap;
    }
    .survey-actions,
    .survey-description {
      width: 48%;
      @media only screen and (max-width: 768px) {
        width: 100%;
      }
    }
  }
</style>
