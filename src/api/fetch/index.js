import axios from 'axios'
import config from '@/config'
import interceptorFactory from './src/interceptor'
import transformRequestFactory from './src/transformRequest'
import transformResponseFactory from './src/transformResponse'

// 全局默认配置
axios.defaults.baseURL = config.host;
axios.defaults.timeout = 10000;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;chartset=UTF-8';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

axios.defaults.transformRequest = [function (data) {
    return data
}]

export default {
    option: {
        interceptor: {},
        transformRequest: {},
        transformResponse: {},
    },
    install(Vue, opts) {
        let option = Object.assign({}, this.option, opts)
        let {
            interceptor,
            transformRequest,
            transformResponse
        } = option
        if (interceptor !== false) {
            interceptorFactory.install(axios.interceptors.request, axios.interceptors.response, interceptor)
        }
        if (transformRequest !== false) {
          transformRequestFactory.install(axios.defaults.transformRequest,transformRequest)
        }
        if (transformResponse !== false) {
          transformResponseFactory.install(axios.defaults.transformResponse,transformResponse)
        }
    }
}