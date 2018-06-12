const List = () => import('@/components/receipt/v1/list')
const List2 = () => import('@/components/receipt/v2/list')
const receiptOmsDetail = () => import('@/components/receipt/v2/detail')

export default [
	{
		path: '/receipt/v1',
		name: 'receiptV1List',
		component: List
	},
	// oms 路由
	{
		path: '/receipt/v2',
		name: 'receiptV2List',
		component: List2,
		children: [
			{
				path: 'detail',
				name: 'receiptOmsDetail',
				component: receiptOmsDetail,
			}
		]
	}
]
