import {
  eachOwn,
  webpackRequire2obj
} from '@/utils'

let interceptors = webpackRequire2obj(require.context('./src',false, /^\.\/[\s\S]+\/*\.js$/), ['./index.js'])

export default {
  options: {
    // applicationForm: {},
    defaultParams: {},
    removeEmpty: {},
    handlerReject: {},
    errorHandler: {},
    loading: {},
    responseData: {}, // 放在所有拦截器最后
  },
  install (requestInterceptor,responseInterceptor,opts){
    let options = Object.assign({}, this.options, opts)
    eachOwn(options, (value,name) => {
      if (value !== false && interceptors[name] && name != 'responseData') {
        let interceptor = interceptors[name]
        if (typeof interceptor.install == 'function') {
          interceptor.install(requestInterceptor,responseInterceptor,value)
        }else{
          if (interceptor.request) {
            requestInterceptor.use(interceptor.request)
          }
          if (interceptor.response) {
            if (typeof interceptor.response === 'function') {
              responseInterceptor.use(interceptor.response)
            } else {
              responseInterceptor.use(interceptor.response.success, interceptor.response.error)
            }
          }
        }
      }
    })
    // 最后的拦截器
    if (options.responseData && interceptors.responseData) {
      responseInterceptor.use(interceptors.responseData.response)
    }
  }
}