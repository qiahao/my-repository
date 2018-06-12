
export function getColumns (){
    return [
        {type: 'selection', align: 'center', width : 60}, 
        {title: '运单号',key: 'order_no', width : 180}, 
        {title: '始发地',key: 'begin_area', width : 200}, 
        {title: '目的地',key: 'end_area', width : 200}, 
        {title: '收货人',key: 'end_link_man', width : 100},
        {title: '联系方式',key: 'end_link_mobile', width : 150},
        {title: '货物名称',key: 'cargo_names', width : 230},
        {title: '件数',key: 'cargo_amounts',width : 200},
        {title: '重量',key: 'cargo_weights', width : 200},
        {title: '体积',key: 'cargo_volumes', width : 200},
        {title: '包装',key: 'cargo_packs', width : 200},
        {title: '代收货款',key: 'fee_dshk', width : 100},
        {title: '到付',key: 'pay_df', width : 100},
        {title: '备注',key: 'shipper_remark', width : 100},
        {title: '提货',key: 'is_pickup', width : 100, render:(h, params) => {
                const maps = {"Y":"是", "N":"否"}
                return h('span',maps[params.row.is_pickup])
            }
        },
        {title: '送货',key: 'is_delivery', width : 100, render: (h, params) => {
                const maps = {"Y":"是", "N":"否"}
                return h('span',maps[params.row.is_delivery])
            }
        }
    ]
};


export function getPrintColumns (){
    return [
        {title: '运单号',key: 'order_no',width : 112}, 
        {title: '目的地',key: 'end_area',width : 90}, 
        {title: '收货人',key: 'end_link_man',width : 40},
        {title: '联系方式',key: 'end_link_mobile',width : 80},
        {title: '货物名称',key: 'cargo_names',width : 50},
        {title: '包装',key: 'cargo_packs',width : 40},
        {title: '件数',key: 'cargo_amounts',width : 30},
        {title: '代收货款',key: 'fee_dshk',width : 50},
        {title: '到付',key: 'pay_df',width : 30},
        {title: '提货',key: 'is_pickup',width : 30, render: (h, params) => {
                const maps = {"Y":"是", "N":"否"}
                return h('span',maps[params.row.is_pickup])
            }
        },
        {title: '送货',key: 'is_delivery', width : 30, render: (h, params) => {
                const maps = {"Y":"是", "N":"否"}
                return h('span',maps[params.row.is_delivery])
            }
        },
        {title: '备注',key: 'shipper_remark', width : 90},
    ]
};


export const datailReturnData = {
    send_area:"",
    send_area_p:"",
    send_area_c:"",
    arrive_area:"",
    arrive_area_p:"",
    arrive_area_c:"",
    trip_length:"",
    trip_no:"",
    trip_state:"",
    trip_state_str:"",
    driver_name:"",
    driver_mobile:"",
    truck_plate:"",
    truck_length:"",
    truck_type:"",
    truck_weight:"",
    trip_load:"",
    create_time:"",
    send_time:"",
    arrive_time:"",
    order_counts:"",
    order_volumes:"",
    order_weights:"",
    order_fees:"",
    fee:"",
    pay_method:"",
    pay_detail:"",
    pay_details:{},
    pay_detail_str:"",
    remark:"",
    is_self_trip:"",
    orders: [],
    fee_dshk:'',
    pay_df:'',
};

