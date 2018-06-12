import axios from 'axios';
const API_CREAT_ORDER = '/api/order/create/own'
const API_CUSTER_QUERY = '/api/tms/partner/query_all_name'
const API_CATGO_LIST = '/api/utils/mru/company-ship-cargo-histroy'

const API_LINK_ALL = '/api/tms/partner/link/query_all'
const API_LINKRECEIPT_ALL = '/api/tms/partner/receipt/query_all'






// 开单接口
export function buildOrder (params) {
    return axios({
        url: API_CREAT_ORDER,
        params: params,
        method: 'post'
    });
}
//客户查询
export function queryCustoms (params) {
    return axios({
        url: API_CUSTER_QUERY,
        params: params
    });
}
//客户查询
export function getCargosList (params) {
    return axios({
        url: API_CATGO_LIST,
        params: params
    });
}

// 联系人
export function getLinkList (params) {
    return axios({
        url: API_LINK_ALL,
        params: params
    });
}
// 收货人
export function getReciveList (params) {
    return axios({
        url: API_LINKRECEIPT_ALL,
        params: params
    });
}
