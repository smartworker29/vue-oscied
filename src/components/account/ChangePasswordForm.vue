<template>
    <div class="account-sub-form">
      <h2>{{ $t('update_password') }}</h2>
      <form @submit.prevent="changePassword" class="form space-between account-form wrap" novalidate>
        <div class="form-half">
          <div class="form-group row" :class="{ 'has-error' : errors.first('oldPassword') }">
            <label class="col-md-4 col-form-label">{{ $t('current_password') }}</label>
            <input v-validate="'required'"
                    name="current_password"
                    type="password"
                    v-model="passwordForm.oldPassword"
                    class="form-control col-md-8"/>
            <small class="error">{{ errors.first('oldPassword') }}</small>
          </div>
        </div>
        <div class="form-half">
          <div class="form-group row" :class="{ 'has-error' : errors.first('newPassword') }">
            <label class="col-md-4 col-form-label">{{ $t('new_password') }}</label>
            <input v-validate="'required'"
                    v-model="passwordForm.newPassword"
                    name="newPassword"
                    type="password"
                    class="form-control col-md-8"
                    ref="newPassword">
            <small class="error">{{ errors.first('newPassword') }}</small>
          </div>
          <div class="form-group row" :class="{ 'has-error' : errors.first('password_confirmation') }">
            <label class="col-md-4 col-form-label">{{ $t('repeat_password') }}</label>
            <input v-validate="'required|confirmed:newPassword'"
                    name="password_confirmation"
                    type="password"
                    v-model="repeatPassword"
                    class="form-control col-md-8"
                    :data-vv-as="$t('repeat_password')">
            <small class="error">{{ errors.first('password_confirmation') }}</small>
        </div>
        </div>
        <div class="row" v-if="error">
          <div class=" col-md-12 text-center">
            <p class="error">{{ error }}</p>
          </div>
        </div>
        <div class="row" v-if="isPasswordChanged">
          <div class=" col-md-12 text-center">
            <div class="alert alert-success" role="alert">{{ $t('password_successfully_changed') }}</div>
          </div>
        </div>
        <div class="full-width flex-end account-form-actions">
            <button type="reset" class="btn btn-primary" @click.prevent="resetChangePasswordForm()">{{ $t('button_g.cancel') }}</button>
            <button type="submit" class="btn btn-primary btn-primary-active">{{ $t('button_g.change_password') }}</button>
        </div>
      </form>
    </div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { UpdatePasswordData, User } from '@/interfaces/UserInterfaces'
import UserService from '@/services/UserService'

@Component({})
export default class ChangePasswordForm extends Vue {
  @Getter('user/currentUser')
  user!: User

  error: string | null = null

  passwordForm: UpdatePasswordData = {
    oldPassword: '',
    newPassword: ''
  }

  repeatPassword: string = ''
  isPasswordChanged: boolean = false

  async changePassword () : Promise<void> {
    this.error = null
    this.errors.clear()

    if (!await this.$validator.validateAll()) {
      this.$el.querySelector('.error')!.scrollIntoView(false)
      return
    }

    try {
      const response = await UserService.changePassword(this.user.id, this.passwordForm)

      this.$validator.pause()
      this.passwordForm.oldPassword = ''
      this.passwordForm.newPassword = ''
      this.repeatPassword = ''

      await this.$auth.setToken(response)

      this.isPasswordChanged = true
      setTimeout(() => {
        this.isPasswordChanged = false
      }, 3000)
    } catch (error) {
      if ('response' in error && error.response.status === 400) {
        this.handleChangePasswordErrors(error.response.data, this.passwordForm)
      } else {
        throw error
      }
    }
  }

  handleChangePasswordErrors (response: any, formData: object) : void {
    this.error = response.message

    Object.keys(response.errors).forEach((value: string) => {
      if (formData.hasOwnProperty(value) && value in response.errors && response.errors[value][0]) {
        this.errors.add({
          field: value,
          msg: response.errors[value][0]
        })
      }
    })
  }

  resetChangePasswordForm () : void {
    this.$validator.pause()
    this.errors.clear()
    this.passwordForm.oldPassword = ''
    this.passwordForm.newPassword = ''
    this.repeatPassword = ''
  }
}
</script>
