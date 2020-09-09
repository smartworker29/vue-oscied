import { BaseApiService } from '@/services/BaseApiService'
import { TsNewUserForm, TsRatee, TsRateeUser, TsRaterUser, TsUserDto } from '@/interfaces'

class TsService extends BaseApiService {
  getUserInfo (tsSurveyId: number, tsCurrentUserId: number) : TsUserDto {
    return this.callMethod('get', `/user/${tsCurrentUserId}/ts/${tsSurveyId}/info/`)
  }

  getRateeInfoById (tsRateeId: number) : TsRatee {
    return this.callMethod('get', `/ts/ratee/${tsRateeId}`)
  }

  getRateeList (tsSurveyId: number) : TsRateeUser[] {
    return this.callMethod('get', `/ts/${tsSurveyId}/ratees/`)
  }

  getRaterList (tsRateeId: number) : TsRaterUser[] {
    return this.callMethod('get', `/ts/${tsRateeId}/raters/`)
  }

  addRatee (tsSurveyId: number, tsCurrentUserId: number, ratee: TsNewUserForm) : void {
    return this.callMethod('post', `ts/${tsSurveyId}/${tsCurrentUserId}/ratees/add`, ratee)
  }

  addRater (tsCurrentUserId: number, tsRateeId: number, rater: TsNewUserForm) : void {
    return this.callMethod('post', `ts/${tsCurrentUserId}/${tsRateeId}/raters/add`, rater)
  }

  removeRater (tsCurrentUserId: number, tsRateeId: number, tsRater: number) : void {
    return this.callMethod('delete', `ts/${tsCurrentUserId}/${tsRateeId}/${tsRater}/delete`)
  }
}

export default new TsService()
