<template>
  <form @submit.prevent="submit" novalidate>
    <div class="row">
      <div class="col-md-6">
        <div class="form-group" :class="{'has-error' : errors.first('firstName')}">
          <label>{{ $t('first_name') }}</label>
          <input name="firstName"
                 type="text"
                 v-model="registrationData.firstName"
                 class="form-control"
                 v-validate="'required|max:50'"
                 :data-vv-as="$t('first_name')"/>
          <small class="error">{{ errors.first('firstName') }}</small>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group" :class="{'has-error' : errors.first('lastName')}">
          <label>{{ $t('last_name') }}</label>
          <input name="lastName"
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
        <div class="form-group" :class="{'has-error' : errors.first('lastName')}">
          <label>{{ $t('gender') }}</label>
          <div>
            <div class="form-check-inline">
              <label class="form-check-label">
                <input type="radio"
                       class="form-check-input"
                       name="gender"
                       v-model="registrationData.gender"
                       v-validate="'required'"
                       value="m"
                       :data-vv-as="$t('gender')">{{ $t('male') }}
              </label>
            </div>
            <div class="form-check-inline">
              <label class="form-check-label">
                <input type="radio" class="form-check-input" name="gender" v-model="registrationData.gender" value="f">{{ $t('female') }}
              </label>
            </div>
          </div>
          <small class="error">{{ errors.first('gender') }}</small>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="form-group" :class="{'has-error' : (errors.first('email') || !emailIsFree)}">
          <label>{{ $t('email_address') }}</label>
          <input name="email"
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
    <div class="row" v-if="availableRegistrationFields.includes('phone')">
      <div class="col-md-12">
        <div class="form-group" :class="{'has-error' : errors.first('phone')}">
          <label>{{ $t('phone_number') }}</label>
          <input name="phone"
                 type="text"
                 v-model="registrationData.phone"
                 class="form-control"
                 v-validate="'required'"
                :data-vv-as="$t('phone_number')"/>
          <small class="error">{{ errors.first('phone') }}</small>
        </div>
      </div>
    </div>
    <div class="row">
      <div class=" col-md-6">
        <div class="form-group" :class="{'has-error' : errors.first('plainPassword')}">
          <label>{{ $t('password') }}</label>
          <input name="plainPassword"
                 v-validate="'required|min:8'"
                 :data-vv-as="$t('password')"
                 type="password"
                 ref="password"
                 v-model="registrationData.password.first"
                 class="form-control"/>
          <small class="error">{{ errors.first('plainPassword') }}</small>
        </div>
      </div>
      <div class=" col-md-6">
        <div class="form-group"
             :class="{'has-error' : errors.first('plainPasswordSecond')}">
          <label>{{ $t('password_confirm') }}</label>
          <input name="plainPasswordSecond"
                 v-validate="'required|confirmed:password'"
                 :data-vv-as="$t('password_confirm')"
                 type="password"
                 v-model="registrationData.password.second"
                 class="form-control"/>
          <small class="error">{{ errors.first('plainPasswordSecond') }}</small>
        </div>
      </div>
    </div>
    <div class="row" v-if="error">
      <div class=" col-md-6">
        <p>{{ error }}</p>
      </div>
    </div>
    <div class="row">
      <div class=" col-md-6">
        <button type="submit" class="btn btn-success">{{ $t('button_g.sign_up') }}</button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import UserService from '@/services/UserService'
import { RegistrationData } from '@/interfaces/UserInterfaces'

@Component({})
export default class SignUpForm extends Vue {
  registrationData: RegistrationData = {
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    password: {
      first: '',
      second: ''
    },
    phone: ''
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
      await UserService.registration(this.registrationData)

      this.$router.push({ name: 'signIn' })
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
}
</script>
