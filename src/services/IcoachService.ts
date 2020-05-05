import { BaseApiService } from '@/services/BaseApiService'
import {
  IcoachCourse,
  IcoachDashboardInfo,
  IcoachSkill,
  IcoachUserInfo
} from '@/interfaces/IcoachInterfaces'

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

  getIcoachDashboardInfo (icoachAccessCode: string) : IcoachDashboardInfo {
    return this.callMethod(
      'get',
      `/icoach/dashboard/${icoachAccessCode}`
    )
  }

  getIcoachSkillInfo (skillId: number) : IcoachSkill {
    return this.callMethod('get', `/icoach/skill/${skillId}`)
  }

  createIcoachUser (icoachId: number, icoachAccessCode: string) : IcoachUserInfo {
    return this.callMethod(
      'post',
      `/icoach/user/create/`,
      { 'icoachId': icoachId, 'accessCode': icoachAccessCode }
    )
  }
}

export default new IcoachService()
