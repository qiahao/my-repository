// import axios from 'axios'
import * as localStorageMng from '@/utils/local-storage-mng'

export default {
    request(config) {
        let _user = localStorageMng.getUserInfo() || {}
        let _params = { user_id: _user.user_id, act_user_id: _user.user_id, company_id: _user.company_id };
        config.params = Object.assign({}, _params, config.params ? config.params : {})
        // if (config.method.toLowerCase() == 'get') {
        // } else {
        //     // config.data = Object.assign({}, _params, config.data ? config.data : {})
        //     config.params = _params
        // }
        return config;
    }
}