import store from '@/store'
import IcoachLocalStorageHelper from '@/utils/IcoachLocalStorageHelper'
import dayjs from 'dayjs'
import { IcoachCourse } from '@/interfaces/IcoachInterfaces'

class IcoachHelper {
  completeIcoachSkill (icoachCourseId: number | null, icoachUserId: number | null) : void {
    store.commit('icoach/clearIcoachInfo')
    if (icoachCourseId) {
      IcoachLocalStorageHelper.removeBegunIcoach(icoachCourseId)
    }
    if (icoachUserId) {
      const icoachUserInfo = IcoachLocalStorageHelper.getIcoachUser(icoachUserId)
      if (icoachUserInfo && icoachUserInfo.icoachUserId === null) {
        IcoachLocalStorageHelper.removeIcoachUser(icoachUserId)
      }
    }
  }

  checkIcoachCourse (icoachCourse: IcoachCourse) : void {
    const now = dayjs().format('YYYY-MM-DD')

    if (!icoachCourse || !icoachCourse.validFrom || !icoachCourse.validTo) {
      return
    }

    const from = dayjs(icoachCourse.validFrom).format('YYYY-MM-DD')
    const to = dayjs(icoachCourse.validTo).format('YYYY-MM-DD')

    if (now < from) {
      throw new TypeError('This Icoach is not yet active.')
    }

    if (now > to) {
      throw new TypeError('This Icoach has now expired.')
    }
  }
}

export default new IcoachHelper()
