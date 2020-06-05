<template>
  <form class="form reset-password-form" @submit.prevent="submit" novalidate>
    <h2>{{ $t('password_reset.heading1') }}</h2>
    <p><strong>{{ $t('password_reset.heading2') }}</strong></p>
    <p>{{ $t('password_reset.instructions') }}</p>
    <div class="form-group" :class="{'has-error' : errors.first('newPassword')}" style="margin-top: 25px">
      <label>{{ $t('password') }}</label>
      <input name="newPassword"
             type="password"
             v-model="passwordForm.newPassword"
             class="form-control"
             v-validate="'required'"
             :data-vv-as="$t('password')"/>
      <small class="error">{{ errors.first('newPassword') }}</small>
    </div>
    <div class="form-group" :class="{'has-error' : errors.first('confirmPassword')}">
      <label>{{ $t('password_confirm') }}</label>
      <input name="confirmPassword"
             type="password"
             v-model="passwordForm.confirmPassword"
             class="form-control"
             v-validate="'required'"
             :data-vv-as="$t('password_confirm')"/>
      <small class="error">{{ errors.first('confirmPassword') }}</small>
    </div>

    <div class="row" v-if="error">
      <div class=" col-md-12 text-center">
        <p class="error">{{ error }}</p>
      </div>
    </div>

    <div class="form-actions form-actions-justified">
      <button type="submit" class="btn btn-success">{{ $t('button_g.submit') }}</button>
    </div>
  </form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import UserService from '@/services/UserService'
import { ResetPasswordData } from '@/interfaces/UserInterfaces'

@Component({ name: 'ResetPasswordForm' })
export default class ResetPasswordForm extends Vue {
  error: string | null = null
  passwordForm: ResetPasswordData = {
    newPassword: '',
    confirmPassword: ''
  }

  @Prop({ default: '' })
  email!: string

  @Prop({ default: '' })
  token!: string

  async submit () {
    if (!await this.$validator.validateAll()) {
      return
    }

    this.error = null
    this.errors.clear()
    this.$validator.reset()

    try {
      const passwordResponse = await UserService.resetPassword(this.email, this.token, this.passwordForm)
      this.$router.push({ name: 'home' })
    } catch (error) {
      if ('response' in error && error.response.status === 400) {
        this.handleResetPasswordErrors(error.response.data, this.passwordForm)
      } else {
        throw error
      }
    }
  }

  handleResetPasswordErrors (response: any, formData: object) : void {
    Object.keys(response.errors).forEach((value: string) => {
      if (formData.hasOwnProperty(value) && value in response.errors && response.errors[value][0]) {
        this.errors.add({
          field: value,
          msg: response.errors[value].join('\n')
        })
      }
    })
  }
}
</script>

<style>
  .reset-password-form {
    color: black;
  }
</style>
