export const receiptV2Columns = (context) => {
    let vm = context
    return [
        { type: 'selection', width: 60, align: 'center' },
        { width: 170, title: '运单号', key: 'order_no', render: (h,params) => {
            
            return (<span class="text-link" onClick={() => {context.handler2Detail(params.row.order_id)}}>{params.row.order_no}</span>)
        }},
        { width: 170, title: '开单日期', key: 'order_create_time' },
        {
            width: 100, title: '回单状态',
            align: 'center',
            render: (h, params) => {
                let _row = params.row
                return (
                    <span>{vm.backState.call(vm, _row)}</span>
                )
            }
        },
        {
            width: 100, title: '回单类型',
            align: 'center',
            render: (h, params) => {
                let _row = params.row
                return (
                    <span>{vm.backType.call(vm, _row)}</span>
                )
            }
        },
        {
            width: 100, title: '回单份数', key: 'back_nums',
            align: 'center',
            render: (h, params) => {
                let _row = params.row
                return (
                    <span>{(_row.back_nums == "" || _row.back_nums == null || _row.back_nums == "null") ? '无' : _row.back_nums + '份'}</span>
                )
            }
        },
        { width: 120, title: '客户', align: 'center', key: 'send_company' },
        { width: 170, title: '起运地', key: 'begin_area' },
        { width: 150, title: '目的地', key: 'end_area' },
        { width: 100, title: '货物', key: 'c_names' },
        { width: 80, title: '件数', key: 'c_amounts' },
        { width: 170, title: '运单状态', key: 'order_state_desc' },
        { width: 170, title: '发放人', key: 'receipt_user' },
        { width: 170, title: '司机姓名', key: 'driver_name' },
        { width: 170, title: '车牌号码', key: 'truck_plate' },
        { width: 170, title: '车型', key: 'truck_type' },
        { width: 170, title: '车长', key: 'truck_length' },
        { width: 170, title: '电话', key: 'driver_tel' },
        { width: 170, title: '装载', key: 'trip_load' },
        { width: 170, title: '运费', key: 'driver_order_fee' },
        {
            width: 170, title: '发放方式', key: 'receipt_type',
            render: (h, params) => {
                let _row = params.row
                return (
                    <span>{vm.filterReceiptType.call(vm, _row.receipt_type)}</span>
                )
            }
        },
        {
            width: 170, title: '包裹／车号',
            render: (h, params) => {
                let _row = params.row
                if (_row.receipt_type == 1) {
                    return (<span>{_row.driver_mobile}</span>)
                } else if (_row.receipt_type == 2) {
                    return (<span>{_row.express_no}</span>)
                } else {
                    return (<span>无</span>)
                }
            }
        },
        { width: 170, title: '备注', key: 'receipt_remark' },
        {
            width: 170, title: '回单照片', fixed: 'right', align: 'center',
            render: (h, params) => {
                let pics
                if (!params.row.op_pics) {
                    pics = []
                } else{
                    pics = params.row.op_pics.split(',')
                }

                if (pics.length >= 5) {
                    return (
                        <span class="text-link" onClick={vm.openPhotoModal.bind(vm, (params.row))}>查看</span>
                    )
                } else if(pics.length > 0){
                    return (
                        <div>
                            <span class="text-link mr10" onClick={vm.openPhotoModal.bind(vm, (params.row))}>查看</span>
                            <span class="text-link" onClick={vm.openUploadModal.bind(vm, (params.row))}>上传</span>
                        </div>
                    );
                }else{
                    return (
                        <div>
                            <span class="text-link" onClick={vm.openUploadModal.bind(vm, (params.row))}>上传</span>
                        </div>
                    );
                }
            }
        }
    ]
}