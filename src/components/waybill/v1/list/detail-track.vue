<template>
        <!-- <Timeline-item v-for="item in track">{{item.op_time}} {{item.op_user_name}} {{item.op_desc}}</Timeline-item> -->
    <div class="pt20">
        <div class="time-section  clearfix" v-for="item in track">
        	<div class="list-date"><span>{{item.op_time | dateFormat('YYYY-MM-DD') }}</span><br/><span>{{item.op_time | dateFormat('HH:mm') }}</span></div>
        	<p  class='p'>{{item.op_user_name}}</p>
        	<div class="list-op clearfix">
        		<div  style="padding-right: 30px">{{item.op_desc}}</div>
        	</div>
        </div>
    </div>
</template>
<script>
	import { orderDetailTrack,orderDetailLogs,orderDetailBackLog,orderDetailNoteList} from '@/api/src/waybillApi'
	import { utilCookie, formatDate} from '@/utils/util'
	import { mapState } from 'vuex'

	export default {
		name: 'orderDetailTrack',
		props: {order_id: ''},
		data() {
			return {
				track: null
			}
		},
		created() {
			
		},
		computed:{
			...mapState(['userInfo']),
		},
		methods: {
			loadList() {
				let _vm = this;
				let user = this.userInfo
				let params = {act_user_id: user.user_id, act_company_id: user.company_id};
	            params.order_id = _vm.order_id;
	            _vm.track = null;
				orderDetailTrack(params).then((data)=>{
					_vm.track = data.resultObj;
				})
			}
		},
		watch: {
			order_id(value) {
				if(value!=""){
					this.loadList();
				}
				
			}
		}
	}
</script>
<style scoped="">

</style>