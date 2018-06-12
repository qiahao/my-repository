export default [
  {
    path: '/demo/test1',
      name: 'demoTest1',
      component: r => require(['@/demo/test/list1.vue'],r)
  },
  {
    path: '/demo/test2',
      name: 'demoTest2',
      component: r => require(['@/demo/test/list2.vue'],r)
  },
  {
    path: '/demo/test',
      name: 'demoTest',
      component: r => require(['@/demo/test/list.vue'],r)
  },

]