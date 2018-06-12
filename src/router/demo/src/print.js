export default [
    {
	    path: '/demo/print/trip',
        name: 'demoPrintTrip',
        component: r => require(['@/demo/print/trip-lodop'],r)
    },
    
    // lodop
    {
        path: '/demo/print/tag-lodop',
        name: 'demoPrintTagLodop',
        component: r => require(['@/demo/print/tag-lodop'],r)
    },
    {
        path: '/demo/print/order-cover-lodop',
        name: 'demoPrintOrderCoverLodop',
        component: r => require(['@/demo/print/order-cover.vue'],r)
    }
]