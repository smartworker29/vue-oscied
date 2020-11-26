import { BaseApiService } from '@/services/BaseApiService'
import {
  IcoachSkillForm,
  IcoachSkillFullInfo,
  IcoachSkillShortInfo,
  TsManagerRatingType,
  TsManagerUser,
  TsManagerRating,
  TsManagerRatingAvarageScore,
  TsNewUserForm,
  TsRateeReview,
  TsRateeUser,
  TsRaterRateeSkillRating,
  TsRaterUser,
  TsRatingForm,
  TsUserDto,
  TsUserRole,
  TsRateeRatingResults
} from '@/interfaces'

class TsService extends BaseApiService {
  getUserInfo (tsSurveyId: number, tsCurrentUserId: number) : TsUserDto {
    return this.callMethod('get', `/user/${tsCurrentUserId}/ts/${tsSurveyId}/info/`)
  }

  getRateeInfoById (tsRateeId: number) : TsRateeUser {
    return this.callMethod('get', `/ts/ratees/${tsRateeId}/`)
  }

  getRateeList (tsSurveyId: number) : TsRateeUser[] {
    return this.callMethod('get', `/ts/${tsSurveyId}/ratees/for-manager/`)
  }

  getRaterList (tsRateeId: number) : TsRaterUser[] {
    return this.callMethod('get', `/ts/${tsRateeId}/raters/`)
  }

  getManagerInfo (tsRole: TsUserRole, tsRateeId: number) : TsManagerUser {
    return this.callMethod('get', `/ts/${tsRole}/${tsRateeId}/manager`)
  }

  getSkillList (tsRateeId: number) : IcoachSkillShortInfo[] {
    return this.callMethod('get', `/ts/${tsRateeId}/skills/`)
  }

  getSkillListForUser (tsRateeId: number) : IcoachSkillShortInfo[] {
    return this.callMethod('get', `/ts/${tsRateeId}/skills/for-rater`)
  }

  publish (tsCurrentUserId: number, tsRateeId: number) : TsRateeUser {
    return this.callMethod(
      'put',
      `/ts/${tsCurrentUserId}/ratees/${tsRateeId}/publish/`,
      {},
      null,
      {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }
    )
  }

  addRatee (tsSurveyId: number, tsCurrentManagerId: number, ratee: TsNewUserForm) : TsRateeUser {
    return this.callMethod('post', `ts/${tsSurveyId}/${tsCurrentManagerId}/ratees/add/`, ratee)
  }

  addRater (tsCurrentUserId: number, tsRateeId: number, rater: TsNewUserForm) : TsRaterUser {
    return this.callMethod('post', `ts/${tsCurrentUserId}/${tsRateeId}/raters/add/`, rater)
  }

  addSkill (tsCurrentUserId: number, tsRateeId: number, skill: IcoachSkillForm) : IcoachSkillShortInfo {
    return this.callMethod('post', `ts/${tsCurrentUserId}/${tsRateeId}/skills/add/`, skill)
  }

  removeRater (tsCurrentUserId: number, tsRateeId: number, tsRater: number) : void {
    return this.callMethod('delete', `ts/${tsCurrentUserId}/${tsRateeId}/raters/${tsRater}/delete/`)
  }

  removeSkill (tsCurrentUserId: number, tsRateeId: number, skillId: number): void {
    return this.callMethod('delete', `ts/${tsCurrentUserId}/${tsRateeId}/skills/${skillId}/delete/`)
  }

  uploadRatersRatee (tsSurveyId: number) : TsRateeUser[] {
    return this.callMethod('get', `/ts/${tsSurveyId}/ratees/for-rater/`)
  }

  uploadUserRatee (tsSurveyId: number) : TsRateeUser[] {
    return this.callMethod('get', `/ts/${tsSurveyId}/ratees/my/`)
  }

  getSkillInfo (tsRateeId: number, skillId: number) : IcoachSkillFullInfo {
    return this.callMethod('get', `ts/${tsRateeId}/skills/${skillId}`)
  }

  getRating (tsRateeId: number, skillId: number) : TsRaterRateeSkillRating {
    return this.callMethod('get', `ts/${tsRateeId}/${skillId}/rating`)
  }

  addRating (tsRateeId: number, skillId: number, rating: TsRatingForm) : TsRatingForm {
    return this.callMethod('post', `ts/${tsRateeId}/${skillId}/rating/add/`, { rating })
  }

  getManagerRating (tsRateeId: number, type: TsManagerRatingType) : TsRaterRateeSkillRating|[] {
    return this.callMethod('get', `ts/${tsRateeId}/rating/${type}/`)
  }

  addManagerRating (tsRaterRateeId: number, rating: TsRatingForm, type: TsManagerRatingType) : TsRatingForm {
    return this.callMethod('post', `ts/${tsRaterRateeId}/rating/${type}/add/`, { rating })
  }

  getEverydayRating (tsRateeId: number) : TsRaterRateeSkillRating|[] {
    return this.callMethod('get', `ts/${tsRateeId}/rating/everyday/`)
  }

  addEveryDayRating (tsRaterRateeId: number, rating: TsRatingForm) : TsRatingForm {
    return this.callMethod('post', `ts/${tsRaterRateeId}/rating/everyday/add/`, { rating })
  }

  getManagerRatingAvarageScore (tsRaterRateeId: number, type: TsManagerRatingType) : TsManagerRatingAvarageScore {
    return this.callMethod('get', `ts/${tsRaterRateeId}/rating/${type}/average/`)
  }

  getManagerRatingLastTen (tsRaterRateeId: number, type: TsManagerRatingType) : TsManagerRating[] {
    return this.callMethod('get', `ts/${tsRaterRateeId}/rating/${type}/last/`)
  }

  getRateeReviewsPeriods (tsRaterRateeId: number) : TsRateeReview[] {
    return this.callMethod('get', `ts/${tsRaterRateeId}/reviews/`)
  }

  getRateeReviewsReport (tsRaterRateeId: number, tsRateeReviewId: number) : object {
    return this.callMethod('get', `ts/${tsRaterRateeId}/reviews/${tsRateeReviewId}/`)
  }

  getRateeRatingReviews (tsRaterRateeId: number, tsRateeReviewId: number) : object {
    return this.callMethod('get', `ts/${tsRaterRateeId}/rating-reviews/${tsRateeReviewId}/`)
  }

  getRateeRatingResults (tsRateeId: number) : TsRateeRatingResults {
    return this.callMethod('get', `ts/ratees/${tsRateeId}/reting-results/`)
  }
}

export default new TsService()
