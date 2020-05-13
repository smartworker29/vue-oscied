import { BaseApiService } from '@/services/BaseApiService'
import {
  IcoachCourse,
  IcoachDashboardInfo,
  IcoachSkill,
  IcoachSkillComment,
  IcoachSkillQuestion,
  IcoachSkillScore,
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

  getIcoachSkillQuestions (skillId: number): IcoachSkillQuestion[] {
    return this.callMethod('get', `/icoach/question/${skillId}`)
  }

  getIcoachSkillScore (skillId: number, icoachUserId: number): IcoachSkillScore {
    return this.callMethod('get', `/icoach/score/${skillId}/${icoachUserId}`)
  }

  createIcoachUser (icoachId: number, accessCode: string) : IcoachUserInfo {
    return this.callMethod(
      'post',
      `/icoach/user/create/`,
      { icoachId, accessCode }
    )
  }

  createIcoachSkillComment (icoachId: number, skillId: number, stepId: number, comment: string) : IcoachSkillComment {
    return this.callMethod(
      'post',
      `/icoach/comment/create/`,
      { icoachId, skillId, stepId, comment }
    )
  }

  sendScoreForm (answers: object, skillId: number, icoachUserId: number): IcoachSkillScore {
    return this.callMethod('post',
      '/icoach/score/create/',
      { answers, skillId, icoachUserId }
    )
  }
}

export default new IcoachService()
