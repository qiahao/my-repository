<template>
	<div class="waybill-detail-main">
	<slide-modal v-model="slideModal" style="width:912.2px;">
		 	
	 	<div slot="head">

            <span class="tit">运单详情</span><span  class="model-closed" @click=""></span>
            <span class="order-state ml10">{{orderStateDesc}}</span>
            <span class="insure-status ml10">{{insureStatusDesc}}</span>

            <i-button :disabled="detailData.is_del==='Y'"  size="large" key="save" type="text" @click="orderDeatailSave" class="ml40" style="margin-left:100px"><Icon type="android-checkbox-outline" class="mr10"></Icon>保存</i-button>
            <i-button :disabled="detailData.is_del==='Y'"  size="large" key="sign" type="text" @click="sign"  class="ml20"><Icon type="compose"  class="mr10"></Icon></i>签收</i-button>
            <i-button :disabled="detailData.is_del==='Y'"  size="large" key="insure" type="text" @click="oninsure"  class="ml20"><Icon type="umbrella" class="mr10"></Icon>投保</i-button>
        </div>
        <div class="fix-modal-main">          
            <Tabs :animated="false" style="padding-right:40px" v-model="tabModel">
		        <Tab-pane label="运单详情">
					<order-details :order_id="order_id" :detailData="detailData" ref="odetail" :lsearch="dsearch"></order-details>
				</Tab-pane>
		        <Tab-pane label="地图轨迹" ref="mapTabPand">
		        	<order-detail-map :order_id="order_id" :fresh-map="freshMap"></order-detail-map>
		        </Tab-pane>
		        <Tab-pane label="运单跟踪">
		        	<order-detail-track :order_id="order_id"></order-detail-track>
		        </Tab-pane>
		        <Tab-pane label="操作记录">
		        	<order-detail-logs :order_id="order_id"></order-detail-logs>
		        </Tab-pane>
		        <Tab-pane label="回单记录">
		        	<order-detail-back-log :order_id="order_id"></order-detail-back-log>
		        </Tab-pane>
				<Tab-pane label="异常管理" name="exceptionManage">
					<exception-manage  :order_id="order_id"></exception-manage>
				</Tab-pane>
		        <Tab-pane label="更多备注">
		        	<order-detail-note-list :order_id="order_id"></order-detail-note-list>
		        </Tab-pane>
		        <Tab-pane label="投保详情">
		        	<order-detail-insurance :order_id="order_id" :orderState="orderState" :oninsurance="oninsure"
		        	:onpayfinish="onpayfinish1"
		        	:oninusePay="oninusePay1"
		        	:onreInsure="onreInsure1"
		        	:insureStatus="insureStatus"
		        	></order-detail-insurance>
		        </Tab-pane>
		    </Tabs>
        </div>
		</slide-modal>
	</div>
</template>
<script>
	import { orderDetail} from '@/api/src/waybillApi'
    import orderDetailTrack from './detail-track.vue'
    import orderDetailLogs from './detail-logs.vue'
    import orderDetailBackLog from './detail-back-log.vue'
    import orderDetailNoteList from './detail-note-list.vue'
    import orderDetailInsurance from './detail-insurance.vue'
    import orderDetailMap from './detail-map.vue'
    import orderDetails from './detail-order.vue'
	import exceptionManage from './exception-manage.vue'
	import slideModalMixin from '@/mixins/slideModalMixin'
	export default {
		mixins: [slideModalMixin],
		name: 'orderDetail',
		props: {
			order_id: '',
		    oninsurance: {
		      type: Function,
		      default: null
		    },
		    onpayfinish: {
		      type: Function,
		      default: null
		    },
		    oninusePay: {
		      type: Function,
		      default: null
		    },
		    onreInsure: {
		      type: Function,
		      default: null
		    },
			dsearch: {
		      type: Function,
		      default: null
		    },
		    insureStatus: '',
			value: {require:true}
		},
		data() {
			return {
				orderState: '',
				orderStateDesc: '',
				detailData: '',
				tabModel: 0,

				freshMap: false, // 刷新地图：fixed 地图初始化太小
			}
		},
		components: {
			'order-detail-track': orderDetailTrack,
			'order-detail-logs': orderDetailLogs,
			'order-detail-back-log': orderDetailBackLog,
			'order-detail-note-list': orderDetailNoteList,
			'order-detail-insurance': orderDetailInsurance,
			'order-detail-map': orderDetailMap,
			'order-details': orderDetails,
			exceptionManage,
		},
		methods: {
			oninsure(){
				if (this.oninsurance) {
					this.oninsurance(this.order_id);
				}
			},
			onpayfinish1(){
				if (this.onpayfinish) {
					this.onpayfinish(this.order_id);
				}
			},
			oninusePay1(){
				if (this.oninusePay) {
					this.oninusePay(this.order_id);
				}
			},
			onreInsure1(){
				if (this.onreInsure) {
					this.onreInsure(this.order_id);
				}
			},
			loadOrderDetail() {
				let params = {order_id: this.order_id};
				orderDetail(params).then((data)=>{
					let obj = data.resultObj;
					this.detailData=data.resultObj;
					this.orderState = obj.order_state;
					if (this.orderState=='0') {
						this.orderStateDesc =  '库存运单';
					}else if (this.orderState=='1') {
						this.orderStateDesc =  '转交中';
					}else if (this.orderState=='2') {
						this.orderStateDesc =  '已转交';
					}else if (this.orderState=='3') {
						this.orderStateDesc =  '已签收';
					}else if (this.orderState=='4') {
						this.orderStateDesc =  '已拒绝';
					}else if (this.orderState=='5') {
						this.orderStateDesc =  '已装车';
					}else if (this.orderState=='6') {
						this.orderStateDesc =  '已发车';
					}else{
						this.orderStateDesc =  '';
					}
					
				})
			},
			orderDeatailSave(){
				this.$refs.odetail.buildOrer('buildData');  
			},
			sign(){
				this.$emit('orderSign',this.order_id);
			},
			loadDetail(){
				
			}
		},
		created() {
		},
		watch: {
			order_id(value) {
				this.loadOrderDetail();
			},
			value (){
                this.slideModal = this.value;
            },
            slideModal (n,o){
                this.$emit('input',this.slideModal)
                if (n) {
                    this.loadDetail();
                }
            },
            tabModel (n,o){
            	if (n == 1) {this.freshMap = true }
            }


		},
		computed: {
			
			insureStatusDesc: function(){
				let value = this.insureStatus;
				if (value) {
					if (value == 'N') {
						return '未投保'
					}else if(value == 'Y'){
						return '已投保'
					}else if(value == 'D'){
						return '待支付'
					}else if(value == 'E'){
						return '投保失败'
					}else{
						return '';
					}
				}
			},
			// freshMap: function (){
			// 	return this.tabModel == 1
			// }
		},
		mounted() {

		},
		
	}
</script>
<style scoped="">
	.order-state {
		width: 48px;
		height: 20px;
		font-size: 16px;
		line-height: 1.25;
		text-align: left;
		color: #ff5946;
		/*color: var(--coral);*/
	}
	.insure-status {
		width: 56px;
	    height: 20px;
	    font-size: 14px;
	    text-align: left;
	    color: #09bb07;
	    /*color: var(--vibrant-green);*/
	}
</style>
<style>
.time-section{
  position:relative;
  margin-left: 180px;
  margin-top:12px;
  min-height: 80px;
  padding-bottom: 20px;
  border-left:1px solid #d8d8d8;
  padding-right: 180px;
}
.time-section:last-child{
  border-left:none;
}
.time-section:before{
  position: absolute;
  content: "";
  width: 5px;
  height: 5px;
  border-radius:2px;
  left:-3px;
  top: -8px;
  background: #d8d8d8;
}
.time-section .list-date{
  position: absolute;
  left:-90px;
  top:-15px;
  text-align: right
}
.time-section p{
  position: absolute;
  left:15px;
  top:-16px;
  font-size: 16px;
  color:#000;
  width: 130px;
  margin: 0;
}
.time-section .list-time{
  position: absolute;
  left:15px;
  top:10px;
}
.time-section .list-op{
  position: relative;
  left:150px;
  top: -16px;
  font-size: 16px;
  color:#000;
  width: 100%;
}
</style>
