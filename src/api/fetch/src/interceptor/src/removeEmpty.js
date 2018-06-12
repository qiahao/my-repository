import { removeEmpty , decomposeUrl, type} from "@/utils";

export default {
  request (config){
    if (config.removeEmpty === true) {
      let params = config.params || {}

      // 处理params的参数
      params = removeEmpty(params)

      // 处理url上的参数
      if (config.url.indexOf('?') > -1) {
        let urlDecomposion = decomposeUrl(config.url)
        config.url = config.url.replace(/(\?.*)$/, '')
        params = Object.assign(params, removeEmpty(urlDecomposion.params))
      }

      config.params = params

      // 处理data参数
      if (config.method.toLowerCase() !== 'get') {
        config.data = deepRemoveEmpty(config.data)
      }
    }
    return config
  },

}

function deepRemoveEmpty(obj) {
  switch (typeof obj) {
    case 'object':
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          obj[key] = deepRemoveEmpty(obj[key])
        }
      }
      return removeEmpty(obj)
      break;
    case 'array':
      obj[key] = obj[key].map(item => {
        return deepRemoveEmpty(item)
      })
      return obj
      break;
    default: 
      return obj
      break;
  }
}