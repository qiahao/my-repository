import axios from 'axios';
const PRICE_LIST = '/api/tms/price/member/list'
const PRICE_ADD = '/api/tms/price/member/create'
const PRICE_GET = '/api/tms/price/member/detail'
const PRICE_EDIT = '/api/tms/price/member/modify'
const PRICE_ERRECT = '/api/tms/price/effect'
const PRICE_ROUTE_LIST = '/api/tms/price/route/member/list'
const PRICE_ROUTE_DETAIL = '/api/tms/price/route/detail'
const PRICE_ROUTE_ADD = '/api/tms/price/route/create'
const PRICE_ROUTE_EDIT = '/api/tms/price/route/update'
const PRICE_ROUTE_DEL = '/api/tms/price/route/delete'
const PRICE_ROUTE_UPLOAD = '/api/utils/excel/route-price/upload'
const PRICE_ROUTE_DOWNLOAD = '/api/utils/excel/route-price/demo'

const PRICE_ROUTE_CLEAR = '/api/tms/price/route/member/clear'







//价格列表
export function getPriceList (params) {
    return axios({
        url: PRICE_LIST,
        params: params
    });
}
//价格增加
export function addPrice (params) {
    return axios({
        url: PRICE_ADD,
        params: params
    });
}
//价格详情
export function getPrice (params) {
    return axios({
        url: PRICE_GET,
        params: params
    });
}
//价格修改
export function editPrice (params) {
    return axios({
        url: PRICE_EDIT,
        params: params
    });
}
//价格生失效
export function effectPrice (params) {
    return axios({
        url: PRICE_ERRECT,
        params: params
    });
}
//价格路线列表
export function getPriceRouteList (params) {
    return axios({
        url: PRICE_ROUTE_LIST,
        params: params
    });
}
/*
//价格路线详情
export function getPriceRouteDetail (params) {
    return axios({
        url: PRICE_ROUTE_DETAIL,
        params: params
    });
}
//价格路线增加
export function addPriceRoute (params) {
    return axios({
        url: PRICE_ROUTE_ADD,
        params: params
    });
}
//价格路线修改
export function editPriceRoute (params) {
    return axios({
        url: PRICE_ROUTE_EDIT,
        params: params
    });
}
//价格路线修改
export function delPriceRoute (params) {
    return axios({
        url: PRICE_ROUTE_DEL,
        params: params
    });
}

*/
export function uploadPriceRoute (params) {
    return axios({
        url: PRICE_ROUTE_UPLOAD,
        params: params
    });
}
export function downloadPriceRoute (params) {
    return axios({
        url: PRICE_ROUTE_DOWNLOAD,
        params: params
    });
}

export function clearPriceRoute (params) {
    return axios({
        url: PRICE_ROUTE_CLEAR,
        params: params
    });
}




