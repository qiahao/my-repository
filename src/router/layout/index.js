import { webpackRequire2array } from '@/utils/util';
import Layout from '@/common/layout'
import notFound from '@/router/common/not-found'

const routes = webpackRequire2array(require.context('./src', false, /^\.\/[\s\S]+\/*\.js$/), [])
export default {
	path: '/layout',
	component: Layout,
	meta: { requiresAuth: true },
	children: [
		{
			path: '/',
			name: 'layoutDefault',
			redirect: '/home'
		},
		...routes,
		notFound
	]
}
