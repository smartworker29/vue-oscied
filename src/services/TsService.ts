import { BaseApiService } from '@/services/BaseApiService'
import {
  IcoachSkillForm,
  IcoachSkillShortInfo,
  TsNewUserForm,
  TsRateeUser,
  TsRaterUser,
  TsUserDto
} from '@/interfaces'

class TsService extends BaseApiService {
  getUserInfo (tsSurveyId: number, tsCurrentUserId: number) : TsUserDto {
    return this.callMethod('get', `/user/${tsCurrentUserId}/ts/${tsSurveyId}/info/`)
  }

  getRateeInfoById (tsCurrentUserId: number, tsRateeId: number) : TsRateeUser {
    return this.callMethod('get', `/ts/${tsCurrentUserId}/ratee/${tsRateeId}`)
  }

  getRateeList (tsSurveyId: number) : TsRateeUser[] {
    return this.callMethod('get', `/ts/${tsSurveyId}/ratees/`)
  }

  getRaterList (tsRateeId: number) : TsRaterUser[] {
    return this.callMethod('get', `/ts/${tsRateeId}/raters/`)
  }

  getSkillList (tsRateeId: number) : IcoachSkillShortInfo[] {
    return this.callMethod('get', `/ts/${tsRateeId}/skills/`)
  }

  publish (tsCurrentUserId: number, tsRateeId: number) {
    return this.callMethod('post', `/ts/${tsCurrentUserId}/ratee/${tsRateeId}/publish/`)
  }

  addRatee (tsSurveyId: number, tsCurrentUserId: number, ratee: TsNewUserForm) : void {
    return this.callMethod('post', `ts/${tsSurveyId}/${tsCurrentUserId}/ratees/add`, ratee)
  }

  addRater (tsCurrentUserId: number, tsRateeId: number, rater: TsNewUserForm) : void {
    return this.callMethod('post', `ts/${tsCurrentUserId}/${tsRateeId}/raters/add`, rater)
  }

  addSkill (tsCurrentUserId: number, tsRateeId: number, skill: IcoachSkillForm): void {
    return this.callMethod('post', `ts/${tsCurrentUserId}/${tsRateeId}/skills/add`, skill)
  }

  removeRater (tsCurrentUserId: number, tsRateeId: number, tsRater: number) : void {
    return this.callMethod('delete', `ts/${tsCurrentUserId}/${tsRateeId}/${tsRater}/delete`)
  }

  removeSkill (tsCurrentUserId: number, tsRateeId: number, skillId: number): void {
    return this.callMethod('delete', `ts/${tsCurrentUserId}/${tsRateeId}/skill/${skillId}/delete`)
  }

  uploadRatersRatee (tsSurveyId: number) : TsRateeUser[] {
    return this.callMethod('get', `/ts/${tsSurveyId}/ratees/for-rater/`)
  }

  uploadUserRatee (tsSurveyId: number) : TsRateeUser[] {
    return this.callMethod('get', `/ts/${tsSurveyId}/ratees/my/`)
  }
}

export default new TsService()
