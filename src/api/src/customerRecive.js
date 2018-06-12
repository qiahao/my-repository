import axios from 'axios';
const RECIVE_LIST = '/api/tms/partner/receipt/query_all'
const RECIVE_ADD = '/api/tms/partner/receipt/add'
const RECIVE_GET = '/api/tms/partner/receipt/query'
const RECIVE_EDIT = '/api/tms/partner/receipt/update'
const RECIVE_DEL = '/api/tms/partner/receipt/delete'



// 承运商列表
export function getReciveList (params) {
    return axios({
        url: RECIVE_LIST,
        params: params
    });
}
// 承运商增加
export function addRecive (params) {
    return axios({
        url: RECIVE_ADD,
        params: params
    });
}

// 承运商修改
export function editRecive (params) {
    return axios({
        url: RECIVE_EDIT,
        params: params
    });
}
// 承运商删除
export function delRecive (params) {
    return axios({
        url: RECIVE_DEL,
        params: params
    });
}






