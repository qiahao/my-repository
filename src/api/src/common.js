import axios from 'axios';
const API_CATGO_LIST = '/api/utils/mru/company-ship-cargo-histroy' // 获取用户常用货物

// 获取用户常用货物
export function getCargosList (params) {
    return axios({
        url: API_CATGO_LIST,
        params: params
    });
}