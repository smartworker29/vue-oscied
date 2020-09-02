import { BaseApiService } from '@/services/BaseApiService'
import { TsUserDto } from '@/interfaces'

class TsService extends BaseApiService {
  getUser (surveyId: number, userId: number) : TsUserDto {
    return this.callMethod('get', `/user/${userId}/ts/${surveyId}/info/`)
  }
}

export default new TsService()
