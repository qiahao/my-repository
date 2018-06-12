<template src="./template.html"></template>
<script>
import emitter from "@/mixins/emitter.js";
// import buildContain from './build-contain.vue'
import orderPrint from "@/components/print/print.vue";

import { mapState, mapMutations } from "vuex";
import {
  setV2OrderState,
  setV2OrderStateCustomer
} from "@/store/mutation-types.js";
import { print ,getNumber,  fmt} from "@/utils";
import * as constants from "./constants.js";

import sectionA from "./section-a.js";
import sectionB from "./section-b.js";
import sectionC from "./section-c.js";
import sectionD from "./section-d.js";
import sectionE from "./section-e.js";

const { round } = Math;

/**
 * store 存储order 信息
 * mounted 时 从store获取order 信息
 * destroy 存储order信息到 store
 */

//订单列表个格设置
export default {
  name: "v2BuildOrder",
  data: function() {
    return {
      printData: {},
      buildOrderForm: null,
      order: constants.initOrder(),
      orderRule: {},
      buildButtonLoading: false,
      buildAndPrintButtonLoading: false,
      isSpeed: false,
      isPickup: false,
      isDelivery: false
    };
  },
  components: { orderPrint },
  mixins: [emitter, sectionA, sectionB, sectionC, sectionD, sectionE],
  computed: {
    ...mapState(["userInfo"])
  },
  watch: {
    
    isSpeed(n) {
      this.order.is_speed = n ? "Y" : "N";
    },
    isPickup(n) {
      this.order.is_pickup = n ? "Y" : "N";
    },
    isDelivery(n) {
      this.order.is_delivery = n ? "Y" : "N";
    }
  },
  methods: {
    // 执行开单操作 通知子组件验证
    doBuild() {
      if (this.buildButtonLoading || this.buildAndPrintButtonLoading) {
        return;
      }
      this.buildButtonLoading = true;
      this.buildOrder(1);
    },
    doBuildAndPrint() {
      if (this.buildButtonLoading || this.buildAndPrintButtonLoading) {
        return;
      }
      this.buildAndPrintButtonLoading = true;
      this.buildOrder(2);
    },
    // 取消开单
    handlerCancelBuild() {
      this.order = constants.initOrder();
      this.buildOrderForm.resetFields();
    },

    printOrder(order) {
      this.printData = Object.assign(order, JSON.parse(order.fee_details));
      this.printData.create_time = fmt.dateFormat(new Date())
      this.$refs.orderPint.$emit('do-print-order', this.printData)
    },

    buildOrder(type = 1) {
      this.buildOrderForm.validate(valid => {
        if (valid) {
          let hasCargo = this.order.cargos.some(item => {
            return !!item.c_name;
          });
          if (hasCargo) {
            let order = constants.getBuildOrderParams(this.order);
            let beginAddr = order.begin_address.split("$");
            let endAddr = order.end_address.split("$");
            order.end_address = endAddr[0];
            order.end_lng = endAddr[1];
            order.end_lat = endAddr[2];
            order.begin_address = beginAddr[0];
            order.begin_lng = beginAddr[1];
            order.begin_lat = beginAddr[2];
            order.create_user_id = this.userInfo.user_id;

            this.$api.order
              .createOrderOwn(order)
              .then(data => {
                if (type != 1) {
                  this.printOrder(order);
                }
                this.isSpeed = false;
                this.isPickup = false;
                this.isDelivery = false;
                this.order = constants.initOrder();

                this.buildOrderForm.resetFields();
                this.order.order_create_time = fmt.dateFormat(new Date())
                this.$Message.info(data.resultInfo);
                this.order.end_address = "";
                this.setButtonLoading();
              })
              .catch(e => {
                this.setButtonLoading();
              });
          } else {
            this.$Message.error("请填写一条有效货物");
            this.setButtonLoading();
          }
        } else {
          this.setButtonLoading();
        }
      });
    },

    setButtonLoading(type = 0, bl = false) {
      switch (type) {
        case 1:
          this.buildButtonLoading = bl;
          break;
        case 2:
          this.buildAndPrintButtonLoading = bl;
          break;
        default:
          this.buildButtonLoading = bl;
          this.buildAndPrintButtonLoading = bl;
          break;
      }
    }
  },
  mounted() {
    this.buildOrderForm = this.$refs.buildOrderForm;
  },
  activated() {
    this.order.order_create_time = fmt.dateFormat(new Date()) //moment().format("YYYY-MM-DD HH:mm:ss");
  }
};
</script>
<style lang="scss" src="./style.scss"></style>