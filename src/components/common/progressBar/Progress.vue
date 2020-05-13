<template>
  <div class="progress-wrapper">
    <span class="progress-title">{{ $t('progress') }}</span>
    <div class="progress">
      <div class="progress-bar progress-bar-striped progress-bar-animated"
           v-if="processedPercent"
           role="progressbar"
           :style="`width: ${processedPercent}%;`"></div>
      <span class="progress-percentage" v-if="percentage">{{ formattedProcessedItemsCount }}%</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

@Component({ name: 'Progress' })
export default class Progress extends Vue {
  @Getter('survey/getCurrentProductSurveySectionCount')
  totalSurveyProgressItemsCount?: number

  @Getter('survey/getCountCompletedSurveySection')
  processedSurveyItemsCount?: number

  @Prop({})
  totalPropsProgressItemsCount?: number

  @Prop({})
  processedPropsItemsCount?: number

  @Prop({ default: false })
  percentage?: boolean

  get totalProgressItemsCount () : number {
    if (this.totalPropsProgressItemsCount) {
      return this.totalPropsProgressItemsCount
    }

    if (this.totalSurveyProgressItemsCount) {
      return this.totalSurveyProgressItemsCount
    }

    return 0
  }

  get processedItemsCount () : number {
    if (this.processedPropsItemsCount) {
      return this.processedPropsItemsCount
    }

    if (this.processedSurveyItemsCount) {
      return this.processedSurveyItemsCount
    }

    return 0
  }

  get processedPercent () : number {
    return (this.processedItemsCount && this.totalProgressItemsCount)
      ? this.processedItemsCount / this.totalProgressItemsCount * 100
      : 0
  }

  get formattedProcessedItemsCount () : string|0 {
    return this.percentage && this.processedPercent ? this.processedPercent.toFixed(2) : 0
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
    position: relative;
  }

  .progress-bar {
    height: 15px;
    border-radius: 8px;
    border: solid 1px #bdddff;
    background: linear-gradient(to bottom, rgba(214,239,255,0.52) 0%, rgba(214,239,255,1) 100%);
  }

  .progress-percentage {
    position: absolute;
    top: -2px;
    right: 0;
    font-size: 14px;
  }
</style>