<template>
  <div class="wm-city-contain">
    <ul>
      <li v-for="(item,i) in cityList" @click="handlerClickItem(item)">{{item.label}}</li>
    </ul>
  </div>
</template>

<script>
import Emitter from "@/mixins/emitter";

import { cityList } from "../src/test-data";
export default {
  data() {
    return {
      cityList
    };
  },
  mixins: [Emitter],
  methods: {
    handlerClickItem(item) {
      this.$emit("select-item");
    }
  }
};
</script>

<style>

</style>
