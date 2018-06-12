import * as constants from './constants.js'


export default {
    // 用户信息
    userInfo: {},
    // oms 开单信息保存
    // 1.开单信息存储 
    // 2. 存储成JSON 可避免js引用传值问题
    v2OrderState: JSON.stringify(constants.v2OrderDetail),
    // 解决oms开单客户选择后 退出再开单是托运人收货人列表丢失问题
    v2OrderStateCustomer: JSON.stringify(constants.v2OrderStateCustomer),

    // 页面菜单
    pageMenu: [],
    // 功能菜单
    funcMenu: [],

    // 字典数据 车型
    truckTypes: [],
    // 字典数据 车长
    truckLengths: [],
    // 字典数据 货物包装
    cargoPacks: [],

    // 顶部查询运单号
    queryOrderNumber: '',
    // 库存管理：只看我开的单 => 开单人员ID查询
    // onlyShowMyCreatedOrder: false,
    orderStoreQueryUserId: '',
}