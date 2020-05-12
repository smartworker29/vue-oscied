<template>
  <div class="application-wrapper">
    <template>
      <user-header/>
    </template>
    <div class="application-content">
      <router-view/>
      <app-footer />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import UserHeader from '@/components/common/layout/UserHeader.vue'
import AppFooter from '@/components/footer/AppFooter.vue'

@Component({
  name: 'Layout',
  components: {
    UserHeader,
    AppFooter
  }
})
export default class Layout extends Vue {}
</script>
