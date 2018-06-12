import axios from 'axios';
const API_MENU_LIST = '/api/system/menu/list'
const API_MENU_ADD = '/api/system/menu/add'
const API_MENU_UPDATE = '/api/system/menu/edit'
const API_MENU_DETIAL = '/api/system/menu/detail'
const API_MENU_DEL = '/api/system/menu/del'


// 列表接口
function getMenuListApi (params) {
    return axios({
    	url: API_MENU_LIST,
    	params: params
    });
}
// 详情接口
function getMenuDetialApi (params) {
    return axios({
        url: API_MENU_DETIAL,
        params: params
    });
}
// 新增接口
function menuAddApi (params) {
    return axios({
        url: API_MENU_ADD,
        params: params
    });
}
// 修改接口
function menuUpdateApi (params) {
    return axios({
        url: API_MENU_UPDATE,
        params: params
    });
}
// 删除接口
function menuDelApi (params) {
    return axios({
        url: API_MENU_DEL,
        params: params
    });
}

export {getMenuListApi, getMenuDetialApi, menuAddApi, menuUpdateApi, menuDelApi}
