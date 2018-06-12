const colorArray = ['#febf06', '#48cc46', '#0071c0']

// 车次状态
export const tripStateTypes = [
    { text: '全部', key: '' }, 
    { text: '待发车', key: '0' }, 
    { text: '运输中', key: '1' }, 
    { text: '已到车', key: '2' }
]
// 车次来源
export const tripSourceTypes = [
    { text: '全部', key: '' }, 
    { text: '发站车次', key: 'fz' }, 
    { text: '到站车次', key: 'dz' }
];
const insureTypeMap = { 'Y' : '投保成功', 'D' : '投保中', 'N' : '投保失败', 'U' : '未投保' }
export function getCulomns (){
    return [
        {type: 'selection', width: 60,fixed: 'left', align: 'center'},
        {title: '车次号',key: 'trip_no',fixed: 'left', width : 200, render: (h,params)=>{
            return (<span class="text-link" onClick={() => {this.openTripDetailModal(params.row.trip_id)}}> {params.row.trip_no} </span>)
        }}, 
        {title: '状态',key: 'trip_state_str', width :100, render: (h, params) => {
            return h('span', {
                style: {
                    color: colorArray[params.row.trip_state]
                },
            }, params.row.trip_state_str)
        }},
        {title: '装载',key: 'trip_load', width : 150}, 
        {title: '起点',key: 'send_area', width : 150}, 
        {title: '终点',key: 'arrive_area', width : 150}, 
        {title: '公里数',key: 'trip_length', width : 100},
        {title: '配载运单数',key: 'trip_order_cnt', width : 150},
        {title: '网点',key: 'company_name', width : 150},
        {title: '司机',key: 'driver_name',width : 100},
        {title: '联系方式',key: 'driver_mobile', width : 150},
        {title: '车牌号',key: 'truck_plate', width : 120},
        {title: '车型',key: 'truck_type', width : 150},
        {title: '车长',key: 'truck_length', width : 100},
        {title: '当前位置',key: 'last_addr', width : 300}
    ]
}
export function getXHSCulomns (){
    return [
        {type: 'selection', width: 60,fixed: 'left', align: 'center'},
        {title: '车次号',key: 'trip_no',fixed: 'left', width : 200, render: (h,params)=>{
            return (<span class="text-link" onClick={() => {this.openTripDetailModal(params.row.trip_id)}}> {params.row.trip_no} </span>)
        }}, 
        {title: '状态',key: 'trip_state_str', width :100, render: (h, params) => {
            return h('span', {
                style: {
                    color: colorArray[params.row.trip_state]
                },
            }, params.row.trip_state_str)
        }},
        {title: '投保状态',key: 'insure_status', width : 100, render: (h,params) => {
            return h('span',insureTypeMap[`${params.row.insure_status}`])
        }},
        {title: '装载',key: 'trip_load', width : 150}, 
        {title: '起点',key: 'send_area', width : 150}, 
        {title: '终点',key: 'arrive_area', width : 150}, 
        {title: '公里数',key: 'trip_length', width : 100},
        {title: '配载运单数',key: 'trip_order_cnt', width : 150},
        {title: '网点',key: 'company_name', width : 150},
        {title: '司机',key: 'driver_name',width : 100},
        {title: '联系方式',key: 'driver_mobile', width : 150},
        {title: '车牌号',key: 'truck_plate', width : 120},
        {title: '车型',key: 'truck_type', width : 150},
        {title: '车长',key: 'truck_length', width : 100},
        {title: '当前位置',key: 'last_addr', width : 300}
    ]
}
export const searchParams = {
    q_trip_source:'',
    q_trip_state:'0',
    q_keyword:'',
    q_trip_no: ''
}
