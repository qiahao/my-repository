<template>
	<div style="display:inline-block;height:37px;vertical-align:middle">
		<i-input class="wm-drop-input" style="display:none" type="text" v-model="query"></i-input>
		<div class='filter-list'>
			<label v-for="(item,index) in list" :class="{ active: data===item.key}" :key="index"><input type="radio" :value=item.key v-model="data">
				<span @click="stateChange(item.key)">{{item.text}}</span>
			</label>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		value: {
			default: ''
		},
		list: {
			require: true,
		}
	},
	data() {
		return {
			query:'',
			data: ''
		}
	},
	methods: {
		stateChange(e) {
			let _vm = this;
			this.query = this.query == e ? "" : e
			this.$emit('input', this.query)
			setTimeout(function() {
				_vm.$emit('on-change')
				_vm.data = _vm.query;
			}, 10)
		},
	},
	watch: {
		value(n) {
			this.data = n
		},
	},
	mounted() {
	},
}

</script>
<style>
.filter-list {}

.filter-list label {
	position: relative;
	over-flow: hidden;
	vertical-align: top;
	font-size: 0
}

.filter-list input {
	display: none
}

.filter-list span {
	display: inline-block;
	height: 37px;
	line-height: 35px;
	margin: 0;
	padding: 0 16px;
	font-size: 14px;
	color: #495060;
	transition: all 0.2s ease-in-out;
	cursor: pointer;
	border: 1px solid #dddee1;
	border-left: 0;
	background: #fff;
}

.filter-list label:first-child span {
	border-left: 1px solid #dddee1;
}

.filter-list .active span {
	background: #fff;
	border-color: #2d8cf0;
	color: #2d8cf0;
	box-shadow: -1px 0 0 0 #2d8cf0;
}

.filter-list label:first-child span {
	border-top-left-radius: 4px;
	border-bottom-left-radius: 4px
}

.filter-list label:last-child span {
	border-top-right-radius: 4px;
	border-bottom-right-radius: 4px
}
</style>