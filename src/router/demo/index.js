// import { webpackRequire2array } from '@/utils/util';
import Layout from '@/common/layout'
import routes from './routes'

// const routes = webpackRequire2array(require.context('./src', false, /^\.\/[\s\S]+\/*\.js$/), [])


const demo = {
    path: '/demo',
    name: 'demo',
	component: Layout,
	children: [ ...routes]
}

export default demo
