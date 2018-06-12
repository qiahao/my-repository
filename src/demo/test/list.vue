<template>
	<div>
		<div class="contain-head">
      <i-button type="primary" @click="handlerOpenSpin">打开加载</i-button>
      <i-button type="error" @click="handlerCloseSpin">关闭加载</i-button>
		</div>

		<div class="contain-main">
		</div>
	</div>
</template>
<script>
	import loader from '@/common/loader'
	export default {
		data (){
			return {

			}
		},
		components: {},
		methods: {
			// 重写加载详情方法
			handlerOpenSpin () {
        loader.show()
        setTimeout(() => {
          loader.hide()
        }, 3000);
      },
      handlerCloseSpin () {
        loader.hide()
      },
		},
		created (){
		},
		mounted (){
		}
	}
</script>
<style lang="scss" scoped>
</style>
<style lang="scss" >
</style>