<template>
  <form @submit.prevent="submit" novalidate>
    <div class="row">
      <div class="col-md-12">
        <div class="form-group" :class="{'has-error' : errors.first('email')}">
          <input name="email"
                 :placeholder="[[ $t('email_address') ]]"
                 type="email"
                 v-model="signInData.email"
                 class="form-control"
                 v-validate="'required|email|max:180'"
                 :data-vv-as="$t('email_address')"/>
          <small class="error">{{ errors.first('email') }}</small>
        </div>
      </div>
    </div>
    <div class="row">
      <div class=" col-md-12">
        <div class="form-group" :class="{'has-error' : errors.first('password')}">
          <input name="password"
                 :placeholder="[[ $t('password') ]]"
                 v-validate="'required|min:3'"
                 :data-vv-as="$t('password')"
                 type="password"
                 v-model="signInData.password"
                 class="form-control"/>
          <small class="error">{{ errors.first('password') }}</small>
        </div>
      </div>
    </div>
    <div class="row" v-if="error">
      <div class=" col-md-6">
        <p class="error">{{ error }}</p>
      </div>
    </div>
    <div class="row">
      <div class=" col-md-12 text-center">
        <button type="button" class="btn btn-link" @click="changeForm('signUp')">{{ $t('forgot_password') }}</button>
        <button type="submit" class="btn btn-success col-12">{{ $t('button_g.sign_in') }}</button>
        <button type="button" class="btn btn-link" @click="changeForm('signUp')">{{ $t('no_account') }}</button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { SignInData } from '@/interfaces/UserInterfaces'
import { AxiosResponse } from 'axios'
import UserService from '@/services/UserService'
import LocaleHelper from '@/utils/LocaleHelper'

@Component({})
export default class SignInForm extends Vue {
  signInData: SignInData = {
    email: '',
    password: ''
  }
  error: string = ''

  async submit () {
    if (!await this.$validator.validateAll()) {
      return
    }

    try {
      await this.$auth.login(this.signInData)
      const userData = await UserService.getUser()
      LocaleHelper.setUserLocale(userData.locale)

      const userLocale = LocaleHelper.getUserLocale()
      if (userLocale) {
        this.$i18n.locale = userLocale
        this.localizeValidator(LocaleHelper.getLocaleForVeeValidate(userLocale))
      }

      this.$validator.reset()
      this.error = ''

      this.$emit('authorizedComplete')
    } catch (error) {
      const response: AxiosResponse = error.response
      if (response) {
        this.error = response.data.message || response.data.error || 'Sign in error'
      } else {
        throw error
      }
    }
  }

  changeForm (formName: string) {
    this.$emit('changeForm', formName)
  }
}
</script>
