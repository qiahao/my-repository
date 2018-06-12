import { Message } from "iview";
import store from "@/store";
const MSG_SERVER_ERROR = '网络异常稍后再试'
export default {
  options: {
    errorHandler(error){
      if (error && error.data) {
        if (error.data.bizResult) {
          switch (error.data.bizResult) {
            case 'USER_NOT_LOGIN':
            case 'USER_NOT_EXSIST':
            case 'USER_LOGIN_BY_OTHER':
            store.dispatch('logout')
            break;
          }
        }
        Message.warning(error.data.resultInfo)
      }else{
        Message.warning(MSG_SERVER_ERROR)
      }
    }
  },
  install (requestInterceptor,responseInterceptor,opts) {
    let option = Object.assign({},this.options,opts)
    responseInterceptor.use(response => response, error => {
      if (error.config && error.config.errorHandler !== false) {
        option.errorHandler(error)
      }
      return Promise.reject(error)
    })
  }
}