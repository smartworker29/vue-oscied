import store from '@/store'
import { BaseApiService } from '@/services/BaseApiService'
import {
  User,
  RegistrationData,
  SignInData,
  UpdatePasswordData,
  UpdateUserData,
  ResetPasswordData,
  RequestResetPasswordData
} from '@/interfaces/UserInterfaces'

class UserService extends BaseApiService {
  checkEmailAvailability (email: string) : boolean {
    return this.callMethod('get', '/public/check-email-availability', {},
      'available', { params: { email } })
  }

  getAvailableRegistrationFields () : string[] {
    return this.callMethod('get', '/public/registration-fields', {}, 'fields')
  }

  async getUser (hard: boolean = false) : Promise<User> {
    if (store.getters['user/currentUser'] && hard !== true) {
      return store.getters['user/currentUser']
    }

    const response = await this.api.get('/me')
    store.commit('user/setUser', response.data)
    store.commit('user/setIsAuthenticated', true)

    return response.data
  }

  logout () : void {
    store.commit('user/logout')
  }

  registration (regData: RegistrationData) : object {
    return this.callMethod('post', '/public/registration', { registrationForm: regData })
  }

  signIn (signInData: SignInData) : string {
    return this.callMethod('post', '/login_check', signInData, 'token')
  }

  update (userId: number, userData: UpdateUserData) : User {
    return this.callMethod('put', `/user/${userId}`, { updateUserDataForm: userData })
  }

  changePassword (userId: number, passwordData: UpdatePasswordData) {
    return this.callMethod(
      'post',
      `/user/${userId}/change_password`,
      { updatePasswordForm: passwordData }
    )
  }

  requestResetPassword (passwordData: RequestResetPasswordData): boolean {
    return this.callMethod('post', '/public/request-reset-password', { passwordRequestForm: passwordData })
  }

  resetPassword (email: string, token: string, passwordData: ResetPasswordData): boolean {
    return this.callMethod('post', `public/reset-password/${email}/${token}`, { passwordResetForm: passwordData })
  }

  async uploadImage (userId: number, data: FormData) {
    return this.callMethod('post', `/user/${userId}/upload_picture`, data)
  }

  async deleteImage (userId: number, fileName: string) {
    return this.callMethod('delete', `/user/${userId}/delete_picture`, null, null, { data: { fileName } })
  }
}

export default new UserService()
