<template>
  <div>{{ $t('progress') }}
    <div class="progress">
      <div class="progress-bar progress-bar-striped progress-bar-animated"
           role="progressbar"
           :style="`width: ${processedPercent}%;`"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

@Component({})
export default class SurveyProgress extends Vue {
  @Getter('survey/totalSurveySection')
  totalProgressItemsCount?: number

  @Getter('survey/countCompletedSurveySection')
  processedItemsCount?: number

  get processedPercent () : number {
    return (this.processedItemsCount && this.totalProgressItemsCount)
      ? this.processedItemsCount / this.totalProgressItemsCount * 100
      : 0
  }
}
</script>
