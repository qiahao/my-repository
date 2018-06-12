import axios from 'axios';
const API_PREORDER_LIST = '/api/preorder/v2/list'
const API_PREORDER_ACCEPT = '/api/preorder/v2/accept'
const API_PREORDER_REJECT = '/api/preorder/reject'
const API_PREORDER_DETAIL = '/api/preorder/v2/detail'

// 订单列表接口
export function getPreorderList (params) {
    return axios({
        url: API_PREORDER_LIST,
        params: params
    });
}
// 订单接受接口
export function setPreorderAccept (params) {
    return axios({
        url: API_PREORDER_ACCEPT,
        params: params
    });
}
// 订单拒绝接口
export function setPreorderReject (params) {
    return axios({
        url: API_PREORDER_REJECT,
        params: params
    });
}
//订单详情获取
export function getPreorderDetail (params) {
    return axios({
        url: API_PREORDER_DETAIL,
        params: params
    });
}


