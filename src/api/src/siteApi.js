import axios from 'axios';

const SITE_LIST     = '/api/company/partener/list';
const SITE_DETAIL   = '/api/company/partener/detail';
const SITE_EDIT     = '/api/company/partener/edit';
const SITE_INVITE   = '/api/company/partener/invitation';
const SITE_CANCEL   = '/api/company/partener/cancel';
const SITE_REFUSE   = '/api/company/partener/refuse';
const SITE_AGREE   = '/api/company/partener/agree';
const SITE_DETAIL_BY_MOBILE = '/api/company/detail_by_mobile';
/*const SHIP_ADD = '/api/ship/add'
const SHIP_UPDATE = '/api/ship/update'
const SHIP_DEL = '/api/ship/delete'
const SHIP_DETAIL = '/api/ship/query'

const SHIP_LINK_LIST = '/api/ship/link/list'

const SHIP_RECEIPT_LIST = '/api/ship/receipt/list'*/

// 获取合作站点列表
function siteList (params) {
    return  axios({
        url: SITE_LIST,
        params: params
    });
}

// 获取合作站点详情
function siteDetail (params) {
    return  axios({
        url: SITE_DETAIL,
        params: params
    });
}

// 保存合作站点详情
function siteEdit (params) {
    return  axios({
        url: SITE_EDIT,
        params: params
    });
}

// 邀请合作站点
function siteInvite (params) {

    return  axios({
        url: SITE_INVITE,
        params: params
    });
}

// 取消合作站点
function siteCancel (params) {
    return  axios({
        url: SITE_CANCEL,
        params: params
    });
}

// 拒绝合作
function siteRefuse (params) {
    return  axios({
        url: SITE_REFUSE,
        params: params
    });
}

// 同意合作
function siteAgree (params) {
    return  axios({
        url: SITE_AGREE,
        params: params
    });
}

function siteDetailByMobile (params) {
    return  axios({
        url: SITE_DETAIL_BY_MOBILE,
        params: params
    });
}
export { siteList, siteDetail, siteEdit, siteInvite, siteCancel,siteRefuse,
    siteAgree, siteDetailByMobile
}