import axios from 'axios';
const PROJECT_LIST = '/api/tms/project/member/list'
const PROJECT_CREATE = '/api/tms/project/member/create'
const PROJECT_DETAIL = '/api/tms/project/member/detail'
const PROJECT_UPDATE = '/api/tms/project/member/modify'
const PROJECT_DEL = '/api/tms/project/delete'
const PROJECT_CONTRACT_LIST = '/api/tms/project/route/member/contract/list'
const PROJECT_CONTRACT_CREATE = '/api/tms/project/route/member/contract'
const PROJECT_USER_LIST = '/api/users/list'
const PROJECT_PRICE_ROUTE_LIST = '/api/tms/project/route/member/list'
const PROJECT_PRICE_ROUTE_CLEAR = '/api/tms/project/route/member/clear'


// 项目列表
export function getProjectList (params) {
    return axios({
        url: PROJECT_LIST,
        params: params
    });
}
// 项目增加
export function projectCreate (params) {
    return axios({
        url: PROJECT_CREATE,
        params: params
    });
}
// 项目详情
export function projectDetail (params) {
    return axios({
        url: PROJECT_DETAIL,
        params: params
    });
}
// 项目修改
export function projectUpdate (params) {
    return axios({
        url: PROJECT_UPDATE,
        params: params
    });
}
// 项目删除
export function projectDel (params) {
    return axios({
        url: PROJECT_DEL,
        params: params
    });
}
// 项目分包信息
export function projectTractList (params) {
    return axios({
        url: PROJECT_CONTRACT_LIST,
        params: params
    });
}

// 项目分包创建
export function projectTractCreate (params) {
    return axios({
        url: PROJECT_CONTRACT_CREATE,
        params: params
    });
}


//
export function projectRouteList (params) {
    return axios({
        url: PROJECT_PRICE_ROUTE_LIST,
        params: params
    });
}

export function clearProjectRoute (params) {
    return axios({
        url: PROJECT_PRICE_ROUTE_CLEAR,
        params: params
    });
}

export function projectUserlist (params) {
    return axios({
        url: PROJECT_USER_LIST,
        params: params
    });
}




