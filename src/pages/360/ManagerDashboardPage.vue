<template>
  <div class="survey">
    <div class="survey-header">
      <h1 class="survey-title">{{ $t('welcome_to_survey', { surveyName: (surveyInfo) ? surveyInfo.title : '' }) }}</h1>
    </div>
    <div class="survey-content">
      <button class="btn btn-primary btn-primary-active" @click="addNewRatee">
        {{ $t('button_g.add_new_rating_team') }}
      </button>

      <div v-if="rateeList" class="ts-survey-wrapper">
        <div v-for="(ratee, id) in rateeList" :key="id" class="ts-survey-item">
          <img :src="ratee.image.fileURL || require('@/assets/user.png')">
          <div>{{ ratee.fullName }}</div>
          <div>{{ ratee.email }}</div>
          <div v-if="ratee.isLive">
            <button class="btn btn-primary btn-primary-active" @click="review">
              {{ $t('button_g.review') }}
            </button>
            <button class="btn btn-primary btn-primary-active" @click="results">
              {{ $t('button_g.results') }}
            </button>
          </div>
          <button class="btn btn-primary btn-primary-active" @click="setup" v-else>
            {{ $t('button_g.setup') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { SurveyInfo, TsRateeUser, TsUserDto } from '@/interfaces'
import { Getter } from 'vuex-class'
import TsService from '@/services/TsService'
import SurveyService from '@/services/SurveyService'
import SurveyHelper from '@/utils/SurveyHelper'

@Component({
  name: 'ManagerDashboardPage'
})
export default class ManagerDashboardPage extends Vue {
  @Prop()
  tsSurveyId !: number

  @Getter('user/isAuthenticated')
  isAuthenticated!: boolean

  @Getter('survey/getDisplayedBaseSurveyInfo')
  surveyInfo!: SurveyInfo

  @Getter('ts/getUser')
  tsUser!: TsUserDto

  rateeList: TsRateeUser[] = []

  addNewRatee () {}

  async created () {
    if (!this.isAuthenticated) {
      this.$router.push({ name: 'notFound' })
    }

    if (!this.surveyInfo) {
      const something = await SurveyService.getSurveyInfoById(
        SurveyHelper.TS,
        this.tsSurveyId
      )

      this.$store.commit('survey/setTakenSurveyData', {
        productSurveyId: this.tsSurveyId,
        productSurveyType: SurveyHelper.TS,
        surveyInfo: something
      })
    }

    this.rateeList = await TsService.getRateeList(this.tsSurveyId)
  }

  setup () {}

  review () {}

  results () {}
}
</script>

<style lang="scss">
  .ts-survey-wrapper {
    display: flex;
  }

  .ts-survey-item {
    border: 1px solid #d8efff;
    border-radius: 10px;
    padding: 10px;
    margin: 10px;
  }
</style>
