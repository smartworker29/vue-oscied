<template>
  <div class="auth-container-wrapper">
    <div class="auth-container">
      <div class="auth-content">
        <div class="welcome-info">
          <span class="welcome-sub-title">{{ $t('welcome_to_survey', { surveyName: 'CCR3 Onesource' }) }}</span>
        </div>
        <div class="auth-forms" v-if="!isAuthenticated">
          <div class="form-wrapper">
            <div class="form-content">
              <div v-if="displayedForm === 'request'" class="sign-form">
                <RequestResetPasswordForm />
              </div>
              <div v-else-if="displayedForm === 'reset'" class="sign-form">
                <ResetPasswordForm :email="email" :token="token"/>
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
import ResetPasswordForm from '@/components/login/ResetPasswordForm.vue'
import RequestResetPasswordForm from '@/components/login/RequestResetPasswordForm.vue'

@Component({
  name: 'HomePage',
  components: {
    RequestResetPasswordForm,
    ResetPasswordForm
  }
})
export default class ResetPasswordPage extends Vue {
  @Getter('user/isAuthenticated')
  isAuthenticated!: boolean
  displayedForm: string = 'request'

  @Prop({ default: '' })
  email!: string

  @Prop({ default: '' })
  token!: string

  created () {
    if (this.email && this.token) {
      this.displayedForm = 'reset'
    }
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
    color: #fff;
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
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

  .auth-forms {
    width: 100%;
    max-width: 509px;
  }
</style>
