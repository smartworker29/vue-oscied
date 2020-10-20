<template>
  <section class="ipulse-actions" v-if="statements">
    <div class="ipulse-slider-header">
      <div class="ipulse-slider-header-item">
        <span v-for="(option, key) in options" :key="key">{{ option }}</span>
      </div>
    </div>
    <div v-for="(statement, key) in statements" :key="key">
      <div class="ipulse-slider-wrapper">
        <span class="ipulse-slider-title">{{ statement.title }}</span>
        <div class="ipulse-slider-range">
          <range-slider @change-value="updateValues($event, statement.id)" />
        </div>
      </div>
    </div>

    <button class="btn btn-primary btn-primary-active confirm-survey" @click="updateOrder">{{ $t('button_g.confirm_order') }}</button>
    <modal :classes="['ccr-modal']" name="confirm-statements-modal" :height="'auto'">
      <SimpleConfirmModal
        :title="$t('confirmation_message')"
        :message="$t('no_ranked_statement')"
        @cancel="hideConfirmModal"
        @confirm="confirmModal"
      />
    </modal>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import RangeSlider from '@/components/common/rangeSlider/RangeSlider.vue'
import { IpulseSortingStatement, IpulseStatement } from '@/interfaces'
import SimpleConfirmModal from '@/components/modals/SimpleConfirmModal.vue'

@Component({
  name: 'RangeSliderSortingStatement',
  components: {
    RangeSlider,
    SimpleConfirmModal
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

  updateOrder (): void {
    const unScoredStatement: IpulseSortingStatement | undefined = this.values.find(
      (statement: IpulseSortingStatement): boolean => {
        return statement.score === 1
      }
    )

    if (unScoredStatement) {
      this.$modal.show('confirm-statements-modal')

      return
    }

    this.confirmUpdateOrder()
  }

  confirmModal (): void {
    this.hideConfirmModal()
    this.confirmUpdateOrder()
  }

  confirmUpdateOrder (): void {
    this.$emit('update-order', this.values)
  }

  hideConfirmModal (): void {
    this.$modal.hide('confirm-statements-modal')
  }
}
</script>

<style lang="scss">
  .ipulse-slider {

    &-header {
      width: 48%;
      display: flex;
      flex-direction: column;
      margin-left: auto;

      &-item {
        display: flex;
        justify-content: space-between;
      }
    }
    &-wrapper {
      display: flex;
      margin-top: 10px;
      margin-bottom: 15px;
    }
    &-title {
      padding-top: 20px;
      width: 48%;
    }
    &-range {
      width: 48%;
      margin-left: auto;
    }
    @media screen and (max-width: 900px) {
      &-header {
        width: 100%;
      }
      &-title {
        display: block;
        margin-bottom: 7px;
        width: 100%;
        line-height: 1.4;
      }
      &-wrapper {
        display: block;
        margin-bottom: 11px;
      }
      &-range {
        width: 100%;
        margin-left: 0;
      }
    }
    @media screen and (max-width: 768px) {
      &-header {
        font-size: 14px;
      }
      &-title {
        font-size: 15px;
        line-height: 1.3;
      }
    }
    @media screen and (max-width: 380px) {
      &-header {
        font-size: 12px;
      }
    }
  }
  .rtl {

    .ipulse-slider {

      &-header {
        margin-right: auto;
        margin-left: 0;
      }
      &-range {
        margin-right: auto;
        margin-left: 0;
      }
    }
  }
</style>
