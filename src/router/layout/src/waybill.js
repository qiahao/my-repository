
const V1Build = () => import('@/components/waybill/v1/build')
const V1List = () => import('@/components/waybill/v1/list')

const V2Build = () => import('@/components/waybill/v2/build')

export default [
    {
        path: '/waybill/v1',
        name: 'waybillV1List',
        component: V1List
    },
    {
        path: '/waybill/v1/build',
        name: 'waybillV1Build',
        component: V1Build
    },

    // oms 开单
    {
        path: '/waybill/v2/build',
        name: 'waybillV2Build',
        component: V2Build
    },
]