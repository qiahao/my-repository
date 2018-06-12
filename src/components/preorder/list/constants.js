import { subStringLimit,getArrayIds } from '@/utils/util'

const colorArray = ['#febf06','#48cc46','#0071c0'];
let stateDecArray = ['待审核','已接受','已拒绝'];
export function getConditionList() {
    return [
        { text: '全部', key: '' },
        { text: '待审核', key: '0' },
        { text: '已接受', key: '1' },
        { text: '已拒绝', key: '2' }
    ]
}

export function getColumns() {
    return [
        { type: 'selection', width: 60, fixed: 'left' },
        {
            title: '订单号',
            key: 'order_no',
            fixed: 'left',
            width: 180,
            render: (h, params) => {
                return (<span class="text-link" onClick={() => {this.handler2Detail(params.row.forward_id)}}>{params.row.order_no}</span>)
            }
        },
        {
            title: '来源',
            key: 'source_from',
            width: 100,
            render(h, params) {
                return h('span', subStringLimit(params.row.source_from, 5))
            }
        },
        {
            title: '状态',
            key: 'forward_state',
            width: 80,
            render: (h, params) => {
                return h('span', {
                    style: {
                        color: colorArray[params.row.forward_state]
                    },
                }, stateDecArray[params.row.forward_state])
            }
        },

        { title: '客户', key: 'send_company', width: 130 },
        {
            title: '发货人信息',
            key: 'begin_link_man',
            width: 210,
            render: (h, params) => {
                return h('span', params.row.begin_link_man + ' ' + params.row.begin_link_mobile)
            }
        },
        { title: '始发地', key: 'begin_area', width: 150 },
        { title: '目的地', key: 'end_area', width: 150 },
        {
            title: '收货人信息',
            key: 'end_link_man',
            width: 210,
            render: (h, params) => {
                return h('span', params.row.end_link_man + ' ' + params.row.end_link_mobile)
            }
        },
        { title: '货物名称', key: 'c_names', width: 100 },
        { title: '总件数', key: 'order_count', width: 100 },
        { title: '总重量', key: 'order_weights', width: 100 },
        { title: '总体积', key: 'order_volumes', width: 100 },
        { title: '包装', key: 'c_packs', width: 100 },
        { title: '提货费', key: 'liner_fee_th', width: 80 },
        { title: '送货费', key: 'liner_fee_sh', width: 80 },
        { title: '保险费', key: 'liner_fee_bx', width: 80 },
        { title: '代收货款', key: 'liner_fee_dshk', width: 80 },
        { title: '代收手续费', key: 'liner_fee_dssx', width: 100 },
        { title: '其他费用', key: 'liner_fee_qt', width: 80 },
        { title: '现付', key: 'liner_pay_cash', width: 80 },
        { title: '到付', key: 'liner_pay_arrive', width: 80 },
        { title: '回单付', key: 'liner_pay_back', width: 80 },
        { title: '月结', key: 'liner_pay_month', width: 80 },
        { title: '委托单号', key: 'shipper_order_no', width: 150 },
        { title: '上游转交时间', key: 'forward_time', width: 180 },
        { title: '下游确认时间', key: 'confirm_time', width: 180 },
        { title: '经办人', key: 'confirm_user_name', width: 100 },
        { title: '备注', key: 'shipper_remark', width: 100 }
    ]
}