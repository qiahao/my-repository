/**
 * 运单基本信息
 */
import moment from 'moment'


export const telPhoneRge = /^\d{7,12}$/;
export const numRge = /^\d*(\.\d+)?$/;
export const num2Rge = /^\d*(\.\d{1,2})?$/;
export const num3Rge = /^\d*(\.\d{1,3})?$/;
export const intRge = /^\d+$/;


// 查询初始化
export const projectListParams = {
    page: 1,
    page_size: 10,
    partner_id: '',
    pm_bulk: '',
    pm_state: 1,
    query_string: ''
};



export const customerListParams = {
    keyword: '',
    pcid: '',
};

export const linkListParams = {
    keyword: '',
    pcid: '',
};


export const receiptListParams = {
    keyword: '',
    pcid: '',
};

export const historyCargoListParams = {
    page: 1,
    page_size: 10,
    ship_id: '',
    c_keyword: '',
};




export const valideteTelPhone = (rule, value, callback) => {
    if (!value) callback(new Error('这是必填项'))
    if (!telPhoneRge.test(value)) callback(new Error('输入正确手机或电话号码'))
    else callback()
};





/*客户信息 end*/

/*货物信息*/
/*货物信息 end*/

/*费用信息*/
export const validFixed2Number = function (rule, value, callback) {
    if (value && !num2Rge.test(value)) callback(new Error('请输入1到2位数字'))
    else callback()
}

/*费用信息 end*/


export const getNumber = (num) => {
    let n = 0
    n = isNaN(parseFloat(num)) ? 0 : parseFloat(num)
    n = Math.round(n * 100) / 100 + ''
    return Number(n.replace(/\.00$/, ''))
}

// 包装函数 表单验证绑定this 用
export const proxy = function (fun, context = this) {
    return fun.bind(context)
}

export const getFeeInit = (obj, exclude = [], initVal = 0) => {
    let _rst = {}
    obj.forEach((item) => { if (!exclude.includes(item.type)) _rst[item.type] = initVal })
    return _rst
}


// 费用详情
export const feeDetailTypes = [
    { type: 'partner_fee_th', text: '提货费' },
    { type: 'partner_fee_sh', text: '送货费' },
    { type: 'partner_fee_smjz', text: '声明价值' },
    { type: 'partner_fee_bj', text: '保价费' },
    { type: 'partner_fee_bx', text: '保险费' },
    { type: 'partner_fee_zx', text: '装卸费' },
    { type: 'partner_fee_sl', text: '上楼费' },
    { type: 'partner_fee_bz', text: '包装费' },
    { type: 'partner_fee_az', text: '安装费' },
    { type: 'partner_fee_bg', text: '保管费' },
    { type: 'partner_fee_jc', text: '进仓费' },
    { type: 'partner_fee_dshk', text: '代收货款' },
    { type: 'partner_fee_dssx', text: '代收手续费' },
    { type: 'partner_fee_qt', text: '其他' }
];

// 付款方式
// 注释项：oms 只有5中付款方式，后端接口有做转换
export const payDetailTypes = [
    { type: 'partner_pay_cash', text: '现付' },
    { type: 'partner_pay_arrive', text: '到付' },
    { type: 'partner_pay_back', text: '回单付' },
    { type: 'partner_pay_hdfk', text: '货到付款' },
    { type: 'partner_pay_qfu', text: '欠付' },
    { type: 'partner_pay_hkk', text: '货款扣' },
    { type: 'partner_pay_month', text: '月结' },
    { type: 'partner_pay_xfan', text: '现返' },
    { type: 'partner_pay_qfan', text: '欠返' },
    { type: 'partner_pay_dbf', text: '多笔付' }
];




// 初始化运费详情
export const orderDetailFeeDetails = getFeeInit(feeDetailTypes, [], '')
// 初始化付款详情
export const orderDetailPayDetails = getFeeInit(payDetailTypes, ['partner_pay_dbf'], '')

export const orderDetailCargo = { c_name: '', c_pack: '', c_amount: '', c_weight: '', c_volume: '', c_price: '', c_price_unit: '元/吨' }

// 初始化货物信息

// 初始化运单信息
export const orderDetail = {
    shipper_order_no: '',
    shipper_remark: '',
    create_user_id: '',
    bulk_type: 0,
    is_pickup: 'N',
    is_delivery: 'N',
    order_volumes: '',
    order_weights: '',
    cargos: [],
    cargos_remark: '',
    begin_code: '',
    begin_area: '',
    begin_lng: '0',
    begin_lat: '0',
    begin_address: '',
    begin_link_man: '',
    begin_link_mobile: '',
    end_code: '',
    end_area: '',
    end_lng: '0',
    end_lat: '0',
    end_address: '',
    end_link_man: '',
    end_link_mobile: '',
    fee_transport: '0',
    fee_details: {},
    pay_total: '0',
    pay_type: 'partner_pay_cash',
    pay_details: {},
    back_type: 'no',
    back_type_other: '',
    back_nums: '0',
    is_kzj: 'Y',
    send_company: '',
    receive_company: '',
    expect_arrive_days: '',
    prj_id: '',
    is_speed: 'N',
    special_req: '',
    req_truck_type: '',
    req_truck_length: '',
    send_msg_phone_no: '',
    order_create_time: ''
};

export const initOrder = function () {
    let order = { ...orderDetail }
    let cargos = []
    order.fee_details = { ...orderDetailFeeDetails }
    order.pay_details = { ...orderDetailPayDetails }
    for (let i = 0, l = 3; i < l; i++) {
        cargos[i] = { ...orderDetailCargo }
    }
    order.cargos = cargos

    order.order_create_time = new Date()
    return order
}

/**
 * rule
 */

export const curDateLimit = (rule, value, callback) => {
    if (typeof (value) == 'object' && (new Date()).valueOf() <= value.valueOf()) {
        callback(new Error('不能选将来时间'));
    } else {
        callback();
    }
};

export const truckTypeRule = (msg) => {
    return function (rule, value, callback) {
        if (this.order.bulk_type == 1 && !value) { callback(new Error(msg)) } else { callback() }
    }
}




/*客户信息*/
export const customerRule = {
    begin_code: { required: true, message: '这是必填项', trigger: 'change' },
    end_code: { required: true, message: '这是必填项', trigger: 'change' },
    send_company: { required: true, message: '这是必填项', trigger: 'change' },
    begin_link_man: { required: true, message: '这是必填项', trigger: 'change' },
    end_link_man: { required: true, message: '这是必填项', trigger: 'change' },
    begin_link_mobile: { validator: valideteTelPhone, trigger: 'change' },
    end_link_mobile: { validator: valideteTelPhone, trigger: 'change' },
    begin_address: { required: true, message: '这是必填项' },
    end_address: { required: true, message: '这是必填项' },
    shipper_order_no: { max: 20, message: '长度不能超过20字符' },
    order_create_time: [
        { required: true, message: '这是必填项' },
        { validator: curDateLimit }
    ],
};

// 货物验证

/**
 * 根据货物名称 和单位判断是否必填
 * Tue Sep 26 15:32:26 2017
 * 修改验证规则
 */

// export const validPack = (i) => {
//     return function (rule, value, callback) {
//         let vm = this
//         if (vm.order.cargos[i].c_name && !value) callback(new Error('这是必填项'))
//         else callback()
//     }
// }
// export const validAmount = (i) => {
//     return function (rule, value, callback) {
//         let vm = this
//         if (vm.order.cargos[i].c_name) {
//             if (vm.order.cargos[i].c_price_unit == '元/件') {
//                 if (!value) callback(new Error('请输入件数'))
//                 else if (!intRge.test(value)) callback(new Error('请输入正整数'))
//                 else callback()
//             } else if (!!value) {
//                 if (!intRge.test(value)) callback(new Error('请输入正整数'))
//                 else callback()
//             } else {
//                 callback()
//             }
//         } else {
//             callback()
//         }
//     }
// }
// export const validWeight = (i) => {
//     return function (rule, value, callback) {
//         let vm = this
//         if (vm.order.cargos[i].c_name) {
//             if (vm.order.cargos[i].c_price_unit == '元/吨') {
//                 if (!value) callback(new Error('请输入重量'))
//                 else if (!numRge.test(value)) callback(new Error('请输入数字'))
//                 else if (!num3Rge.test(value) || value <= 0 || value >= 100) callback(new Error('重量需小于100，且小数不能超过3位'))
//                 else callback()
//             } else if (!!value) {
//                 if (!numRge.test(value)) callback(new Error('请输入数字'))
//                 else if (!num3Rge.test(value) || value <= 0 || value >= 100) callback(new Error('重量需小于100，且小数不能超过3位'))
//                 else callback()
//             } else {
//                 callback()
//             }
//         } else {
//             callback()
//         }
//     }
// }
// export const validVolume = (i) => {
//     return function (rule, value, callback) {
//         let vm = this
//         if (vm.order.cargos[i].c_name) {
//             if (vm.order.cargos[i].c_price_unit == '元/方') {
//                 if (!value) callback(new Error('体积不能为空'))
//                 else if (!numRge.test(value)) callback(new Error('请输入数字'))
//                 else if (!num2Rge.test(value) || value <= 0 || value >= 1000) callback(new Error('体积需小于1000，且小数不能超过2位'))
//                 else callback()
//             } else if (!!value) {
//                 if (!numRge.test(value)) callback(new Error('请输入数字'))
//                 else if (!num2Rge.test(value) || value <= 0 || value >= 1000) callback(new Error('体积需小于1000，且小数不能超过2位'))
//                 else callback()
//             } else {
//                 callback()
//             }
//         } else {
//             callback()
//         }
//     }
// }
// export const validPrice = (i) => {
//     return function (rule, value, callback) {
//         let vm = this
//         if (vm.order.cargos[i].c_name) {
//             if (!value) callback(new Error('请输入单价'))
//             else if (!numRge.test(value) || !num2Rge.test(value)) callback(new Error('请输入数字，且小数不能超过2位'))
//             else if (value <= 0 || value >= 10000) callback(new Error('价格需小于10000'))
//             else callback()
//         } else callback()
//     }
// };

// 验证费用总和
export const validPayTotal = function (rule, value, callback) {
    let _total = 0
    for (let key in this.order.pay_details) {
        _total += getNumber(this.order.pay_details[key])
    }
    if (_total != this.order.pay_total) callback(new Error('合计费用与付款总额不相等'))
    else callback()
}

// 回单份数验证
export const validateBackNums = function (rule, value, callback) {
    if (this.order.back_type != 'no') {
        if (value === undefined || value === '') callback(new Error('不能为空'))
        else if (!intRge.test(value) || value < 0 || value > 9) callback(new Error('请输入0到9的整数'))
        else callback()
    } else {
        callback()
    }
}

// 工具方法
export const getBuildOrderParams = function (order) {
    let _order = { ...order }
    // _order.create_user_id = vm.userInfo.user_id
    _order.order_create_time = moment(_order.order_create_time).format('YYYY-MM-DD HH:mm:ss')
    _order.fee_details = JSON.stringify(_order.fee_details)
    delete _order.pay_details.partner_pay_dbf
    _order.pay_details = JSON.stringify(_order.pay_details)
    _order.cargos = JSON.stringify(_order.cargos.filter(item => { return item.c_name }))
    return _order
}


// 18-04 货物验证
/**
 * 有货物名称 包装不能为空
 */
export function validatePack (context) {
    return function (i) {
        function validator(rule,value,callback) {
            if (context.order.cargos[i].c_name && !value) callback(new Error('这是必填项'))
            else callback()
        }
        return [{validator }]
    }
}

/**
 * 有货物名称 件数不能为空
 */
export function validateAmount (context) {
    return function (i) {
        function validator(rule,value,callback) {
            if (context.order.cargos[i].c_name) {
                if (!value) {
                    callback(new Error('这是必填项'))
                }else if (!intRge.test(value)) {
                    callback(new Error('请输入正整数'))
                }else{
                    callback()
                }
            }else {
                callback()
            }
        }
        return [{validator }]
    }
}

export function validateWeight (context) {
    return function (i) {
        function validator(rule,value,callback) {
            if (context.order.cargos[i].c_name) {
                if (value) {
                    if (!numRge.test(value)) {
                        callback(new Error('请输入数字'))
                    }else if(0> value || value >= 100 ){
                        callback(new Error('请输入0-99.999的数字'))
                    }else{
                        callback()
                    }
                } else if(context.order.cargos[i].c_price_unit == '元/吨'){
                    callback(new Error('请输入重量'))
                } else if(context.order.cargos[i].c_price_unit == '元/件' && !context.order.cargos[i].c_volume){
                    callback(new Error('输入重量或体积'))
                } else{
                    callback()
                }
            } else {
                callback()
            }
        }
        return [{validator }]
    }
} 
export function validateVolume (context) {
    return function (i) {
        function validator(rule,value,callback) {
            if (context.order.cargos[i].c_name) {
                if (value) {
                    if (!numRge.test(value)) {
                        callback(new Error('请输入数字'))
                    }else if(0 > value || value >= 1000){
                        callback(new Error('请输入0-999.99的数字'))
                    }else{
                        callback()
                    }
                } else if(context.order.cargos[i].c_price_unit == '元/方'){
                    callback(new Error('请输入体积'))
                } else if(context.order.cargos[i].c_price_unit == '元/件' && !context.order.cargos[i].c_weight){
                    callback(new Error('输入重量或体积'))
                } else{
                    callback()
                }
            } else {
                callback()
            }
        }
        return [{validator }]
    }
} 
export function validatePrice (context) {
    return function (i) {
        function validator(rule,value,callback) {
            if (context.order.cargos[i].c_name) {
                if (!value) {
                    callback(new Error('请输入单价'))
                } else if (!numRge.test(value) || !num2Rge.test(value)) {
                    callback(new Error('请输入数字，且小数不能超过2位'))
                } else if (value < 0 || value > 10000){
                    callback(new Error('请输入0到10000数字'))
                }
                else {
                    callback()
                }
            }else{
                callback()
            }
        }
        return [{validator }]
    }
}