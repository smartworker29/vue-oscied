<template>
  <div>
    <app-header></app-header>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Header from '@/components/common/layout/Header.vue'

@Component({
  components: {
    appHeader: Header
  }
})
export default class Layout extends Vue {}
</script>
