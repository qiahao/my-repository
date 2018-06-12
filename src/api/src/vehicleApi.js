import axios from 'axios';

const API_VEHICLE_LIST = '/api/driver/list'
const API_VEHICLE_ADD = '/api/driver/add'
const API_VEHICLE_EDIT = '/api/driver/edit'
const API_VEHICLE_DELETE = '/api/driver/del'
const API_VEHICLE_DETAIL = '/api/driver/detail'
const API_GET_YUNBA_DRIVER_INFO = '/api/driver/get_yunba_driver_info'
const API_GET_YUNBA_TRUCK_INFO = '/api/driver/get_yunba_truck_info'

function apiListVehicle(params) {
    return axios({
        url: API_VEHICLE_LIST,
        params: params
    })
}

function apiAddVehicle(params) {
    return axios({
        url: API_VEHICLE_ADD,
        params: params
    })
}

function apiEditVehicle(params) {
    return axios({
        url: API_VEHICLE_EDIT,
        params: params
    })
}

function apiDelVehicle(params) {
    return axios({
        url: API_VEHICLE_DELETE,
        params: params
    })
}

function apiDetailVehicle(params) {
    return axios({
        url: API_VEHICLE_DETAIL,
        params: params
    })
}

function getYunbaDriverInfo(params) {
    return axios({
        url: API_GET_YUNBA_DRIVER_INFO,
        params: params
    })
}

function getYunbaTruckInfo(params) {
    return axios({
        url: API_GET_YUNBA_TRUCK_INFO,
        params: params
    })
}

export { apiListVehicle ,apiAddVehicle ,apiEditVehicle ,apiDelVehicle ,apiDetailVehicle ,getYunbaDriverInfo ,getYunbaTruckInfo}