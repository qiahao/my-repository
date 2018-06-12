import axios from 'axios';
const API_DEPT_LIST = '/api/users/department/list'
const API_DEPT_ADD = '/api/users/department/add'
const API_DEPT_UPDATE = '/api/users/department/edit'
const API_DEPT_DETIAL = '/api/users/department/detail'
const API_DEPT_DEL = '/api/users/department/del'

const API_ALL_DEPT_BY_USER_ID = '/api/users/department/query_all_dept_by_user_id'
const API_SELECTED_USER_BY_DEPT_ID = '/api/users/department/query_selected_user_by_dept_id'

// 列表接口
function getDeptListApi (params) {
    return axios({
    	url: API_DEPT_LIST,
    	params: params
    });
}
// 详情接口
function getDeptDetialApi (params) {
    return axios({
        url: API_DEPT_DETIAL,
        params: params
    });
}
// 新增接口
function deptAddApi (params) {
    return axios({
        url: API_DEPT_ADD,
        params: params
    });
}
// 修改接口
function deptUpdateApi (params) {
    return axios({
        url: API_DEPT_UPDATE,
        params: params
    });
}
// 删除接口
function deptDelApi (params) {
    return axios({
        url: API_DEPT_DEL,
        params: params
    });
}


function getAllDeptByUserId (params) {
    return axios({
        url: API_ALL_DEPT_BY_USER_ID,
        params: params
    });
}

function getSelectedUserByDeptId (params) {
    return axios({
        url: API_SELECTED_USER_BY_DEPT_ID,
        params: params
    });
}

export {getDeptListApi, getDeptDetialApi, deptAddApi, deptUpdateApi, deptDelApi,getAllDeptByUserId, getSelectedUserByDeptId}
