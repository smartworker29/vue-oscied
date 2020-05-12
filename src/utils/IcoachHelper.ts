import store from '@/store'
import IcoachLocalStorageHelper from '@/utils/IcoachLocalStorageHelper'

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
}

export default new IcoachHelper()
