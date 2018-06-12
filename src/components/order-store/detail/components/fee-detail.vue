<template lang="html">
    <i-form ref="feePayForm" :label-width="90" :model="entity" :rules="rules">

        <!-- 客户运费 -->
        <h4 class="mtb10">客户运费</h4>

        <!-- 费用信息 -->
        <div class="row-box mb10">
            <Row>
                <i-col span="8">
                    <Form-item label="运费：" :rules="rules.numberFixed">
                        <i-input v-model="entity.partner_fees.partner_fee_y" placeholder="请输入运费" :disabled="!isEdit"></i-input>
                    </Form-item>
                </i-col>
                
                <!-- 隐藏项 -->
                <!-- 默认显示了运费 在此排除运费选项 -->
                <i-col span="8" 
                        v-show="partnerFeesShowed.includes(item.type)" 
                        v-if="item.type != 'partner_fee_y'" 
                        v-for="(item,i) in partnerFeeTypes" 
                        :key="i">
                    <Form-item :label="item.text + '：'" :prop="'partner_fees.' + item.type" :rules="rules.numberFixed">
                        <i-input v-model="entity.partner_fees[item.type]" 
                                :placeholder="'请输入' + item.text" 
                                :icon="isEdit ? 'close-circled' : ''" 
                                @on-click="handlerHidePartnerFees(item.type)" 
                                :disabled="!isEdit"></i-input>
                    </Form-item>
                </i-col>
                <!-- 隐藏项 end -->
                <!-- 更多费用 -->
                <!-- 默认显示了运费 在此排除运费选项 -->
                <i-col span="8">
                    <Dropdown class="full-dropdown" @on-click="handlerShowPartnerFees" trigger="click">
                        <span> 更多费用
                            <Icon type="arrow-down-b" class="fr mt10"></Icon>
                        </span>
                        <Dropdown-menu slot="list">
                            <Dropdown-item v-for="(item,i) in partnerFeeTypes" 
                                            v-if="item.type != 'partner_fee_y'" 
                                            :name="item.type" 
                                            :key="i">{{item.text}}</Dropdown-item>
                        </Dropdown-menu>
                    </Dropdown>
                </i-col>
            </Row>
        </div>

        <!-- 付款方式 -->
        <div class="row-box mb10">
            <Row>
                <i-col span="8">
                    <Form-item label="合计费用：" prop="partner_fee">
                        <i-input placeholder="合计费用" :value="entity.partner_fee" readonly></i-input>
                    </Form-item>
                </i-col>

                <i-col span="8">
                    <Form-item label="付款方式：">
                        <i-select v-model="entity.partner_pay_type" 
                                  placement="top" 
                                  @on-change="changePartnerPayType" 
                                  :disabled="!isEdit">
                          <i-option v-for="(item,i) in partnerPayTypes" :value="item.type" :key="i">{{item.text}}</i-option>
                        </i-select>
                    </Form-item>
                </i-col>
                
                <i-col span="8" 
                        v-for="(item,i) in partnerPayTypes" 
                        v-show="entity.partner_pay_type == 'partner_pay_dbf' || entity.partner_pay_type == item.type" 
                        v-if="item.type != 'partner_pay_dbf'" 
                        :key="i">
                    <Form-item :label="item.text + '：'" 
                                :prop="'partner_pays.' + item.type" 
                                :rules="rules.numberFixed">
                        <i-input v-model="entity.partner_pays[item.type]" :placeholder="'请输入' + item.text" :disabled="!isEdit"></i-input>
                    </Form-item>
                </i-col>
            </Row>
        </div>
        <!-- 客户运费 end -->

        
        <!-- 其他费用 根据对应pay_type 判断是否显示 -->
        <!-- 承运商费用 -->
        <template v-if="entity.liner_pay_type">
            <h4 class="mtb10">承运商费用</h4>
            <!-- 承运信息 -->
            <div class="row-box mb10">
                <Row>
                    <i-col span="8">
                        <Form-item label="运费：" :rules="rules.numberFixed">
                            <i-input v-model="entity.liner_fees.liner_fee_y" placeholder="请输入运费" :disabled="!isEdit"></i-input>
                        </Form-item>
                    </i-col>
                    <!-- 隐藏项 -->
                    <!-- 默认显示了运费 在此排除运费选项 -->
                    <i-col span="8" 
                            v-show="linerFeesShowed.includes(item.type)" 
                            v-if="item.type != 'liner_fee_y'" 
                            v-for="(item,i) in linerFeeTypes" 
                            :key="i">
                        <Form-item :label="item.text + '：'" :prop="'liner_fees.' + item.type" :rules="rules.numberFixed">
                            <i-input v-model="entity.liner_fees[item.type]" 
                                      :placeholder="'请输入' + item.text" 
                                      :icon="isEdit ? 'close-circled' : ''" 
                                      @on-click="handlerHideLinerFees(item.type)" 
                                      :disabled="!isEdit"></i-input>
                        </Form-item>
                    </i-col>
                    <!-- 隐藏项 end -->
                </Row>
            </div>
            <div class="row-box mb10" v-if="entry.assign_company_name">
                <Row>
                    <i-col span="24">
                        <Form-item label="承运名称：">
                            {{entry.assign_company_name}}
                        </Form-item>
                    </i-col>
                </Row>
            </div>
            <!-- 付款方式 -->
            <div class="row-box mb10">
                <Row>
                    <i-col span="8">
                        <Form-item label="合计费用：" prop="liner_fee">
                            <i-input placeholder="合计费用" :value="entity.liner_fee" readonly></i-input>
                        </Form-item>
                    </i-col>
                    <i-col span="8">
                        <Form-item label="付款方式：">
                            <i-select placement="top" 
                                      v-model="entity.liner_pay_type" 
                                      @on-change="changeLinerPayType" 
                                      :disabled="!isEdit">
                                <i-option v-for="(item,i) in linerPayTypes" :value="item.type" :key="i">{{item.text}}</i-option>
                            </i-select>
                        </Form-item>
                    </i-col>
                    <i-col span="8" 
                            v-if="item.type != 'liner_pay_dbf'" 
                            v-show="entity.liner_pay_type == 'liner_pay_dbf' || entity.liner_pay_type == item.type" 
                            v-for="(item,i) in linerPayTypes" 
                            :key="i">
                        <Form-item :label="item.text + '：'" 
                                    :prop="'liner_pays.' + item.type" 
                                    :rules="rules.numberFixed">
                            <i-input v-model="entity.liner_pays[item.type]" :placeholder="'请输入' + item.text" :disabled="!isEdit"></i-input>
                        </Form-item>
                    </i-col>
                </Row>
            </div>
        </template>
        <!-- 承运商费用 end -->


        <!-- 司机费用 -->
        <template v-if="entity.driver_pay_type">
            <h4 class="mtb10">司机费用</h4>
            <!-- 承运信息 -->
            <div class="row-box mb10">
                <Row>
                    <i-col span="8">
                        <Form-item label="承运信息："> 指派司机 </Form-item>
                    </i-col>
                    <i-col span="16">
                        <Form-item :label-width="1" class="pl10">
                            <span class="pl10">{{entry.assign_driver_name}}</span>
                            <span class="pl10">{{entry.assign_truck_plate}}</span>
                            <span class="pl10">{{entry.assign_truck_length}}</span>
                            <span class="pl10">{{entry.assign_truck_type}}</span>
                            <span class="pl10">{{entry.assign_driver_mobile}}</span>
                        </Form-item>
                    </i-col>
                </Row>
            </div>
            <!-- 付款方式 -->
            <div class="row-box mb10">
                <Row>
                    <i-col span="8">
                        <Form-item label="运费：" prop="driver_fees.driver_fee_y" :rules="rules.numberFixed">
                            <i-input placeholder="运费" v-model="entity.driver_fees.driver_fee_y" :disabled="!isEdit"></i-input>
                        </Form-item>
                    </i-col>
                    <i-col span="8">
                        <Form-item label="其他：" prop="driver_fees.driver_fee_qt" :rules="rules.numberFixed">
                            <i-input placeholder="其他费用" v-model="entity.driver_fees.driver_fee_qt" :disabled="!isEdit"></i-input>
                        </Form-item>
                    </i-col>
                </Row>
            </div>
            <div class="row-box mb10">
                <Row>
                    <i-col span="8">
                        <Form-item label="合计费用：">
                            <!-- todo : entity.driver_fee == 710.53 时 会显示为 710.530000000001 原因未知 -->
                            {{entity.driver_fee ? entity.driver_fee.toFixed(2) : 0}}
                        </Form-item>
                    </i-col>
                    <i-col span="8">
                        <Form-item label="付款方式：">
                            <i-select placement="top" v-model="entity.driver_pay_type" @on-change="changeDriverPayType" :disabled="!isEdit">
                                <i-option v-for="(item,i) in driverPayTypes" :value="item.type" :key="i">{{item.text}}</i-option>
                            </i-select>
                        </Form-item>
                    </i-col>
                    <i-col span="8" v-for="(item,i) in driverPayTypes" v-if="item.type != 'driver_pay_dbf'" v-show="entity.driver_pay_type == 'driver_pay_dbf' || entity.driver_pay_type == item.type" :key="i">
                        <Form-item :label="item.text + '：'" :prop="'driver_pays.' + item.type" :rules="rules.numberFixed">
                            <i-input v-model="entity.driver_pays[item.type]" :placeholder="'请输入' + item.text" :disabled="!isEdit"></i-input>
                        </Form-item>
                    </i-col>
                </Row>
            </div>
        </template>
        <!-- 司机费用 end -->
    </i-form>
</template>
<script>

import { getTotalNumner,getNumber} from "@/utils";
import {
  partnerFeesTypes,
  partnerPaysTypes,
  partnerFees,
  partnerPays,
  linerPaysTypes,
  linerFeesTypes,
  linerFees,
  linerPays,
  driverFees,
  driverPays,
} from "@/utils/static-dict";
import * as constants from "../constant.js";

// mixins
import detailChildMixin from "@/mixins/detail-child-mixin.js";

import sectionC from "./fee-section-c.js";

// 组件用到的字段
export default {
  name: "orderStoreDetailFeeDetail",
  model: {
    prop: "editting"
  },
  props: {
    editting: false,
    orderId: '',

    // 详情输入承运商名称等
    entry: {
      default() {
        return {
          assign_company_name: ''
        };
      }
    }
  },

  data: function() {
    // 两位小数
    const fixed2Rge = /^\d*(\.\d{1,2})?$/;
    const numberFixed = (rule, value, callback) => {
      if (!!value && !fixed2Rge.test(value))
        callback(new Error("请输入1到2位小数"));
      else callback();
    };
    const partnerFeeValidator = (rule, value, callback) => {
      let _total = 0
      if (this.entity.partner_pay_type === 'partner_pay_dbf') {
          for (let key in this.entity.partner_pays) {
              _total += getNumber(this.entity.partner_pays[key])
          }
      } else {
          _total += getNumber(this.entity.partner_pays[this.entity.partner_pay_type])
      }

      if (!constants.numRge.test(value)) {
          callback(new Error('必须是数字'))
      } else if (_total != getNumber(value)) {
          callback(new Error('客户合计费用与付款总额不等'))
      } else {
          callback()
      }
    }
  
    const linerFeeValidator = (rule, value, callback) => {
			let _total = 0
			if (this.entity.liner_pay_type === 'liner_pay_dbf') {
				for (let key in this.entity.liner_pays) {
					_total += getNumber(this.entity.liner_pays[key])
				}
			} else {
				_total += getNumber(this.entity.liner_pays[this.entity.liner_pay_type])
			}

			if (!constants.numRge.test(value)) {
				callback(new Error('必须是数字'))
			} else if (_total != getNumber(value)) {
				callback(new Error('承运商合计费用与付款总额不等'))
			} else {
				callback()
			}
		}
    
    
    return {
      // 费用 付款详情
      entity: {
        partner_fees: {},
        partner_pays: {},
        liner_fees: {},
        liner_pays: {},
        driver_fees: {},
        driver_pays: {}
      },

      rules: {
        numberFixed: { validator: numberFixed, trigger: "change blur" },
        partner_fee: { validator: partnerFeeValidator, trigger: 'change' },
        liner_fee: { validator: linerFeeValidator, trigger: 'change' }
      },

      /** 客户费用 */
      // 客户费用明细
      partnerFeeTypes: Object.freeze(partnerFeesTypes),
      // 客户付款方式
      partnerPayTypes: Object.freeze(partnerPaysTypes),
      // 客户费用显示项
      partnerFeesShowed: [],

      /** 承运商费用 */
      linerPayTypes: Object.freeze(linerPaysTypes),
      linerFeeTypes: Object.freeze(linerFeesTypes),
      linerFeesShowed: [],
      
      /** 司机费用 */
      
    };
  },
  mixins: [detailChildMixin, sectionC],
  computed: {
    isEdit: {
      get() {
        return this.editting;
      },
      set(val) {
        this.$emit("input", val);
      }
    },


    // 客户运费：合计费用
    partnerTotalFees() {
      let numbersArray = [], excludeKeys = ['partner_fee_dshk','partner_fee_smjz']
      for (let k in this.entity.partner_fees) {
        let num = Number(this.entity.partner_fees[k])
        if (!excludeKeys.includes(k) && this.partnerFeesShowed.includes(k) && !isNaN(num)) {
          numbersArray.push(this.entity.partner_fees[k])
        }
      }
      return getTotalNumner(numbersArray)
    },

    // 承运商运费
    linerTotalFees() {
      let numbersArray = [], excludeKeys = ['liner_fee_dshk','liner_fee_smjz']
      for (let k in this.entity.liner_fees) {
        let num = Number(this.entity.liner_fees[k])
        if (!excludeKeys.includes(k) && this.linerFeesShowed.includes(k) && !isNaN(num)) {
          numbersArray.push(this.entity.liner_fees[k])
        }
      }
      return getTotalNumner(numbersArray)
    },
  },
  watch: {
    // 客户运费：合计费用赋值
    partnerTotalFees (n){
      this.entity.partner_fee = n
      if (this.entity.partner_pay_type != 'partner_pay_dbf') {
        this.entity.partner_pays[this.entity.partner_pay_type] = this.entity.partner_fee
      }
    },
    // 承运商运费：合计费用赋值
    linerTotalFees (n){
      this.entity.liner_fee = n
      if (this.entity.liner_pay_type != 'liner_pay_dbf') {
        this.entity.liner_pays[this.entity.liner_pay_type] = this.entity.liner_fee
      }
    }


  },
  methods: {
    init() {
      this.loadFeepay();
    },
    // 初始化数据
    loadFeepay() {
      let params = { order_id: this.id }
      this.$api.order.getOrderFeepayDetail(params).then(data => {
        if (!data.resultObj) {
          return this.entity = {
            partner_fees: {},
            partner_pays: {},
            liner_fees: {},
            liner_pays: {},
            driver_fees: {},
            driver_pays: {}
          }
        }

        
        // 防止费用和付款方式为空引起的报错
        this.entity = Object.assign({}, data.resultObj);
        let {
          partner_fees,
          partner_pays,
          liner_fees,
          liner_pays,
          driver_fees,
          driver_pays,
        } = data.resultObj

        if (this.entity.driver_fee !== null) this.entity.driver_fee = Number(this.entity.driver_fee);
        

        this.$set(
          this.entity,
          "partner_fees",
          Object.assign({}, partnerFees, partner_fees)
        );
        this.$set(
          this.entity,
          "partner_pays",
          Object.assign({}, partnerPays, partner_pays)
        );
        this.$set(
          this.entity,
          "liner_fees",
          Object.assign({}, linerFees, liner_fees)
        );
        this.$set(
          this.entity,
          "liner_pays",
          Object.assign({}, linerPays, liner_pays)
        );
        this.$set(
          this.entity,
          "driver_fees",
          Object.assign({}, driverFees, driver_fees)
        );
        this.$set(
          this.entity,
          "driver_pays",
          Object.assign({}, driverPays, driver_pays)
        );

        this.partnerFeesShowed = Object.keys(partner_fees);
        this.linerFeesShowed = Object.keys(liner_fees || {});
        // this.entity.liner_fee = Math.abs(this.entity.liner_fee);
      });
    },

    // 客户运费
    handlerShowPartnerFees(type) {
        if (this.partnerFeesShowed.includes(type))
          this.partnerFeesShowed.push(type)
    },
    handlerHidePartnerFees(type) {
        this.partnerFeesShowed.splice(this.partnerFeesShowed.indexOf(type), 1)
        this.entity.partner_fees[type] = 0
    },
    // 改变付款方式 重置被隐藏的付款费用
    // 客户付款方式改变
    changePartnerPayType(type) {
        if (type != 'partner_pay_dbf') {
            for (let key in this.entity.partner_pays) {
                if (key != type) this.entity.partner_pays[key] = ''
                else this.entity.partner_pays[key] = this.entity.partner_fee
            }
        }
    },
    
    // 承运商费用
    // 客户运费
    handlerShowLinerFees(type) {
        if (this.linerFeesShowed.includes(type))
          this.linerFeesShowed.push(type)
    },
    handlerHideLinerFees(type) {
        this.linerFeesShowed.splice(this.linerFeesShowed.indexOf(type), 1)
        this.entity.liner_fees[type] = 0
    },
    // 改变付款方式 重置被隐藏的付款费用
    // 客户付款方式改变
    changeLinerPayType(type) {
        if (type != 'partner_pay_dbf') {
            for (let key in this.entity.liner_pays) {
                if (key != type) this.entity.liner_pays[key] = ''
                else this.entity.liner_pays[key] = this.entity.liner_fee
            }
        }
    },

    // 司机运费
    
    
    
    // 保存费用
    handlerSave() {
      this.$refs.feePayForm.validate(valid => {
        if (valid) {
          let params = {
            order_id: this.id,
            order_feepay_detail: JSON.stringify(this.entity),
            remark: ""
          };
          this.$api.order.editOrderFeepay(params).then(data => {
            this.isEdit = false;
            this.$Message.info(data.resultInfo);
            bus.$emit("order-detail-reload");
            bus.$emit("order-list-reload");
            bus.$emit("operation-reload");
            bus.$emit("save-result");
            this.loadFeepay();
          });
        }
      });
    }
  },
  created() {},
  mounted() {
    // 路由跟新
    bus.$on("detail-fee-detail-update", () => {
      this.loadFeepay();
    });
  }
};
</script>