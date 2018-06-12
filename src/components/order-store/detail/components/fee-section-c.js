/**
 * 司机运费
 */
import { getNumber } from '@/utils/util'
import * as staticDict from '@/utils/static-dict'
import * as constants from '../constant.js'


export default {
	data () {
		const driverFeeValidator = (rule, value, callback) => {
            let _total = 0;
            for (let key in this.entity.driver_pays) {
                _total += getNumber(this.entity.driver_pays[key])
            }
            if (getNumber(this.order.driver_fee) != _total) callback(new Error('合计费用与付款总和不相等'))
            else callback()
        }

		return {
            driverPayTypes: Object.freeze(staticDict.driverPaysTypes),
			rules: {
				 driver_fee: { validator: driverFeeValidator, trigger: 'none' },
			}
		}
	},
	computed: {},
	watch: {
		'entity.driver_fees': {
		    handler(n, o) {
		        let _total = 0
		        for (let key in n) { _total += getNumber(n[key]) }
		        this.entity.driver_fee = _total
		        let _type = this.entity.driver_pay_type
		        if (_type && _type != 'driver_pay_dbf') { this.entity.driver_pays[_type] = _total }

		    },
		    deep: true
		},

	},
	methods: {
		// 司机付款方式改变
		changeDriverPayType(type) {
		    if (type != 'driver_pay_dbf') {
		        for (let key in this.entity.driver_pays) {
		            if (key != type) this.entity.driver_pays[key] = ''
		            else this.entity.driver_pays[key] = this.entity.driver_fee
		        }
		    }
		},
	}
}