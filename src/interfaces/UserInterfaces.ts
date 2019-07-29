export interface User {
  firstName: string
  lastName: string
  email: string
  gender: string
  phone?: string
}

export interface RegistrationData {
  email: string
  password: {
    first: string
    second: string
  }
  firstName: string
  lastName: string
  gender: string
  phone?: string
}

export interface SignInData {
  email: string
  password: string
}
