/**
 * 开单基本信息：项目、客户、托运人、收货人选择；
 */
import * as constants from './constants.js'
import { addFloat } from '@/utils/util'

export default {
    data () {
        return {
            util: {
                moreFee: false,
                feeDetailTypes: Object.freeze(constants.feeDetailTypes),
                payDetailTypes: Object.freeze(constants.payDetailTypes),
            },
            orderRule: {
                fee_transport: [
                    { required: true, message: '运费必填' },
                    { validator: constants.validFixed2Number, trigger: 'blur' },
                ],
                pay_total: { validator: constants.proxy(constants.validPayTotal, this), trigger: 'none' },
                validFixed2Number: { validator: constants.validFixed2Number, trigger: 'blur' },
            }
        }
    },
    computed: {
        // 总费用
        totalFee: function () {
            let _total = constants.getNumber(this.order.fee_transport);
            let nums = [this.order.fee_transport]
            let excludeFees = ['partner_fee_smjz', 'partner_fee_dshk']


            if (this.util.moreFee) {
                for (let key in this.order.fee_details) {
                    if (!excludeFees.includes(key)) {
                        nums.push(this.order.fee_details[key])
                    }
                }
                _total = addFloat.apply(null,nums)
            }
            return _total
        }
    },
    watch: {
        // section-d: 根据有效货物计算的总运费
        totalFeeTransport: function (n, o) {
            this.order.fee_transport = n
        },
        // 总费用
        totalFee: function (n, o) {
            this.order.pay_total = n
            if (this.order.pay_type != 'partner_pay_dbf') this.order.pay_details[this.order.pay_type] = n
        }
    },
    methods: {
        // 显示更多费用
        showMoreFee () {
            this.util.moreFee = !this.util.moreFee
        },

        changePayTypeHandler (type) {
            // 其他付款方式置空  多笔付时 当前付款方式也置空

            for (let key in this.order.pay_details) {
                if (key != type) this.order.pay_details[key] = ''
            }
            if (type == 'partner_pay_dbf') this.order.pay_details[type] = ''
            else this.order.pay_details[type] = this.order.pay_total != '0' ? this.order.pay_total : ''
        }
    },
    created () {

    }

}