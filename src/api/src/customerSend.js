import axios from 'axios';
const SEND_LIST = '/api/tms/partner/link/list'
const SEND_ADD = '/api/tms/partner/link/add'
const SEND_GET = '/api/tms/partner/link/query'
const SEND_EDIT = '/api/tms/partner/link/edit'
const SEND_DEL = '/api/tms/partner/link/delete'



// 承运商列表
export function getSendList (params) {
    return axios({
        url: SEND_LIST,
        params: params
    });
}
// 承运商增加
export function addSend (params) {
    return axios({
        url: SEND_ADD,
        params: params
    });
}

// 承运商修改
export function editSend (params) {
    return axios({
        url: SEND_EDIT,
        params: params
    });
}
// 承运商删除
export function delSend (params) {
    return axios({
        url: SEND_DEL,
        params: params
    });
}






