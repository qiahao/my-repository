export {
    validatePack, 
    validateAmount, 
    validateWeight, 
    validateVolume, 
    validatePrice
} from '@/components/waybill/v2/build/constants.js'

export const numRge = /^\d*(\.\d+)?$/;
export const num2Rge = /^\d*(\.\d{1,2})?$/;
export const num3Rge = /^\d*(\.\d{1,3})?$/;
export const intRge = /^\d+$/;
export const phoneRge = /^\d{7,12}$/
/*基本信息*/

/*初始化货物常量*/
export const cargo = { c_name: '', c_pack: '', c_amount: '', c_weight: '', c_volume: '', c_price: '', c_price_unit: '', c_price_unit: '元/吨' };



/*表单验证*/

// 包装函数 表单验证绑定this 用
export const proxy = function (fun, context = this) {
    return fun.bind(context)
}

export const linkPhoneRule = function (rule, value, callback) {
    if (!phoneRge.test(value)) {
        callback(new Error('输入11-12位手机或电话号码'))
    } else {
        callback()
    }
}

let truckTypeLength = function (msg) {
    return function (rule, value, callback) {
        if (this.order.bulk_type == 1 && !value) { callback(new Error(msg)) } else { callback() }
    }
}


export const truckTypeRule = (context) => {
    return proxy(truckTypeLength('车型不能为空'), context)
}
export const truckLengthRule = (context) => {
    return proxy(truckTypeLength('车长不能为空'), context)
}

export const curDateLimit = (rule, value, callback) => {
    if (typeof (value) == 'object' && (new Date()).valueOf() <= value.valueOf()) {
        callback(new Error('不能选将来时间'));
    } else {
        callback();
    }
}

// 回单份数验证
export const validateBackNums = function (context) {
    return proxy(function (rule, value, callback) {
        if (this.order.back_type != 'no') {
            if (value === undefined || value === '') callback(new Error('不能为空'))
            else if (!intRge.test(value) || value < 0 || value > 9) callback(new Error('请输入0到9的整数'))
            else callback()
        } else {
            callback()
        }
    }, context)
}