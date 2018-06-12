<template>
	<div class="filter-select-main"  v-clickoutside="handleClose">
		<div class="filter-input" @click="selectToggle()">
			<span>筛选</span><span v-show="count>0"  class="ml5 num">{{count}}</span><Icon class="ml10" type="arrow-down-b"></Icon>
		</div>
		<div class="filter-option-main" v-show="togglevalue">
			<ul>
				<li>
					<h3>业务类型</h3>
					<div class="filter-option">
						<Radio-group v-model="filterData.q_bulk_type">
							<Radio label="1"><span @click="changeBulk('1')" :class="{ active: filterData.q_bulk_type=='1'}">整车业务</span></Radio>
							<Radio label="0"><span @click="changeBulk('0')" :class="{ active: filterData.q_bulk_type=='0'}">零担业务</span></Radio>
						</Radio-group>
					</div>
				</li>
				<li>
					<h3>运单状态</h3>
					
					<div class="filter-option">
						<Radio-group v-model="filterData.q_bulk_types">
							<Radio label="q_is_exception"><span @click="changeBulks('q_is_exception')" :class="{ active: filterData.q_bulk_types=='q_is_exception'}">异常运单</span></Radio>
							<Radio label="q_is_reject"><span @click="changeBulks('q_is_reject')" :class="{ active: filterData.q_bulk_types=='q_is_reject'}">退回运单</span></Radio>
							<Radio label="q_is_del"><span @click="changeBulks('q_is_del')" :class="{ active: filterData.q_bulk_types=='q_is_del'}">作废运单</span></Radio>
						</Radio-group>
					</div>
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
					q_bulk_type: '',
					q_bulk_types: '',
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
					this.filterData.q_bulk_type!=''?num++:'';
					this.filterData.q_bulk_types!=''?num++:'';
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
				
				this.filterData.q_bulk_type='';
				this.filterData.q_bulk_types='';
				
			},
			handleClose(){
				this.togglevalue=false;
			},
			changeBulk(e){
				let _vm = this;
				if(this.filterData.q_bulk_type==e){
					setTimeout(function(){
						_vm.filterData.q_bulk_type=''
					},10)
				}
			},
			changeBulks(e){
				let _vm = this;
				if(this.filterData.q_bulk_types==e){
					setTimeout(function(){
						_vm.filterData.q_bulk_types=''
					},10)
				}
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
.filter-option-main li{border-bottom:1px solid #dddee1;padding:5px 0}
.filter-option-main li:last-child{border-bottom:none}
.filter-option-main h3{
	color:#333;
	font-szie:14px;
	height:34px;
	line-height:34px;
}
.filter-option-main .filter-option label{
	margin:0 10px;
	cursor:pointer
}
.filter-option-main .filter-option .ivu-radio{
	display:none
}
.filter-option-main .active{
	font-weight:blod;
	color:#0982cd
}
.filter-foot h3{
	text-align:center;
	color:#0982cd;
	border-top:1px solid #dddee1;
	margin-top:10px;
	cursor:pointer
}
</style>