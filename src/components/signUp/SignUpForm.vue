<template>
  <form @submit.prevent="submit" class="form" novalidate>
    <div class="form-group" :class="{'has-error' : errors.first('firstName')}">
      <label>{{ $t('first_name') }}</label>
      <input name="firstName"
              type="text"
              v-model="registrationData.firstName"
              class="form-control"
              v-validate="'required|max:50'"
              :data-vv-as="$t('first_name')"/>
      <small v-if="errors.first('firstName')" class="error">{{ errors.first('firstName') }}</small>
    </div>
    <div class="form-group" :class="{'has-error' : errors.first('lastName')}">
      <label>{{ $t('last_name') }}</label>
      <input name="lastName"
              type="text"
              v-model="registrationData.lastName"
              class="form-control"
              v-validate="'required|max:50'"
              :data-vv-as="$t('last_name')"/>
      <small v-if="errors.first('lastName')" class="error">{{ errors.first('lastName') }}</small>
    </div>
      <div class="form-group" :class="{'has-error' : (errors.first('email') || !emailIsFree)}">
        <label>{{ $t('email_address') }}</label>
        <input name="email"
                type="email"
                v-model="registrationData.email"
                class="form-control"
                v-validate="'required|email|max:180'"
                :data-vv-as="$t('email_address')"
                @change="checkEmail()"/>
        <small class="error" v-if="errors.first('email')">{{ errors.first('email') }}</small>
        <small class="error" v-if="!errors.first('email') && !emailIsFree">{{ $t('email_already_user') }}</small>
      </div>
      <div class="form-group form-group-select" :class="{ 'has-error': genderRequiredError }">
        <label>{{ $t('gender') }}</label>
        <multiselect
          v-model="registrationData.gender"
          :placeholder="$t('select')"
          label="label"
          :searchable="false"
          :show-labels="false"
          :options="genderOptions">
        </multiselect>
        <small v-if="genderRequiredError" class="error">{{ $t('gender_is_required') }}</small>
      </div>
      <div
        class="form-group"
        v-if="availableRegistrationFields.includes('phone')"
        :class="{'has-error' : errors.first('phone')}">
        <label>{{ $t('phone_number') }}</label>
        <input name="phone"
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
    <div class="form-actions form-actions-justified">
      <span class="switch-form" @click="changeForm('signIn')">{{ $t('already_registered') }}</span>
      <button type="submit" class="btn btn-success">{{ $t('button_g.register') }}</button>
    </div>
  </form>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import UserService from '@/services/UserService'
import { RegistrationFormData } from '@/interfaces/UserInterfaces'
import LocaleHelper from '@/utils/LocaleHelper'
import { EventBus } from '@/main'

@Component({ name: 'SignUpForm' })
export default class SignUpForm extends Vue {
  registrationData: RegistrationFormData = {
    email: '',
    firstName: '',
    lastName: '',
    gender: null,
    phone: '',
    locale: ''
  }

  availableRegistrationFields: string[] = []
  emailIsFree: boolean = true
  genderRequiredError: boolean = false
  error: string | null = null
  genderOptions: Array<any> = []

  async created () {
    this.genderOptions = [{ label: this.$t('male'), value: 'm' }, { label: this.$t('female'), value: 'f' }]
    this.availableRegistrationFields = await UserService.getAvailableRegistrationFields()
  }

  async checkEmail () {
    this.emailIsFree = await UserService.checkEmailAvailability(this.registrationData.email)
  }

  async submit () {
    this.checkEmail()
    this.genderRequiredError = !this.registrationData.gender || !this.registrationData.gender.value
    this.error = ''

    if (!await this.$validator.validateAll() || !this.emailIsFree) {
      this.$el.querySelector('.error')!.scrollIntoView(false)
      return
    }

    try {
      this.registrationData.locale = LocaleHelper.getUserLocale()
      const registrationData = await UserService.registration({
        ...this.registrationData,
        ...{ gender: this.registrationData.gender ? this.registrationData.gender.value : null }
      })
      await this.$auth.setToken(registrationData)
      await UserService.getUser()

      EventBus.$emit('authorizedComplete')
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
