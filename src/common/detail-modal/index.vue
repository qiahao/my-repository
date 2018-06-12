<template>
	<transition name="slide-right">
		<div class="detail-modal" :class="{'has-head': $slots.head,'has-foot': $slots.foot}" v-show="modal">
	        <div :class="headClasses" v-if="$slots.head">
		        <slot name="head"></slot>
	        </div>
	        <div :class="mainClasses">
	        	<div class="inner"><slot></slot></div>
	        </div>
	        <div :class="footClasses" v-if="$slots.foot">
	        	<slot name="foot"></slot>
	        </div>
	        <Icon type="close-round" @click.native="close"></Icon>
	        <!-- <i class="wm-icon wm-icon-close" @click="close"></i> -->
	    </div>
    </transition>
</template>
<script>
	const prefixCls = 'detail-modal'
	export default {
		name: 'detailModal',
		props: {
			value: {type: Boolean,require: true}
		},
		data (){
			return {
				modal: this.value,
			}
		},
		computed: {
			headClasses (){
				return [`${prefixCls}-head`]
			},
			mainClasses (){
				return [`${prefixCls}-main`]
			},
			footClasses (){
				return [`${prefixCls}-foot`]
			},
		},
		watch: {
			value (n) {
				this.modal = n
			},
		},
		methods: {
			close (){
				this.modal = false
                this.$emit('input',false)
                this.$emit('on-detail-close')
                bus.$emit('on-detail-close')
            }
		},
		created (){},
		mounted (){},
	}
	
</script>

<style lang="scss" src="./detail-modal.scss"></style>

