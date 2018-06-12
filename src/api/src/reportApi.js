import axios from 'axios';
import {exportExcel} from '@/utils/util'

const API_REPORT_ORDER_STATISTICS = '/api/report/order/statistics'
const API_REPORT_TRIP_ANALUZE_LIST = '/api/report/queryTripAnalyzeList'
const API_REPORT_ORDER_ANALUZE_LIST = '/api/report/queryOrderAnalyzeList'

// 报表统计
export function reportOrderStatistics(params) {
    return axios({
        url: API_REPORT_ORDER_STATISTICS,
        params: params
    })
}

// 车次毛利分析列表
export function queryTripAnalyzeList(params) {
    return axios({
        url: API_REPORT_TRIP_ANALUZE_LIST,
        params: params
    })
}

//车次毛利分析表导出
export function exportTripAnalyze (params) {
    return exportExcel(params,'/api/utils/excel/tripAnalyze')
}

// 运单毛利分析列表
export function queryOrderAnalyzeList(params) {
    return axios({
        url: API_REPORT_ORDER_ANALUZE_LIST,
        params: params
    })
}

//运单毛利分析表导出
export function exportOrderAnalyze (params) {
    return exportExcel(params,'/api/utils/excel/orderAnalyze')
}