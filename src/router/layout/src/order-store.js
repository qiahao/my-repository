const orderStoreList = () => import('@/components/order-store/list')
const orderStoreDetail = () => import('@/components/order-store/detail/index.vue')

export default [
	{
	    path: '/order-store',
	    name: 'orderStoreList',
	    component: orderStoreList,
	    children: [
	    	{
	    		path: 'detail/:id',
	    		name: 'orderStoreDetail',
	    		component: orderStoreDetail,
	    	}
	    ]
	},
	
]