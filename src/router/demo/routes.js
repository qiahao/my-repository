import printRoutes from './src/print.js'
import testRoutes from './src/test.js'
export default [
    // 打印
    ...printRoutes,
    ...testRoutes,
    // 城市选择
    {
        path: '/demo/city-select',
        name: 'demoCitySelect',
        component: r => require(['@/demo/city-select'],r)
    },


]