<template>
  <div class="drag-and-drop-statement-sorting row">
    <div class="col-md-6 row">
      <div class="col-md-1">
        <p v-for="(item, index) in options.list" :key="index" class="dd-sorting-list-item-num">{{ index + 1 }}</p>
      </div>
      <div class="col-md-11">
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
    <div class="col-md-6">
      <p><fa icon="info-circle"/> {{ $t('sorting_g.drag.tip') }}</p>
    </div>
    <button class="btn btn-primary" @click="updateOrder">{{ $t('button_g.confirm_order') }}</button>
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
