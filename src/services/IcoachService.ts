import { BaseApiService } from '@/services/BaseApiService'
import { IcoachCourse, IcoachUserInfo } from '@/interfaces/IcoachInterfaces'

class IcoachService extends BaseApiService {
  getIcoachCourseInfo (accessCode: string) : IcoachCourse {
    return this.callMethod('get', `/public/icoach/access-code/${accessCode}/`)
  }

  getIcoachUser (icoachId: number, icoachAccessCode: string) : IcoachUserInfo {
    return this.callMethod(
      'post',
      `/icoach/user/get/`,
      { 'icoachId': icoachId, 'accessCode': icoachAccessCode }
    )
  }
}

export default new IcoachService()
