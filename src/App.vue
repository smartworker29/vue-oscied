<template>
  <div id="app">
    <app-layout v-if="isLoaded"/>
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
  isLoaded: boolean = false;

  async beforeCreate () {
    if (this.$auth.isAuthenticated()) {
      await UserService.getUser()
    }
  }

  async created () {
    if (this.$auth.isAuthenticated()) {
      try {
        const userData: User = await UserService.getUser()
        LocaleHelper.setUserLocale(userData.locale)
        this.isLoaded = true
      } catch (error) {
        if ('response' in error && error.response.status === 401) {
          await this.$auth.logout()
          await UserService.logout()
          this.isLoaded = true
          this.$router.push({ name: 'home' })
        } else {
          this.isLoaded = true
          throw error
        }
      }
    }
    const userLocale = LocaleHelper.getUserLocale()
    if (userLocale) {
      this.$i18n.locale = userLocale
      this.handleArabianLocale(userLocale)
      this.localizeValidator(LocaleHelper.getLocaleForVeeValidate(userLocale))
    }
    this.isLoaded = true
  }

  handleArabianLocale (userLocale: string): void {
    if (userLocale === 'ar') {
      document.getElementsByTagName('body')[0].classList.add('rtl')
    } else {
      document.getElementsByTagName('body')[0].classList.remove('rtl')
    }
  }
}
</script>

<style lang="scss">
  // @import '~bootstrap/dist/css/bootstrap.css';
  // @import '~bootstrap-vue/dist/bootstrap-vue.css';
  @import "~vue-multiselect/dist/vue-multiselect.min.css";
  @import "~flag-icon-css/css/flag-icon.css";
  @import "./assets/styles/app";
  body {
    font-family: 'Cerebri Sans';
    font-weight: normal;
    font-size: 16px;
    line-height: 1.5;
  }

  html, body, #app {
    height: 100%;
  }

  .application-wrapper {
    height: 100%;
    min-height: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-flow: column;
  }

  .application-content {
    background: #0085cd;
    position: relative;
    flex: 1;
  }

  html {
    min-height: 100vh;
  }
</style>
