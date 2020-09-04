import { BaseApiService } from '@/services/BaseApiService'
import { TsNewRateeForm, TsRateeUser, TsUserDto } from '@/interfaces'

class TsService extends BaseApiService {
  getUserInfo (tsSurveyId: number, tsCurrentUserId: number) : TsUserDto {
    return this.callMethod('get', `/user/${tsCurrentUserId}/ts/${tsSurveyId}/info/`)
  }

  getRateeList (tsSurveyId: number) : TsRateeUser[] {
    return this.callMethod('get', `/ts/${tsSurveyId}/ratees/`)
  }

  addRatee (tsSurveyId: number, tsCurrentUserId: number, ratee: TsNewRateeForm) : void {
    return this.callMethod('post', `ts/${tsSurveyId}/${tsCurrentUserId}/ratees/add`, ratee)
  }
}

export default new TsService()
