<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>

	export default {
	  	name: 'app',
	  	data: function () {
	  		return {}
	  	},
	  	computed: {},
		mounted (){}
	}
</script>

<style>
#app {
	width: 100%;
	height: 100%;
	font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","\5FAE\8F6F\96C5\9ED1",Arial,sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
</style>
