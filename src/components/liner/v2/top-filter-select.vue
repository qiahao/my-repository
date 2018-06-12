<template>
	<div class="filter-select-main"  v-clickoutside="handleClose">
		<div class="filter-input" @click="selectToggle()">
			<span>筛选</span><span v-show="count>0"  class="ml5 num">{{count}}</span><Icon class="ml10" type="arrow-down-b"></Icon>
		</div>
		<div class="filter-option-main" v-show="togglevalue">
			<ul>
				<li>
					<h3>公司类型</h3>
					
					<Radio-group v-model="filterData.liner_type" type="button">
						<Radio label="0"><span>专线公司</span></Radio>
						<Radio label="1"><span>运输车队</span></Radio>
					</Radio-group>
					
				</li>
				<li>
					<h3>邀请类型</h3>
					<Radio-group v-model="filterData.invite_type" type="button">
						<Radio label="1"><span>收到的邀请</span></Radio>
						<Radio label="0"><span>发出的邀请</span></Radio>
					</Radio-group>
				</li>
				<li>
					<h3>下单方式</h3>
					<Radio-group v-model="filterData.liner_order_form" type="button">
						<Radio label="0"><span>人工下单</span></Radio>
						<Radio label="1"><span>在线下单</span></Radio>
					</Radio-group>
				</li>
			</ul> 
			<div v-show='count>0' class="filter-foot">
				<h3 @click="clearCondion">清空筛选条件</h3>
			</div>       
		</div>
		
	</div>
</template>
<script>
	import clickoutside from '@/directives/clickoutside'
	export default {
		props: {
			
		},
		data (){
			return {
				count:'',
				togglevalue: false,
				filterData: {
					liner_type: '',
					invite_type: '',
					liner_order_form: ''

				}
			}
		},
		computed: {

		},
		watch: {
			filterData:{
				handler: function(curVal,oldVal){
                    this.$emit('reload',this.filterData)
					let num = 0;
					this.filterData.liner_type!=''?num++:'';
					this.filterData.invite_type!=''?num++:'';
					this.filterData.liner_order_form!=''?num++:'';
					this.count=num
    　　　　　　　},
                deep:true
			}
			
		},
		directives: {clickoutside},
		methods: {
			selectToggle(){
				this.togglevalue=this.togglevalue?false:true
			},
			clearCondion(){
				this.filterData.liner_type=''
				this.filterData.invite_type=''
				this.filterData.liner_order_form=''
			},
			handleClose(){
				this.togglevalue=false;
			},
		},
		created (){},
		mounted (){},
	}
	
</script>
<style>
.filter-select-main{
	display:inline-block;
	position:relative;
	font-size:12px;
	z-index:5;
	vertical-align: middle;
}
.filter-input{
	background:#fff;
	border:1px solid #dddee1;
	height:37px;
	line-height:35px;
	border-radius:4px;
	padding:0 15px;
	cursor:pointer
}
.filter-input .num{
	border-radius:8px;
	border:1px solid #ccc;
	display:inline-block;
	height:16px;
	width:16px; 
	line-height:16px;
	text-align:center
	}
.filter-option-main{
	position:absolute;
	left:0;top:34px;
	border:1px solid #dddee1;
	background:#fff;
	padding:10px;
	border-radius:4px;
	width:320px;
}

.filter-option-main .ivu-radio-group-button .ivu-radio-wrapper{
	border:none
}
.filter-option-main .ivu-radio-group-button .ivu-radio-wrapper-checked{
	box-shadow:none !important;
}
.filter-foot h3{
	text-align:center;
	color:#0982cd;
	border-top:1px solid #dddee1;
	margin-top:10px;
	cursor:pointer
}
</style>