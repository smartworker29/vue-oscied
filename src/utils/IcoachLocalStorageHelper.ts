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

  private saveIcoachUser (icoachData: IcoachData) : void {
    this.setData(this.getIcoachUserKey(icoachData.icoachUserId), icoachData)
  }

  public beginIcoach (icoachData: IcoachData) : void {
    this.addBegunIcoach(icoachData.icoachCourseId)
    this.saveIcoachUser(icoachData)
  }

  public removeBegunIcoach (icoachCourseId: number) : void {
    const begunIcoachs: number[] | null = this.getData(this.icoachBegun)

    if (!begunIcoachs || !begunIcoachs.includes(icoachCourseId)) {
      return
    }

    const result: number[] = begunIcoachs.filter((storedIcoachId) => { return storedIcoachId !== icoachCourseId })

    this.setData(this.icoachBegun, result)
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

  public removeIcoachUser (icoachUserId: number) : void {
    window.localStorage.removeItem(this.getIcoachUserKey(icoachUserId))
  }
}

export default new IcoachLocalStorageHelper()
