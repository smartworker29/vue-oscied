export interface IcoachCourse {
  id: number
  title: string
  welcomeMessage: string
  accessCode: string
  defaultLanguage: string
  isPublished: boolean
  logos: IcoachLogo[]
  validFrom: Date | null
  validTo: Date | null
}

export interface IcoachLogo {
  fileName: string
  filePath: string
  fileURL: string
}

export interface IcoachUserInfo {
  id: number
  isAuthorised: boolean
}
