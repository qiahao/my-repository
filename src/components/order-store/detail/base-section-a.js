import { mapActions } from 'vuex'
import { getPartnerAll } from '@/api/src/partner'
import * as constants from './constant.js'

export default {
	data () {

		return {
			util: {
				timeOption: {
					disabledDate: (date) => date && date.valueOf() > Date.now()
				},
				sendCompanyList: [], // 客户列表
				truckTypeList: [], // 车型
				truckLengthList: [], // 车长
				provinceOpts: { 'change-on-select': true },
			},
			// 验证
			orderRule: {
				send_company: { required: true, message: '客户名称不能为空' },
				order_create_time: [
					{ required: true, message: '开单时间不能为空' },
				],
				begin_code: { required: true, message: '起始地不能为空' },
				end_code: { required: true, message: '目的地不能为空' },
				begin_link_man: { required: true, message: '托运人不能为空' },
				begin_link_mobile: [
					{ required: true, message: '联系电话不能为空' },
					{ validator: constants.linkPhoneRule, trigger: 'blur' },
				],
				begin_address: { required: true, message: '地址不能为空' },
				end_link_man: { required: true, message: '收货人不能为空' },
				end_link_mobile: [
					{ required: true, message: '联系电话不能为空' },
					{ validator: constants.linkPhoneRule, trigger: 'blur' },
				],
				end_address: { required: true, message: '地址不能为空' },
				req_truck_type: { validator: constants.truckTypeRule(this), trigger: 'change' },
				req_truck_length: { validator: constants.truckLengthRule(this), trigger: 'change' },
			},
		}
	},
	computed: {},
	watch: {},
	methods: {
		...mapActions(['getTruckTypes', 'getTruckLengths']),
		// 初始化
		init () {
			// 初始 获取操作人客户列表
			getPartnerAll({}).then((data) => { this.util.sendCompanyList = data.resultObj })
			// 获取车型 车长
			this.getTruckTypes().then((list) => { this.util.truckTypeList = list })
			this.getTruckLengths().then((list) => { this.util.truckLengthList = list })
		},
		// 出发地
		beginAreaChange (val) {
			this.order.begin_code = val.split('$')[0]
			this.order.begin_area = val.split('$')[1] || this.order.begin_area
		},
		// 目的地
		endAreaChange (val) {
			this.order.end_code = val.split('$')[0]
			this.order.end_area = val.split('$')[1] || this.order.end_area
		},
	},
	created () {
		this.init()
	},
	mounted () { },
	activated () { },
}