import axios from 'axios';
const API_ROLE_LIST = '/api/system/role/list_not_page'
const API_ROLE_ADD = '/api/system/role/add'
const API_ROLE_UPDATE = '/api/system/role/edit'
const API_ROLE_DETIAL = '/api/system/role/detail'
const API_ROLE_DEL = '/api/system/role/del'
const API_ROLE_STATE = '/api/system/role/state'

const API_MENU_LIST = '/api/system/menu/query_all_menu_by_role_id'
const API_USER_LIST = '/api/system/role/query_all_user_by_role_id'
const API_ASSIGN_MENU = '/api/system/menu/assign_menu_for_role'
const API_ASSIGN_USER = '/api/system/role/assign_user_for_role'
const API_ALL_ROLE_LIST = '/api/system/role/query_all_role_by_user_id'
const API_SELECTED_USER_LIST = '/api/system/role/query_selected_user_by_role_id'

// 列表接口
function getRoleListApi (params) {
    return axios({
    	url: API_ROLE_LIST,
    	params: params
    });
}
// 根据用户ID查询角色列表接口
function getAllRoleListApi (params) {
    return axios({
        url: API_ALL_ROLE_LIST,
        params: params
    });
}
// 详情接口
function getRoleDetialApi (params) {
    return axios({
        url: API_ROLE_DETIAL,
        params: params
    });
}
// 新增接口
function roleAddApi (params) {
    return axios({
        url: API_ROLE_ADD,
        params: params
    });
}
// 修改接口
function roleUpdateApi (params) {
    return axios({
        url: API_ROLE_UPDATE,
        params: params
    });
}
// 删除接口
function roleDelApi (params) {
    return axios({
        url: API_ROLE_DEL,
        params: params
    });
}
// 禁用/启用接口
function roleStateApi (params) {
    return axios({
        url: API_ROLE_STATE,
        params: params
    });
}
// 菜单列表接口
function menuListApi (params) {
    return axios({
        url: API_MENU_LIST,
        params: params
    });
}
// 用户列表接口
function userListApi (params) {
    return axios({
        url: API_USER_LIST,
        params: params
    });
}
// 已选择的用户列表接口
function selectedUserListApi (params) {
    return axios({
        url: API_SELECTED_USER_LIST,
        params: params
    });
}

// 分配菜单接口
function assignMenuApi (params) {
    return axios({
        url: API_ASSIGN_MENU,
        params: params
    });
}

// 分配用户接口
function assignUserApi (params) {
    return axios({
        url: API_ASSIGN_USER,
        params: params
    });
}
export {getRoleListApi, getRoleDetialApi, roleAddApi, roleUpdateApi, roleDelApi,
        menuListApi, userListApi, roleStateApi,assignMenuApi, assignUserApi, getAllRoleListApi,
    selectedUserListApi}
