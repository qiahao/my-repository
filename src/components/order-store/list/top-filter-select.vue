<template>
	<div class="filter-select-main" v-clickoutside="handleClose">
		<div class="filter-input" @click="selectToggle()">
			<span>筛选</span>
			<span v-show="count>0" class="ml5 num">{{count}}</span>
			<Icon class="ml10" type="arrow-down-b"></Icon>
		</div>

		<div class="filter-option-main" v-show="toggleValue">
			<ul>
				<li>
					<h3>业务类型</h3>
					<div class="filter-option">
            <div>
              <span v-for="(item,i) in bulkTypes" :key="i"
                    @click="handlerChangeBulk(item.value)" 
                    style="cursor: pointer;"
                    class="mr15"
                    :class="{ active: entity.bulkType == item.value}">{{item.label}}</span>
            </div>
					</div>
				</li>

				<li>
					<h3>运单状态</h3>
					<div class="filter-option">
            <span v-for="(item,i) in orderStates" :key="i"
                  @click="handlerChangeState(item.value)" 
                  style="cursor: pointer;"
                  class="mr15"
                  :class="{ active: entity.orderState == item.value}">{{item.label}}</span>
					</div>
				</li>
				<li>
					<Checkbox v-model="entity.isCreateOwner">只看我开的单</Checkbox>
				</li>
			</ul>
			<div v-show='count>0' class="filter-foot">
				<h3 @click="handlerClear">清空筛选条件</h3>
			</div>
		</div>

	</div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import * as mutationTypes from "@/store/mutation-types.js";
import clickoutside from "@/directives/clickoutside";
const bulkTypes = [
  {label: '整车业务', value: '1'},
  {label: '零担业务', value: '0'}
]
const orderStates = [
  {label: '异常运单', value: 'q_is_exception'},
  {label: '退回运单', value: 'q_is_reject'},
  {label: '作废运单', value: 'q_is_del'},
]

export default {
  props: {
    bulkType: '',
    orderState: '',
    isCreateOwner: false,
  },
  data() {
    return {
      toggleValue: false,

      entity: {
        bulkType: this.bulkType,
        orderState: this.orderState,
        isCreateOwner: this.isCreateOwner,
      },
      bulkTypes,
      orderStates,
    };
  },
  computed: {
    // ...mapState(['onlyShowMyCreatedOrder']),
    count () {
      let num = 0
      for (let k in this.entity) {
        if (this.entity.hasOwnProperty(k) && this.entity[k]) {
          num ++
        }
      }
      return num
    }
  },
  watch: {

    bulkType (n){
      this.entity.bulkType = n
    },
    orderState (n){
      this.entity.orderState = n
    },
    isCreateOwner (n){
      this.entity.isCreateOwner = n
    },
    
    entity: {
      handler: function() {
        this.$emit("on-change", this.entity);
      },
      deep: true
    }
  },
  directives: { 
    clickoutside 
  },
  methods: {
    ...mapMutations({setOnlyShowMyCreatedOrder: mutationTypes.setOnlyShowMyCreatedOrder}),
    selectToggle() {
      this.toggleValue = this.toggleValue ? false : true;
    },
    handlerClear() {
      this.entity ={
        bulkType: '',
        orderState: '',
        isCreateOwner: false,
      }
    },
    handleClose() {
      this.toggleValue = false;
    },
    handlerChangeBulk(type) {
      this.entity.bulkType = this.entity.bulkType == type ? '' : type
    },
    handlerChangeState(type) {
      this.entity.orderState = this.entity.orderState == type ? '' : type
    },
  },
  created() {
    // this.entity.isCreateOwner = this.onlyShowMyCreatedOrder
  },
  mounted() {
  }
};
</script>
<style>
.filter-select-main {
  display: inline-block;
  position: relative;
  font-size: 12px;
  z-index: 5;
  vertical-align: middle;
}
.filter-input {
  background: #fff;
  border: 1px solid #dddee1;
  height: 37px;
  line-height: 35px;
  border-radius: 4px;
  padding: 0 15px;
  cursor: pointer;
}
.filter-input .num {
  border-radius: 8px;
  border: 1px solid #ccc;
  display: inline-block;
  height: 16px;
  width: 16px;
  line-height: 16px;
  text-align: center;
}
.filter-option-main {
  position: absolute;
  left: 0;
  top: 34px;
  border: 1px solid #dddee1;
  background: #fff;
  padding: 10px;
  border-radius: 4px;
  width: 320px;
}
.filter-option-main li {
  border-bottom: 1px solid #dddee1;
  padding: 5px 0;
}
.filter-option-main li:last-child {
  border-bottom: none;
}
.filter-option-main h3 {
  color: #333;
  font-size: 14px;
  height: 34px;
  line-height: 34px;
}
.filter-option-main .filter-option label {
  margin: 0 10px;
  cursor: pointer;
}
.filter-option-main .filter-option .ivu-radio {
  display: none;
}
.filter-option-main .active {
  font-weight: blod;
  color: #0982cd;
}
.filter-foot h3 {
  text-align: center;
  color: #0982cd;
  border-top: 1px solid #dddee1;
  margin-top: 10px;
  cursor: pointer;
}
</style>