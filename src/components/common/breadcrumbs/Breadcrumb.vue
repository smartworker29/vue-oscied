<template>
  <div class="breadcrumbs">
    <div v-for="(item, key) in items.slice(0,-1)" :key="key">
      <BreadcrumbItem :breadcrumb="item"/>
    </div>
    <BreadcrumbLastItem :breadcrumb="lastItem"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { BreadcrumbElement } from '@/interfaces/BreadcrumbsInterfaces'
import BreadcrumbItem from '@/components/common/breadcrumbs/BreadcrumbItem.vue'
import BreadcrumbLastItem from '@/components/common/breadcrumbs/BreadcrumbLastItem.vue'

@Component({
  name: 'Breadcrumb',
  components: {
    BreadcrumbItem,
    BreadcrumbLastItem
  }
})
export default class Breadcrumb extends Vue {
  @Prop({ default: [] })
  items!: BreadcrumbElement[]

  get lastItem () : BreadcrumbElement | null {
    return this.items[this.items.length - 1]
  }
}
</script>

<style lang="scss" scoped>
   .breadcrumbs {
    color: #0085cd;
    display: flex;
    padding: 5px 10px;
  }
</style>
