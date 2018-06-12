// const orderState = {}
//分配司机货物详情表格设置
export const INSURE_RULE = {
    product_type: [
        { required: true, message: '这是必填项', trigger: 'change' }
    ],
    holder_name: [
        { required: true, message: '这是必填项', trigger: 'blur' }
    ],
    holder_link_name: [
        { required: true, message: '这是必填项', trigger: 'blur' }
    ],
    holder_tel: [
        { required: true, message: '这是必填项', trigger: 'blur' },
        { pattern: /^1[34578]\d{9}$/, message: '正确输入号码格式', trigger: 'blur' }
    ],
    insure_name: [
        { required: true, message: '这是必填项', trigger: 'blur' }
    ],
    order_no: [
        { required: true, message: '这是必填项', trigger: 'blur' }
    ],
    departure_bad: { required: true, message: '这是必填项', trigger: 'blur' },
    departure_ead: { required: true, message: '这是必填项', trigger: 'blur' },
    departure_place_name: [
        { required: true, message: '这是必填项', trigger: 'blur' }
    ],
    destination_place_name: [
        { required: true, message: '这是必填项', trigger: 'blur' }
    ],
    goods_name: [
        { required: true, message: '这是必填项', trigger: 'blur' }
    ],
    pack_type: [
        { required: true, message: '这是必填项', trigger: 'change' }
    ],
    amount: [
        { required: true, message: '这是必填', trigger: 'blur' },
        { pattern: /^[0-9]*[1-9][0-9]*$/, message: '请输入整数', trigger: 'blur' },
    ],
    goods_value: [
        { required: true, message: '这是必填项', trigger: 'blur' },
        { pattern: /^\d+\.?\d{0,2}$/, message: '小数不能超过两位', trigger: 'blur' }
    ],
    trans_no: [
        { required: true, message: '这是必填项', trigger: 'blur' },
        { pattern: /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/, message: '正确输入车牌号码', trigger: 'blur' }

    ],
    expect_start_time: [
        { required: true, message: '请选择日期' }
    ],
}           