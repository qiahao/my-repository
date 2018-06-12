export function getCulomns (vm){
    let _this = vm
    return [
        {type: 'selection', width: 60, align: 'center'},
        {title: '运单号/车次号',key: 'orderno_tripno', width : 160}, 
        {title: '收付类型',key: 'feepay_type', width : 80,render: (h,params) => {
            return h('span', params.row.feepay_type == '0' ? '支出' : '收入')
        }}, 
        {title: '费用金额',key: 'money', width : 80}, 
        {title: '费用类型',key: 'fee_type', width : 80}, 
        {title: '对象',key: 'pay_object', width : 150}, 
        {title: '客户名称',key: 'partner_name', width : 150}, 
        {title: '起始地',key: 'begin_area', width : 150}, 
        {title: '目的地',key: 'end_area', width : 150}, 
        {title: '发货人信息',key: 'begin_link', width : 150}, 
        {title: '收货人信息',key: 'end_link', width : 150}, 
        {title: '货物',key: 'cargos', width : 150,render: (h,params)=>{
            let cargos = params.row.cargos.map(item => item.c_name).join(',')
            return h('span',cargos)
        }}, 
        {title: '挂账时间',key: 'general_time', width : 160}, 
        {title: '开单时间',key: 'order_create_time', width : 160}, 
    ]
}


// 核销项类型： 列表筛选
export const billTypeMap = {
    '0':'运单收入核销表',
    '1':'运单支出核销表',
    '2':'车费支出核销表',
}
// 列表查询
export const feeQuery = {
    catalog: '0',
    create_time_begin: '',
    create_time_end: '',
    keyword: '',
    truck_owner: ''
}
// 新增编辑账单
export const newBill = {
    item_ids: "",
    finance_name: "",
    finance_obj: ""
}

