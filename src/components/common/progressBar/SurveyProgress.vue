<template>
  <div class="progress">
    <div class="progress-bar progress-bar-striped progress-bar-animated"
         role="progressbar"
         :style="`width: ${processedPercent}%;`"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class SurveyProgress extends Vue {// todo::call attributes from store
  totalProgressItemsCount: number = 10
  processedItemsCount: number = 5

  get processedPercent () : number {
    return this.processedItemsCount / this.totalProgressItemsCount * 100
  }
}
</script>
