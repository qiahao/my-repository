import axios from 'axios';
const API_WAYBILL_LIST = '/api/order/list'
const API_WAYBILL_DEL = '/api/order/delete'
//分配司机
const COMPANY_LIST = '/api/trip/query_company_list'
const DRIVER_LIST = '/api/order/driver/list'
const TRIP_CREATE = '/api/trip/create'
//分配承运承
const PREORDER_LIST = '/api/preorder/subcontractor/list'
const PREORDER_CREATE = '/api/preorder/v2/create'
//分配成员
const MEMBER_LIST = '/api/preorder/member/list'
const MEMBER_CREATE = '/api/preorder/v2/member/create'
//签收
const SIGN = '/api//order/sign'
//运单详情
const ORDER_DETAIL = '/api/order/detail/new'
const ORDER_DETAIL_MODIFY = '/api/order/modify'
const ORDER_DETAIL_TRACK = '/api/order/track'
const ORDER_DETAIL_NOTE_LIST = '/api/order/note/list'
const ORDER_DETAIL_BACK_LOG = '/api/order/back/log'
const ORDER_DETAIL_LOGS = '/api/order/logs'
const ORDER_DETAIL_NOTE_ADD = '/api/order/note/add'
const ORDER_DETAIL_INSURANCE_INFO = '/api/za/insurance/info'
const ORDER_DETAIL_INSURANCE_SAVE = '/api/za/insurance/order'
const ORDER_DETAIL_ORDER_TRACE = '/api/order/trace'





// 登陆接口
export function getWaybillList (params) {
    return axios({
        url: API_WAYBILL_LIST,
        params: params
    });
}
export function getWaybillDEL (params) {
    return axios({
        url: API_WAYBILL_DEL,
        params: params
    });
}

//分配司机
export function getCompanyList (params) {
    return axios({
        url: COMPANY_LIST,
        params: params
    });
}

export function getDriverList (params) {
    return axios({
        url: DRIVER_LIST,
        params: params
    });
}
export function tripCreate (params) {
    return axios({
        url: TRIP_CREATE,
        params: params
    });
}

//分配承运商
export function getPreorderList (params) {
    return axios({
        url: PREORDER_LIST,
        params: params
    });
}
export function PreorderCreate (params) {
    return axios({
        url: PREORDER_CREATE,
        params: params
    });
}
//分配成员
export function getMemberList (params) {
    return axios({
        url: MEMBER_LIST,
        params: params
    });
}
export function memberCreate (params) {
    return axios({
        url: MEMBER_CREATE,
        params: params
    });
}


export function orderSign (params) {
    return axios({
        url: SIGN,
        params: params
    });
}

//运单详情接口
export function orderDetail (params) {
    return axios({
        url: ORDER_DETAIL,
        params: params
    });
}
export function orderDetailTrack (params) {
    return axios({
        url: ORDER_DETAIL_TRACK,
        params: params
    });
}

export function orderDetailLogs (params) {
    return axios({
        url: ORDER_DETAIL_LOGS,
        params: params
    });
}

export function orderDetailBackLog (params) {
    return axios({
        url: ORDER_DETAIL_BACK_LOG,
        params: params
    });
}

export function orderDetailNoteList (params) {
    return axios({
        url: ORDER_DETAIL_NOTE_LIST,
        params: params
    });
}

export function orderDetailNoteAdd (params) {
    return axios({
        url: ORDER_DETAIL_NOTE_ADD,
        params: params
    });
}


export function orderDetailInsuranceInfo (params) {
    return axios({
        url: ORDER_DETAIL_INSURANCE_INFO,
        params: params
    });
}
export function orderDetailInsuranceSave (params) {
    return axios({
        url: ORDER_DETAIL_INSURANCE_SAVE,
        params: params
    });
}
export function orderDetailOrderTrace (params) {
    return axios({
        url: ORDER_DETAIL_ORDER_TRACE,
        params: params
    });
}
export function orderDetailModify (params) {
    return axios({
        url: ORDER_DETAIL_MODIFY,
        data: params,
        method: 'post',
    });
}
