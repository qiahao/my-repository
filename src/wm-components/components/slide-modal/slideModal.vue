<template>
	<transition name="slide-right" >
		<div   v-clickoutside="clickoutsideHandle" class="wm-slide-modal" :class="{'has-head': $slots.head,'has-foot': $slots.foot}" v-show="modal">
	        <div :class="headClasses" v-if="$slots.head">
		        <slot name="head"></slot>
	        </div>
	        <div :class="mainClasses">
	        	<div class="inner"><slot></slot></div>
	        </div>
	        <div :class="footClasses" v-if="$slots.foot">
	        	<slot name="foot"></slot>
	        </div>
	        <i  class="wm-icon wm-icon-close" @click="close"></i>
	    </div>
    </transition>
</template>
<script>
	const prefixCls = 'wm-slide-modal'
	import clickoutside from '@/directives/clickoutside'
	export default {
		name: 'wmSlideModal',
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
		directives: { clickoutside },
		methods: {
			close (){
				this.modal = false
                this.$emit('input',false)
                this.$emit('slide-modal-close')
                bus.$emit('slide-modal-close')
            },
			clickoutsideHandle() {
				if(this.modal){
					this.close
				}
					
			},
		},
		created (){},
		mounted (){},
	}
	
</script>