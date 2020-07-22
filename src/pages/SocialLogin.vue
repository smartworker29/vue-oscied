<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import UserService from '@/services/UserService'
import LocaleHelper from '@/utils/LocaleHelper'
import { EventBus } from '@/main'

@Component({ name: 'SocialLogin' })
export default class SocialLogin extends Vue {
  async created () {
    try {
      await this.$auth.setToken(this.$route.query)

      const userData = await UserService.getUser()
      LocaleHelper.setUserLocale(userData.locale)

      const userLocale = LocaleHelper.getUserLocale()
      if (userLocale) {
        this.$i18n.locale = userLocale
        this.localizeValidator(LocaleHelper.getLocaleForVeeValidate(userLocale))
      }

      this.$router.push({ name: 'home' })

      EventBus.$emit('authorizedComplete')
    } catch (error) {
      throw error
    }
  }
}
</script>
