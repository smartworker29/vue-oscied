<template>
  <form @submit.prevent="submit" class="form" novalidate>
    <div class="form-group" :class="{'has-error' : errors.first('firstName')}">
      <label for="">First name</label>
      <input name="firstName"
              :placeholder="[[ $t('first_name') ]]"
              type="text"
              v-model="registrationData.firstName"
              class="form-control"
              v-validate="'required|max:50'"
              :data-vv-as="$t('first_name')"/>
      <small v-if="errors.first('firstName')" class="error">{{ errors.first('firstName') }}</small>
    </div>
    <div class="form-group" :class="{'has-error' : errors.first('lastName')}">
      <label for="">Last name</label>
      <input name="lastName"
              :placeholder="[[ $t('last_name') ]]"
              type="text"
              v-model="registrationData.lastName"
              class="form-control"
              v-validate="'required|max:50'"
              :data-vv-as="$t('last_name')"/>
      <small v-if="errors.first('lastName')" class="error">{{ errors.first('lastName') }}</small>
    </div>
      <div class="form-group" :class="{'has-error' : (errors.first('email') || !emailIsFree)}">
        <label for="">Email address</label>
        <input name="email"
                :placeholder="[[ $t('email_address') ]]"
                type="email"
                v-model="registrationData.email"
                class="form-control"
                v-validate="'required|email|max:180'"
                :data-vv-as="$t('email_address')"
                @change="checkEmail()"/>
        <small class="error" v-if="errors.first('email')">{{ errors.first('email') }}</small>
        <small class="error" v-if="!errors.first('email') && !emailIsFree">{{ $t('email_already_user') }}</small>
      </div>
      <div class="form-group">
        <label for="">Gender</label>
        <v-select class="form-select" name="gender" v-model="registrationData.gender" :options="genderOption"></v-select>
      </div>
      <div
        class="form-group"
        v-if="availableRegistrationFields.includes('phone')"
        :class="{'has-error' : errors.first('phone')}">
        <label for="">Phone number</label>
        <input name="phone"
                :placeholder="[[ $t('phone_number') ]]"
                type="text"
                v-model="registrationData.phone"
                class="form-control"
                v-validate="'required'"
              :data-vv-as="$t('phone_number')"/>
        <small v-if="errors.first('phone')" class="error">{{ errors.first('phone') }}</small>
      </div>
    <div class="row" v-if="error">
        <p>{{ error }}</p>
    </div>
    <div class="form-actions form-action-justified">
      <span @click="changeForm('signIn')">{{ $t('already_registered') }}</span>
      <button type="submit" class="btn btn-success">{{ $t('button_g.register') }}</button>
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
  genderOption: Array<any> = []

  async created () {
    this.genderOption = [this.$t('gender'), this.$t('male'), this.$t('female')]
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
