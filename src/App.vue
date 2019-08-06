<template>
  <div id="app">
    <app-layout/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Layout from '@/components/common/layout/Layout.vue'
import UserService from '@/services/UserService'
import LocaleHelper from '@/utils/LocaleHelper'

@Component({
  components: {
    appLayout: Layout
  }
})
export default class App extends Vue {
  async created () {
    if (this.$auth.isAuthenticated()) {
      this.$store.commit('user/setIsAuthenticated', true)
      await UserService.getUser()
    }

    const userLocale = LocaleHelper.getUserLocale()
    if (userLocale) {
      this.$i18n.locale = userLocale
      this.localizeValidator(userLocale)
    }
  }
}
</script>

<style lang="scss">
  @import "./assets/styles/app";
  @import '~bootstrap/dist/css/bootstrap.css';
  @import '~bootstrap-vue/dist/bootstrap-vue.css';
</style>
