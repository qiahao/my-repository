import axios from 'axios';


// 运单 - 开单（创建自有运单） 用户开单，创建自有运单 
const ORDER_CREATE_OWN = '/api/order/v2/create/own'
    // 运单 - 修改运单 用户修改运单内容 
const ORDER_MODIFY = '/api/order/v2/modify'
    // 运单 - 列表 用户查看运单列表 
const ORDER_LIST = '/api/order/v2/list'
    // 运单 - 详情 用户查看运单详情 
const ORDER_DETAIL_NEW = '/api/order/v2/detail/new'
    // 运单 - 签收 库存运单签收功能 
const ORDER_SIGN = '/api/order/sign'
    // 运单 - 运单操作记录 查看运单操作记录 
const ORDER_LOGS = '/api/order/logs'
    // 运单 - 物流跟踪 跟踪运单的节点信息 
const ORDER_TRACK = '/api/order/track'
    // 运单 - 地图轨迹 获取全国所有省份的列表 
const ORDER_TRACE = '/api/order/trace'
    // 运单 - 作废 我需要运单作废功能，以便将误开的运单作废。 
const ORDER_DELETE = '/api/order/delete'
    // 运单 - 获取运单货物历史 创建运单时，获取曾经发布过的货物信息的历史记录 
const ORDER_CARGO_LIST = '/api/order/cargo/list'
    // 运单费用支付 - 详情/明细 查看运单的费用与支付明细信息 
const ORDER_FEEPAY_DETAIL = '/api/order/feepay/detail'
    // 运单费用支付 - 修改 修改运单的某项费用或支付 
const ORDER_FEEPAY_UPDATE = '/api/order/feepay/modify'
    // 运单费用支付 - 删除 删除运单的某项费用或支付。 
const ORDER_FEEPAY_DELETE = '/api/order/feepay/delete'
    // 运单分配 - 指定运吧VIP司机 将一个或多个运单指派给某个VIP承运 
const ORDER_ASSIGN_TO_YB_VIP_DRIVER = '/api/order/assign/to-yb-vip-driver'
    // 运单分配 - 查找运吧VIP司机 根据姓名或手机号码模糊查询 
const ORDER_ASSIGN_MATCH_YB_VIP_DRIVER = '/api/order/assign/match-yb-vip-driver'
    // 运单分配 - 发布为运吧货源 将一个运单发布为运吧VIP专区货源。根据配置，允许此货源可同时发布到货源大厅 
const ORDER_ASSIGN_TO_YB_APP = '/api/order/assign/to-yb-app'
    // 运单分配 - 自动分配承运商 将运单自动分配给承运商。项目内的运单按项目配置进行分配，非项目运单则轮流匹配承运商 
const ORDER_ASSIGN_AUTO_TO_LINER = '/api/order/v2/assign/auto-to-liner'
    // 运单分配 - 查询自动匹配的承运商信息
const ORDER_ASSIGN_AUTO_MATCH_LINER = '/api/order/assign/auto-match-liner'
    // 运单备注 - 列表 根据运单ID获取所有的运单备注 
const ORDER_NOTE_LIST = '/api/order/note/list'
    // 运单备注 - 新增 新增运单备注 
const ORDER_NOTE_ADD = '/api/order/note/add'
    //跟踪节点信息
const ORDER_TRACK_POINT = 'api/order/track/point'
    //追加跟踪节点信息
const ORDER_TRACK_POINT_APPEND = 'api/order/track/append'
    //运单管理-删除
const API_WAYBILL_DEL = '/api/order/delete'
    //运单管理-导出
export const ORDER_BACK_EXPORT = '/api/order/back/export/excel'

// 运单 - 开单（创建自有运单） 用户开单，创建自有运单 
export function createOrderOwn(data) {
    return axios({
        url: ORDER_CREATE_OWN,
        data: data,
        method: 'post',
        removeEmpty: true
    })
}

// 运单 - 修改运单 用户修改运单内容 
export function editOrder(data) {
    return axios({
        url: ORDER_MODIFY,
        data: data,
        method: 'post',
        removeEmpty: true,
    })
}

// 运单 - 列表 用户查看运单列表 
export function getOrderList(params) {
    return axios({
        url: ORDER_LIST,
        params: params
    })
}

// 运单 - 详情 用户查看运单详情 
export function getOrderDetail(params) {
    return axios({
        url: ORDER_DETAIL_NEW,
        params: params
    })
}

// 运单 - 签收 库存运单签收功能 
export function signOrder(params) {
    return axios({
        url: ORDER_SIGN,
        params: params
    })
}

// 运单 - 验证运单是否到站（签收时）
export function checkSignOrderAllow(id) {
    return axios({
        url: '/api/order/v2/sign/allow',
        params: { order_ids: id }
    })
}



// 运单 - 运单操作记录 查看运单操作记录 
export function getOrderLogs(params) {
    return axios({
        url: ORDER_LOGS,
        params: params
    })
}

// 运单 - 物流跟踪 跟踪运单的节点信息 
export function getOrderTrack(params) {
    return axios({
        url: ORDER_TRACK,
        params: params
    })
}

// 运单 - 地图轨迹 获取全国所有省份的列表 
export function getOrderTrace(params) {
    return axios({
        url: ORDER_TRACE,
        params: params
    })
}

// 运单 - 作废 我需要运单作废功能，以便将误开的运单作废。 
export function deleteOrder(params) {
    return axios({
        url: ORDER_DELETE,
        params: params
    })
}

// 运单 - 获取运单货物历史 创建运单时，获取曾经发布过的货物信息的历史记录 
export function getOrderCargoList(params) {
    return axios({
        url: ORDER_CARGO_LIST,
        params: params
    })
}

// 运单费用支付 - 详情/明细 查看运单的费用与支付明细信息 
export function getOrderFeepayDetail(params) {
    return axios({
        url: ORDER_FEEPAY_DETAIL,
        params: params
    })
}

// 运单费用支付 - 修改 修改运单的某项费用或支付 
export function editOrderFeepay(params) {
    return axios({
        url: ORDER_FEEPAY_UPDATE,
        params: params
    })
}

// 运单费用支付 - 删除 删除运单的某项费用或支付。 
export function deleteOrderFeepay(params) {
    return axios({
        url: ORDER_FEEPAY_DELETE,
        params: params
    })
}

// 运单分配 - 指定运吧VIP司机 将一个或多个运单指派给某个VIP承运 
export function assignOrderToVipDriver(params) {
    return axios({
        url: ORDER_ASSIGN_TO_YB_VIP_DRIVER,
        params: params
    })
}

// 运单分配 - 查找运吧VIP司机 根据姓名或手机号码模糊查询 
export function getOrderMatchVipDriver(params) {
    return axios({
        url: ORDER_ASSIGN_MATCH_YB_VIP_DRIVER,
        params: params
    })
}

// 运单分配 - 发布为运吧货源 将一个运单发布为运吧VIP专区货源。根据配置，允许此货源可同时发布到货源大厅 
export function assignOrderToApp(params) {
    return axios({
        url: ORDER_ASSIGN_TO_YB_APP,
        params: params
    })
}

// 运单分配 - 自动分配承运商 将运单自动分配给承运商。项目内的运单按项目配置进行分配，非项目运单则轮流匹配承运商 
export function assignOrderAutoToLiner(params) {
    return axios({
        url: ORDER_ASSIGN_AUTO_TO_LINER,
        params: params
    })
}

// 运单分配 - 查询自动匹配的承运商信息
export function getOrderAutoMatchLiner(params) {
    return axios({
        url: ORDER_ASSIGN_AUTO_MATCH_LINER,
        params: params
    })
}

// 运单备注 - 列表 根据运单ID获取所有的运单备注 
export function getOrderNoteList(params) {
    return axios({
        url: ORDER_NOTE_LIST,
        params: params
    })
}

// 运单备注 - 新增 新增运单备注 
export function addOrderNote(params) {
    return axios({
        url: ORDER_NOTE_ADD,
        params: params
    })
}
//运单跟踪节点信息
export function getOrderTrackPoint(params) {
    return axios({
        url: ORDER_TRACK_POINT,
        params: params
    })
}
//运单跟踪追加节点
export function addTrackPoint(params) {
    return axios({
        url: ORDER_TRACK_POINT_APPEND,
        params: params
    })
}
//运单删除
export function getWaybillDEL(params) {
    return axios({
        url: API_WAYBILL_DEL,
        params: params
    });
}
// //导出运单：鑫合顺
// export function exportOrder (params) {
//     return axios({ 
//         url: `/api/utils/excel/orders/xhs`,
//         params: params
//     });
// }