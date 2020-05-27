import axios, { AxiosRequestConfig, AxiosResponse, AxiosStatic } from 'axios'

export abstract class BaseApiService {
  protected api: AxiosStatic

  constructor () {
    this.api = axios
    this.api.defaults.headers.common['X-AUTH-TOKEN'] = process.env.VUE_APP_TOKEN
  }

  protected callMethod (
    method: string,
    url: string,
    requestData?: object | null,
    responseKey?: string | null,
    config?: AxiosRequestConfig
  ) : any {
    const requestedMethod = method.toLowerCase()

    switch (requestedMethod) {
      case 'get':
        return this.api.get(url, config)
          .then((response: AxiosResponse) => {
            return responseKey && response.data.hasOwnProperty(responseKey)
              ? response.data[responseKey] : response.data
          })

      case 'post':
        return this.api.post(url, requestData, config)
          .then((response: AxiosResponse) => {
            return responseKey && response.data.hasOwnProperty(responseKey)
              ? response.data[responseKey] : response.data
          })

      case 'put':
        return this.api.put(url, requestData, config)
          .then((response: AxiosResponse) => {
            return responseKey && response.data.hasOwnProperty(responseKey)
              ? response.data[responseKey] : response.data
          })

      case 'patch':
        return this.api.patch(url, requestData, config)
          .then((response: AxiosResponse) => {
            return responseKey && response.data.hasOwnProperty(responseKey)
              ? response.data[responseKey] : response.data
          })
      default:
        throw new Error('An undefined method called.')
    }
  }
}
