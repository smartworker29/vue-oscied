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
    <div>
      <TapSortingStatement :options="options" @updateOrder="updateOrder"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TapSortingStatement from '@/components/common/sorting/TapSortingStatement.vue'
import SurveyProgress from '@/components/common/progressBar/SurveyProgress.vue'
import { StatementSortingOptions } from '@/interfaces/SortingInterfaces'

@Component({
  components: { TapSortingStatement, SurveyProgress }
})
export default class TestTapSortingPage extends Vue {
  options: StatementSortingOptions = {
    list: (new Array(20)).fill(0).map((item: any, index: number) : object => {
      index++
      return { id: index, title: `Phrase ${index}` }
    }),
    displayOption: 'title'
  }
  updatedOrderList: object[] = []

  updateOrder (updatedOrderList: object[]) {
    this.updatedOrderList = updatedOrderList
    console.log(this.updatedOrderList)// todo::do something with the ordered list
  }
}
</script>
