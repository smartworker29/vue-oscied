<template>
  <form class="form request-reset-password-form" @submit.prevent="submit" novalidate>
    <h4>{{ $t('request_reset_password_title') }}</h4>
    <div class="form-group" :class="{'has-error' : errors.first('email')}">
      <label>{{ $t('email_address') }}</label>
      <input name="email"
             type="text"
             v-model="email"
             class="form-control"
             v-validate="'required'"
             :data-vv-as="$t('email_address')"/>
    </div>
    <div class="row" v-if="error">
      <div class=" col-md-6">
        <p class="error">{{ error }}</p>
      </div>
    </div>

    <div class="form-actions form-actions-justified">
      <span class="switch-form" @click="$router.back()">{{ $t('back') }}</span>
      <button type="submit" class="btn btn-success">{{ $t('button_g.reset') }}</button>
    </div>
  </form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AxiosResponse } from 'axios'
import UserService from '@/services/UserService'

@Component({ name: 'RequestResetPasswordForm' })
export default class RequestResetPasswordForm extends Vue {
  email: string = ''
  error: string = ''

  async submit () {
    if (!await this.$validator.validateAll()) {
      return
    }

    try {
      const passwordResponse = await UserService.requestResetPassword({ username: this.email, origin: this.$router.resolve('reset-password').href })
      this.$validator.reset()
      this.error = ''
      this.$router.push({ name: 'home', params: { message: `We have sent you an email to '${this.email}'. Please check your mailbox. If you don't get an email please check your spam mail folder and settings.` } })
    } catch (error) {
      const response: AxiosResponse = error.response
      if (response) {
        this.error = response.data.message || response.data.error || 'Reset password error'
      } else {
        throw error
      }
    }
  }
}
</script>

<style>
  .request-reset-password-form {
    color: black;
  }
</style>
