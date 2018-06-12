<template>
  <div class="tc">
    <h1>{{title}}</h1>
    <h3>{{secTitle}}</h3>
  </div>
</template>
<script>
export default {
  name: 'page404',
  data () {
    return {
      title: '404 页面不见了',
      secTitle: '请确认页面地址'
    }
  }
}
</script>
<style scoped>
  .tc{
    padding: 50px;
  }
</style>
