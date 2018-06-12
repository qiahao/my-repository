import axios from 'axios';
// 客户管理 - 列表
const PARTNER_LIST = '/api/tms/partner/list'
// 客户管理 - 详情
const PARTNER_DETAIL = '/api/tms/partner/detail'
// 客户管理 - 新增
const PARTNER_ADD = '/api/tms/partner/add'
// 客户管理 - 修改
const PARTNER_EDIT = '/api/tms/partner/edit'
// 客户管理 - 删除
const PARTNER_DEL = '/api/tms/partner/del'
// 客户管理 - 审核列表
const PARTNER_AUDIT_LIST = '/api/tms/partner/audit/list'
// 客户管理 - 审核同意
const PARTNER_AUDIT_AGREE = '/api/tms/partner/audit/agree'
// 客户管理 - 审核拒绝
const PARTNER_AUDIT_REFUSE = '/api/tms/partner/audit/refuse'
// 客户管理 - 查询所有的客户（包括联系人和收货人）
const PARTNER_QUERY_ALL = '/api/tms/partner/query_all'
// 客户管理 - 查询说有的客户名称
const PARTNER_QUERY_ALL_NAME = '/api/tms/partner/query_all_name'
// 客户管理 - 查询所有联系人
const PARTNER_LINK_QUERY_ALL = '/api/tms/partner/link/query_all'
// 客户管理 - 查询所有收货人
// const PARTNER_QUERY_ALL_NAME = '/api/tms/partner/query_all_name'

// 客户管理 - 列表
export function getPartnerList (params){
    return axios({
        url: PARTNER_LIST,
        params: params
    })
}
// 客户管理 - 详情
export function getPartnerDetail (params){
    return axios({
        url: PARTNER_DETAIL,
        params: params
    })
}
// 客户管理 - 新增
export function addPartner (params){
    return axios({
        url: PARTNER_ADD,
        params: params
    })
}
// 客户管理 - 修改
export function editPartner (params){
    return axios({
        url: PARTNER_EDIT,
        params: params
    })
}
// 客户管理 - 删除
export function deletePartner (params){
    return axios({
        url: PARTNER_DEL,
        params: params
    })
}
// 客户管理 - 审核列表
export function getPartnerAuditList (params){
    return axios({
        url: PARTNER_AUDIT_LIST,
        params: params
    })
}
// 客户管理 - 审核同意
export function agreePartnerAudit (params){
    return axios({
        url: PARTNER_AUDIT_AGREE,
        params: params
    })
}
// 客户管理 - 审核拒绝
export function refusePartnerSudit (params){
    return axios({
        url: PARTNER_AUDIT_REFUSE,
        params: params
    })
}
// 客户管理 - 查询所有的客户（包括联系人和收货人）
export function getPartnerAll (params){
    return axios({
        url: PARTNER_QUERY_ALL,
        params: params
    })
}
// 客户管理 - 查询说有的客户名称
export function getPartnerAllName (params){
    return axios({
        url: PARTNER_QUERY_ALL_NAME,
        params: params
    })
}
// 客户管理 - 查询所有联系人
export function getPartnerAllLink (params){
    return axios({
        url: PARTNER_LINK_QUERY_ALL,
        params: params
    })
}
// 客户管理 - 查询所有收货人
export function getPartnerAllReciptName (params){
    return axios({
        url: PARTNER_QUERY_ALL_NAME,
        params: params
    })
}


