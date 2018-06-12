
export function getRules() {
    return {
        truck_plate: { required: true, message: '车牌号码不能为空', trigger: 'blur' } ,
        truck_length: { required: true, message: '请选择车长', trigger: 'change' }, 
        truck_type: { required: true, message: '请选择车型', trigger: 'blur' } ,
        truck_weight: { required: true, message: '载重不能为空', trigger: 'blur' }, 
        driver_name: { required: true, message: '司机姓名不能为空', trigger: 'blur' }, 
        driver_mobile: { required: true, message: '联系方式不能为空', trigger: 'blur change' }, 
        driver_id_no: { required: true, message: '身份证号不能为空', trigger: 'blur' }, 
        truck_cube: { required: true, message: '容积不能为空', trigger: 'blur' }
    }
}

export function getInitVehicle() {
    return {
        driver_name: '',
        driver_id_no: '',
        driver_qulification_no: '',
        driver_company: '',
        driver_company_road_permit_no: '',
        driver_mobile: '',
        driver_sex: 'M',
        id_front_pic: '',
        id_back_pic: '',
        driver_lisence_pic: '',
        driver_pic: '',
        truck_plate: '',
        truck_plate_type: '',
        truck_vehicle_type: 'H01', // todo 小程序导致新增接口 服务端和需求没给出明确定义
        truck_owner: '',
        truck_tranport_permit_no: '',
        truck_frame: '',
        truck_catagory: '大车(干线)',
        truck_type: '',
        truck_length: '',
        truck_belong: '0',
        truck_weight: '',
        truck_cube: '',
        truck_drive_lisence: '',
        truck_operating_lisence: '',
        truck_pics: '',
    }
}