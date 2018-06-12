import axios from 'axios';

const SHIP_LIST = '/api/ship/list'
const SHIP_ADD = '/api/ship/add'
const SHIP_UPDATE = '/api/ship/update'
const SHIP_DEL = '/api/ship/delete'
const SHIP_DETAIL = '/api/ship/query'

const SHIP_LINK_LIST = '/api/ship/link/list'
const SHIP_LINK_DETAIL = '/api/ship/link/query'
const SHIP_LINK_ADD = '/api/ship/link/add'
const SHIP_LINK_EDIT = '/api/ship/link/update'
const SHIP_LINK_DEL = '/api/ship/link/delete'

const SHIP_RECEIPT_LIST = '/api/ship/receipt/list'
const SHIP_RECEIPT_DETAIL = '/api/ship/receipt/query'
const SHIP_RECEIPT_ADD = '/api/ship/receipt/add'
const SHIP_RECEIPT_EDIT = '/api/ship/receipt/update'
const SHIP_RECEIPT_DEL = '/api/ship/receipt/delete'

// 获取客户列表
function shipList (params) {
    return axios({
    	url: SHIP_LIST,
    	params: params
    });
}

// 新增客户
function shipAdd (params) {
    return axios({
    	url: SHIP_ADD,
    	params: params
    });
}


// 修改客户
function shipUpdate (params) {
    return axios({
    	url: SHIP_UPDATE,
    	params: params
    });
}

// 客户详情
function shipDetail (params) {
    return axios({
    	url: SHIP_DETAIL,
    	params: params
    });
}

// 删除客户
function shipDel (params) {
    return axios({
    	url: SHIP_DEL,
    	params: params
    });
}

/* 发货人 */
function shipLinkList (params) {
    return axios({
    	url: SHIP_LINK_LIST,
    	params: params
    });
}
function shipLinkDetail (params) {
    return axios({
    	url: SHIP_LINK_DETAIL,
    	params: params
    });
}
function shipLinkAdd (params) {
    return axios({
    	url: SHIP_LINK_ADD,
    	params: params
    });
}
function shipLinkEdit (params) {
    return axios({
    	url: SHIP_LINK_EDIT,
    	params: params
    });
}
function shipLinkDel (params) {
    return axios({
    	url: SHIP_LINK_DEL,
    	params: params
    });
}

/* 收货人 */
function shipReceiptList (params) {
    return axios({
    	url: SHIP_RECEIPT_LIST,
    	params: params
    });
}
function shipReceiptDetail (params) {
    return axios({
    	url: SHIP_RECEIPT_DETAIL,
    	params: params
    });
}
function shipReceiptAdd (params) {
    return axios({
    	url: SHIP_RECEIPT_ADD,
    	params: params
    });
}
function shipReceiptEdit (params) {
    return axios({
    	url: SHIP_RECEIPT_EDIT,
    	params: params
    });
}
function shipReceiptDel (params) {
    return axios({
    	url: SHIP_RECEIPT_DEL,
    	params: params
    });
}

export { shipList, shipAdd, shipUpdate, shipDel, shipDetail,
		shipLinkList, shipLinkAdd, shipLinkDel, shipLinkEdit, shipLinkDetail,
		shipReceiptList, shipReceiptAdd, shipReceiptDel, shipReceiptDetail, shipReceiptEdit }