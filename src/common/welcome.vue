<template>
  <div class="tc">
    <h1>{{title}}</h1>
  </div>
</template>
<script>
export default {
  name: 'welcome',
  data () {
    return {
      title: '欢迎登陆',
    }
  }
}
</script>
<style scoped>
  .tc{
    padding: 50px;
  }
</style>
