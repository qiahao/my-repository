export default [
  {
		path: '/finance/bill',
		name: 'financeBill',
		component: r => require(['@/components/finance/bill/list.vue'],r)
	},
  {
		path: '/finance/bill/detail/:billId',
		name: 'financeBillDetail',
		component: r => require(['@/components/finance/bill/detail.vue'],r)
	},
  {
		path: '/finance/bill/edit/:billId',
		name: 'financeBillEdit',
		component: r => require(['@/components/finance/bill/edit.vue'],r)
	},
  {
		path: '/finance/fee',
		name: 'financeFee',
		component: r => require(['@/components/finance/fee/list.vue'],r)
	}
]
