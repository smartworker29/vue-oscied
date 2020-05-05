<template>
  <div class="icoach" v-if="isAuthenticated">
    <div class="icoach-header">
      <h1 class="icoach-title">{{ $t('welcome_to_icoach', { icoachName: (icoachCourse) ? icoachCourse.title : 'CCR3 Onesource' }) }}</h1>
    </div>
    <div class="icoach-content">
      <p v-html="(icoachCourse) ? icoachCourse.welcomeMessage : ''"></p>
      <button class="btn btn-primary btn-primary-active" @click="beginIcoach">
        {{ $t('button_g.start_icoach') }}
      </button>
    </div>
  </div>
  <div v-else class="auth-container-wrapper">
    <div class="auth-container">
      <div class="auth-content">
        <div class="welcome-info">
          <h2 class="welcome-title">{{ $t('welcome_to_icoach', { icoachName: (icoachCourse) ? icoachCourse.title : '' }) }}</h2>
          <p class="sign-in-suggestion"
             v-html="$t('please_register', { signIn: `<a id='${signInLinkId}'>${$t('sign_in').toLowerCase()}</a>` })"
          ></p>
          <p class="hide-mobile" v-html="(icoachCourse) ? icoachCourse.welcomeMessage : ''"></p>
        </div>
        <div class="auth-forms" v-if="!isAuthenticated">
          <div class="form-wrapper">
            <div class="form-switcher">
              <button @click="displayedForm = 'signUp'" :class="{ 'active': displayedForm === 'signUp' }">{{ $t('register') }}</button>
              <button @click="displayedForm = 'signIn'" :class="{ 'active': displayedForm === 'signIn' }">{{ $t('sign_in') }}</button>
            </div>
            <div class="form-content">
              <div v-if="displayedForm === 'signIn'" class="sign-form">
                <SignInForm @changeForm="changeForm"/>
              </div>
              <div v-else-if="displayedForm === 'signUp'" class="sign-form">
                <SignUpForm @changeForm="changeForm"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import SignInForm from '@/components/signIn/SignInForm.vue'
import SignUpForm from '@/components/signUp/SignUpForm.vue'
import { EventBus } from '@/main'
import { IcoachCategoriesEnum, IcoachCourse, IcoachUserInfo } from '@/interfaces/IcoachInterfaces'
import IcoachService from '@/services/IcoachService'
import IcoachLocalStorageHelper from '@/utils/IcoachLocalStorageHelper'

@Component({
  components: {
    SignInForm,
    SignUpForm
  }
})
export default class WelcomePage extends Vue {
  @Getter('user/isAuthenticated')
  isAuthenticated!: boolean

  @Prop({})
  accessCode!: string

  displayedForm: string = 'signUp'
  icoachUserInfo!: IcoachUserInfo
  icoachCourse: IcoachCourse | null = null
  signInLinkId = 'sign-in-link-in-welcome'

  async created () {
    EventBus.$on('authorizedComplete', async () => {
      await this.beginIcoach()
    })

    try {
      this.icoachCourse = await IcoachService.getIcoachCourseInfo(this.accessCode)
    } catch (error) {
      this.$router.push({ name: 'notFound' })
    }

    let signInLink = document.querySelector(`#${this.signInLinkId}`)
    if (signInLink) {
      signInLink.addEventListener('click', (): void => { this.displayedForm = 'signIn' })
    }
  }

  async beginIcoach () {
    this.icoachUserInfo = await IcoachService.getIcoachUser(
      this.icoachCourse!.id,
      this.accessCode
    ) || await IcoachService.createIcoachUser(
      this.icoachCourse!.id,
      this.accessCode
    )

    this.$store.commit('icoach/setIcoachInfo', {
      'userId': this.icoachUserInfo.id,
      'icoachCourse': this.icoachCourse
    })

    let storageIcoachUserInfo = IcoachLocalStorageHelper.getIcoachUser(
      this.icoachUserInfo.id
    )
    if (!storageIcoachUserInfo) {
      storageIcoachUserInfo = {
        icoachAccessCode: this.accessCode,
        icoachCourseId: this.icoachCourse!.id,
        icoachUserId: this.icoachUserInfo.id,
        icoachCourseTitle: this.icoachCourse!.title,
        icoachSkillCategoryId: IcoachCategoriesEnum.SOFT_SKILLS
      }
    }

    IcoachLocalStorageHelper.beginIcoach(storageIcoachUserInfo)

    this.$router.push({
      name: 'icoach.dashboard',
      params: {
        icoachUserId: this.icoachUserInfo.id.toString()
      }
    })
  }

  changeForm (formName: string) {
    this.displayedForm = formName
  }
}
</script>

<style lang="scss">
  .icoach {
    background: #fff;
    height: 100%;
  }

  .icoach-title {
    font-size: 32px;
    font-weight: 300;
    color: #fff;
    display: flex;
    justify-content: space-between;
    @media only screen and (max-width: 768px) {
      margin-bottom: 11px;
    }
  }

  .icoach-header {
    background: #0085cd;
    overflow: hidden;
    color: #fff;
    padding: 1% 5.5% 7px 5.5%;
    p {
      margin-bottom: 30px;
    }
  }

  .icoach-content {
    color: #071012;
    overflow: hidden;
    padding: 3.1% 10% 60px 5.5%;
    @media only screen and (max-width: 768px) {
      padding: 12px 12px 1px 10px;
      .btn {
        width: 100%;
      }
    }
    h2 {
      font-size: 20px;
      font-weight: 300;
      margin: 0 0 30px 0;
    }
    p {
      margin-bottom: 30px;
      @media only screen and (max-width: 768px) {
        margin-bottom: 19px;
      }
    }
  }
</style>
