<template>
  <section class="ipulse-actions" v-if="statements">
    <div class="ipulse-slider-header">
      <div class="ipulse-slider-header-item">
        <span v-for="(option, key) in options" :key="key">{{ option }}</span>
      </div>
      <div class="ipulse-slider-header-item">
        <span v-for="index in 10" :key="index">{{ index }}</span>
      </div>
    </div>
    <div v-for="(statement, key) in statements" :key="key">
      <div class="ipulse-slider-wrapper">
        <span class="ipulse-slider-title">{{ statement.title }}</span>
        <span class="ipulse-slider-range">
          <range-slider @change-value="updateValues($event, statement.id)"/>
        </span>
      </div>
    </div>

    <button class="btn btn-primary btn-primary-active confirm-survey" @click="updateOrder">{{ $t('button_g.confirm_order') }}</button>
  </section>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import RangeSlider from '@/components/common/rangeSlider/RangeSlider.vue'
import { IpulseSortingStatement, IpulseStatement } from '@/interfaces'

@Component({
  name: 'RangeSliderSortingStatement',
  components: {
    RangeSlider
  }
})

export default class RangeSliderSortingStatement extends Vue {
  @Prop({ default: null })
  statements!: IpulseStatement[]

  values: IpulseSortingStatement[] = []
  options: string[] = [
    'Disagree',
    'Somewhat Agree',
    'Agree',
    'Strongly Agree'
  ]

  created () {
    this.values = this.statements.map(value => {
      return {
        statementId: value.id,
        score: 1
      }
    })
  }

  updateValues (value: string, key: number) {
    const found = this.values.find((item) => {
      return item.statementId === key
    })

    if (found) {
      found.score = Number(value)
    }
  }

  @Emit()
  updateOrder () {
    return this.values
  }
}
</script>

<style lang="scss">
  .ipulse-slider-header {
    width: 48%;
    display: flex;
    flex-direction: column;
    margin-left: auto;

    .ipulse-slider-header-item {
      display: flex;
      justify-content: space-between;
    }
  }

  .ipulse-slider-wrapper {
    display: flex;
    margin-top: 10px;
    margin-bottom: 15px;
  }
  .ipulse-slider-title {
    width: 48%;
  }
  .ipulse-slider-range {
    width: 48%;
    margin-left: auto;
  }

  .rtl .ipulse-slider-header {
    margin-right: auto;
    margin-left: 0;
  }

  .rtl .ipulse-slider-range {
    margin-right: auto;
    margin-left: 0;
  }
</style>
