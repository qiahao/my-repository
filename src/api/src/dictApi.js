import axios from 'axios';

// 字典表查询
const DICT_LIST_BY_KEY = '/api/utils/sys/dict/list'
const DICT_PIINT_BY_KEY = '/api/utils/bizdict/get_by_key'

function _byKey(dictKey) {
    return axios({
        url: DICT_LIST_BY_KEY,
        params: { 'dict_key': dictKey }
    })
}

function dictTruckPlateTypeApi() {
    return _byKey('PLATE_TYPE')
}

function dictTruckLengthApi() {
    return _byKey('TRUCK_LENGTH')
}

function dictTruckTypeApi() {
    return _byKey('VEHICLE_TYPE')
}

function dictVehicleTypeApi() {
    return _byKey('VEHICLE_TYPE')
}

function dictCargoPackApi() {
    return _byKey('CARGO_PACK')
}

function dictgetPrintApi() {
    return axios({
        url: DICT_PIINT_BY_KEY,
        params: { 'dict_key': 'ORDER_PRINT_FORMAT' }
    })
}
//日常收支类型
function dictPaymentTypeApi() {
    return _byKey('PAYMENT_TYPE')
}
//日常支付类型
function dictPayTypeApi() {
    return _byKey('PAY_TYPE')
}
export { dictTruckPlateTypeApi, dictTruckLengthApi, dictTruckTypeApi, dictCargoPackApi, dictgetPrintApi ,dictVehicleTypeApi, dictPaymentTypeApi, dictPayTypeApi}