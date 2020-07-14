<template>
  <div class="range-container">
    <div class="range">
      <input v-model.number="inputRange" class="range-input" type="range" min="1" :max="rangeAmount" steps="1" @change="changeValue" ref="rangeSlider"/>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'

@Component({ name: 'RangeSlider' })
export default class RangeSlider extends Vue {
  @Prop({ default: null })
  rangeLimit: number|null = null

  defaultAmount: number = 10

  inputRange: number|null = null

  @Ref()
  rangeSlider!: HTMLInputElement

  get rangeAmount (): number {
    const rangeLimit = this.rangeLimit

    return rangeLimit || this.defaultAmount
  }

  changeValue (event: Event) {
    const slider = this.rangeSlider
    let percentage: number = (parseInt(slider.value) - parseInt(slider.min)) / (parseInt(slider.max) - parseInt(slider.min)) * 100
    slider.style.background = 'linear-gradient(to right, #0085cd 0%, #0085cd ' + percentage + '%, #bdddff ' + percentage + '%, #bdddff 100%)'
  }
}
</script>
<style lang="scss" scoped>
  $thumb-color: #0085cd !default;
  $thumb-light-color: #bdddff !default;
  $thumb-radius: 50% !default;
  $thumb-height: 15px !default;
  $thumb-width: 15px !default;
  $thumb-shadow-width: 1px 10px !default;
  $thumb-shadow-color: rgba(135, 192, 220, 0.9) !default;

  @mixin thumb {
    box-shadow: 0 0 $thumb-shadow-width $thumb-shadow-color;
    background: $thumb-color;
    border-radius: $thumb-radius;
    cursor: pointer;
    height: $thumb-height;
    width: $thumb-width;
  }

  .range-container {
    .range-input {
      width: 100%;
      height: 5px;
      background: $thumb-light-color;
      outline: none;
    }

    input[type=range] {
      -moz-appearance: none;
      -webkit-appearance: none;
      appearance: none;

      &::-webkit-slider-thumb {
        @include thumb;
        appearance: none;
      }
      &::-moz-range-thumb {
        @include thumb;
        appearance: none;
      }
      &::-ms-thumb {
        @include thumb;
        appearance: none;
      }
    }
  }
</style>
