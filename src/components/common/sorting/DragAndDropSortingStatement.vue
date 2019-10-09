<template>
  <div class="drag-and-drop-statement-sorting row">
    <div class="drag-and-drop-info">
      <p><fa class="icon" icon="info-circle"/> {{ $t('sorting_g.drag.tip') }}</p>
    </div>
    <div class="drag-and-drop-content">
      <div class="drag-and-drop-numbers">
        <p v-for="(item, index) in options.list" :key="index" class="dd-sorting-list-item-num">{{ index + 1 }}</p>
      </div>
      <div class="drag-and-drop">
        <draggable class="dd-sorting-list"
                   :list="options.list"
                   :handle="'.handle'"
                   :animation="250"
                   :forceFallback="true"
                   ghostClass="ghost-placeholder"
                   chosenClass="chosen-item"
                   dragClass="dragged-item">
          <div class="dd-sorting-item handle" v-for="(item, index) in options.list" :key="index">
            <span class="item-phrase">{{ item[options.displayOption] }}</span> <span class="arrow"><fa icon="arrows-alt-v"/></span>
          </div>
        </draggable>
      </div>
    </div>
    <button class="btn btn-primary btn-primary-active" @click="updateOrder">{{ $t('button_g.confirm_order') }}</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import draggable from 'vuedraggable'
import { StatementSortingOptions } from '@/interfaces/SortingInterfaces'

@Component({
  components: { draggable }
})
export default class DragAndDropSortingStatement extends Vue {
  @Prop({
    default: {
      list: [],
      displayOption: 'title'
    }
  })
  options!: StatementSortingOptions

  updateOrder () {
    this.$emit('updateOrder', this.options.list)
  }
}
</script>

<style lang="scss">
  .drag-and-drop-content {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 40px;
  }

  .drag-and-drop {
    flex: 1;
  }
</style>
