export interface File {
  fileURL: string
  filePath: string
  fileName: string
}

export interface Image extends File {}

export enum MainLogosTypes {
  ICOACH_LOGOS = 'icoach',
  SURVEY_LOGOS = 'survey'
}
