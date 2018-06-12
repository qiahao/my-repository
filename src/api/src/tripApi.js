import axios from 'axios';
import {exportExcel} from '@/utils/util'
const API_TRIP_LIST = '/api/trip/list'
const API_TRIP_SEND = '/api/trip/send'
const API_TRIP_ARRIVE = '/api/trip/receive'
const API_TRIP_CANCEL = '/api/trip/cancel'
const API_TRIP_DETAIL_MSG = '/api/trip/detail'
const API_TRIP_LOG = '/api/trip/log'
const API_TRIP_FOLLOW = '/api/trip/operation/log'
const API_TRIP_COMPANY_LIST = '/api/trip/query_company_list'
const API_TRIP_PAY = '/api/trip/info'
const API_TRIP_PAY_SAVE = '/api/trip/edit'
const API_TRIP_LOC_MSG = '/api/gps/vehicle/trace'
const API_TRIP_ASSIGN_CANCEL = '/api/trip/assign/cancel'

// 车次列表接口
export function getTripList (params) {
    return axios({
    	url: API_TRIP_LIST,
    	params: params
    });
}
// 取消车次接口
export function setTripCancel (params) {
    return axios({
    	url: API_TRIP_CANCEL,
    	params: params
    });
}
// 确认发车接口
export function setTripSend (params) {
    return axios({
    	url: API_TRIP_SEND,
    	params: params
    });
}
// 确认到车接口
export function setTripArrive (params) {
    return axios({
    	url: API_TRIP_ARRIVE,
    	params: params
    });
}
// 获取车次详情-车次信息接口
export function getTripDetailMsg (params) {
    return axios({
        url: API_TRIP_DETAIL_MSG,
        params: params
    });
}
// 获取车次详情-操作记录接口
export function getTripActLog (params) {
    return axios({
        url: API_TRIP_LOG,
        params: params
    });
}
// 获取车次详情-物流跟踪接口
export function getTripFollow (params) {
    return axios({
        url: API_TRIP_FOLLOW,
        params: params
    });
}

// 获取车次详情-修改-到站网点列表接口
export function getTripNextCompanyList (params) {
    return axios({
        url: API_TRIP_COMPANY_LIST,
        params: params
    });
}
// 获取车次详情-修改-获取车次费用信息接口
export function getTripPayMsg (params) {
    return axios({
        url: API_TRIP_PAY,
        params: params
    });
}
// 获取车次详情-修改-保存车次费用信息接口
export function setTripPayMsg (params) {
    return axios({
        url: API_TRIP_PAY_SAVE,
        params: params
    });
}
// 获取车次详情-地图轨迹信息接口
export function getTripTrace (params) {
    return axios({
        url: API_TRIP_LOC_MSG,
        params: params
    });
}

// 运单配载 - 取消配载
export function cancelAssign (params) {
    return axios({
        url: API_TRIP_ASSIGN_CANCEL,
        params: params
    });
}


// 整车投保:富邦投保
export function tripInsure (params) {
    return axios({
        url: '/api/trip/insure/fubang/add',
        params: params
    });
}

// 整车投保详情:富邦投保
export function getTripInsureDetail (tripId) {
    return axios({
        url: '/api/trip/insure/fubang/detail',
        params: {trip_id: tripId}
    });
}



// Excel - 车次配载运单导出
export function exportTripOrders (params) {
    return exportExcel(params,'/api/utils/excel/trip/orders')
}




