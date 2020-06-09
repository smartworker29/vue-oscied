<template>
  <div class="auth-container-wrapper">
    <div class="auth-container">
      <!-- <div class="auth-header">
        <img class="logo" :src="require('@/assets/logo-ccr.svg')" />
        <div class="language">
            <LangSwitcher/>
          </div>
      </div> -->
      <div class="auth-content">
        <p class="message" v-if="message">{{ message }}</p>
        <div class="welcome-info">
          <span class="welcome-sub-title">{{ $t('welcome_to_survey', { surveyName: 'CCR3 Onesource' }) }}</span>
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
import LangSwitcher from '@/components/common/layout/LangSwitcher.vue'

@Component({
  name: 'HomePage',
  components: {
    SignInForm,
    SignUpForm,
    LangSwitcher
  }
})
export default class HomePage extends Vue {
  @Getter('user/isAuthenticated')
  isAuthenticated!: boolean
  displayedForm: string = 'signUp'

  @Prop({ default: '' })
  message?: string

  changeForm (formName: string) {
    this.displayedForm = formName
  }

  authorizedComplete () {
    // TODO
  }
}
</script>

<style lang="scss">
  .auth-container-wrapper {
    padding: 3.5% 5.5% 60px 5.5%;
    @media only screen and (max-width: 768px) {
      padding: 3.5% 5.5% 20px 5.5%;
    }
  }
  .auth-container {
    // min-height: 100vh;
    color: #fff;
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
  }

  .auth-header {
    margin-bottom: 81px;
    display: flex;
    justify-content: space-between;
    @media only screen and (max-width: 768px) {
      margin-bottom: 24px;
    }
    @media only screen and (max-width: 576px) {
      margin-top: 10px;
      margin-bottom: 20px;
    }
  }

  .logo {
    width: 181px;
    @media only screen and (max-width: 768px) {
      width: 164px;
    }

    @media only screen and (max-width: 576px) {
      width: 135px
    }
  }

  .auth-content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    @media only screen and (max-width: 600px) {
      .welcome-info {
        max-width: 100%;
      }
    }
  }

  .welcome-info {
    max-width: 52%;
    padding-right: 5%;
    p {
      margin-bottom: 24px;
    }
    a {
      font-weight: 600;
      text-decoration: underline;
      cursor: pointer;
    }
    .sign-in-suggestion {
      margin-bottom: 15px;
      @media only screen and (max-width: 576px) {
        font-size: 14px;
        margin-bottom: 21px;
      }
    }
  }

  .welcome-sub-title {
    font-size: 24px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    @media only screen and (max-width: 576px) {
      font-size: 18px;
    }
  }

  .welcome-title {
    font-size: 32px;
    margin: 7px 0 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    @media only screen and (max-width: 576px) {
      font-size: 24px;
      margin: -2px 0 9px;
    }
  }

  .auth-forms {
    width: 100%;
    max-width: 509px;
  }

  .logo-CCR {
    width: 181px;
    height: 54px;
    object-fit: contain;
    background-color: #ffffff;
  }

  .message {
    width: 100%;
    background: #77bb41;
    margin: -15px 0 10px;
    text-align: center;
    padding: 10px;
    font-size: 20px;
  }

</style>
