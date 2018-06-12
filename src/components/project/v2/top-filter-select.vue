<template>
	<div class="filter-select-main"  v-clickoutside="handleClose">
		<div class="filter-input" @click="selectToggle()">
			<span>筛选</span><span v-show="count>0"  class="ml5 num">{{count}}</span><Icon class="ml10" type="arrow-down-b"></Icon>
		</div>
		<div class="filter-option-main" v-show="togglevalue">
			<ul>
				<li>
					<h3>客户归属</h3>
					<Radio-group v-model="filterData.prj_self">
						<Radio label=""><span>全部</span></Radio>
						<Radio label="Y"><span>自营</span></Radio>
						<Radio label="N"><span>非自营</span></Radio>
					</Radio-group>
				</li>
				<li>
					<h3>生效状态</h3>
					<CheckboxGroup v-model="filterData.pm_state">
						<Checkbox label="0" >未生效</Checkbox>
						<Checkbox label="1" >已生效</Checkbox>
						<Checkbox label="2" >无效</Checkbox>
						<Checkbox label="3">已过期</Checkbox>
					</CheckboxGroup>
				</li>
			</ul> 
			<div  class="filter-foot">
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
					prj_self: '',
					pm_state: ['0','1','2']
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
					this.filterData.prj_self!=''?num++:'';
					this.filterData.pm_state.length!=0?num++:[];
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
				this.filterData.prj_self=''
				this.filterData.pm_state=['0','1','2']
			},
			handleClose(){
				this.togglevalue=false;
			},
		},
		created (){},
		mounted (){},
		activated (){
			this.filterData = {
					prj_self: '',
					pm_state: ['0','1','2']
				}
		}
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

.filter-foot h3{
	text-align:center;
	color:#0982cd;
	border-top:1px solid #dddee1;
	margin-top:10px;
	cursor:pointer
}
</style>