<template>
  <div class="row">
    <div class="col-12 account-sub-form">
      <h2>{{ $t('your_profile') }}</h2>
      <form id="account-form" @submit.prevent="submit()" novalidate v-if="userUploaded">
        <div class="row">
          <div class="col-md-5">
            <div class="form-group row" :class="{ 'has-error' : errors.first('firstName') }">
              <label class="col-md-4 col-form-label">{{ $t('first_name') }}</label>
              <input name="firstName"
                     type="text"
                     v-model="userDataForm.firstName"
                     class="form-control col-md-8"
                     :data-vv-as="$t('first_name')"
                     v-validate="'required|max:50'"
                     @change="isFormChanged = true"/>
              <small class="error">{{ errors.first('firstName') }}</small>
            </div>
          </div>
          <div class="offset-md-1 col-md-5">
            <div class="form-group row" :class="{ 'has-error' : errors.first('email') }">
              <label class="col-md-4 col-form-label">{{ $t('email_address') }}</label>
              <input name="email"
                     v-validate="'required|email'"
                     type="text"
                     :data-vv-as="$t('email_address')"
                     v-model="userDataForm.email"
                     class="form-control col-md-8"
                     @change="isFormChanged = true"/>
              <small class="error">{{ errors.first('email') }}</small>
            </div>
          </div>
        </div>
        <div class="row">
          <div class=" col-md-5">
            <div class="form-group row" :class="{ 'has-error' : errors.first('lastName') }">
              <label class="col-md-4 col-form-label">{{ $t('last_name') }}</label>
              <input name="lastName"
                     v-validate="'required|max:50'"
                     type="text"
                     :data-vv-as="$t('last_name')"
                     v-model="userDataForm.lastName"
                     class="form-control col-md-8"
                     @change="isFormChanged = true"/>
              <small class="error">{{ errors.first('lastName') }}</small>
            </div>
          </div>
          <div class="offset-md-1 col-md-5">
            <div class="form-group row" :class="{ 'has-error' : errors.first('phone') }">
              <label class="col-md-4 col-form-label">{{ $t('phone_number') }}</label>
              <input name="phone"
                     type="text"
                     v-model="userDataForm.phone"
                     class="form-control col-md-8"
                     @change="isFormChanged = true"/>
              <small class="error">{{ errors.first('phone') }}</small>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-5">
            <div class="form-group row" :class="{ 'has-error' : errors.first('gender') }">
              <label class="col-md-4 col-form-label">{{ $t('gender') }}</label>
              <select name="gender"
                      class="form-control col-md-8"
                      v-model="userDataForm.gender"
                      :data-vv-as="$t('gender')"
                      v-validate="'required'"
                      @change="isFormChanged = true">
                <option value="" disabled selected>{{ $t('gender') }}</option>
                <option value="m">{{ $t('male') }}</option>
                <option value="f">{{ $t('female') }}</option>
              </select>
              <small class="error">{{ errors.first('gender') }}</small>
            </div>
          </div>
          <div class="offset-md-1 col-md-5">
            <div class="form-group row" :class="{ 'has-error' : errors.first('locale') }">
              <label class="col-md-4 col-form-label">{{ $t('language') }}</label>
              <select name="locale"
                      class="form-control col-md-8"
                      v-model="userDataForm.locale"
                      :data-vv-as="$t('language')"
                      v-validate="'required'"
                      @change="isFormChanged = true">
                <option v-for="(locale, index) in availableLocales"
                        :value="locale.locale" :key="index">
                  {{ locale.localeName }}
                </option>
              </select>
              <small class="error">{{ errors.first('locale') }}</small>
            </div>
          </div>
        </div>
        <div class="row" v-if="isUserDataChanged">
          <div class=" col-md-12 text-center">
            <div class="alert alert-success" role="alert">{{ $t('profile_successfully_changed') }}</div>
          </div>
        </div>
        <div class="row">
          <div class="offset-md-6 col-md-5 text-right row">
            <button type="reset"
                    class="btn btn-warning col-4"
                    @click.prevent="resetProfileForm()"
                    :disabled="!isFormChanged">
              {{ $t('button_g.cancel') }}
            </button>
            <button type="submit"
                    class="btn btn-success offset-1 col-7"
                    :disabled="!isFormChanged">
              {{ $t('button_g.update_profile') }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { LocaleData, UpdateUserData, User } from '@/interfaces/UserInterfaces'
import LocaleHelper from '@/utils/LocaleHelper'
import UserService from '@/services/UserService'

@Component({})
export default class ProfileForm extends Vue {
  user!: User
  userDataForm: UpdateUserData = {
    firstName: '',
    lastName: '',
    locale: '',
    gender: '',
    phone: '',
    email: ''
  }

  availableLocales: LocaleData[] = []
  isFormChanged: boolean = false
  isUserDataChanged: boolean = false

  async created () : Promise<void> {
    this.user = await UserService.getUser()

    this.userDataForm = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      locale: this.user.locale,
      gender: this.user.gender,
      phone: this.user.phone,
      email: this.user.email
    }

    this.availableLocales = LocaleHelper.availableLocalesData
  }

  get userUploaded () : boolean {
    return this.userDataForm !== null
  }

  async submit () : Promise<void> {
    if (!await this.$validator.validateAll()) {
      this.$el.querySelector('.error')!.scrollIntoView(false)
      return
    }

    try {
      const response = await UserService.update(this.user.id, this.userDataForm)
      await this.$auth.setToken(response)

      if (this.userDataForm.locale !== this.user.locale) {
        window.location.reload()
      }

      this.$validator.pause()
      this.user = await UserService.getUser(true)

      this.isFormChanged = false

      this.isUserDataChanged = true
      setTimeout(() => {
        this.isUserDataChanged = false
      }, 3000)
    } catch (error) {
      if ('response' in error && error.response.status === 400) {
        this.handleProfileFormErrors(error.response.data, this.userDataForm)
      } else {
        throw error
      }
    }
  }

  @Watch('errors.items')
  watchEmailInput () : void {
    if (this.errors.has('email')) {
      this.errors.remove('firstName')
      this.errors.remove('lastName')
      this.errors.remove('phone')
      this.errors.remove('locale')
      this.errors.remove('gender')
    }
  }

  handleProfileFormErrors (response: any, userDataForm: UpdateUserData) : void {
    Object.keys(response.errors).forEach((value: string) => {
      if (userDataForm.hasOwnProperty(value) && value in response.errors && response.errors[value][0]) {
        this.errors.add({
          field: value,
          msg: response.errors[value][0]
        })
      }
    })
  }

  resetProfileForm () : void {
    this.userDataForm = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      locale: this.user.locale,
      gender: this.user.gender,
      phone: this.user.phone,
      email: this.user.email
    }

    this.$validator.pause()
    this.errors.clear()
    this.isFormChanged = false
  }
}
</script>
