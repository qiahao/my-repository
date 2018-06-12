import axios from 'axios';
const API_STAFF_LIST = '/api/users/list'
const API_STAFF_STATE = '/api/users/status'
const API_STAFF_ADD = '/api/users/add'
const API_STAFF_UPDATE = '/api/users/edit'
const API_STAFF_RESET = '/api/users/reset_pwd'
const API_STAFF_DETIAL = '/api/users/get'
const API_STAFF_DEL = '/api/users/del'
const API_SELECTED_USER_BY_DEPT_ID = '/api/users/department/query_selected_user_by_dept_id'


// 列表接口
function getStaffListApi (params) {
    return axios({
    	url: API_STAFF_LIST,
    	params: params
    });
}
// 详情接口
function getStaffDetialApi (params) {
    return axios({
        url: API_STAFF_DETIAL,
        params: params
    });
}
// 启禁用接口
function setStaffStateApi (params) {
    return axios({
    	url: API_STAFF_STATE,
    	params: params
    });
}
// 新增接口
function staffAddApi (params) {
    return axios({
        url: API_STAFF_ADD,
        params: params
    });
}
// 修改接口
function staffUpdateApi (params) {
    return axios({
        url: API_STAFF_UPDATE,
        params: params
    });
}

// 删除接口
function staffDelApi (params) {
    return axios({
        url: API_STAFF_DEL,
        params: params
    });
}
// 重置密码接口
function staffResetApi (params) {
    return axios({
        url: API_STAFF_RESET,
        params: params
    });
}

function getSelectedUserByDeptId (params) {
    return axios({
        url: API_SELECTED_USER_BY_DEPT_ID,
        params: params
    });
}
export {getStaffListApi ,getStaffDetialApi ,setStaffStateApi ,staffAddApi ,staffUpdateApi ,staffResetApi,
 getSelectedUserByDeptId, staffDelApi}
