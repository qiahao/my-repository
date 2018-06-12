<template>
	<div style="display:inline-block;height:37px;vertical-align:middle;z-index:100">
		<i-input class="wm-drop-input"  type="text" v-model="query"></i-input>
		<calendar-Date></calendar-Date>
	</div>
</template>
<script>
import calendarDate from './calendarDate.vue'
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
	components: {
		calendarDate,
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

</style>