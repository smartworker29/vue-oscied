<template>
  <div class="progress-wrapper">
    <span v-if="showTitle" class="progress-title">{{ $t('progress') }}</span>
    <div :class="{'progress-flex': !showPercentInside }">
      <div class="progress">
        <div class="progress-bar progress-bar-striped progress-bar-animated"
             v-if="processedPercent"
             role="progressbar"
             :style="`width: ${processedPercent}%;`"/>
      </div>
      <span v-if="!(showPercentInside && percentage)" class="progress-percentage">{{ processedPercent }}%</span>
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

  @Prop({ default: true })
  showTitle?: boolean

  @Prop({ default: true })
  showPercentInside?: boolean

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
      ? Math.ceil(this.processedItemsCount / this.totalProgressItemsCount * 100)
      : 0
  }

  get formattedProcessedItemsCount () : string|0 {
    return this.percentage && this.processedPercent ? this.processedPercent.toFixed(0) : 0
  }
}
</script>

<style lang="scss">
  .progress {
    width: 240px;
    background-color: #e6f3fa;
    border-color: transparent;
    height: 9px;
    border-radius: 8px;
    position: relative;
    margin-top: 6px;
  }

  .progress-bar {
    height: 9px;
    border-radius: 5px;
    background: #00cdbf;
    border: none;
    margin-top: -1px;
    margin-left: -1px;
  }

  .progress-percentage {
    font-size: 14px;
  }
  .progress {
    .progress-percentage {
      position: absolute;
      top: -2px;
      right: 0;
    }
  }

  .progress-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
