import { IcoachData } from '@/interfaces/LocalStorageInterfaces'
import { IcoachCategories } from '@/interfaces/IcoachInterfaces'

class IcoachLocalStorageHelper {
  private readonly icoach = 'icoach'
  private readonly icoachBegun = 'begun_icoach'

  private setData (key: string, data: any) : void {
    window.localStorage.setItem(key, JSON.stringify(data))
  }

  private getData (key: string) : any {
    const data: string | null = window.localStorage.getItem(key)
    return data !== null ? JSON.parse(data) : null
  }

  private getIcoachUserKey (icoachUserId: number) : string {
    return `s_${this.icoach}_${icoachUserId}`
  }

  private addBegunIcoach (icoachCourseId: number) : void {
    let begunIcoachs: number[] | null = this.getData(this.icoachBegun)

    if (begunIcoachs === null) {
      begunIcoachs = []
    }

    begunIcoachs.push(icoachCourseId)
    this.setData(this.icoachBegun, begunIcoachs)
  }

  private saveIcoachUser(icoachData: IcoachData) : void {
    this.setData(this.getIcoachUserKey(icoachData.icoachUserId), icoachData)
  }

  public beginIcoach (icoachData: IcoachData) : void {
    this.addBegunIcoach(icoachData.icoachCourseId)
    this.saveIcoachUser(icoachData)
  }

  public hasIcoachUser (icoachUserId: number) : boolean {
    return window.localStorage.getItem(this.getIcoachUserKey(icoachUserId)) !== null
  }

  public getIcoachUser (icoachUserId: number) : IcoachData | null {
    return this.getData(this.getIcoachUserKey(icoachUserId))
  }

  public updateCurrentCategory (icoachUserId: number, icoachSkillCategoryId: IcoachCategories): void {
    let icoachCurrentData: IcoachData = this.getData(this.getIcoachUserKey(icoachUserId))
    icoachCurrentData.icoachSkillCategoryId = icoachSkillCategoryId

    this.setData(this.getIcoachUserKey(icoachUserId), icoachCurrentData)
  }
}

export default new IcoachLocalStorageHelper()
