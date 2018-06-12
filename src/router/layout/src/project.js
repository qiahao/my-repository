const list = () => import('@/components/project/v2/list')
const detail = () => import('@/components/project/v2/detail')


export default [
	{
		path: '/project/v2',
		name: 'projectV2List',
		component: list,
	},
	{
		path: '/project/v2/detail',
		name: 'projectDetail',
		component: detail
	}

]