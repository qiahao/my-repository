const List = () => import('@/components/preorder/list')
const Detail = () => import('@/components/preorder/detail')
export default [
	{
	    path: '/preorder/v1',
	    name: 'preorderV1List',
	    component: List,
	    children: [
	    	{
	    		path: '/preorder/detail/:id',
	    		name: 'preorderDetail',
	    		component: Detail,
	    	}
	    ]
	}
]