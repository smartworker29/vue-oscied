<template>
  <div class="breadcrumbs-item">
    <router-link :to="breadcrumb.link">
      <span>{{ breadcrumb.name || '' }}</span>
    </router-link>
    <img src="@/assets/icons/icon-arrow-down-xs-blue.svg" class="breadcrumbs-item__arrow-right">
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { BreadcrumbElement } from '@/interfaces/BreadcrumbsInterfaces'

@Component({ name: 'BreadcrumbItem' })
export default class BreadcrumbItem extends Vue {
  @Prop({ default: null })
  breadcrumb!: BreadcrumbElement
}
</script>

<style lang="scss" scoped>
  .breadcrumbs-item {
    display: flex;
    padding: 0 3px;
    color: #3d5a80;

    &__arrow-right {
      transform: rotate(270deg);
    }

    a {
      color: #0085cd;
      text-decoration: none;

      &:visited {
        color: #0085cd;
      }
    }
  }
</style>
