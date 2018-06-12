export default [
	{
	    path: '/report/v1',
	    name: 'reportV1List',
	    component: r => require(['@/components/report/order-statistics'],r)
	},

	{
	    path: '/report/order-profit',
	    name: 'reportOrderProfit',
	    component: r => require(['@/components/report/order/order-profit'],r)
	},

	{
	    path: '/report/vehicle-profit',
	    name: 'reportVehicleProfit',
	    component: r => require(['@/components/report/vehicle/vehicle-profit'],r)
	},

	// // oms
	// {
	//     path: '/report/v2',
	//     name: 'reportV2List',
	//     component: OrderStatistics
	// }
]

