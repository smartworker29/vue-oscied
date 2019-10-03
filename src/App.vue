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
import { User } from '@/interfaces/UserInterfaces'

@Component({
  components: {
    appLayout: Layout
  }
})
export default class App extends Vue {
  async created () {
    if (this.$auth.isAuthenticated()) {
      try {
        const userData: User = await UserService.getUser()
        LocaleHelper.setUserLocale(userData.locale)
      } catch (error) {
        if ('response' in error && error.response.status === 401) {
          this.$auth.logout().then(async () : Promise<void> => {
            await UserService.logout()
            this.$router.push({ name: 'home' })
          })
        } else {
          throw error
        }
      }
    }

    const userLocale = LocaleHelper.getUserLocale()
    if (userLocale) {
      this.$i18n.locale = userLocale
      this.localizeValidator(LocaleHelper.getLocaleForVeeValidate(userLocale))
    }
  }
}
</script>

<style lang="scss">
  @import "./assets/styles/app";
  @import '~bootstrap/dist/css/bootstrap.css';
  @import '~bootstrap-vue/dist/bootstrap-vue.css';
  html, body, #app {
    height: 100%;
  }
</style>
