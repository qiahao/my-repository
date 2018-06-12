export function getColums () {
    return [
        { type: 'selection', width: 60, align: 'center' },
        {title: '姓名',key: 'driver_name', width : 160,render: (h,params)=>{
            return h('a', {
                        on:{click:() => this.derecteToDetai(params.row.driver_id) }
                    }, params.row.driver_name)
            } 
        }, 
        { title: '联系电话', key: 'driver_mobile', width: 150 }, 
        { title: '车牌号', key: 'truck_plate', width: 100 }, 
        { title: '类型', key: 'truck_catagory'}, 
        { title: '车型', key: 'truck_type' }, 
        { title: '车长', key: 'truck_length' }, 
        { title: '吨位', key: 'truck_weight' }, 
        { title: '容积', key: 'truck_cube' }, 
        { title: '承运次数', key: 'accept_count' }, 
    ]   
}

export const searchParams = {
    driver_name: '',
    driver_mobile: '',
    truck_plate: ''
}