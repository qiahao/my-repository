// const orderState = {}
//分配司机货物详情表格设置
import { subStringLimit } from '@/utils/util'
export const COMMON_PARAM_DRRIVER_DETAIL = [
    {
        title: '选中运单',
        key: 'totalCount'
    },
    {
        title: '件数',
        key: 'totalAmount'
    },
    {
        title: '重量(吨)',
        key: 'totalWeight'
    },
    {
        title: '体积(方)',
        key: 'totalVolume'
    },
    {
        title: '到付运费',
        key: 'totalDf'
    },
    {
        title: '代收货款',
        key: 'totalDshk'
    }
]


//服务商列表

const COMMON_PARAM_FA_LIST = [
    { type: 'selection', width: 60 },
    {
        title: '承运商',
        key: 'partener_name',

    },
    {
        title: '线路',
        key: 'partener_route',

    },
    {
        title: '报价',
        key: 'partener_price',

    },
    {
        title: '联系人',
        key: 'partener_link_man',

    }
    ,
    {
        title: '联系电话',
        key: 'partener_link_tel',

    }

]

//签收表格


export const signColumn = (context) => {
    let vm = context
    return [
        {
            title: '运单号',
            key: 'order_no'
        },
        {
            title: '收货人',
            key: 'end_link_man'
        },
        {
            title: '电话号码',
            key: 'end_link_mobile'
        },
        {
            title: '代收货款',
            key: 'fee_dshk'
        }
    ]
}

let colorArray = ['#0071c0', '#febf06', '#fe850a', '#48cc46', '#fe850a', '#febf06', '#fe850a']
export const INDEX_LIST = [
    { type: 'selection', width: 60, align: 'center', fixed: 'left' },
    { title: '运单号', key: 'order_no', width: 180, fixed: 'left' },

    {
        title: '来源', key: 'order_source', width: 130, render (h, params) {
            return h('span', subStringLimit(params.row.order_source, 5))
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
    {
        title: '投保情况', key: 'insurance_state', width: 100, render: (h, params) => {
            let obj = {
                "D": "待支付",
                "N": "未投保",
                "E": "投保失败",
                "Y": "已投保"
            }
            let state = obj[params.row.insurance_state]
            return h('span', {

            }, state)
        }
    },
    { title: '客户', key: 'send_company', width: 130 },
    {
        title: '发货人信息', key: 'begin_link_man', width: 210, render: (h, params) => {
            return h('span', params.row.begin_link_man + ' ' + params.row.begin_link_mobile)
        }
    },
    { title: '始发地', key: 'begin_area', width: 150 },
    { title: '目的地', key: 'end_area', width: 150 },
    {
        title: '收货人信息', key: 'end_link_man', width: 210, render: (h, params) => {
            return h('span', params.row.end_link_man + ' ' + params.row.end_link_mobile)
        }
    },
    { title: '货物名称', key: 'c_names', width: 150 },
    { title: '总件数', key: 'order_count', width: 100 },
    { title: '总重量', key: 'order_weights', width: 100 },
    { title: '总体积', key: 'order_volumes', width: 100 },
    { title: '包装', key: 'c_packs', width: 80 },
    { title: '运费', key: 'fee_transport', width: 80 },
    { title: '提货费', key: 'fee_th', width: 80 },
    { title: '送货费', key: 'fee_sh', width: 80 },
    { title: '保险费', key: 'fee_bx', width: 80 },
    { title: '代收货款', key: 'fee_dshk', width: 80 },
    { title: '代收手续费', key: 'fee_dssx', width: 80 },
    { title: '其他费用', key: 'fee_qt', width: 80 },
    { title: '现付', key: 'pay_xfu', width: 80 },
    { title: '到付', key: 'pay_df', width: 80 },
    { title: '回单付', key: 'pay_hdf', width: 80 },
    { title: '月结', key: 'pay_yj', width: 80 },
    { title: '开单时间', key: 'order_create_time', width: 160 },
    { title: '完成时间', key: 'finish_time', width: 160 },
    { title: '经办人', key: 'create_user_name', width: 80 },
    {
        title: '备注', key: 'shipper_remark', width: 200, render (h, params) {
            params.row.shipper_remark = params.row.shipper_remark || '';
            return h('span', params.row.shipper_remark.slice(0, 20) + (params.row.shipper_remark.length > 20 ? '......' : ''))
        }
    },
    {
        title: '是否异常', key: 'is_exception', width: 90, render (h, params) {

            return h('span', params.row.is_exception === 'Y' ? '是' : '否')
        }
    },
    {
        title: '整车/零担', key: 'bulk_type', width: 100, render (h, params) {
            return h('span', params.row.bulk_type == 1 ? "整车" : "零担")
        }
    },
    { title: '上游单号', key: 'pre_order_no', width: 180 },
]