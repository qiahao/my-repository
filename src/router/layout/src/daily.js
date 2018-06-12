const list = () => import('@/components/daily/cashFlow')
const dailyDetail = () => import('@/components/daily/detail/index.vue')

export default [
	{
      path: '/daily/cashFlow',
      name: 'dailyCashFlow',
	    component: list,
	    children: [
	    	{
	    	    path: '/daily/detail',
	    	    name: 'dailyDetail',
	    	    component: dailyDetail,

	    	}
	    ]
	}
]