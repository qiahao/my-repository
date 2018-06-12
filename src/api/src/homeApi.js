import axios from 'axios';
const API_HOME_ORDER_STATE_SCALE = '/api/report/homepage/order-state-scale'
const API_HOME_ORDER_COUNTS_WEIGHTS = '/api/report/homepage/order-counts-weights'
const API_HOME_TRIP_CARRIER_SCALE = '/api/report/homepage/trip-carrier-scale'
const API_HOME_TRIP_SENDS = '/api/report/homepage/trip-sends'

function req(url, params)  {
    return axios({
        url: url,
        params: params
    })
}

// 30日内各状态下的运单的占比
export function reportOrderStateScale(params) {
    return req(API_HOME_ORDER_STATE_SCALE, params)
}

// 7日内日运单数与日运单重量
export function reportOrderCountsWeights(params) {
    return req(API_HOME_ORDER_COUNTS_WEIGHTS, params)
}

// 7日内车次自有与外协司机的占比
export function reportTripCarrierScale(params) {
    return req(API_HOME_TRIP_CARRIER_SCALE, params)
}

// 7日内车次日发车数
export function reportTripSends(params) {
    return req(API_HOME_TRIP_SENDS, params)
}