import axios from 'axios';
const LINER_LIST = '/api/tms/liner/list'
const LINER_ADD = '/api/tms/liner/add'
const LINER_GET = 'api/tms/liner/get'
const LINER_EDIT = '/api/tms/liner/edit'
const LINER_DEL = '/api/tms/project/contract/delete'
const LINER_AUDIT_LIST = '/api/tms/liner/audit/list'
const LINER_AUDIT_AGREE = '/api/tms/liner/audit/agree'
const LINER_AUDIT_REFUSE = '/api/tms/liner/audit/refuse'
const LINER_AUDIT_CANCEL = '/api/tms/liner/audit/cancel'
const LINER_SCORE = 'api/tms/liner/score'





// 承运商列表
export function getLinerList (params) {
    return axios({
        url: LINER_LIST,
        params: params
    });
}
// 承运商增加
export function addLiner (params) {
    return axios({
        url: LINER_ADD,
        params: params
    });
}
// 承运商详情
export function getLiner (params) {
    return axios({
        url: LINER_GET,
        params: params
    });
}
// 承运商修改
export function editLiner (params) {
    return axios({
        url: LINER_EDIT,
        params: params
    });
}
// 承运商删除
export function delLiner (params) {
    return axios({
        url: LINER_DEL,
        params: params
    });
}
// 承运商审核列表
export function linerTAuditList (params) {
    return axios({
        url: LINER_AUDIT_LIST,
        params: params
    });
}
// 承运商审核同意
export function agreeLinerAudit (params) {
    return axios({
        url: LINER_AUDIT_AGREE,
        params: params
    });
}
// 承运商拒绝
export function refuseLinerAudit (params) {
    return axios({
        url: LINER_AUDIT_REFUSE,
        params: params
    });
}
// 承运商拒绝
export function cancelLinerAudit (params) {
    return axios({
        url: LINER_AUDIT_CANCEL,
        params: params
    });
}
// 承运商拒绝
export function setLinerScore (params) {
    return axios({
        url: LINER_SCORE,
        params: params
    });
}






