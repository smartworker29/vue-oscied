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
                    />
              <small class="error">{{ errors.first('firstName') }}</small>
            </div>
            <div class="form-group row" :class="{ 'has-error' : errors.first('lastName') }">
              <label class="col-md-4 col-form-label">{{ $t('last_name') }}</label>
              <input name="lastName"
                     v-validate="'required|max:50'"
                     type="text"
                     :data-vv-as="$t('last_name')"
                     v-model="userDataForm.lastName"
                     class="form-control col-md-8"/>
              <small class="error">{{ errors.first('lastName') }}</small>
            </div>
            <div class="form-group row form-group-select" :class="{ 'has-error' : errors.first('lastName') }">
              <label class="col-md-4 col-form-label">{{ $t('gender') }}</label>
              <multiselect
                v-model="userDataForm.gender"
                :placeholder="$t('select')"
                label="label"
                :searchable="false"
                :show-labels="false"
                :options="genderOptions"
                @select="genderChanged">
              </multiselect>
              <small class="error">{{ errors.first('gender') }}</small>
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
              <small class="error">{{ errors.first('email') }}</small>
            </div>
            <div class="form-group row" :class="{ 'has-error' : errors.first('phone') }">
              <label class="col-md-4 col-form-label">{{ $t('phone_number') }}</label>
              <input name="phone"
                     type="text"
                     v-model="userDataForm.phone"
                     class="form-control col-md-8"/>
              <small class="error">{{ errors.first('phone') }}</small>
            </div>
            <div class="form-group form-group-select" :class="{ 'has-error' : errors.first('locale') }">
              <label class="col-md-4 col-form-label">{{ $t('language') }}</label>
              <language-select v-model="userDataForm.locale"/>
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
                      >
                {{ $t('button_g.cancel') }}
              </button>
              <button class="btn btn-primary btn-primary-active"
                     >
                {{ $t('button_g.update_profile') }}
              </button>
          </div>
      </form>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { LocaleData, UpdateUserData, UpdateUserDataForm, User } from '@/interfaces/UserInterfaces'
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
  genderOptions: Array<any> = []

  userDataForm: UpdateUserDataForm = {
    firstName: '',
    lastName: '',
    locale: '',
    gender: null,
    phone: '',
    email: ''
  }

  availableLocales: LocaleData[] = []
  isUserDataChanged: boolean = false

  async created () : Promise<void> {
    this.user = await UserService.getUser()
    this.genderOptions = [{ label: this.$t('male'), value: 'm' }, { label: this.$t('female'), value: 'f' }]

    this.mapProfileForm()

    this.availableLocales = LocaleHelper.availableLocalesData
  }

  get userUploaded () : boolean {
    return this.userDataForm !== null
  }

  async submit () : Promise<void> {
    this.errors.clear()
    if (!this.userDataForm.gender || !this.userDataForm.gender.value) {
      this.errors.add({
        field: 'gender',
        msg: this.$t('gender_is_required').toString()
      })
    }

    await this.$validator.validateAll()
    if (this.errors.count() !== 0) {
      this.$el.querySelector('.error')!.scrollIntoView(false)
      return
    }

    try {
      const response = await UserService.update(this.user.id,
        { ...this.userDataForm,
          ...{ gender: this.userDataForm.gender ? this.userDataForm.gender.value : null } })

      await this.$auth.setToken(response)

      if (this.userDataForm.locale !== this.user.locale) {
        window.location.reload()
      }

      this.$validator.pause()
      this.errors.clear()
      this.user = await UserService.getUser(true)

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

  handleProfileFormErrors (response: any, userDataForm: UpdateUserDataForm) : void {
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
    this.mapProfileForm()

    this.$validator.pause()
    this.errors.clear()
  }

  mapProfileForm (): void {
    this.userDataForm = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      locale: this.user.locale,
      gender: this.genderOptions.find(g => g.value === this.user.gender),
      phone: this.user.phone,
      email: this.user.email
    }
  }

  genderChanged (selectedOption: any) : void {
    if (!selectedOption) {
      this.errors.add({
        field: 'gender',
        msg: this.$t('gender_is_required').toString()
      })

      return
    }

    if (this.errors.has('gender')) {
      this.errors.remove('gender')
    }
  }
}
</script>
