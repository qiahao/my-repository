<template>
  <div>
      <div class="mg50 w300">
          {{city}}
        <city-select class="rlt" v-model="city"></city-select>
      </div>
  </div>
</template>

<script>
export default {
    data () {
        return {
            city: '350101'
        }
    }
}
</script>

<style>

</style>
