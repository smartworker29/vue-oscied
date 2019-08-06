<template>
  <form @submit.prevent="submit" novalidate>
    <div class="row">
      <div class="col-md-12">
        <div class="form-group" :class="{'has-error' : errors.first('email')}">
          <label>{{ $t('email_address') }}</label>
          <input name="email"
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
          <label>{{ $t('password') }}</label>
          <input name="password"
                 v-validate="'required|min:8'"
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
      <div class=" col-md-6">
        <button type="submit" class="btn btn-success">{{ $t('button_g.sign_in') }}</button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { SignInData } from '@/interfaces/UserInterfaces'
import { AxiosResponse } from 'axios'
import UserService from '@/services/UserService'

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
      await UserService.getUser()

      this.$validator.reset()
      this.error = ''

      this.$router.push({ name: 'home' })
    } catch (error) {
      const response: AxiosResponse = error.response
      if (response) {
        this.error = response.data.message || response.data.error || 'Sign in error'
      } else {
        throw error
      }
    }
  }
}
</script>
