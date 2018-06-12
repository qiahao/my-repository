<template>
	<i :class="classes"><slot></slot></i>
</template>
<script>
	const prefixCls = 'wm-icon'
	export default {
		name: 'wmIcon',
		props: {
			type: {require: true}
		},
		computed: {
			classes (){
				return [`${prefixCls}`,[`${prefixCls}-${this.type}`]]
			}
		}
	}
	
</script>

<style>
	.wm-icon{
		position: relative;
		top: -2px;
		line-height: 1;
		vertical-align: middle;
	}
</style>