import Vue from 'vue'
import App from './App.vue'

import axios from 'axios'
import router from './router'
import store from './store'
import './icons'
import i18n from './i18n'
import './mixin'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import BootstrapVue from 'bootstrap-vue'
import Multiselect from 'vue-multiselect'
import VueAxios from 'vue-axios'
import VeeValidate from 'vee-validate'
import VueAuthenticate from 'vue-authenticate'
import Vuex from 'vuex'

import LocaleHelper from '@/utils/LocaleHelper'

export const EventBus = new Vue()

Vue.component('multiselect', Multiselect)
Vue.use(BootstrapVue)
Vue.use(VeeValidate)
Vue.use(Vuex)
Vue.use(VueAxios, axios)
Vue.use(VueAuthenticate, {
  baseUrl: process.env.VUE_APP_API_ENDPOINT_URL,
  loginUrl: '/login_check',
  tokenPrefix: 'onesource_',
  tokenPath: 'token',
  storageNamespace: '',
  registerUrl: ''
})

Vue.component('fa', FontAwesomeIcon)

Vue.config.productionTip = false

axios.defaults.baseURL = process.env.VUE_APP_API_ENDPOINT_URL
axios.interceptors.request.use(function (config) {
  if (config.headers.common.Accept && config.headers.common.Accept.indexOf('*/*') !== -1) {
    config.headers.accept = 'application/json'
  }

  const userLocale = LocaleHelper.getUserLocale()
  if (userLocale) {
    config.headers['Accept-Language'] = userLocale
  }

  return config
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

/*
const createApp = () => {
  const app = new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
  })
  // .$mount('#app')

  return { app, router, store }
}
export default createApp
*/
