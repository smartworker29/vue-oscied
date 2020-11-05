import { BaseApiService } from '@/services/BaseApiService'
import {
  IcoachSkillForm,
  IcoachSkillFullInfo,
  IcoachSkillShortInfo,
  TsManagerRatingType,
  TsManagerUser,
  TsNewUserForm,
  TsRateeScore,
  TsRateeUser,
  TsRaterRateeSkillRating,
  TsRaterUser,
  TsRatingForm,
  TsUserDto
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

  getRateeManagerInfo (tsRateeId: number) : TsManagerUser {
    return this.callMethod('get', `/ts/${tsRateeId}/manager`)
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

  getRateeScores (tsRaterRateeId: number) : TsRateeScore[] {
    return this.callMethod('get', `ts/${tsRaterRateeId}/scores/`)
  }
}

export default new TsService()
