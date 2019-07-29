<template>
  <div>
    <app-header></app-header>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Header from '@/components/common/layout/Header.vue'
import UserService from '@/services/UserService'

@Component({
  components: {
    appHeader: Header
  }
})
export default class Layout extends Vue {
  async created () {
    if (this.$auth.isAuthenticated()) {
      this.$store.commit('user/setIsAuthenticated', true)
      await UserService.getUser()
    }
  }
}
</script>

<style lang="less">
</style>
