import axios from 'axios';
const API_INSURE_ORDER = '/api/za/insurance/order'
const API_INSURE_PAY = '/api/za/insurance/topay'
const API_INSURE_LOAD = '/api/za/insurance/uwp'
const API_INSURE_REORDER = '/api/za/insurance/reorder'
const API_INSURE_INFO = '/api/za/insurance/info'



// 投保新增
export function insuerOrder (params) {
    return axios({
    	url: API_INSURE_ORDER,
    	params: params
    });
}
// 投保支付
export function insurePay (params) {
    return axios({
    	url: API_INSURE_PAY,
    	params: params
    });
}
// 投保出单
export function insureLoad (params) {
    return axios({
    	url: API_INSURE_LOAD,
    	params: params
    });
}
// 重新投保
export function insuerReorder (params) {
    return axios({
    	url: API_INSURE_REORDER,
    	params: params
    });
}
// 投保详情
export function insuerInfo (params) {
    return axios({
    	url: API_INSURE_INFO,
    	params: params
    });
}


