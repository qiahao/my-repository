import axios from 'axios';
const PARTNER_LIST = '/api/tms/partner/account/list'
const PARTNER_ADD = '/api/tms/partner/account/add'
const PARTNER_GET = '/api/tms/partner/account/detail'
const PARTNER_EDIT = '/api/tms/partner/account/edit'
const PARTNER_STATUS = '/api/tms/partner/account/status'
const PARTNER_IS_EXIST = '/api/tms/partner/account/exists'
const PARTNER_PWD_RESEST = '/api/tms/partner/account/resetpwd'





// 客户列表
export function getPartnerList (params) {
    return axios({
        url: PARTNER_LIST,
        params: params
    });
}
// 客户增加
export function addPartner (params) {
    return axios({
        url: PARTNER_ADD,
        params: params
    });
}
// 客户详情
export function getPartner (params) {
    return axios({
        url: PARTNER_GET,
        params: params
    });
}
// 客户修改
export function editPartner (params) {
    return axios({
        url: PARTNER_EDIT,
        params: params
    });
}

// 状态修改
export function editPartnerStatus (params) {
    return axios({
        url: PARTNER_STATUS,
        params: params
    });
}

// 状态修改
export function isPartnerExit (params) {
    return axios({
        url: PARTNER_IS_EXIST,
        params: params
    });
}
// 密码重置
export function resestPartnerPwd (params) {
    return axios({
        url: PARTNER_PWD_RESEST,
        params: params
    });
}







