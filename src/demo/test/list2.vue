<template>
	<div class="ptb50">
		<!-- <upload-image :url-list="list" :hide-if-exist="false" @on-success="successHandler" @on-remove="removeHandler"></upload-image> -->
		<print-trip v-model="printActive" :trip="tripDetail"></print-trip>
	</div>
</template>
<script>

	import uploadImage from '@/common/upload-image'
	import emitter from '@/mixins/emitter.js'
	import printTrip from '@/common/print-trip'
	const tripDetail = {
    "trip_load":"5吨/12方/9.1%",
    "driver_id":"733d0feb-4fb5-4bf6-9cf9-039e410f45fb",
    "fee":"333",
    "trip_state":"2",
    "remark":"",
    "trip_no":"TC-ZJ111180411008",
    "is_b2c":"Y",
    "order_weights":"5.000",
    "truck_plate":"闽A3B117",
    "order_counts":1,
    "trip_state_str":"已到站",
    "order_volumes":"12.000",
    "pay_detail":{"pay_cash":"333","pay_oil":"" },
    "truck_type":"集装箱",
    "trip_id":"08bfe29a-90c1-4ed0-ae9e-ff381d493ed0",
    "create_time":"2018-04-11 09:59:20",
    "truck_weight":"55",
    "arrive_area":"上海-上海-黄浦",
    "trip_length":"93.93",
    "driver_mobile":"17882829393",
    "volumes":"12.00",
    "send_area":"浙江省嘉兴市",
    "pay_method":"0",
    "weights":"5.000",
    "trip_order_cnt":"1",
    "is_self_trip":"Y",
    "arrive_time":"2018-04-11 10:01:26",
    "driver_name":"TANG",
    "order_fees":"5010.00",
    "send_time":"", // 未发车
    "orders":[{"order_no":"ZJ1111804110007",
        "end_area":"上海-上海-黄浦",
        "begin_area":"北京-北京-东城",
        "partner_pay_type":"partner_pay_cash",
        "cargo_names":"巧克力",
        "cargo_packs":"木箱",
        "fee_details":{"partner_fee_y":"5010" },
        "pay_details":{"partner_pay_cash":"5010" },
        "cargo_weights":"5",
        "is_pickup":"N",
        "is_delivery":"N",
        "end_link_mobile":"13066100000",
        "cargo_amounts":"23",
        "receive_company":"",
        "shipper_remark":"",
        "pay_df":"",
        "end_link_man":"老赵",
        "pay_type":"partner_pay_cash",
        "cargo_volumes":"12",
        "fee_dshk":"",
        "order_id":"89fc3557-3864-4978-9eb8-b782fa44a13b"
    }],
    "truck_length":"6.8"
}

	export default {
		data (){
			return {
				order: {
					
				},
				list: [],
				option: {
					autoHide: true
				},
				// 装车清单
				tripDetail: tripDetail,
				printActive: false,
			}
		},
		mixins: [emitter],
		components: {
			uploadImage,
			printTrip,
		},
		methods: {
			successHandler (file,id) {
				this.list = [file.url]
			},
			removeHandler (file,i,id) {
				this.list.splice(i, 1)
			}
		},
		mounted (){
			
		}
	}
</script>
<style scoped>
    
</style>