import { BaseApiService } from '@/services/BaseApiService'
import {
  IcoachCourse,
  IcoachDashboardInfo,
  IcoachSkill,
  IcoachSkillComment,
  IcoachUserInfo
} from '@/interfaces/IcoachInterfaces'

class IcoachService extends BaseApiService {
  getIcoachCourseInfo (accessCode: string) : IcoachCourse {
    return this.callMethod('get', `/public/icoach/access-code/${accessCode}/`)
  }

  getIcoachUser (icoachId: number, accessCode: string) : IcoachUserInfo {
    return this.callMethod(
      'post',
      `/icoach/user/get/`,
      { icoachId, accessCode }
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

  getIcoachSkillComments (skillId: number, stepId: number, userId: number): IcoachSkillComment[] {
    return this.callMethod('get', `/icoach/comment/${userId}/${skillId}/${stepId}`)
  }

  createIcoachUser (icoachId: number, accessCode: string) : IcoachUserInfo {
    return this.callMethod(
      'post',
      `/icoach/user/create/`,
      { icoachId, accessCode }
    )
  }

  createIcoachSkillComment (icoachId: number, skillId: number, stepId: number, comment: string) : IcoachUserInfo {
    return this.callMethod(
      'post',
      `/icoach/comment/create/`,
      { icoachId, skillId, stepId, comment }
    )
  }
}

export default new IcoachService()
