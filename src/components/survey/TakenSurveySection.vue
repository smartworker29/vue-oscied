<template>
  <div class="container">
    <section v-if="statements">
      <DragAndDropSortingStatement v-if="isWideScreen" :options="sortingOptions" :surveyProduct="surveyProduct" @updateOrder="completeSection"/>
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

@Component({
  components: {
    DragAndDropSortingStatement,
    TapSortingStatement
  }
})
export default class TakenSurveySection extends Vue {
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
