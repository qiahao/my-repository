import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'iview' //处理cookie
import routes from './routes'
import * as localStorageMng from '@/utils/local-storage-mng'


Vue.use(Router)
const router = new Router({
	// mode: 'history',
	routes
});

router.beforeEach((to, from, next) => {
	// 判断登陆是否需要权限
	if (to.matched.some(record => record.meta.requiresAuth)) {
		
		if (localStorageMng.hasLogin()) {
			next();
		} else {
			Message.info('请先登陆')
			next({ path: '/login' });
		}
	} else {
		next();
	}
});

export default router;