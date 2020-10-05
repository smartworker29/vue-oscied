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

<style lang="scss">
.skill-comment__wrapper {
  display: flex;

  @media screen and (max-width: 768px) {
    flex-wrap: wrap;
  }
}
.skill-comment {
  border: 1px solid #d8efff;
  background: #f7fcff;
  border-radius: 5px;
  margin-top: 30px;
  padding: 22px 23px;

  h4 {
    font-size: 20px;
    margin: 0 0 15px;
    font-weight: 300;
  }

  &__form {
    width: 100%;
  }

  &__input {
    border: 1px solid #d8efff;
    border-radius: 8px;
    padding: 9px 14px;
    background: #fff;
    width: 80%;
    font-size: 14px;
    height: 32px;
    flex: 1;
    color: rgba(7, 16, 18, 0.5);
    @media screen and (max-width: 768px) {
      height: 86px;
      flex: auto;
    }
    &:focus {
      outline: none;
    }
  }

  &__label {
    display: block;
    padding: 20px 0;
  }

  &__submit {
    cursor: pointer;
    float: right;
    border: 1px;
    border-radius: 12px;
    background: #00cdbf;
    padding: 7px 20px;
    color: #fff;
    margin-left: 16px;
    @media screen and (max-width: 768px) {
      width: 100%;
      margin: 16px 0 0;
    }
  }

  &__published-comments {
    border-top: 1px solid #d8efff;
    margin-top: 24px;
    padding-top: 24px;
  }

  &__logo {
    border-radius: 50%;
    width: 48px;
    height: 48px;
    margin-right: 16px;
  }
  &__name {
    color: #0085cd;
  }

  &__content {
    font-size: 14px;
    color: #6a7071;
    div {
      font-size: 16px;
      line-height: 1.5;
      color: #071012;
      font-weight: 300;
    }
  }
}

.published-comment {
  display: flex;
  margin-right: 17px;
  margin-bottom: 25px;
}
</style>
