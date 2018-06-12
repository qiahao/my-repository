import Vue from 'vue'
import * as types from './mutation-types.js'

export default {

	[types.setUserInfo]: (state,userInfo = {}) => {
		Vue.set(state,'userInfo',userInfo)
	},
	// oms 开单信息存储
	[types.setV2OrderState]: (state, v2OrderStateJson) => {
		Vue.set(state,'v2OrderState',v2OrderStateJson)
	},
	// 解决oms开单客户选择后 退出再开单是托运人收货人列表丢失问题
	[types.setV2OrderStateCustomer]: (state, v2OrderStateCustomerJson) => {
		Vue.set(state,'v2OrderStateCustomer',v2OrderStateCustomerJson)
	},

	// 页面菜单
	[types.setPageMenu]: (state, pageMenu = []) => {
		Vue.set(state,'pageMenu',pageMenu)
	},
	// 功能菜单
	[types.setFuncMenu]: (state, funcMenu = []) => {
		Vue.set(state,'funcMenu',funcMenu)
	},

	// 字典 车型
	[types.setTruckTypes]: (state, truckTypes = []) => {
		Vue.set(state,'truckTypes',truckTypes)
	},
	// 字典 车长
	[types.setTruckLengths]: (state, truckLengths = []) => {
		Vue.set(state,'truckLengths',truckLengths)
	},
	// 字典 包装
	[types.setCargoPacks]: (state, cargoPacks = []) => {
		Vue.set(state,'cargoPacks',cargoPacks)
	},
	// 字典 包装
	[types.setQueryOrderNumber]: (state, queryOrderNumber = '') => {
		Vue.set(state,'queryOrderNumber',queryOrderNumber)
	},


	[types.setOrderStoreQueryUserId] : (state, orderStoreQueryUserId = '') => {
		Vue.set(state,'orderStoreQueryUserId', orderStoreQueryUserId)
	}

}
