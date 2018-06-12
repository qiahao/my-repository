<template>
	<div class="pt20">
		<div v-if="insureState==='N'||insureState==='E'">
            <div class="insure-n clearfix  insure-icon-error">
                <span class="error-icon margin-right-10"></span>
                <span class="ml10">您未投保，请点击下方投保按钮，对该运单进行投保。</span>
            </div>
            <i-button class="mt20" key="add" type="primary" @click="insure"><i class="tms-icon tms-icon-add"></i>投保</i-button>
        </div>
        <div v-if="insureState==='D'">
            <div class="insure-n clearfix  insure-icon-warn">
                <span class="warn-icon margin-right-10"></span>
                <span class="margin-left-10">您已投保：{{insureedData.cargo_product}},请在30分钟内完成支付！</span>
            </div>
            <div class="insureresultlist">
                <p></p>
                <p>订单号：{{insureedData.channel_order_no}}</p>
                <p> 投保人：{{insureedData.holder_name}}</p>
                <p>被保险人：{{insureedData.insure_name}}</p>
                <p>保险起止日期：{{insureedData.policy_start}}（起）{{insureedData.policy_end}}（止）
                </p>
                <p>
                    保额：¥{{insureedData.coverage}}
                </p>
                <p>
                    保费：¥{{insureedData.premium}}
                </p>

            </div>
            <div class="clearfix">
            	<i-button key="add" type="primary" @click="reinsure"><i class="tms-icon tms-icon-add"></i>重新投保</i-button>
				<i-button key="add" type="primary" @click="payfinish"><i class="tms-icon tms-icon-add"></i>支付完成</i-button>
				<i-button key="add" type="primary" @click="insurepay"><i class="tms-icon tms-icon-add"></i>去支付</i-button>
            </div>
        </div>
        <div v-if="insureState==='Y'">
            <div class="insure-n clearfix  insure-icon-sucess">
                <span class="sucess-icon margin-right-10"></span>
                <span>您已投保：{{insureedData.product_name}}</span>
            </div>
            <div class="insureresultlist">

                <p>
                    订单号：{{insureedData.channel_order_no}}
                </p>
                <p>
                    保订号：{{insureedData.policy_no}}
                </p>
                <p>
                    投保人：{{insureedData.holder_name}}
                </p>
                <p>
                    被保险人：{{insureedData.insure_name}}
                </p>
                <p>
                    保险起止日期：{{insureedData.policy_start}}（起）{{insureedData.policy_end}}（止）
                </p>
                <p>
                    保额：¥{{insureedData.coverage}}
                </p>
                <p>
                    保费：¥{{insureedData.premium}}
                </p>
                <p>
                    电子保单下载：<br><a :href="insureedData.epolicy_downloadlink" target="_blank">{{insureedData.epolicy_downloadlink}}</a>
                </p>
                <p v-if="insureedData.iseinvoice">
                    电子发票下载：<br><a :href="insureedData.einvoice_url" target="_blank">{{insureedData.einvoice_url}}</a>
                </p>
            </div>
        </div>
	</div>
</template>
<script>
	import { orderDetailLogs,orderDetailInsuranceSave,orderDetailInsuranceInfo} from '@/api/src/waybillApi'
	import config from '@/config/index'
    import emitter from '@/mixins/emitter'
    import detailChildMixin from '@/mixins/detail-child-mixin.js'
	export default {
		name: 'orderDetailInsurance',
        props:{
            detailData:'',
        },
		data() {
			return {
				insureState: '',
				insureedData: {}
			}
		},
		created() {
			
		},
        mixins: [emitter,detailChildMixin],
        mounted () {
            this.init();
            bus.$on("order-detail-reload",()=>{
                vm.loadList();
            })
        },
		methods: {
            init(){
                this.loadList()
            },
			loadList() {
				let params = {order_id: this.id}
				orderDetailInsuranceInfo(params).then((data)=>{
					this.insureedData = data.resultObj.order;
					this.insureState = data.resultObj.insurance_state;
					//this.insureState = 'D';
				})
			},
			insure() {
				let _vm = this;
                bus.$emit("insure-order",Object.assign(_vm.detailData,{'insurance_state':_vm.insureState}))

			},
			reinsure() {
				let _vm = this;
				bus.$emit("insure-order",Object.assign(_vm.detailData,{'insurance_state':_vm.insureState}))
			},
			payfinish() {
				let _vm = this;
				bus.$emit("insure-order",Object.assign(_vm.detailData,{'insurance_state':_vm.insureState}))
			},
			insurepay() {
				let _vm = this;
				bus.$emit("insure-order",Object.assign(_vm.detailData,{'insurance_state':_vm.insureState}))
			}
		},
		watch: {
			order_id(value) {
                if(value!=""){
                    this.loadList();
                }
			},
			insureStatus(value) {
				this.insureState = value;
                if(value!=""){
                    this.loadList();
                }
			}
		},
		computed: {

		}
	}
</script>
<style scoped="">
	
.insure-n{
  height: 44px;
  line-height: 44px;
}
.insure-icon-error{
  color:#d43f3a;
}
.insure-icon-warn{
  color:#f0ad4e;
}
.insure-icon-sucess{
  color:#09bb07;
}

.error-icon{
  position: relative;
  display: inline-block;
  height: 44px;
  width: 44px ;
  border:2px solid #d43f3a;
  border-radius:50%;
  float: left;
}
.error-icon:before{
  content: "";
  position: absolute;
  left:19px;
  top:11px;
  width: 2px;
  height: 20px;
  border:1px solid #d43f3a;
  transform: rotate(-45deg);
}
.error-icon:after{
  content: "";
  position: absolute;
  left:19px;
  top:11px;
  width: 2px;
  height: 20px;
  border:1px solid #d43f3a;
  transform: rotate(45deg);
}

.warn-icon{
  position: relative;
  display: inline-block;
  height: 44px;
  width: 44px ;
  border:2px solid #f0ad4e;
  border-radius:50%;
  float: left;
}
.warn-icon:before{
  content: "";
  position: absolute;
  left:19px;
  top:6px;
  width: 2px;
  height: 20px;
  border:1px solid #f0ad4e;
}
.warn-icon:after{
  content: "";
  position: absolute;
  left:19px;
  top:30px;
  width: 2px;
  height: 3px;
  border:1px solid #f0ad4e;
}

.sucess-icon{
  position: relative;
  display: inline-block;
  height: 44px;
  width: 44px ;
  border:2px solid #09bb07;
  border-radius:50%;
  float: left;
}
.sucess-icon:before{
  content: "";
  position: absolute;
  left:13px;
  top:22px;
  width: 2px;
  height: 8px;
  border:1px solid #09bb07;
  transform: rotate(-35deg);
}
.sucess-icon:after{
  content: "";
  position: absolute;
  left:24px;
  top:11px;
  width: 2px;
  height: 24px;
  border:1px solid #09bb07;
  transform: rotate(50deg);
}
</style>