<template>
  <div class="range-container" v-if="rangeLimit > 0">
    <div class="range-numbers" v-if="withNumber">
      <span v-for="index in rangeLimit"
            :key="index"
            :class="{ 'selected-number': inputRange === index }"
            @click="changeValueByNumber(index)"
      >
        {{ index }}
      </span>
    </div>
    <div class="range">
      <input v-model.number="inputRange"
             class="range-input"
             type="range"
             min="1"
             max="-1"
             ref="rangeSlider"
             @input="changedValue"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'

@Component({ name: 'RangeSlider' })
export default class RangeSlider extends Vue {
  @Prop({
    required: false,
    default: 10
  })
  rangeLimit!: number

  @Prop({
    required: false,
    default: true
  })
  withNumber!: boolean

  inputRange = 1

  @Ref()
  rangeSlider!: HTMLInputElement

  mounted () {
    this.rangeSlider.max = String(this.rangeLimit)
  }

  changeValueByNumber (selectedValue: number): void {
    this.rangeSlider.value = String(selectedValue)
    this.recalculateRangeStyles()
    this.inputRange = selectedValue

    this.$emit('change-value', this.inputRange)
  }

  changedValue (event: Event) {
    this.recalculateRangeStyles()
    const input = event.target as HTMLInputElement

    this.$emit('change-value', input.value)
  }

  recalculateRangeStyles (): void {
    const { value, min, max } = this.rangeSlider
    const dark = '#0085cd'
    const light = '#bdddff'
    const percentage: number = (Number(value) - Number(min)) / (Number(max) - Number(min)) * 100
    const direction = this.$i18n.locale === 'ar' ? 'left' : 'right'
    this.rangeSlider.style.background = `linear-gradient(to ${direction}, ${dark} 0%, ${dark} ${percentage}%, ${light} ${percentage}%, ${light} 100%)`
  }

  reset (): void {
    this.inputRange = 1
    this.rangeSlider.value = '1'
    this.recalculateRangeStyles()
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
  @mixin thumb-tablet {
    box-shadow: 0 0 1px 7px $thumb-shadow-color;
    background: $thumb-color;
    border-radius: $thumb-radius;
    cursor: pointer;
    height: $thumb-height - 5;
    width: $thumb-width - 5;
  }

  .range {

    &-numbers {
      display: flex;
      justify-content: space-between;
      margin: 0 -4px;

      span {
        cursor: pointer;
        text-align: center;
        width: 22px;

        &.selected-number {
          font-weight: bold;
        }
      }
    }
    &-input {
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
    @media screen and (max-width: 900px) {
      &-numbers {
        margin: 0 -7px;

        span {
          font-size: 15px;
        }
      }
      input[type=range] {

        &::-webkit-slider-thumb {
          @include thumb-tablet;
        }
        &::-moz-range-thumb {
          @include thumb-tablet;
        }
        &::-ms-thumb {
          @include thumb-tablet;
        }
      }
    }
    @media screen and (max-width: 768px) {
      &-numbers {
        span {
          font-size: 14px;
        }
      }
    }
  }
</style>
