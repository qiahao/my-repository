export const billStatusMap = {
    N: '未核销',
    D: '部分核销',
    Y: '已核销'
}
export function getCulomns (vm){
    let _this = vm
    return [
        {type: 'selection', width: 60, align: 'center'},
        {title: '对账单名称',key: 'finance_name', width : 150, render: (h,params) => {
            return (<span class="text-link" on-click={() => {_this.handlerRedirectDetail(params.row.finance_id)}}>{params.row.finance_name}</span>)
        }}, 
        {title: '核销状态',key: 'finance_status', width : 80, render: (h,params) => {
            return h('span',billStatusMap[params.row.finance_status])
        }}, 
        {title: '对账单编号',key: 'finance_no', width : 160}, 
        {title: '对账对象',key: 'finance_obj', width : 150}, 
        {title: '应收金额',key: 'finance_income', width : 80}, 
        {title: '实收金额',key: 'finance_income_already', width : 80}, 
        {title: '未核销金额',key: 'finance_income_un', width : 80}, 
        {title: '应付金额',key: 'finance_pay', width : 80}, 
        {title: '实付金额',key: 'finance_pay_already', width : 80}, 
        {title: '未核销金额',key: 'finance_pay_un', width : 80}, 
        {title: '核销人',key: 'create_name', width : 150}, 
        {title: '生成时间',key: 'create_time', width : 150}, 
        {title: '核销时间',key: 'finance_time', width : 150}
    ]
}



// 查询列表 账单状态
export const billStatusMapList = [
    {status : '', label: '全部'},
    {status : 'N', label: '未核销'},
    {status : 'D', label: '部分核销'},
    {status : 'Y', label: '已核销'}
]

// 查询条件
export const query = {
    finance_status: '',
    create_time_begin: '',
    create_time_end: '',
    keyword: ''
}


/**
 * 详情
 */

export function getDetailCulomns (vm) {
    let _this = vm
    return [
        {title: '运单号/车次号',key: 'orderno_tripno', width : 150}, 
        {title: '收付类型',key: 'feepay_type', width : 150,render: (h,params) => {
            return h('span', params.row.feepay_type == '0' ? '支出' : '收入')
        }}, 
        {title: '费用金额',key: 'money', width : 150}, 
        {title: '费用类型',key: 'fee_type', width : 150}, 
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

// 反向核销列表
export const columnsSeletionType = {type: 'selection', width: 60, align: 'center'}
export const VerificationColumns = [
    {title:'核销时间',key: 'record_time',width: 150},
    {title:'应收金额',key: 'income_all',width: 150},
    {title:'本次应收核销',key: 'income_now',width: 150},
    {title:'应付金额',key: 'pay_all',width: 150},
    {title:'本次应付核销',key: 'pay_now',width: 150},
    {title:'核销人',key: 'record_name',width: 150},
    {title:'其他',key: 'record_status',width: 150,render: (h,params)=>{
        return h('span',params.row.record_status == 'N' ? '已反向核销' : '')
    }},
    {title:'核销备注',key: 'record_remark',width: 150},
    {title:'财务记账号',key: 'pay_no',width: 150},

]
export function getVerificationRecordColumns (vm) {
    let _this = vm, columns = [...VerificationColumns]
    return columns
}
export function getVerificationRecordSelectionColumns (vm) {
    let _this = vm, columns = [...VerificationColumns]
    columns.unshift(columnsSeletionType)
    return columns
}