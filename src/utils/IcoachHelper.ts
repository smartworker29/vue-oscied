import store from '@/store'
import IcoachLocalStorageHelper from '@/utils/IcoachLocalStorageHelper'
import dayjs from 'dayjs'
import { IcoachCourse } from '@/interfaces/IcoachInterfaces'
import i18n from '@/i18n'

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

    if (icoachCourse.validFrom) {
      const from = dayjs(icoachCourse.validFrom).format('YYYY-MM-DD')

      if (now < from) {
        throw new TypeError(i18n.t('icoach_is_not_active').toString())
      }
    }

    if (icoachCourse.validTo) {
      const to = dayjs(icoachCourse.validTo).format('YYYY-MM-DD')

      if (now > to) {
        throw new TypeError(i18n.t('icoach_is_expired').toString())
      }
    }
  }
}

export default new IcoachHelper()
