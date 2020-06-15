import { BaseApiService } from '@/services/BaseApiService'
import { DashboardResponse } from '@/interfaces/DashboardInterface'

class DashboardService extends BaseApiService {
  getDashboardItems (): DashboardResponse {
    return this.callMethod('get', `user/dashboard`)
  }
}

export default new DashboardService()
