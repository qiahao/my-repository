const Trip = () => import('@/components/trip/list/index.vue')
const TripDetail = () => import('@/components/trip/detail/index.vue')

export default [
	{
	    path: '/trip/v1',
	    name: 'tripV1List',
	    component: Trip,
	    children: [
	    	{
	    	    path: '/trip/detail/:id',
	    	    name: 'tripDetail',
	    	    component: TripDetail,

	    	}
	    ]
	}
]