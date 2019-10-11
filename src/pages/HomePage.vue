<template>
  <div class="auth-container-wrapper">
    <div class="auth-container">
      <div class="auth-header">
        <img class="logo" :src="require('@/assets/logo-ccr.svg')" />
        <div class="language">
            <LangSwitcher/>
          </div>
      </div>
      <div class="auth-content">
        <div class="welcome-info">
          <span class="welcome-sub-title">Welcome</span>
          <h2 class="welcome-title">Survey name</h2>
              <p class="sign-in-suggestion" v-if="!isAuthenticated">Please register or <a @click="displayedForm = 'signIn'">sign in</a> if you are a existing user</p>
              <p class="hide-mobile">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nec enim risus. Mauris efficitur felis lacinia, aliquam mauris a, imperdiet turpis. Morbi fringilla urna eros, at mattis dui sagittis ac. Curabitur eu enim nisl. Nullam ac feugiat sapien. Quisque eu purus ut diam imperdiet viverra sed at nulla. In pharetra hendrerit vestibulum.</p>
              <p class="hide-mobile">Donec sollicitudin, felis ut posuere aliquam, quam lorem gravida nulla, non tempor dui felis sed magna. Nulla facilisi. Fusce rhoncus faucibus ipsum at blandit. Aenean posuere tellus nec lorem maximus, ut egestas quam varius. Integer vitae nulla consequat, cursus dui non, vestibulum sem. </p>
        </div>
        <div class="auth-forms" v-if="!isAuthenticated">
          <div class="form-wrapper">
            <div class="form-switcher">
              <button @click="displayedForm = 'signUp'" :class="{ 'active': displayedForm === 'signUp' }">Register</button>
              <button @click="displayedForm = 'signIn'" :class="{ 'active': displayedForm === 'signIn' }">Sign in</button>
            </div>
            <div class="form-content">
              <div v-if="displayedForm === 'signIn'" class="sign-form">
                <SignInForm @changeForm="changeForm" @authorizedComplete="authorizedComplete"/>
              </div>
              <div v-else-if="displayedForm === 'signUp'" class="sign-form">
                <SignUpForm @changeForm="changeForm" @authorizedComplete="authorizedComplete"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import SignInForm from '@/components/signIn/SignInForm.vue'
import SignUpForm from '@/components/signUp/SignUpForm.vue'
import LangSwitcher from '@/components/common/layout/LangSwitcher.vue'

@Component({
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
    @media only screen and (max-width: 600px) {
      flex-wrap: wrap;
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

</style>
