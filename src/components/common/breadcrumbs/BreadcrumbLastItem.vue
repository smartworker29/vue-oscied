<template>
  <span class="breadcrumbs-last-item">{{ breadcrumb.name || '' }}</span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { BreadcrumbElement } from '@/interfaces/BreadcrumbsInterfaces'

@Component({ name: 'BreadcrumbLastItem' })
export default class BreadcrumbLastItem extends Vue {
  @Prop({ default: null })
  breadcrumb!: BreadcrumbElement
}
</script>

<style lang="scss" scoped>
  .breadcrumbs-last-item {
    padding: 0 3px;
    color: #3d5a80;
  }
</style>
