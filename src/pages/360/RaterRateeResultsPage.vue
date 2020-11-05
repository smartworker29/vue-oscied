<template>
  <div class="survey ts-rater-ratee-results-page">
    <div class="survey-header">
      <h1 class="survey-title">{{ $t('welcome_to_survey', { surveyName: (surveyInfo) ? surveyInfo.title : '' }) }}</h1>
    </div>
    <div class="survey-content">
      <button class="btn btn-primary btn-primary-active" @click="goToList">
        {{ $t('button_g.back') }}
      </button>

      <div class="rater-ratee-wrapper">
        <div class="ratees-block user-ratees" v-if="myRatees.length > 0">
          <h2>{{ $t('my_rating') }}</h2>
          <div class="ratee-items">
            <users-ratee-card v-for="ratee in myRatees"
                              :key="ratee.id"
                              :userRatee="ratee"
                              :has-view-my-score="false"
            />
          </div>
        </div>
        <div class="ratees-block results-block" v-if="scores">
          <h2>{{ $t('ts.results.my_results') }}</h2>
          <table>
            <thead>
              <tr>
                <td>{{ $t('ts.results.from') }}</td>
                <td>{{ $t('ts.results.to') }}</td>
                <td>{{ $t('ts.results.avarage_score') }}</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(score, id) in scores" :key="id">
                <td>{{ score.timeCreated | formatDate('D/M/YYYY h:mm a') }}</td>
                <td>{{ score.timeExpiry | formatDate('d/M/YYYY h:mm a') }}</td>
                <td>{{ score.score }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import {
  SurveyInfo,
  TsRateeScore,
  TsRateeUser,
  TsUserDto,
  User
} from '@/interfaces'
import { Getter } from 'vuex-class'
import TsService from '@/services/TsService'
import UsersRateeCard from '@/components/360/UsersRateeCard.vue'

@Component({
  name: 'RaterRateeSkillPage',
  components: {
    UsersRateeCard
  }
})
export default class RaterRateeSkillPage extends Vue {
  @Prop({ required: true })
  tsSurveyId !: number

  @Prop({ required: true })
  tsRaterRateeId !: number

  @Getter('user/currentUser')
  user!: User

  @Getter('ts/getUsers')
  tsUserInfo!: TsUserDto

  @Getter('user/isAuthenticated')
  isAuthenticated!: boolean

  @Getter('survey/getDisplayedBaseSurveyInfo')
  surveyInfo!: SurveyInfo

  myRatees: TsRateeUser[] = []
  scores: TsRateeScore[] = []

  async created () {
    this.myRatees = await TsService.uploadUserRatee(this.tsSurveyId)
    this.scores = await TsService.getRateeScores(this.tsRaterRateeId)
  }

  goToList (): void {
    this.$router.push({
      name: 'survey.ts.dashboard',
      params: {
        tsSurveyId: this.tsSurveyId.toString()
      }
    })
  }
}
</script>
