import axios from 'axios';
const PARTNER_LIST = '/api/tms/partner/list'
const PARTNER_ADD = '/api/tms/partner/add'
const PARTNER_GET = '/api/tms/partner/detail'
const PARTNER_EDIT = '/api/tms/partner/edit'
const PARTNER_DEL = '/api/tms/partner/del'
const PARTNER_AUDIT_LIST = '/api/tms/partner/audit/list'
const PARTNER_AUDIT_AGREE = '/api/tms/partner/audit/agree'
const PARTNER_AUDIT_REFUSE = '/api/tms/partner/audit/refuse'
const PARTNER_AUDIT_CANCEL = '/api/tms/partner/audit/cancel'

// 客户管理 - 查询所有的客户（包括联系人和收货人）
const PARTNER_QUERY_ALL = '/api/tms/partner/query_all'
// 客户管理 - 查询说有的客户名称
const PARTNER_QUERY_ALL_NAME = '/api/tms/partner/query_all_name'

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
// 客户删除
export function delPartner (params) {
    return axios({
        url: PARTNER_DEL,
        params: params
    });
}
// 客户审核列表
export function linerTAuditList (params) {
    return axios({
        url: PARTNER_AUDIT_LIST,
        params: params
    });
}
// 客户审核同意
export function agreePartnerAudit (params) {
    return axios({
        url: PARTNER_AUDIT_AGREE,
        params: params
    });
}
// 客户拒绝
export function refusePartnerAudit (params) {
    return axios({
        url: PARTNER_AUDIT_REFUSE,
        params: params
    });
}
// 客户取消合作
export function cancelPartnerAudit (params) {
    return axios({
        url: PARTNER_AUDIT_CANCEL,
        params: params
    });
}

// 客户取消合作
export function getPartnerAll (params) {
    return axios({
        url: PARTNER_QUERY_ALL,
        params: params
    });
}

// 客户取消合作
export function getPartnerAllName (params) {
    return axios({
        url: PARTNER_QUERY_ALL_NAME,
        params: params
    });
}



// :todo 合并customerReciveljs / customerSend.js

const LINK_LIST_ALL = '/api/tms/partner/link/query_all'
const RECEIPT_LIST_ALL = '/api/tms/partner/receipt/query_all'


export function getLinkListAll (params) {
    return axios({
        url: LINK_LIST_ALL,
        params: params
    });
}

export function getReceiptListAll (params) {
    return axios({
        url: RECEIPT_LIST_ALL,
        params: params
    });
}




