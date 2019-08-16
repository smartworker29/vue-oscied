<template>
  <div>
    <div class="row">
      <div class="col-md-8">
        <h1>{{ $t('world_view') }}</h1>
        <p>{{ $t('sorting_g.description') }} <button>{{ $t('more')}} ></button></p>
      </div>
      <div class="col-md-4">
        <SurveyProgress/>
      </div>
    </div>
    <div v-if="!displayCompleteMessage">
      <DragAndDropSortingStatement v-if="isWideScreen" :options="sortingOptions" @updateOrder="updateOrder"/>
      <TapSortingStatement v-else :options="sortingOptions" @updateOrder="updateOrder"/>
    </div>
    <p v-else>You complete survey</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import DragAndDropSortingStatement from '@/components/common/sorting/DragAndDropSortingStatement.vue'
import TapSortingStatement from '@/components/common/sorting/TapSortingStatement.vue'
import SurveyProgress from '@/components/common/progressBar/SurveyProgress.vue'
import { StatementSortingOptions } from '@/interfaces/SortingInterfaces'
import { Section, Statement, Survey } from '@/interfaces/SurveyInterfaces'
import store from '@/store'

@Component({
  components: { DragAndDropSortingStatement, TapSortingStatement, SurveyProgress }
})
export default class SurveyPage extends Vue {
  @Getter('survey/currentSurvey')
  currentSurvey!: Survey

  currentSection: number = -1

  sortingOptions: StatementSortingOptions = {
    list: [],
    displayOption: 'title'
  }

  updatedOrderList: Section[] = []

  displayCompleteMessage: boolean = false

  created () {
    if (!this.currentSurvey || this.currentSurvey.sections.length === 0) {
      alert('Survey is empty')
    }

    this.currentSection = 0
    this.sortingOptions.list = this.currentSurvey.sections[this.currentSection]['statements']
  }

  get isWideScreen () : boolean {
    return window.innerWidth > 768
  }

  updateOrder (updatedOrderList: Statement[]) {
    if (!this.currentSurvey.sections[this.currentSection]) {
      return
    }

    this.updatedOrderList[this.currentSection] = this.currentSurvey.sections[this.currentSection]
    this.updatedOrderList[this.currentSection]['statements'] = updatedOrderList
    this.currentSection++
    if (this.currentSurvey.sections[this.currentSection] && this.currentSurvey.sections[this.currentSection]['statements']) {
      this.sortingOptions.list = this.currentSurvey.sections[this.currentSection]['statements']
    } else {
      console.log(this.updatedOrderList) // todo::handle result
      this.displayCompleteMessage = true
      alert('You complete survey')
    }
    store.commit('survey/addOneCompletedSection')
  }
}
</script>
