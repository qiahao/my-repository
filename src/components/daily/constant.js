// 车次来源
export const dateTypes = [
    { text: '本月', key: '0' }, 
    { text: '上月', key: '1' }, 
    { text: '最近三月', key: '3' }
];
export function getCulomns (){
    return [
        {title: '操作', width : 100, align: 'center', render: (h,params)=>{
            return (<div><span class="text-link" onClick={() => {this.openPaymentDetailModal(params.row.payment_id)}}> 修改</span><div class="middle-line"></div><span class="text-link" onClick={() => {this.paymentDel(params.row.payment_id)}}> 删除 </span></div>)
        }},
        {title: '金额（元）',key: 'pay_money', width : 100},
        {title: '类型',key: 'payment_type_text', width : 80}, 
        {title: '收/付款人',key: 'pay', width : 150}, 
        {title: '费用用途',key: 'cost_use', width : 150}, 
        {title: '车牌号',key: 'truck_plate', width : 100},
        {title: '车次号',key: 'trip_no', width : 100},
        {title: '运单号',key: 'order_no', width : 100},
        {title: '开户行',key: 'bank_name',width : 100},
        {title: '银行卡号',key: 'bank_no', width : 150},
        {title: '开户人',key: 'bank_holder', width : 100},
        {title: '微信号',key: 'wx_no', width : 120},
        {title: '支付宝号',key: 'ali_no', width : 100},
        {title: '油卡号',key: 'oil_no', width : 150},
        {title: '备注',key: 'remark', width : 120},
        {title: '操作人',key: 'create_user_name', width : 120},
        {title: '时间',key: 'create_time', width : 150}
    ]
}

