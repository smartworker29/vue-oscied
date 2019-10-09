<template>
  <div class="progress-wrapper">
    <span class="progress-title">{{ $t('progress') }}</span>
    <div class="progress">
      <div class="progress-bar progress-bar-striped progress-bar-animated"
           v-if="processedPercent"
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
  @Getter('survey/getCurrentProductSurveySectionCount')
  totalProgressItemsCount?: number

  @Getter('survey/getCountCompletedSurveySection')
  processedItemsCount?: number

  get processedPercent () : number {
    return (this.processedItemsCount && this.totalProgressItemsCount)
      ? this.processedItemsCount / this.totalProgressItemsCount * 100
      : 0
  }
}
</script>

<style lang="scss">
  .progress {
    width: 240px;
    height: 16px;
    border-radius: 8px;
    border: solid 1px #d6efff;
    background-color: #ffffff;
  }

  .progress-bar {
    height: 16px;
    border-radius: 8px;
    border: solid 1px #bdddff;
    background: linear-gradient(to bottom, rgba(214,239,255,0.52) 0%, rgba(214,239,255,1) 100%);
  }
</style>
