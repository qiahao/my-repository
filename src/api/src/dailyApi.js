import axios from 'axios';
import {exportExcel} from '@/utils/util'

// 字典表查询
const PAYMNET_LIST = '/api/payment/list'
const PAYMNET_DEL = '/api/payment/del'
const PAYMNET_ADD = '/api/payment/add'
const PAYMNET_EDIT = '/api/payment/edit'
const PAYMNET_GET = '/api/payment/get'

export function paymentList(param) {
    return axios({
        url: PAYMNET_LIST,
        params: param
    })
}

//日常收支导出
export function exportPaymentOrders (params) {
  return exportExcel(params,'/api/utils/excel/payment')
}

//删除
export function paymentDel(param) {
  return axios({
      url: PAYMNET_DEL,
      params: param,
      method: "POST"
  })
}

//新增
export function paymentAdd(param) {
  return axios({
      url: PAYMNET_ADD,
      params: param,
      method: "POST"
  })
}

//修改
export function paymentEdit(param) {
  return axios({
      url: PAYMNET_EDIT,
      params: param,
      method: "POST"
  })
}


//获取详情
export function paymentGet(param) {
    return axios({
        url: PAYMNET_GET,
        params: param
    })
}