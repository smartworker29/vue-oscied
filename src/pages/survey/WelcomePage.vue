<template>
  <div class="container">
    <div class="row">
      <div class="col-8">
        <h1>{{ $t('welcome_to_survey', { surveyName: (surveyInfo) ? surveyInfo.title : '' }) }}</h1>
        <p v-if="!isAuthenticated">{{ $t('please_register') }}</p>
        <p>{{ (surveyInfo) ? surveyInfo.welcomeMessage : '' }}!</p>
      </div>

      <div class="col-4" v-if="!isAuthenticated">
        <div class="language">
          <LangSwitcher/>
        </div>
        <div v-if="displayedForm === 'signIn'" class="sign-form">
          <SignInForm @changeForm="changeForm" @authorizedComplete="authorizedComplete"/>
        </div>
        <div v-else-if="displayedForm === 'signUp'" class="sign-form">
          <SignUpForm @changeForm="changeForm" @authorizedComplete="authorizedComplete"/>
        </div>
      </div>
      <div class="col-4" v-else>
        <button type="button" class="btn btn-warning" @click="beginSurvey">
          {{ isUncompletedSurvey ? $t('button_g.continue_survey') : $t('button_g.start_survey') }}
        </button>
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
