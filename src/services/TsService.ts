import { BaseApiService } from '@/services/BaseApiService'
import { TsRateeUser, TsUserDto } from '@/interfaces'

class TsService extends BaseApiService {
  getUser (surveyId: number, userId: number) : TsUserDto {
    return this.callMethod('get', `/user/${userId}/ts/${surveyId}/info/`)
  }

  getRateeList (tsSurveyId: number) : TsRateeUser[] {
    return this.callMethod('get', `/ts/${tsSurveyId}/ratees/`)
  }
}

export default new TsService()
