<template>
  <div class="survey ts-rater-ratee-skill-page">
    <div class="survey-header">
      <h1 class="survey-title">{{ $t('welcome_to_survey', { surveyName: (surveyInfo) ? surveyInfo.title : '' }) }}</h1>
    </div>
    <div class="survey-content">
      <button class="btn btn-primary btn-primary-active" @click="goToList">
        {{ $t('button_g.back') }}
      </button>

      <div class="rater-ratee-wrapper">
        <div class="ratees-block rater-ratee-info" v-if="ratee">
          <h2>{{ $t('who_i_rating') }}</h2>
          <rater-ratee-card :ts-survey-id="tsSurveyId" :raterRatee="ratee" />
        </div>

        <div class="ratees-block skill-block" v-if="skillInfo">
          <h2 class="rater-ratee-skill-title">{{ skillInfo.name }}</h2>
          <span>{{ $t('ts.leave_a_comment_below', { fullName: ratee.fullName }) }}</span>
          <div class="results-block" v-if="skillInfo.status && rating">
            <h3>
              {{ $t('ts.you_have_rated', { fullName: ratee.fullName, score: rating.score, skill: skillInfo.name }) }}
            </h3>
            <div class="skill-comment published-comment">
              <img v-if="user.image.fileURL" :src="user.image.fileURL" class="skill-comment__logo" :alt="rating.comment">
              <img v-else :src="require('@/assets/user.png')" class="skill-comment__logo">
              <div class="skill-comment__content">
              <span class="skill-comment__name">{{ user.firstName }} {{ user.lastName }}</span>
                <div>{{ rating.comment }}</div>
              </div>
            </div>
          </div>
          <div v-else>
            {{ $t('ts.choose_the_rating', { fullName: ratee.fullName, skill: skillInfo.name }) }}
            <form class="form skill-rate-form skill-comment" @submit.prevent="rate" novalidate>
              <range-slider @change-value="updateValues($event)" />
              <label for="comment" class="skill-comment__label">{{ $t('ts.leave_a_comment') }}</label>
              <div class="skill-comment__wrapper">
                <textarea
                  v-model="ratingForm.comment"
                  v-validate="'required'"
                  id="comment"
                  name="comment"
                  class="skill-comment__input"
                />
                <button type="submit" class="btn btn-primary-active skill-comment__submit">{{ $t('button_g.submit') }}</button>
              </div>
              <p class="error" v-if="errors">{{ errors.first('comment') }}</p>
            </form>
          </div>
          <h4>{{ $t('ts.this_skill_in_context') }}</h4>
          <div v-html="skillInfo.skillInContext" />
          <h4>{{ $t('ts.how_to_develop') }}</h4>
          <div v-html="skillInfo.howToDevelop" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import {
  IcoachSkillFullInfo,
  SurveyInfo,
  TsRateeUser,
  TsRaterRateeSkillRating,
  TsRatingForm,
  TsUserDto, User
} from '@/interfaces'
import { Getter } from 'vuex-class'
import RaterRateeCard from '@/components/360/RaterRateeCard.vue'
import TsService from '@/services/TsService'
import RangeSlider from '@/components/common/rangeSlider/RangeSlider.vue'

@Component({
  name: 'RaterRateeSkillPage',
  components: {
    RaterRateeCard,
    RangeSlider
  }
})
export default class RaterRateeSkillPage extends Vue {
  @Prop({ required: true })
  tsSurveyId !: number

  @Prop({ required: true })
  tsRaterRateeId !: number

  @Prop({ required: true })
  skillId !: number

  @Getter('user/currentUser')
  user!: User

  @Getter('ts/getUsers')
  tsUserInfo!: TsUserDto

  @Getter('user/isAuthenticated')
  isAuthenticated!: boolean

  @Getter('survey/getDisplayedBaseSurveyInfo')
  surveyInfo!: SurveyInfo

  ratee: TsRateeUser | null = null
  skillInfo: IcoachSkillFullInfo | null = null
  rating: TsRaterRateeSkillRating | null = null
  ratingForm: TsRatingForm = { comment: '', score: 1 }

  async created () {
    if (!this.isAuthenticated) {
      await this.$router.push({ name: 'notFound' })
    }

    if (!this.ratee) {
      this.ratee = await TsService.getRateeInfoById(this.tsRaterRateeId)
    }

    if (!this.skillInfo) {
      this.skillInfo = await TsService.getSkillInfo(this.tsRaterRateeId, this.skillId)
    }

    if (this.skillInfo && this.skillInfo.status) {
      this.rating = await TsService.getRating(this.tsRaterRateeId, this.skillInfo.id)
    }
  }

  goToList (): void {
    this.$router.push({
      name: 'survey.ts.user.ratee',
      params: {
        tsRaterRateeId: this.tsRaterRateeId.toString()
      }
    })
  }

  updateValues (value: string) {
    this.ratingForm.score = parseInt(value)
  }

  async rate () {
    if (!await this.$validator.validateAll()) {
      return
    }

    try {
      const result = await TsService.addRating(this.tsRaterRateeId, this.skillId, this.ratingForm)

      this.updateRating(result)
    } catch (error) {
      if ('response' in error && error.response.status === 400) {
        this.handleSkillRatingErrors(error.response.data)
      }
    }
  }

  updateRating (rating: TsRatingForm) {
    this.rating = {
      comment: rating.comment,
      score: rating.score.toFixed(2)
    }
    this.ratingForm = {
      score: 1,
      comment: ''
    }

    if (this.skillInfo) {
      this.skillInfo.status = true
    }
  }

  handleSkillRatingErrors (data: object) {
    // todo::add handle logic
  }
}
</script>
