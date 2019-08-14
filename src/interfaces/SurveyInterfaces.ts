export interface Statement {
  id: number
  title: string
}

export interface Section {
  title: string
  instructions: string
  statements: Statement[]
}

export interface Survey {
  sections: Section[]
}
