<template lang="html">
    <div class="order-store-detail">
        <detail-modal v-model="detailShow" @on-detail-close="modalClose" style="width: 1000px">
            <div slot="head">
                <h3 class="fl">运单{{order.order_no}}</h3>
                <Tag class="ml10" color="green">{{order.order_state | stateFilter}}</Tag>
                <div class="fr">
                    <i-button type="primary" icon="edit" size="small" v-show="!editting" @click="handlerDoEdit">编辑</i-button>
                    <i-button type="primary" size="small" v-show="editting" @click="handlerDoSave">保存</i-button>

                    <i-button size="small" type="primary" @click="doCancelAssign" :disabled="order.order_state!=5">取消分配</i-button>
                    <Dropdown @on-click="doAssign" v-show="isEditable">
                        <i-button size="small" type="primary"> 分配 <Icon type="arrow-down-b"></Icon></i-button>
                        <Dropdown-menu slot="list">
                            <Dropdown-item :name="4">分配司机</Dropdown-item>
                            <Dropdown-item :name="5">分配成员</Dropdown-item>
                            <Dropdown-item :name="6">分配承运商</Dropdown-item>
                            <Dropdown-item :name="1" v-if="order_type_zb">分配VIP司机</Dropdown-item>
                            <Dropdown-item :name="2" v-if="order_type_zb">发布VIP货源</Dropdown-item>
                            <Dropdown-item :name="3" v-if="order_type_zb">自动分配</Dropdown-item>
                        </Dropdown-menu>
                    </Dropdown>
                    <i-button size="small" type="primary" @click.native="doSign">签收</i-button>
                    <Dropdown v-show="isEditable">
                        <i-button size="small" type="primary"> 更多 <Icon type="arrow-down-b"></Icon></i-button>
                        <Dropdown-menu slot="list">
                            <Dropdown-item @click.native="doAddException">异常登记</Dropdown-item>
                            <Dropdown-item @click.native="doACancelOrder">作废运单</Dropdown-item>
                            <Dropdown-item @click.native="doPrintTag">打印货签</Dropdown-item>
                            <Dropdown-item @click.native="doPrint">套打运单</Dropdown-item>
                            <Dropdown-item @click.native="doPrintAll">全打运单</Dropdown-item>
                        </Dropdown-menu>
                    </Dropdown>
                </div>
            </div>
            <!-- 内容 -->
            <div>
                <Tabs v-model="currentTab" class="tabs-box" :animated="false">
                    <Tab-pane label="基本信息" :disabled="editting" name="tabBaseInfo">
                        <base-info ref="tabBaseInfo"
                                    v-model="isBaseInfoEdit"
                                    :order="order" 
                                    @after-save="handlerAfterSaveBaseInfo"></base-info>
                                    <!-- :editting="editting"  -->
                    </Tab-pane>
                    
                    <Tab-pane label="费用明细" :disabled="editting" name="tabFeeDetail">
                        <fee-detail ref="tabFeeDetail"
                                    v-model="isFeeDetailEdit" 
                                    :order-id="id" 
                                    :entry="feeDetailEntry"
                                    @after-save="handlerAfterSaveFeeDetail"></fee-detail>
                    </Tab-pane>
                    
                    <Tab-pane label="操作记录" :disabled="editting" name="tabOperationRecord">
                        <operation-record :editting="editting" :is-editable="isEditable"></operation-record>
                    </Tab-pane>
                    
                    <Tab-pane label="物流跟踪" :disabled="editting" name="tabLogisticsTracking">
                        <logistics-tracking  :editting="editting" :order="order" :is-editable="isEditable"></logistics-tracking>
                    </Tab-pane>
                    
                    <Tab-pane label="签收回单" :disabled="editting">
                        <back-log :order="order"></back-log>
                    </Tab-pane>
                    
                    <Tab-pane label="异常管理" :disabled="editting" name="tabExceptionManage">
                        <exception-manage  :editting="editting" :is-editable="isEditable"></exception-manage>
                    </Tab-pane>
                    
                    <Tab-pane label="备注信息" :disabled="editting" name="tabRemarkInfo">
                        <remark-info  :editting="editting" :is-editable="isEditable"></remark-info>
                    </Tab-pane>
                    
                    <Tab-pane label="投保详情" :disabled="editting"  name="tabBaseInsurance">
                        <base-insurance  :editting="editting" :detailData="originOrder"> </base-insurance>
		            </Tab-pane>
                    
                </Tabs>
            </div>
        </detail-modal>

    </div>
</template>
<script>
import { mapState } from "vuex";
import baseInfo from "./base-info.vue";
import logisticsTracking from "./logistics-tracking.vue";
import feeDetail from "./components/fee-detail.vue";
import backLog from "./base-info-back.vue";
import operationRecord from "./operation-record.vue";
import exceptionManage from "./exception-manage.vue";
import baseInsurance from "./base-insurance.vue";
import remarkInfo from "./remark-info.vue";
import * as constants from "./constant.js";
import emitter from "@/mixins/emitter";
import detailModal from "@/common/detail-modal";
import detailMixin from "@/mixins/detail-mixin";

const editableTabsName = ["tabBaseInfo", "tabFeeDetail"];
export default {
  name: "orderStoreDetailIndex",
  data: function() {
    return {
      originOrder: {},
      // 订单详情
      order: {
        fee_details: {},
        pay_details: {},
        cargos: [],
        create_user: {},
        begin_code: ""
      },
      currentTab: "tabBaseInfo",
      editting: false,

      order_type_zb: false,

      // 费用明细
      // assign 对象
      feeDetailEntry: { }
    };
  },
  mixins: [emitter, detailMixin],
  components: {
    baseInfo,
    feeDetail,
    operationRecord,
    exceptionManage,
    remarkInfo,
    backLog,
    logisticsTracking,
    baseInsurance,
    detailModal
  },
  computed: {
    ...mapState(["userInfo", "funcMenu"]),
    isEditable: function() {
      return this.order.is_del !== "Y";
    },

    // 基本信息是否可编辑
    isBaseInfoEdit() {
      return (
        this.order.is_del !== "Y" &&
        this.currentTab == "tabBaseInfo" &&
        this.editting
      );
    },
    
    // 费用明细
    isFeeDetailEdit() {
      return (
        this.order.is_del !== "Y" &&
        this.currentTab == "tabFeeDetail" &&
        this.editting
      );
    },

    tabDisabled() {
      return this.editting && editableTabsName.includes(this.currentTab);
    }
  },
  watch: {},
  methods: {
    init() {
      this.editting = false
      this.loadDetail();
    },
    loadDetail() {
      // 获取详情
      this.$api.order.getOrderDetail({ order_id: this.id }).then(data => {
        let _rst = data.resultObj;
        this.originOrder = { ..._rst }; // 保存用来分配等操作

        // 赋值并 转Json为js
        // 处理数据源 成前端使用数据
        this.order = { ..._rst };
        this.order.fee_details = JSON.parse(_rst.fee_details || "{}");
        this.order.pay_details = JSON.parse(_rst.pay_details || "{}");
        this.order.cargos = JSON.parse(_rst.cargos || "[]");
        let _l = 3 - this.order.cargos.length;
        if (_l) {
          for (let i = 0; i < _l; i++) {
            this.order.cargos.push({ ...constants.cargo });
          }
        }

        // 传入费用明细数据
        this.feeDetailEntry = Object.assign({}, _rst.assign || {})
      });
    },
    modalClose() {
      this.modal = false;
      setTimeout(() => {
        this.$router.push({ path: "/order-store" });
      }, 300);
    },
    copyObject(source) {
      var result = {};
      for (var key in source) {
        result[key] =
          typeof source[key] === "object"
            ? this.copyObject(source[key])
            : source[key];
      }
      return result;
    },
    // 分配
    doAssign(type) {
      let orderObj = this.copyObject(this.originOrder);
      let feeDetails = {};
      let payDetails = {};
      if (orderObj.fee_details != "") {
        feeDetails = JSON.parse(orderObj.fee_details);
        if (feeDetails) {
          orderObj.partner_fee_dshk = feeDetails.partner_fee_dshk;
          orderObj.fee_details = feeDetails;
        }
      }
      if (orderObj.pay_details != "") {
        payDetails = JSON.parse(orderObj.pay_details);
        if (payDetails) {
          orderObj.partner_pay_back = payDetails.partner_pay_back;
          orderObj.partner_pay_arrive = payDetails.partner_pay_arrive;
          orderObj.pay_details = payDetails;
        }
      }
      switch (type) {
        case 1:
          bus.$emit("specify-vip-driver", [orderObj]);
          break;
        case 2:
          bus.$emit("assign-to-app", orderObj);
          // bus.$emit('detail-assign-to-app', orderObj)
          break;
        case 3:
          bus.$emit("detail-assign-carrier", orderObj);
          break;
        case 4:
          bus.$emit("detail-assign-driver", [orderObj]);
          break;
        case 5:
          bus.$emit("detail-assign-member", orderObj);
          break;
        case 6:
          bus.$emit("detail-assign-facilitator", orderObj);
          break;
      }
    },
    // 打印货签
    doPrintTag() {
      this.dispatch("print-tag", this.originOrder);
    },
    // 打印
    doPrint() {
      this.dispatch("print-order", this.originOrder);
    },
    doPrintAll() {
      this.dispatch("print-order-all", this.originOrder);
    },
    // 签收
    doSign() {
      this.order.partner_fee_dshk = this.order.fee_details.partner_fee_dshk;
      bus.$emit("detail-sign", this.order);
    },

    // 更多
    doAddException() {
      this.currentTab = "exceptionManage";
      bus.$emit("add-exception", this.order.order_id);
    },
    // 作废运单
    doACancelOrder() {
      this.$Modal.confirm({
        content: "确定作废该运单",
        onOk: () => {
          this.$api.order.deleteOrder({ order_ids: this.id }).then(data => {
            this.$Message.info(data.resultInfo);
            this.modalClose();
            this.init();
            bus.$emit("order-list-reload");
          });
        },
        onCancel: () => {}
      });
    },
    doCancelAssign() {
      let vm = this;
      let params = {
        trip_id: this.order.trip.trip_id,
        order_ids: vm.id
      };
      this.$Modal.confirm({
        title: "系统提示",
        content: "您确认取消分配该运单吗？",
        onOk: () => {
          this.$api.tripApi.cancelAssign(params).then(data => {
            // 列表重载数据
            // 关闭弹框
            bus.$emit("order-list-reload");
            vm.loadDetail();
            vm.modalClose();
          });
        }
      });
    },
    handlerDoEdit() {
      this.editting = true;
    },

    handlerDoSave(e) {
      if (
        editableTabsName.includes(this.currentTab) &&
        this.$refs[this.currentTab]
      ) {
        this.$refs[this.currentTab].handlerSave();
      }
    },


    // 基本信息
    handlerAfterSaveBaseInfo(){
      this.init();
      bus.$emit('order-list-reload')
    },
    // 费用明细
    handlerAfterSaveFeeDetail() {
      this.init();
      bus.$emit('order-list-reload')
    },
  },
  created() {},
  mounted() {
    // // 更新基本信息
    // bus.$on("updated-base-info", () => {
    //   this.init();
    // });
    // // 运单状态改变 关闭详情
    bus.$on("order-detail-reload", () => {
      this.init();
    });
    bus.$on("order-detail-close", () => {
      this.modalClose();
    });
    bus.$on("save-result", () => {
      this.editting = false;
    });
    this.order_type_zb = this.funcMenu.includes("ORDER_TYPE_ZB");
  },
  filters: {
    stateFilter: function(i) {
      let arr = [ "库存运单", "转交中", "已转交", "已签收", "已拒绝", "已装车", "已发车" ];
      return arr[i];
    }
  }
};
</script>
<style lang="scss" src="./style.scss"></style>