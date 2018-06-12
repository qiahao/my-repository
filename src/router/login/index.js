import { Message } from 'iview';
import * as localStorageMng from '@/utils/local-storage-mng'
import Login from '@/components/login_register/login'; //登陆

export default {
    path: '/login',
    name: 'login',
    component: Login,
    params: {
        redirect: null
    },
    beforeEnter: (to, from, next) => {
        if (localStorageMng.hasLogin()) {
            if (from.fullPath != '/') 
            Message.info('已登陆，如需到登陆页请先退出')
            next({ path: from.fullPath || '/' })
        }
        else {
            localStorageMng.clearUserInfo()
            next()
        }
    }
}