import * as staticDict from '@/utils/static-dict.js'
import moment from 'moment'
import {subStringLimit} from '@/utils/util'
export const driverFeeDetail = { ...staticDict.driverFees };
export const driverPayDetail = { ...staticDict.driverPays };
// 付款类型
export const driverPayTypes = [...staticDict.driverPaysTypes];

export const payTypeText = {
    partner_pay_cash: '现付',
    partner_pay_arrive: '到付',
    partner_pay_back: '回单付',
    partner_pay_hdfk: '货到付款',
    partner_pay_qfu: '欠付',
    partner_pay_hkk: '货款扣',
    partner_pay_month: '月结',
    partner_pay_xfan: '现返',
    partner_pay_qfan: '欠返',
    partner_pay_dbf: '多笔付'
};


export const listFilters = [
    { text:'全部', key:'' },
    { text:'待分配', key:'dfp' },
    { text:'待发车', key:'dfc' },
    { text:'运输中', key:'ysz' }, 
    { text:'待签收', key:'dqs' },
    { text:'已签收', key:'yqs' },
]
/*列表 表格*/
export function getColumns (){
    const colorArray = ['#0071c0', '#febf06', '#fe850a', '#48cc46', '#fe850a', '#febf06', '#fe850a']
    return [
        {type: 'selection', width : 60 , fixed: 'left' },
        {title: '运单号',key: 'order_no', width : 160 , fixed: 'left', render: (h,params) => {
            return (
                <span class="text-link" onClick={() => {this.handler2Detail(params.row.order_id)}}>{params.row.order_no}</span>
            )
        }},
        {
            title: '来源', key: 'order_source', width: 130, render (h, params) {
                return h('span', subStringLimit(params.row.order_source===null?'':params.row.order_source, 5))
            }
        },
        {
            title: '状态', key: 'is_del', width: 100, render: (h, params) => {
                return h('span', {
                    style: {
                        color: params.row.is_del == "Y" ? "#bbb" : colorArray[params.row.order_state]
                    },
                }, params.row.is_del == "Y" ? "已作废" : params.row.order_state_desc)
            }
        },
        {title: '制单员',key: 'create_user_name', width : 180 },
        {title: '客户名称',key: 'send_company', width : 180 },
        {title: '起始地',key: 'begin_area', width : 180 },
        {title: '目的地',key: 'end_area', width : 180 },
        {
            title: '发货人信息', key: 'begin_link_man', width: 210, render: (h, params) => {
                return h('span', params.row.begin_link_man + ' ' + params.row.begin_link_mobile)
            }
        },
        {
            title: '收货人信息', key: 'end_link_man', width: 210, render: (h, params) => {
                return h('span', params.row.end_link_man + ' ' + params.row.end_link_mobile)
            }
        },
        {title: '货物',key: 'c_names', width : 180 },
        {title: '件数',key: 'order_count', width : 80 },
        {title: '总吨数',key: 'order_weights', width : 80 },
        {title: '总方数',key: 'order_volumes', width : 80 },
        {title: '总运费',key: 'pay_total', width : 80 },
        {title: '付款方式',key: 'partner_pay_type', width : 80 , render: (h,params) => {
            return h('span', payTypeText[params.row.partner_pay_type])
        }},
        {title: '备注',key: 'shipper_remark', width : 180, render: (h,params) => {
            let text = subStringLimit(params.row.shipper_remark === null? '' : params.row.shipper_remark, 10)
            return (<span title={params.row.shipper_remark}>{text}</span>)
        } },
        { title: '上游单号', key: 'pre_order_no', width: 180 },
        {title: '开单时间',key: 'order_create_time', width : 180 ,render: (h,params)=>{
            let _time = params.row.order_create_time
            let _class = moment(_time).add(1, 'days') < moment() ? 'text-error' : ''
            return h('span',{class: _class },_time) 
        }},
    ]
}


/*列表 查询*/
export const searchParams = {
    q_order_state: 'dfp',
    q_order_type: '',
    q_bulk_type: '',
    q_is_exception: '',
    q_is_reject: '',
    q_is_del: 'N',
    q_order_no: '',
    q_order_source: '',
    q_shipper_order_no: '',
    q_send_company: '',
    q_begin_link_mobile: '',
    q_receive_company: '',
    q_end_link_mobile: '',
    q_begin_area: '',
    q_end_area: '',
    q_cargo_name: '',
    q_cargo_pack: '',
    q_create_time_begin: '',
    q_create_time_end: '',
    q_finish_time_begin: '',
    q_finish_time_end: '',
    q_create_user_name: '',
    q_create_user_id: '',
    q_keyword: '',
};


/*列表 end*/

// 发布到app


export const appOrder = {
    order_id: '',
    driver_fee: 0,
    driver_fee_detail: { ...staticDict.driverFees },
    driver_pay_type: 'driver_pay_cash',
    driver_pay_detail: { ...staticDict.driverPays },
    req_truck_type: '不限',
    req_truck_length: '不限',
    cargo_publish_minutes: 0,
    remark: '',
};
// 表格设置
export const appColumns = [{
    title: '总运费',
    key: 'pay_total',
    render: function (h, params) {
        return h('span', params.row['pay_total'] || 0)
    }
},
{
    title: '回单付金额',
    render: function (h, params) {
        let _detail = params.row.pay_details || "{}"
        let _n = _detail.partner_pay_back || 0
        return h('span', _n)
    }
},
{
    title: '代收货款金额',
    key: 'fee_dshk',
    render: function (h, params) {
        let _detail = params.row.fee_details || "{}"
        let _n = _detail.partner_fee_dshk || 0
        return h('span', _n)
    }
},
{
    title: '运费到付金额',
    render: function (h, params) {
        let _detail = params.row.pay_details || "{}"
        let _n = _detail.partner_pay_arrive || 0
        return h('span', _n)
    }
},
];

// 发布到app ends
// 
// 
// 指派司机
export const driverOrder = {
    order_ids: '',
    yb_driver_id: '',
    driver_fee: 0,
    driver_fee_detail: { ...driverFeeDetail },
    driver_pay_type: 'driver_pay_cash',
    driver_pay_detail: { ...driverPayDetail },
    fee_divide_type: '0',
    remark: '',
};


export const driverColumnsOrders = [
    { title: '已选运单数', key: 'total' },
    { title: '总运费', key: 'pay_total' },
    { title: '回单付金额', key: 'pay_hdf' },
    { title: '代收货款金额', key: 'fee_dshk' },
    { title: '运费到付金额', key: 'pay_df' }
];

// 司机列表共用
export const driverColumnsDriver = [
    { title: '司机名称', key: 'driver_name' },
    { title: '联系方式', key: 'driver_mobile' },
    { title: '车牌号', key: 'truck_plate' },
    { title: '车型', key: 'truck_type' },
    { title: '车长', key: 'truck_length' },
];

// 指派司机 end