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
  surveyProduct!: string

  statements: Statement[] | null = null
  sortingOptions: StatementSortingOptions = {
    list: [],
    displayOption: 'statement'
  }

  async created () {
    const section: Section = this.$store.getters['survey/getCurrentProductSurveySection']
    this.statements = await SurveyService.getSectionStatements(this.surveyProduct, section.id)

    this.sortingOptions.list = this.statements
  }

  get isWideScreen () : boolean {
    return window.innerWidth > 768
  }

  completeSection (data: Statement[]) {
    this.$emit('completeSection', data)
  }
}
</script>
