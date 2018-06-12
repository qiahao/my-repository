import axios from 'axios';

// 异常管理 - 异常登记 
const ORDER_EXCEPTION_ADD = '/api/order/exception/add'
// 异常管理 - 异常上报 
const ORDER_EXCEPTION_REPORT = '/api/order/exception/report'
// 异常管理 - 新增异常处理 
const ORDER_EXCEPTION_RESULT_ADD = '/api/order/exception/result/add'
// 异常管理 - 异常列表 
const ORDER_EXCEPTION_LIST = '/api/order/exception/list'
// 异常管理 - 修改异常状态 
const ORDER_EXCEPTION_STATE = '/api/order/exception/state'


// 异常管理 - 异常登记 
export function addException (params){
    return axios({
        url: ORDER_EXCEPTION_ADD,
        params: params
    })
}
// 异常管理 - 异常上报 
export function addExceptionReport (params){
    return axios({
        url: ORDER_EXCEPTION_REPORT,
        params: params
    })
}
// 异常管理 - 新增异常处理 
export function addExceptionResult (params){
    return axios({
        url: ORDER_EXCEPTION_RESULT_ADD,
        params: params
    })
}
// 异常管理 - 异常列表 
export function getExceptionList (params){
    return axios({
        url: ORDER_EXCEPTION_LIST,
        params: params
    })
}
// 异常管理 - 修改异常状态 
export function editExceptionState (params){
    return axios({
        url: ORDER_EXCEPTION_STATE,
        params: params
    })
}