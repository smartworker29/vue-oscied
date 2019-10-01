<template>
  <form @submit.prevent="submit" novalidate>
    <div class="row">
      <div class="col-md-12">
        <div class="form-group" :class="{'has-error' : errors.first('firstName')}">
          <input name="firstName"
                 :placeholder="[[ $t('first_name') ]]"
                 type="text"
                 v-model="registrationData.firstName"
                 class="form-control"
                 v-validate="'required|max:50'"
                 :data-vv-as="$t('first_name')"/>
          <small class="error">{{ errors.first('firstName') }}</small>
        </div>
      </div>
      <div class="col-md-12">
        <div class="form-group" :class="{'has-error' : errors.first('lastName')}">
          <input name="lastName"
                 :placeholder="[[ $t('last_name') ]]"
                 type="text"
                 v-model="registrationData.lastName"
                 class="form-control"
                 v-validate="'required|max:50'"
                 :data-vv-as="$t('last_name')"/>
          <small class="error">{{ errors.first('lastName') }}</small>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="form-group" :class="{'has-error' : (errors.first('email') || !emailIsFree)}">
          <input name="email"
                 :placeholder="[[ $t('email_address') ]]"
                 type="email"
                 v-model="registrationData.email"
                 class="form-control"
                 v-validate="'required|email|max:180'"
                 :data-vv-as="$t('email_address')"
                 @change="checkEmail()"/>
          <small class="error">{{ errors.first('email') }}</small>
          <small class="error" v-if="!errors.first('email') && !emailIsFree">{{ $t('email_already_user') }}</small>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="form-group">
          <select name="gender"
                  class="form-control"
                  v-model="registrationData.gender">
            <option value="" selected>{{ $t('gender') }}</option>
            <option value="m">{{ $t('male') }}</option>
            <option value="f">{{ $t('female') }}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="row" v-if="availableRegistrationFields.includes('phone')">
      <div class="col-md-12">
        <div class="form-group" :class="{'has-error' : errors.first('phone')}">
          <input name="phone"
                 :placeholder="[[ $t('phone_number') ]]"
                 type="text"
                 v-model="registrationData.phone"
                 class="form-control"
                 v-validate="'required'"
                :data-vv-as="$t('phone_number')"/>
          <small class="error">{{ errors.first('phone') }}</small>
        </div>
      </div>
    </div>
    <div class="row" v-if="error">
        <p>{{ error }}</p>
    </div>
    <div class="row">
      <div class="col-md-12 text-center">
        <button type="submit" class="btn btn-success col-12">{{ $t('button_g.sign_up') }}</button>
        <button type="button" class="btn btn-link" @click="changeForm('signIn')">{{ $t('already_registered') }}</button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import UserService from '@/services/UserService'
import { RegistrationData } from '@/interfaces/UserInterfaces'
import LocaleHelper from '@/utils/LocaleHelper'

@Component({})
export default class SignUpForm extends Vue {
  registrationData: RegistrationData = {
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    phone: '',
    locale: ''
  }

  availableRegistrationFields: string[] = []
  emailIsFree: boolean = true
  error: string | null = null

  async created () {
    this.availableRegistrationFields = await UserService.getAvailableRegistrationFields()
  }

  async checkEmail () {
    this.emailIsFree = await UserService.checkEmailAvailability(this.registrationData.email)
  }

  async submit () {
    this.checkEmail()
    this.error = ''

    if (!await this.$validator.validateAll() || !this.emailIsFree) {
      this.$el.querySelector('.error')!.scrollIntoView(false)
      return
    }

    try {
      this.registrationData.locale = LocaleHelper.getUserLocale()
      const registrationData = await UserService.registration(this.registrationData)
      await this.$auth.setToken(registrationData)
      await UserService.getUser()

      this.$emit('authorizedComplete')
    } catch (error) {
      if ('response' in error && error.response.status === 400) {
        this.handleRegistrationErrors(error.response.data)
      } else {
        this.error = error.message
      }
    }
  }

  handleRegistrationErrors (data: object) {
    // todo::add handle logic
  }

  changeForm (formName: string) {
    this.$emit('changeForm', formName)
  }
}
</script>
