import axios from 'axios';
const LINER_LIST = '/api/tms/liner/account/list'
const LINER_ADD = '/api/tms/liner/account/add'
const LINER_GET = '/api/tms/liner/account/get'
const LINER_EDIT = '/api/tms/liner/account/edit'
const LINER_STATUS = '/api/tms/liner/account/status'
const LINER_IS_EXIST = '/api/tms/liner/account/exists'
const LINER_PWD_RESEST = 'api/tms/liner/account/resetpwd'



// 客户列表
export function getLinerList (params) {
    return axios({
        url: LINER_LIST,
        params: params
    });
}
// 客户增加
export function addLiner (params) {
    return axios({
        url: LINER_ADD,
        params: params
    });
}
// 客户详情
export function getLiner (params) {
    return axios({
        url: LINER_GET,
        params: params
    });
}
// 客户修改
export function editLiner (params) {
    return axios({
        url: LINER_EDIT,
        params: params
    });
}

// 状态修改
export function editLinerStatus (params) {
    return axios({
        url: LINER_STATUS,
        params: params
    });
}


export function isLinerExit (params) {
    return axios({
        url: LINER_IS_EXIST,
        params: params
    });
}

// 密码重置
export function resestLinerPwd (params) {
    return axios({
        url: LINER_PWD_RESEST,
        params: params
    });
}


