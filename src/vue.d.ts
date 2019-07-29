import 'vee-validate/types/vue'
import 'vue-meta/types/vue'

declare module 'vue/types/vue' {
  interface VueAuth {
    login(credentials: object): Promise<void>
    authenticate(provider: string): Promise<void>
    logout(): Promise<void>
    isAuthenticated(): boolean
    storage: Storage
    tokenName: string
  }

  export interface Vue {
    $auth: VueAuth
  }
}
