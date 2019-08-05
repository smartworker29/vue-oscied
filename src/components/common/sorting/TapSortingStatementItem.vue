<template>
    <div class="tap-sorting-item" @click="changeStatus">
      <div class="item-phrase">{{ itemOptions.displayOption ? itemOptions.item[itemOptions.displayOption] : 'title' }}</div>
      <div class="item-rank">{{ itemOptions.type === typeOrdered ? itemOptions.orderNumber : ' ' }}</div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { TapStatementSortingItemOptions } from '@/interfaces/SortingInterfaces'

@Component({})
export default class TapSortingStatementItem extends Vue {
  readonly typeOrdered: string = 'ordered'
  readonly typeRaw: string = 'raw'

  @Prop()
  itemOptions!: TapStatementSortingItemOptions

  changeStatus () {
    if (this.itemOptions.type === this.typeRaw) {
      this.$emit('moveToOrder', this.itemOptions.indexOfList)
    } else if (this.itemOptions.type === this.typeOrdered) {
      this.$emit('removeFromOrder', this.itemOptions.indexOfList)
    } else {
      throw new Error(`Undefined type ${this.itemOptions.type}. Available types: ${this.typeRaw}, ${this.typeOrdered}.`)
    }
  }
}
</script>
