<template>
  <div class="survey ts-rater-ratee-skill-page">
    <div class="survey-header">

      <h1 class="survey-title">{{ $t('welcome_to_survey', { surveyName: (surveyInfo) ? surveyInfo.title : '' }) }}</h1>
    </div>
    <div class="survey-content">

      <!-- <button class="btn-back btn btn-primary btn-primary-active" @click="goToList">
        {{ $t('button_g.back') }}
      </button> -->

      <div class="rater-ratee-wrapper">
        <div class="rater-ratee-mobile-wrapper">
          <div class="header">
            <h2>{{ $t("who_i_rating") }}</h2>
            <button class="rater-ratee-expand-nav" @click="toggleRateeMobileNav">
              <span v-if="!rateeMobileNav"></span>
              <span v-if="!rateeMobileNav"></span>
              <span v-if="!rateeMobileNav"></span>
              <fa v-if="rateeMobileNav" class="icon" icon="arrow-up" />
            </button>
          </div>
          <div class="content rater-ratee-info" :class="{'active': rateeMobileNav}">
            <rater-ratee-card :ts-survey-id="tsSurveyId" :raterRatee="ratee" :hasEveryday="hasRoleManager" />
          </div>
        </div>

        <div class="ratees-block rater-ratee-info" v-if="ratee">
          <h2>{{ $t('who_i_rating') }}</h2>
          <rater-ratee-card :ts-survey-id="tsSurveyId" :raterRatee="ratee" />

          <div v-if="myPerformanceManager">
            <h2>{{ $t('my_performance_manager') }}</h2>
            <div class="ratee-items">
              <performance-manager-card :manager="myPerformanceManager" />
            </div>
          </div>
        </div>

        <div class="ratees-block skill-block" v-if="skillInfo">
          <h1 class="rater-ratee-skill-title">{{ skillInfo.name }}</h1>
          <span
            class="rater-ratee-skill-subtitle">{{ $t('ts.leave_a_comment_below', { fullName: ratee.fullName }) }}</span>
          <div class="results-block" v-if="skillInfo.status && rating">
            <h3 class="rater-ratee-skill-form-hint">
              {{ $t('ts.you_have_rated', { fullName: ratee.fullName, score: Math.trunc(rating.score), skill: skillInfo.name }) }}
            </h3>
            <div class="skill-comment published-comment">
              <img v-if="user.image.fileURL" :src="user.image.fileURL" class="skill-comment__logo"
                :alt="rating.comment">
              <img v-else :src="require('@/assets/user.png')" class="skill-comment__logo">
              <div class="skill-comment__content">
                <span class="skill-comment__name">{{ user.firstName }} {{ user.lastName }}</span>
                <div>{{ rating.comment }}</div>
              </div>
            </div>
          </div>
          <div v-else>
            <h3 class="rater-ratee-skill-form-hint">
              {{ $t('ts.choose_the_rating', { fullName: ratee.fullName, skill: skillInfo.name }) }}</h3>

            <form class="form skill-rate-form skill-comment" @submit.prevent="rate" novalidate>

              <select name="rating" class="range-mobile-select custom-select"
              @change-value="updateValues($event)">
                <option selected disabled>Select</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>

              <div class="range-titles">
                <ul>
                  <li>Needs Significant Improvement</li>
                  <li>Needs Improvement</li>
                  <li>Competent</li>
                  <li>A Strength</li>
                  <li>Top Performer</li>
                </ul>
              </div>

              <range-slider @change-value="updateValues($event)" />

              <div class="skill-comment__wrapper">
                <label for="comment" class="skill-comment__label">{{ $t('ts.leave_a_comment') }}</label>
                <textarea v-model="ratingForm.comment" v-validate="'required'" id="comment" name="comment"
                  class="form-control skill-comment__input" rows="5" />
                </div>

               <div class="skill-comment-actions">
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
  TsManagerUser,
  TsRateeUser,
  TsRaterRateeSkillRating,
  TsRatingForm,
  TsUserDto,
  TsUserRole,
  User
} from '@/interfaces'
import { Getter } from 'vuex-class'
import RaterRateeCard from '@/components/360/RaterRateeCard.vue'
import TsService from '@/services/TsService'
import RangeSlider from '@/components/common/rangeSlider/RangeSlider.vue'
import PerformanceManagerCard from '@/components/360/PerformanceManagerCard.vue'

@Component({
  name: 'RaterRateeSkillPage',
  components: {
    RaterRateeCard,
    PerformanceManagerCard,
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

  @Getter('ts/hasRoleRatee')
  hasRoleRatee!: boolean

  @Getter('ts/hasRoleRater')
  hasRoleRater!: boolean

  @Getter('ts/hasRoleManager')
  hasRoleManager!: boolean

  @Getter('survey/getDisplayedBaseSurveyInfo')
  surveyInfo!: SurveyInfo

  ratee: TsRateeUser | null = null
  skillInfo: IcoachSkillFullInfo | null = null
  rating: TsRaterRateeSkillRating | null = null
  ratingForm: TsRatingForm = { comment: '', score: 1 }
  myPerformanceManager: TsManagerUser | null = null
  rateeMobileNav: boolean = false;

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

    await this.uploadMyPerformanceManager()
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

  async toggleRateeMobileNav () {
    this.rateeMobileNav = !this.rateeMobileNav
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

  async uploadMyPerformanceManager () {
    if (this.hasRoleRatee) {
      const currentRatee = this.tsUserInfo.users.find(user => user.role === TsUserRole.RATEE)
      if (!currentRatee) {
        return
      }

      this.myPerformanceManager = await TsService.getManagerInfo(TsUserRole.RATEE, currentRatee.id)
    } else if (this.hasRoleRater) {
      if (!this.ratee) {
        return
      }

      this.myPerformanceManager = await TsService.getManagerInfo(TsUserRole.RATER, this.ratee.id)
    }
  }

  updateRating (rating: TsRatingForm) {
    this.rating = {
      comment: rating.comment,
      score: rating.score
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

<style lang="scss" scoped>
  .survey {
    &-content {
      padding: 0;
      padding-left: 5%;
      padding-bottom: 60px;
      background-color: #fafdff;

      @media screen and (max-width: 768px) {
        padding-left: 0;
      }
    }

    &-header {
      padding: 32px 5% 32px 5%;

      @media screen and (max-width: 768px) {
        padding: 24px 5% 24px 5%;
      }
    }

    &-title {
      margin-top: 0;
      font-size: 24px;
      font-weight: 300;
      color: #ffffff;
    }
  }

  .ratees-block {
    h2 {
      margin-top: 24px;
      font-weight: bold;
    }
  }

  .skill-block {
    background: #fff;
    padding: 32px 20% 32px 24px;

  //  @media screen and (max-width: 1200px) {
  //      padding-right: 5%;
  // }

  @media screen and (max-width: 768px) {
       padding: 32px 5% 32px 5%;
  }

    .rater-ratee-skill-title {
      font-size: 32px;
      font-weight: 600;
      color: #3d5a80;
    }

    .rater-ratee-skill-subtitle {
    margin: 24px 0 40px;
    font-size: 16px;
    line-height: 1.5;
    color: #071012;
    }

    .rater-ratee-skill-form-hint {
      margin: 40px 0 0;
      font-size: 20px;
      font-weight: 500;
      line-height: 1.4;
      color: #071012;
      font-weight: bold;
    }

  .skill-comment__label {
    margin: 40px 0 16px 0;
    padding: 0;
    font-size: 20px;
    line-height: 1.4;
    color: #071012;
  }

  .skill {
    &-comment {
      margin-bottom: 40px;
      border: solid 1px #d6efff;
      padding: 32px 24px 24px;

     @media screen and (max-width: 768px) {
       padding: 5%;
    }

      .error {
        margin: 0;
      }

      .range-mobile-select {
        display: none;
        width: 100%;
        border-radius: 12px;
        border: solid 1px #d6efff;
        background-color: #ffffff;
        padding: 8px 14px 8px 16px;
        outline: none;
        background: #fff url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgIHZpZXdCb3g9IjAgMCAyNCAyNCI+CiAgICA8cGF0aCBmaWxsPSIjMDA4NWNkIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAxNC43ODhMNi44OTcgOS4xN2MtLjE5Ny0uMjE3LS41MjYtLjIyNi0uNzM0LS4wMi0uMjA5LjIwNS0uMjE4LjU0OC0uMDIuNzY1bDUuMyA1LjgzOGMuMTQ1LjE2LjM0Ny4yNDguNTU3LjI0OC4yMSAwIC40MTEtLjA4OS41NTYtLjI0OGw1LjMwMi01LjgzOGMuMTk3LS4yMTcuMTg4LS41Ni0uMDItLjc2Ni0uMjEtLjIwNS0uNTM4LS4xOTYtLjczNS4wMjFMMTIgMTQuNzl6Ii8+Cjwvc3ZnPgo=') no-repeat right 0.75rem center/24px 24px;
      }

      .range-titles {
        margin-bottom: 16px;
          ul {
            display: flex;
            justify-content: space-between;
            align-items: center;
            li {
              max-width: 80px;
              font-size: 12px;
              color: #071012;
            }
          }
          @media screen and (max-width: 768px) {
            display: none;
        }
      }

         @media screen and (max-width: 768px) {

           .range-container {
              display: none;
          }

          .range-mobile-select {
              display: block;
          }
        }
    }

    &-comment__wrapper {
    display: block;
  }

    &-comment__input {
      width: 100%;
      margin-bottom: 16px;
    }

    &-comment-actions {
      display: flex;
      justify-content: flex-end;
    }

  &-comment__submit {
      float: none;
      padding: 7px 16px;
      font-size: 16px;
      font-weight: 500;
    }
  }

  }

  .btn-back {
    margin-top: 24px;
  }

    .ts-rater-ratee-skill-page {

    .rater-ratee-wrapper {

      .rater-ratee-card {
        border-radius: 12px;
        padding: 24px;
        box-sizing: border-box;
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.05);
        border: solid 1px #e6f3fa;
        background-color: #ffffff;

        .actions {
          .btn-primary-active {
            border-radius: 8px;
            background-color: #0085cd;
          }
        }
      }

      .rater-ratee-skills {

        padding-left: 24px;
        padding-right: 80px;
        background: #fff;

        @media screen and (max-width: 768px) {
          padding-left: 5%;
          padding-right: 5%;
        }

        .rater-ratee-skill-title {
          padding-top: 40px;
          font-family: "CerebriSans", sans-serif;
          font-size: 24px;
          font-weight: 600;
          color: #3d5a80;

          @media screen and (max-width: 768px) {
            font-size: 20px;
          }
        }

        .rater-ratee-skill-card-wrapper {
          padding: 27px 0;
        }
      }
    }
  }

.rater-ratee-mobile-wrapper {
    position: relative;
    z-index: 9999;
    padding: 16px 5% 18px 5%;
    background-color: #fafdff;
    display: none;

    box-shadow: 0 9px 16px 0 rgba(0, 0, 0, 0.15);

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    h2 {
      font-size: 20px;
      font-weight: bold;
      margin: 0;
    }

    .content {
      display: none;
      padding-top: 5%;
      padding-bottom: 5%;
      background-color: #fafdff;
      position: relative;

      &.active {
        display: block;
      }
    }

    .rater-ratee-expand-nav {
      width: 28px;
      height: 28px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: 16px;
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.08);
      border: solid 1px #d6efff;
      background-color: #ffffff;
      outline: none;
      z-index: 999;

      span {
        display: block;
        width: 12px;
        height: 2px;
        background-color: #0085cd;

        &:not(:last-of-type) {
          margin-bottom: 2px;
        }
      }

      .icon {
        color: #0085cd;
      }
    }
  }

  @media screen and (max-width: 768px) {
    .rater-ratee-info {
      display: none;
    }

    .rater-ratee-mobile-wrapper {
      display: block;
    }
  }

</style>
