<template>
  <div class="survey" v-if="isAuthenticated">
    <div class="survey-header">
      <h1 class="survey-title">{{ $t('welcome_to_survey', { surveyName: (surveyInfo) ? surveyInfo.title : 'CCR3 Onesource' }) }}</h1>
    </div>
    <div class="survey-content" v-if="surveyInfo">
      <p v-html="surveyInfo.welcomeMessage || ''"></p>
      <button class="btn btn-primary btn-primary-active" @click="beginSurvey">
        {{ isUncompletedSurvey ? $t('button_g.continue_survey') : $t('button_g.start_survey') }}
      </button>
    </div>
    <p v-else-if="error">{{ error }}</p>
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
          <p class="sign-in-suggestion"
             v-html="$t('please_register', { signIn: `<a id='${signInLinkId}'>${$t('sign_in').toLowerCase()}</a>` })"
          ></p>
          <p class="hide-mobile" v-html="(surveyInfo) ? surveyInfo.welcomeMessage : ''"></p>
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
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import SignInForm from '@/components/signIn/SignInForm.vue'
import SignUpForm from '@/components/signUp/SignUpForm.vue'
import LangSwitcher from '@/components/common/layout/LangSwitcher.vue'
import SurveyService from '@/services/SurveyService'
import { SurveyInfo, SurveyUserInfo } from '@/interfaces/SurveyInterfaces'
import { MainLogosTypes } from '@/interfaces/GeneralInterfaces'
import SurveyLocalStorageHelper from '@/utils/SurveyLocalStorageHelper'
import SurveyHelper from '@/utils/SurveyHelper'
import { EventBus } from '@/main'
import { SurveyData } from '@/interfaces/LocalStorageInterfaces'

@Component({
  name: 'WelcomePage',
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
  surveyUserInfo!: SurveyUserInfo
  signInLinkId = 'sign-in-link-in-welcome'
  surveyData: SurveyData | null = null
  error: string = ''

  async created () {
    EventBus.$on('authorizedComplete', async () => {
      await this.beginSurvey()
    })
    try {
      const response = await SurveyService.getProductSurveyInfo(
        this.surveyProduct,
        this.accessCode
      )

      SurveyHelper.checkSurveyInfo(response.survey)

      this.surveyInfo = response.survey
      this.productSurveyId = response.surveyProductId
      this.isUncompletedSurvey = SurveyLocalStorageHelper.hasBegunSurvey(this.surveyProduct, this.productSurveyId)

      if (!this.isAuthenticated) {
        EventBus.$emit('languageChanged', this.surveyInfo.defaultLanguage)
      }

      if (this.surveyUserInfo && SurveyLocalStorageHelper.hasSurveyUser(this.surveyProduct, this.surveyUserInfo.surveyUserId)) {
        this.surveyData = SurveyLocalStorageHelper.getSurveyUser(this.surveyProduct, this.surveyUserInfo.surveyUserId)
      }

      if (this.isAuthenticated && !this.isUncompletedSurvey && this.surveyInfo && !this.surveyInfo.isUnlimitedAccess) {
        const completedSurveyUserInfo = await SurveyService.getCompletedSurveyUser(
          this.surveyProduct,
          this.productSurveyId,
          this.accessCode
        )

        if (completedSurveyUserInfo && completedSurveyUserInfo.isCompleted) {
          this.$router.push({ name: 'survey.complete', params: { title: this.surveyInfo.title, reason: 'survey_has_already_passed' } })
          return
        }
      }

      this.$store.commit('survey/setTakenSurveyData', {
        productSurveyId: this.productSurveyId,
        productSurveyType: this.surveyProduct,
        surveyInfo: this.surveyInfo
      })

      this.$store.commit('mainLogo/setLogos', response.survey.logos)
      this.$store.commit('mainLogo/setType', MainLogosTypes.SURVEY_LOGOS)
    } catch (error) {
      // TODO::add handler to process for errors(go to 404)
      if (error instanceof TypeError) {
        this.error = error.message
      } else {
        this.$router.push({ name: 'notFound' })
      }
    }

    let signInLink = document.querySelector(`#${this.signInLinkId}`)
    if (signInLink) {
      signInLink.addEventListener('click', (): void => { this.displayedForm = 'signIn' })
    }
  }

  changeForm (formName: string) {
    this.displayedForm = formName
  }

  async beginSurvey () {
    this.surveyUserInfo = await SurveyService.getSurveyUser(
      this.surveyProduct,
      this.productSurveyId,
      this.accessCode
    ) ||
      await SurveyService.createSurveyUser(
        this.surveyProduct,
        this.productSurveyId,
        this.accessCode
      )

    if (!SurveyHelper.isSurveyUserAvailable(this.surveyUserInfo)) {
      const title = this.surveyData ? this.surveyData.surveyProductTitle : ''
      SurveyHelper.completeSurvey(this.surveyProduct, this.productSurveyId, this.surveyUserInfo.surveyUserId)
      this.$router.push({ name: 'survey.complete', params: { title } })
      // todo::[m] Add logic for handling completed survey
      // todo::[m] I leave these comments there, because logic of the completed survey is not fully described at moment
      return
    }

    this.$store.commit('survey/setTakenSurveyUserId', {
      productSurveyType: this.surveyProduct,
      surveyUserId: this.surveyUserInfo.surveyUserId
    })

    let storageSurveyUserInfo = SurveyLocalStorageHelper.getSurveyUser(
      this.surveyProduct,
      this.surveyUserInfo.surveyUserId
    )
    if (!storageSurveyUserInfo) {
      storageSurveyUserInfo = {
        surveyProductType: this.surveyProduct,
        surveyAccessCode: this.accessCode,
        surveyProductId: this.productSurveyId,
        surveyProductTitle: this.surveyInfo!.title,
        surveyUserId: this.surveyUserInfo.surveyUserId,
        dpSurveyId: null,
        dpChildSurveys: []
      }
    }

    SurveyLocalStorageHelper.beginSurvey(storageSurveyUserInfo)

    if (this.surveyProduct === SurveyHelper.DP) {
      await this.beginDpSurvey()
      return
    }

    this.$router.push({
      name: 'survey.page.part',
      params: {
        surveyProduct: this.surveyProduct,
        surveyUserId: this.surveyUserInfo.surveyUserId.toString(),
        sectionNumber: '1'
      }
    })
  }

  async beginDpSurvey () : Promise<void> {
    const progress = await SurveyService.getDpSurveyProgress(this.surveyUserInfo.surveyUserId)

    if (progress.isCompleted || !progress.nextSurveyPart) {
      const title = this.surveyData ? this.surveyData.surveyProductTitle : ''
      SurveyHelper.completeSurvey(SurveyHelper.DP, this.productSurveyId, this.surveyUserInfo.surveyUserId)
      this.$router.push({ name: 'survey.complete', params: { title } })
      // todo::[m] Add logic for handling completed survey
      // todo::[m] I leave these comments there, because logic of the completed survey is not fully described at moment
      return
    }

    const nextSurveyProductInfo = await SurveyService.getSurveyInfoById(
      progress.nextSurveyPart.product,
      progress.nextSurveyPart.id
    )

    this.$store.commit('survey/setTakenSurveyData', {
      productSurveyId: progress.nextSurveyPart.id,
      productSurveyType: progress.nextSurveyPart.product,
      surveyInfo: nextSurveyProductInfo
    })

    this.$store.commit('mainLogo/setLogos', nextSurveyProductInfo.logos)
    this.$store.commit('mainLogo/setType', MainLogosTypes.SURVEY_LOGOS)

    this.$store.commit('survey/setTakenSurveyUserId', {
      productSurveyType: progress.nextSurveyPart.product,
      surveyUserId: progress.nextSurveyPart.surveyUserId
    })

    SurveyLocalStorageHelper.addDpChildSurveyUser(
      this.surveyUserInfo.surveyUserId,
      progress.nextSurveyPart.product,
      progress.nextSurveyPart.surveyUserId
    )

    this.$router.push({
      name: 'survey.welcome.dp.survey_product',
      params: {
        surveyProduct: progress.nextSurveyPart.product,
        surveyUserId: progress.nextSurveyPart.surveyUserId.toString()
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
