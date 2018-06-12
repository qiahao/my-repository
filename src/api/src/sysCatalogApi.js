import axios from 'axios';
const API_CATALOG_LIST = '/api/system/catalog/list'
const API_CATALOG_ADD = '/api/system/catalog/add'
const API_CATALOG_UPDATE = '/api/system/catalog/edit'
const API_CATALOG_DETIAL = '/api/system/catalog/detail'
const API_CATALOG_DEL = '/api/system/catalog/del'
const API_ALL_MENU_LIST = '/api/system/menu/query_all_menu'
const API_ASSIGN_MENU_CATOLOG = '/api/system/menu/assign_menu_for_catalog'


// 列表接口
function getCatalogListApi (params) {
    return axios({
    	url: API_CATALOG_LIST,
    	params: params
    });
}
// 详情接口
function getCatalogDetialApi (params) {
    return axios({
        url: API_CATALOG_DETIAL,
        params: params
    });
}
// 新增接口
function catalogAddApi (params) {
    return axios({
        url: API_CATALOG_ADD,
        params: params
    });
}
// 修改接口
function catalogUpdateApi (params) {
    return axios({
        url: API_CATALOG_UPDATE,
        params: params
    });
}
// 删除接口
function catalogDelApi (params) {
    return axios({
        url: API_CATALOG_DEL,
        params: params
    });
}
// 删除接口
function queryAllMenuApi (params) {
    return axios({
        url: API_ALL_MENU_LIST,
        params: params
    });
}

// 分配菜单接口
function assignMenu (params) {
    return axios({
        url: API_ASSIGN_MENU_CATOLOG,
        params: params
    });
}

export {getCatalogListApi, getCatalogDetialApi, catalogAddApi, catalogUpdateApi, catalogDelApi, queryAllMenuApi, assignMenu}
