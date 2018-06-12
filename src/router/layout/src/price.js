const list = () => import('@/components/price/v2/list')
const detail = () => import('@/components/price/v2/detail')
export default [
	{
		path: '/price/v2',
		name: 'priceV2List',
		component: list,
	},
	{
		path: '/price/v2/detail',
		name: 'priceDetail',
		component: detail
	}

]