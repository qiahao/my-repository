// 车次来源
export const dateTypes = [
    { text: '本月', key: '0' }, 
    { text: '上月', key: '1' }, 
    { text: '最近三月', key: '3' }
];
export function getCulomns (){
    return [
        {title: '车次号',key: 'trip_no', width : 170}, 
        {title: '发车日期',key: 'send_time', width : 170}, 
        {title: '司机信息',key: 'driver_info', width : 200}, 
        {title: '车牌号',key: 'truck_plate', width : 100},
        {title: '车载运单收入',key: 'order_fee', width : 150}, 
        {title: '司机运费支出',key: 'fee', width : 120},
        {title: '本车毛利',key: 'income_fee', width : 100},
        {title: '车载运单数',key: 'order_number',width : 100},
        {title: '车次类型',key: 'trip_type', width : 150},
        {title: '落货网点',key: 'company_name', width : 120},
        {title: '到付运费',key: 'driver_pay_arrive', width : 120},
        {title: '总重量',key: 'weights', width : 100},
        {title: '总体积',key: 'volumes', width : 150},
        {title: '总件数',key: 'count', width : 120},
        {title: '装载率',key: 'trip_load', width : 120},
    ]
}

//车次毛利总计列表
export function getTotalCulomns (){
    return [
        {title: '车次总计',key: 'trip_total'},
        {title: '司机运费支出总计',key: 'fee_total', width : 180},
        {title: '本车毛利总计',key: 'income_fee_total', width : 150}, 
        {title: '车载运单收入总计',key: 'order_fee_total', width : 180},
        {title: '车载运单数总计',key: 'order_number_total',width : 150},
        {title: '到付运费总计',key: 'pay_arrive_total', width : 150},
        {title: '件数总计',key: 'count_total'},
        {title: '体积总计',key: 'volumes_total'},
        {title: '重量总计',key: 'weights_total'}
    ]
}

