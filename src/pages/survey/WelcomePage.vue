<template>
  <div class="survey" v-if="isAuthenticated">
    <div class="survey-header">
      <h1 class="survey-title">{{ $t('welcome_to_survey', { surveyName: (surveyInfo) ? surveyInfo.title : '' }) }}</h1>
    </div>
    <div class="survey-content">
      <p v-html="(surveyInfo) ? surveyInfo.welcomeMessage : ''"></p>
      <button class="btn btn-primary btn-primary-active" @click="beginSurvey">
        {{ isUncompletedSurvey ? $t('button_g.continue_survey') : $t('button_g.start_survey') }}
      </button>
    </div>
  </div>
  <div v-else class="auth-container-wrapper">
    <div class="auth-container">
      <!-- <div class="auth-header">
        <img class="logo" :src="require('@/assets/logo-ccr.svg')" />
        <div class="language">
            <LangSwitcher/>
          </div>
      </div> -->
      <div class="auth-content">
        <div class="welcome-info">
          <h2 class="welcome-title">{{ $t('welcome_to_survey', { surveyName: (surveyInfo) ? surveyInfo.title : '' }) }}</h2>
              <p class="sign-in-suggestion">Please register or <a @click="displayedForm = 'signIn'">sign in</a> if you are a existing user</p>
              <p class="hide-mobile" v-html="(surveyInfo) ? surveyInfo.welcomeMessage : ''"></p>
        </div>
        <div class="auth-forms" v-if="!isAuthenticated">
          <div class="form-wrapper">
            <div class="form-switcher">
              <button @click="displayedForm = 'signUp'" :class="{ 'active': displayedForm === 'signUp' }">Register</button>
              <button @click="displayedForm = 'signIn'" :class="{ 'active': displayedForm === 'signIn' }">Sign in</button>
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
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import SignInForm from '@/components/signIn/SignInForm.vue'
import SignUpForm from '@/components/signUp/SignUpForm.vue'
import LangSwitcher from '@/components/common/layout/LangSwitcher.vue'
import SurveyService from '@/services/SurveyService'
import { ResponseProductSurveyInfo, SurveyInfo, SurveyUser } from '@/interfaces/SurveyInterfaces'
import SurveyLocalStorageHelper from '@/utils/SurveyLocalStorageHelper'
import SurveyHelper from '@/utils/SurveyHelper'
import { EventBus } from '@/main'

@Component({
  components: {
    SignInForm,
    SignUpForm,
    LangSwitcher
  }
})
export default class WelcomePage extends Vue {
  @Getter('user/isAuthenticated')
  isAuthenticated!: boolean

  @Prop({})
  surveyProduct!: string
  @Prop({})
  accessCode!: string

  displayedForm: string = 'signUp'
  surveyInfo: SurveyInfo | null = null
  productSurveyId!: number
  isUncompletedSurvey: boolean = false

  async created () {
    EventBus.$on('authorizedComplete', () => {
      this.beginSurvey()
    })
    try {
      const response: ResponseProductSurveyInfo = await SurveyService.getProductSurveyInfo(
        this.surveyProduct,
        this.accessCode
      )

      this.surveyInfo = response.survey
      this.productSurveyId = response.surveyProductId
      this.isUncompletedSurvey = SurveyLocalStorageHelper.hasBegunSurvey(this.surveyProduct, this.productSurveyId)

      this.$store.commit('survey/setCurrentSurveyData', {
        productSurveyId: this.productSurveyId,
        productSurveyType: this.surveyProduct,
        surveyInfo: this.surveyInfo
      })
    } catch (error) {
      // TODO::add handler to process for errors(go to 404)
      this.$router.push({ name: 'notFound' })
    }
  }

  changeForm (formName: string) {
    this.displayedForm = formName
  }

  async beginSurvey () {
    const surveyUserInfo: SurveyUser | null = await SurveyService.getSurveyUser(
      this.surveyProduct,
      this.productSurveyId,
      this.accessCode
    ) ||
      await SurveyService.createSurveyUser(
        this.surveyProduct,
        this.productSurveyId,
        this.accessCode
      )

    if (!SurveyHelper.isSurveyUserAvailable(surveyUserInfo)) {
      SurveyHelper.completeSurvey(this.surveyProduct, this.productSurveyId, surveyUserInfo.surveyUserId)
      this.$router.push({ name: 'survey.complete' })
      // todo::[m] Add logic for handling completed survey

      return
    }

    this.$store.commit('survey/setCurrentSurveyData', {
      productSurveyId: this.productSurveyId,
      productSurveyType: this.surveyProduct,
      surveyInfo: this.surveyInfo,
      surveyUserInfo: surveyUserInfo
    })

    SurveyLocalStorageHelper.beginSurvey({
      surveyProductType: this.surveyProduct,
      surveyAccessCode: this.accessCode,
      surveyProductId: this.productSurveyId,
      surveyUserId: surveyUserInfo.surveyUserId
    })

    this.$router.push({
      name: 'survey.page.part',
      params: {
        surveyProduct: this.surveyProduct,
        surveyUserId: surveyUserInfo.surveyUserId.toString(),
        sectionNumber: '1'
      }
    })
  }
}
</script>

<style lang="scss">
  .survey {
    background: #fff;
    height: 100%;
    .progress-wrapper.survey-progress {
      @media only screen and (max-width: 768px) {
        display: none;
      }
    }
  }

  .survey-logos {
    display: flex;
    align-items: center;
    margin: 0 24px;
  }

  .survey-logo {
    height: 50px;
    margin-right: 10px;
    @media only screen and (max-width: 768px) {
      width: 100px
    }
    img {
      display: block;
      height: 100%;
    }
  }

  .survey-more {
    color: #0085cd;
    margin-left: 16px;
    @media only screen and (max-width: 768px) {
      display: block;
      width: 100%;
      margin-left: 0px;
      margin-top: 6px;
    }
  }

  .survey-title {
    font-size: 32px;
    font-weight: 300;
    color: #fff;
    display: flex;
    justify-content: space-between;
    @media only screen and (max-width: 768px) {
      margin-bottom: 11px;
    }
    .progress-wrapper {
      display: flex;
      font-size: 12px;
      color: #3d5a80;
      .progress-title {
        color: #fff;
        margin-right: 12px;
      }
    }
  }

  .survey-header {
    background: #0085cd;
    overflow: hidden;
    color: #fff;
    padding: 1% 5.5% 7px 5.5%;
    p {
      margin-bottom: 30px;
    }
  }

  .survey-content {
    color: #071012;
    overflow: hidden;
    padding: 3.1% 39.5% 60px 5.5%;
    @media only screen and (max-width: 1024px) {
      padding: 4.1% 41.5% 60px 3.5%;
    }
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
