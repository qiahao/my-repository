import axios from 'axios';

const LOGIN = '/api/users/login'
const GET_USER_MENU_LIST = '/api/users/menu/list'


// 登陆接口
export function login (params) {
    return axios({
    	url: LOGIN,
    	params: params
    });
}

// 获取用户菜单
export function getUserMenuList (params) {
    return axios({
    	url: GET_USER_MENU_LIST,
    	params: params
    });
}

