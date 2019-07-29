<template>
  <div id="app">
    <app-layout/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Layout from '@/components/common/layout/Layout.vue'

@Component({
  components: {
    appLayout: Layout
  }
})
export default class App extends Vue {}
</script>

<style lang="less">
  @import "./assets/styles/app";
  @import '~bootstrap/dist/css/bootstrap.css';
  @import '~bootstrap-vue/dist/bootstrap-vue.css';
</style>
