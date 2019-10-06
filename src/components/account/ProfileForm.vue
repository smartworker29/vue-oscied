<template>
    <div>
      <h2>{{ $t('your_profile') }}</h2>
      <form id="account-form" class="form wrap space-between account-form" @submit.prevent="submit()" novalidate v-if="userUploaded">
          <div class="form-half">
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
            <div class="form-group row form-group-select">
              <label class="col-md-4 col-form-label">{{ $t('gender') }}</label>
              <multiselect
                v-model="userDataForm.gender"
                :placeholder="'Select'"
                :searchable="false"
                :show-labels="false"
                :options="genderOption">
              </multiselect>
            </div>
          </div>
          <div class="form-half">
            <div class="form-group" :class="{'has-error' : errors.first('email')}">
              <label for="">Email address</label>
              <input name="email"
                type="text"
                v-model="userDataForm.email"
                class="form-control"
                v-validate="'required'"
                :data-vv-as="$t('email_address')"/>
            </div>
            <div class="form-group row" :class="{ 'has-error' : errors.first('phone') }">
              <label class="col-md-4 col-form-label">{{ $t('phone_number') }}</label>
              <input name="phone"
                     type="text"
                     v-model="userDataForm.phone"
                     class="form-control col-md-8"
                     @change="isFormChanged = true"/>
              <small class="error">{{ errors.first('phone') }}</small>
            </div>
            <div class="form-group form-group-select" :class="{ 'has-error' : errors.first('locale') }">
              <label class="col-md-4 col-form-label">{{ $t('language') }}</label>
              <language-select />
              <!-- <select name="locale"
                      class="form-control col-md-8"
                      v-model="userDataForm.locale"
                      :data-vv-as="$t('language')"
                      v-validate="'required'"
                      @change="isFormChanged = true">
                <option v-for="(locale, index) in availableLocales"
                        :value="locale.locale" :key="index">
                  {{ locale.localeName }}
                </option>
              </select> -->
              <small class="error">{{ errors.first('locale') }}</small>
            </div>
          </div>
          <div class="row" v-if="isUserDataChanged">
            <div class=" col-md-12 text-center">
              <div class="alert alert-success" role="alert">{{ $t('profile_successfully_changed') }}</div>
            </div>
          </div>
          <div class="full-width flex-end account-form-actions">
              <button class="btn btn-primary"
                      @click.prevent="resetProfileForm()"
                      :disabled="!isFormChanged">
                {{ $t('button_g.cancel') }}
              </button>
              <button class="btn btn-primary btn-primary-active"
                      :disabled="!isFormChanged">
                {{ $t('button_g.update_profile') }}
              </button>
          </div>
      </form>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { LocaleData, UpdateUserData, User } from '@/interfaces/UserInterfaces'
import LocaleHelper from '@/utils/LocaleHelper'
import UserService from '@/services/UserService'
import LanguageSelect from '@/components/form/LanguageSelect.vue'

@Component({
  components: {
    LanguageSelect
  }
})
export default class ProfileForm extends Vue {
  user!: User
  genderOption: Array<any> = []

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

    this.genderOption = [this.$t('male'), this.$t('female')]
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

  async changedEmailInput () : Promise<void> {
    this.isFormChanged = true
    await this.$validator.validateAll()
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
