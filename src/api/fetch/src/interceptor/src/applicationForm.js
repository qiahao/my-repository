import {
  isApplicationForm,
  eachOwn,
  type
} from '@/utils'

// 支持post/put/patch 的表单提交方式
export default {
  request: config => {
    if (config.method.toLowerCase() == 'post') {
    
    // if (isApplicationForm(config.contentType || config.ContentType)) {
      config.headers = Object.assign({
        'Content-Type': 'application/x-www-form-urlencoded;chartset=UTF-8'
      },config.headers)
    //   if (config.data && type(config.data) === 'object') {
    //     let params = new URLSearchParams()
    //     eachOwn(config.data, (value, key) => {
    //       params.append(key, value)
    //     })
    //     config.data = params
    //   }
    }
    return config
  }
}
