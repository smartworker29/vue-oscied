import store from '@/store'
import { BaseApiService } from '@/services/BaseApiService'
import { User, RegistrationData, SignInData } from '@/interfaces/UserInterfaces'

class UserService extends BaseApiService {
  checkEmailAvailability (email: string) : boolean {
    return this.callMethod('get', '/public/check-availability-email', {},
      'available', { params: { email } })
  }

  getAvailableRegistrationFields () : string[] {
    return this.callMethod('get', '/public/reg-fields', {}, 'fields')
  }

  async getUser () : Promise<User> {
    if (store.getters['user/currentUser']) {
      return store.getters['user/currentUser']
    }

    const response = await this.api.get('/me')
    store.commit('user/setUser', response.data)
    store.commit('user/setIsAuthenticated', true)

    return response.data
  }

  test () : string {
    return this.callMethod('get', '/test', {}, 'message')
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
}

export default new UserService()
