import axios from 'axios';
const ORDER_BACK_LIST = '/api/order/back/list' // 回单列表
const ORDER_BACK_UPLOAD = '/api/order/back/upload' // 回单管理 - 上传
const ORDER_BACK_RECEIVE = '/api/order/back/receive' // 回单管理 - 确认收到
const ORDER_BACK_SEND = '/api/order/back/ready' // 回单管理 - 确认发放
const ORDER_BACK_DETAIL = '/api/order/back/detail' // 回单管理-详情


function orderBackListApi (params) {
	return axios({
		url: ORDER_BACK_LIST,
		params: params
	})
}

function orderBackUploadApi (params) {
	return axios({
		url: ORDER_BACK_UPLOAD,
		params: params
	})
}


function orderBackReceiveApi (params) {
	return axios({
		url: ORDER_BACK_RECEIVE,
		params: params
	})
}


function orderBackSendApi (params) {
	return axios({
		url: ORDER_BACK_SEND,
		params: params
	})
}
function orderBackDetailApi (params) {
	return axios({
		url: ORDER_BACK_DETAIL,
		params: params
	})
}


export {
	orderBackListApi,
	orderBackUploadApi,
	orderBackReceiveApi,
	orderBackSendApi,
	orderBackDetailApi
}
