<template>
  <div class="survey">
    <div class="survey-header">
      <h1 class="survey-title">{{ $t('welcome_to_survey', { surveyName: (surveyInfo) ? surveyInfo.title : '' }) }}</h1>
    </div>
    <div class="survey-content">
      <p v-if="!isAuthenticated">{{ $t('please_register') }}</p>
      <p>{{ (surveyInfo) ? surveyInfo.welcomeMessage : '' }}!</p>
      <button v-if="isAuthenticated" class="btn btn-primary btn-primary-active" @click="beginSurvey">
        {{ isUncompletedSurvey ? $t('button_g.continue_survey') : $t('button_g.start_survey') }}
      </button>
      <div class="auth-forms" v-if="!isAuthenticated">
        <div class="language">
          <LangSwitcher/>
        </div>
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
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import SignInForm from '@/components/signIn/SignInForm.vue'
import SignUpForm from '@/components/signUp/SignUpForm.vue'
import LangSwitcher from '@/components/common/layout/LangSwitcher.vue'
import SurveyService from '@/services/SurveyService'
import { ResponseProductSurveyInfo, SurveyInfo } from '@/interfaces/SurveyInterfaces'
import SurveyHelper from '@/utils/SurveyHelper'

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
    try {
      const response: ResponseProductSurveyInfo = await SurveyService.getProductSurveyInfo(
        this.surveyProduct,
        this.accessCode
      )

      this.surveyInfo = response.survey
      this.productSurveyId = response.surveyProductId
      this.isUncompletedSurvey = SurveyHelper.hasUncompletedSurvey(this.surveyProduct, this.productSurveyId)
    } catch (error) {
      console.log(error)// TODO::add handler to process for errors(go to 404)
    }
  }

  changeForm (formName: string) {
    this.displayedForm = formName
  }

  authorizedComplete () {
    if (this.isAuthenticated) {
      // TODO
    }
    this.beginSurvey()
  }

  beginSurvey () {
    this.$store.commit('survey/setCurrentSurveyData', {
      productSurveyId: this.productSurveyId,
      productSurveyType: this.surveyProduct,
      surveyInfo: this.surveyInfo
    })

    SurveyHelper.setCurrentSurveyData(
      this.surveyProduct,
      this.accessCode,
      this.productSurveyId
    )

    this.$router.push({
      name: 'survey.page.part',
      params: {
        surveyProduct: this.surveyProduct,
        surveyProductId: this.productSurveyId.toString(),
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
  }

  .survey-more {
    color: #0085cd;
    margin-left: 16px;
  }

  .survey-title {
    font-size: 32px;
    font-weight: 300;
    color: #071012;
    display: flex;
    justify-content: space-between;
    .progress-wrapper {
      display: flex;
      font-size: 12px;
      color: #3d5a80;
      .progress-title {
        margin-right: 12px;
      }
    }
  }

  .survey-header {
    background: #e6f3fa;
    padding: 1% 5.5% 7px 5.5%;
    p {
      margin-bottom: 30px;
      color: #071012;
    }
  }

  .survey-content {

  }

  .survey-content {
    color: #071012;
    overflow: hidden;
    padding: 3.1% 39.5% 60px 5.5%;
    h2 {
      font-size: 20px;
      font-weight: 300;
      margin: 0 0 30px 0;
    }
    p {
      margin-bottom: 30px;
    }
  }
</style>
