<template>
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
            <!-- <p v-if="!isAuthenticated">{{ $t('please_register') }}</p> -->
            <p class="sign-in-suggestion">Please register or <a @click="displayedForm = 'signIn'">sign in</a> if you are a existing user</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nec enim risus. Mauris efficitur felis lacinia, aliquam mauris a, imperdiet turpis. Morbi fringilla urna eros, at mattis dui sagittis ac. Curabitur eu enim nisl. Nullam ac feugiat sapien. Quisque eu purus ut diam imperdiet viverra sed at nulla. In pharetra hendrerit vestibulum.</p>
            <p>Donec sollicitudin, felis ut posuere aliquam, quam lorem gravida nulla, non tempor dui felis sed magna. Nulla facilisi. Fusce rhoncus faucibus ipsum at blandit. Aenean posuere tellus nec lorem maximus, ut egestas quam varius. Integer vitae nulla consequat, cursus dui non, vestibulum sem. </p>
      </div>
      <div class="auth-forms">
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
  .auth-container {
    min-height: 100vh;
    padding: 50px 80px;
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    @media only screen and (max-width: 768px) {
      padding: 40px 15px;
    }
  }

  .auth-header {
    margin-bottom: 81px;
    display: flex;
    justify-content: space-between;
  }

  .logo {
    width: 181px;
    @media only screen and (max-width: 768px) {
      width: 164px;
    }
  }

  .auth-content {
    display: flex;
    justify-content: space-between
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
    }
  }

  .welcome-sub-title {
    font-size: 24px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
  }

  .welcome-title {
    font-size: 32px;
    margin: 7px 0 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
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

  .form-wrapper {
    overflow: hidden;
    background: #fff;
    border-radius: 23px;
    box-shadow: 0 24px 32px 0 rgba(0, 0, 0, 0.1);
    border: solid 1px #0085cd;
    padding-bottom: 6px;
  }

  .form-switcher {
    background: #e6f3fa;
    padding: 24px 24px 0;
    border-bottom: 1px solid #bdddff;
    @media only screen and (max-width: 768px) {
      display: flex;
      padding: 14px 15px 0;
    }

    button {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      color: #fff;
      background-color: #0085cd;
      font-size: 18px;
      padding: 11px 24px;
      font-weight: 600;
      border: solid 1px #bdddff;
      border-bottom: none;
      position: relative;
      top: 1px;
      &:focus {
        outline: none;
      }
      &.active {
        color: #3d5a80;
        background: #fff;
      }

      @media only screen and (max-width: 768px) {
        width: 100%;
      }
    }
  }

  .form-content {
    padding: 0 21px 24px;
  }

  .form {
    padding-top: 7%;
    overflow: hidden;
    .form-group {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      flex-wrap: wrap;
      align-items: center;

      &:last-child {
        margin-bottom: 20px;
      }

      input {
        font-size: 14px;
        border-radius: 12px;
        width: 100%;
        max-width: 286px;
        padding: 9px 16px;
        background: #ffffff;
        border: solid 1px #d6efff;
        &:focus {
          outline: none;
        }
      }

      .error {
        display: block;
        width: 100%;
      }
    }

    .form-group-select {
      input {
        border: none;
      }
      .multiselect {

        // border: solid 1px #d6efff;
        max-width: 286px;
      }

      .multiselect__tags {
        border-radius: 12px;
        padding: 5px 40px 0 16px;
        min-height: 36px;
        border: solid 1px #d6efff;
      }

      .multiselect__option {
        font-size: 14px;
        padding: 12px 16px;
      }

      .multiselect__option--highlight {
        background: #e6f3fa;
        color: #35495e;
      }

      .multiselect__single {
        font-size: 14px;
        margin: 0;
        padding: 2px 0 0 0;
      }

      .multiselect__content {
        padding-top: 12px;
      }

      .multiselect__content-wrapper {
        top: 27px;
        border: solid 1px #d6efff;
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
        border-top: none;
      }

      .multiselect__placeholder {
        margin-bottom: 1px
      }
      // input {
      //   border: none;
      //   padding: 0;
      //   margin: 0;
      //   width: auto;
      // }

      // .form-select {
      //   width: 100%;
      //   max-width: 286px;
      // }

      // .vs__dropdown-toggle {
      //   border: solid 1px #d6efff;
      //   border-radius: 12px;
      //   padding: 8px 4px;
      // }
    }

    label {
      font-size: 16px;
      color: #071012;
    }
  }

  .btn {
    border-radius: 12px;
    background: #fff;
    border: solid 1px #00cdbf;
    padding: 13px 18px;
  }

  .btn-success {
    color: #fff;
    background-color: #00cdbf;
  }

  .form-actions {
    display: inline-flex;
    margin-top: 6px;
    width: 100%;
    .switch-form {
      font-size: 16px;
      cursor: pointer;
      text-decoration: underline;
      color: #0085cd;
    }
  }

  .form-actions-justified {
    align-items: center;
    justify-content: space-between
  }

  .form-actions-right {
    float: right;
    width: 100%;
    max-width: 286px;
  }

  .sign-in-form {
    .switch-form {
      width: 100%;
      margin-bottom: 21px;
    }
  }

  .wrap {
    flex-wrap: wrap;
  }

</style>
