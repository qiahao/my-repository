<template>
  <div>
    <i-form ref="baseForm" :label-width="85" :model="order" :rules="orderRule">

      <!-- 项目名称 -->
      <div class="row-box mb10">
        <Row>
          <i-col span="16" v-if="order.prj_id">
            <Form-item label="项目名称：">
              {{order.project.prj_name}}
            </Form-item>
          </i-col>
          <i-col span="8">
            <Form-item label="订单号：">
              {{order.order_no}}
            </Form-item>
          </i-col>
        </Row>
      </div>
      <!-- 委托单号 -->
      <div class="row-box mb10">
        <Row>
          <i-col span="8">
            <Form-item label="委托单号：">
              <i-input v-model="order.shipper_order_no" placeholder="委托单号" :disabled="!editting"></i-input>
            </Form-item>
          </i-col>
          <i-col span="8">
            <Form-item label="运输方式：">
              <Radio-group v-model="order.bulk_type">
                <Radio label="0" :disabled="!editting">零担</Radio>
                <Radio label="1" :disabled="!editting">整车</Radio>
              </Radio-group>
            </Form-item>
          </i-col>
          <i-col span="8" class="error-left">
            <Form-item label="开单时间：" prop="order_create_time">
              <Date-picker :options='util.timeOption' type="datetime" v-model="order.order_create_time" placeholder="选择日期和时间" :disabled="!editting"></Date-picker>
            </Form-item>
          </i-col>
        </Row>
      </div>
      <!-- 收发货人信息 -->
      <div class="row-box mb10">
        <!-- 
                        项目单只允许选择
                        非项目单只允许手动修改
                         -->
        <Row>
          <i-col span="6">
            <Form-item label="客户名称：" prop="send_company">
              <!-- :todo 项目单选择因为组件问题 延后开发 -->
              <!-- <i-select v-if="order.prj_id" v-model="order.send_company" placeholder="请输入客户名称">
                                <i-option v-for="(item,i) in util.sendCompanyList" :key="i" :value="item.cs_company">{{item.cs_company}}</i-option>
                            </i-select>
 -->
              <i-input v-model="order.send_company" placeholder="请输入客户名称" :disabled="!editting"></i-input>
            </Form-item>
          </i-col>
          <i-col span="6">
            <Form-item label="起始地：" prop="begin_code">
              <province-cascader placeholder="请选择起始地" :opts="util.provinceOpts" v-model="order.begin_code" @input="beginAreaChange" :disabled="!editting"></province-cascader>
            </Form-item>
          </i-col>
          <i-col span="6">
            <Form-item label="目的地：" prop="end_code">
              <province-cascader placeholder="请选择目的地" :opts="util.provinceOpts" v-model="order.end_code" @input="endAreaChange" :disabled="!editting"></province-cascader>
            </Form-item>
          </i-col>
          <i-col span="6">
            <Form-item label="是否加急：">
              <!-- <Checkbox v-model="isSpeed">急</Checkbox> -->
              <Checkbox :value="order.is_speed === 'Y'" @on-change="order.is_speed = arguments[0] ? 'Y' : 'N'" :disabled="!editting">急</Checkbox>
            </Form-item>
          </i-col>
        </Row>
        <Row>
          <i-col span="6">
            <Form-item label="托运人：" prop="begin_link_man">
              <i-input v-model="order.begin_link_man" placeholder="请输入托运人" :disabled="!editting"></i-input>
            </Form-item>
          </i-col>
          <i-col span="6">
            <Form-item label="联系电话：" prop="begin_link_mobile">
              <i-input v-model="order.begin_link_mobile" placeholder="请输入联系电话" :disabled="!editting"></i-input>
            </Form-item>
          </i-col>
          <i-col span="10">
            <Form-item label="详细地址：" prop="begin_address">
              <i-input placeholder="请输入详细地址" v-model="order.begin_address" :disabled="!editting"></i-input>
            </Form-item>
          </i-col>
          <i-col span="2">
            <Form-item :label-width="5">
              <Checkbox :value="order.is_pickup === 'Y'" @on-change="order.is_pickup = arguments[0] ? 'Y' : 'N'" :disabled="!editting">提货</Checkbox>
            </Form-item>
          </i-col>
        </Row>
        <Row>
          <i-col span="6">
            <Form-item label="收货人：" prop="end_link_man">
              <i-input placeholder="请输入收货人" v-model="order.end_link_man" :disabled="!editting"></i-input>
            </Form-item>
          </i-col>
          <i-col span="6">
            <Form-item label="联系电话：" prop="end_link_mobile">
              <i-input placeholder="请输入联系电话" v-model="order.end_link_mobile" :disabled="!editting"></i-input>
            </Form-item>
          </i-col>
          <i-col span="10">
            <Form-item label="详细地址：" prop="end_address">
              <i-input placeholder="请输入详细地址" v-model="order.end_address" :disabled="!editting"></i-input>
            </Form-item>
          </i-col>
          <i-col span="2">
            <Form-item :label-width="5">
              <Checkbox :value="order.is_delivery === 'Y'" @on-change="order.is_delivery = arguments[0] ? 'Y' : 'N'" :disabled="!editting">送货</Checkbox>
            </Form-item>
          </i-col>
        </Row>
      </div>
      <!-- 车型选择 -->
      <transition name="fade">
        <div class="row-box mb10" v-show="order.bulk_type == 1">
          <Row>
            <i-col span="24">
              <Form-item class="ivu-form-item-required" label="选择车型：" style="display: inline-block;"></Form-item>
              <Form-item :label-width="1" class="car-select" prop="req_truck_type">
                <i-select placeholder="请选择车型" v-model="order.req_truck_type" :disabled="!editting">
                  <i-option value="">无</i-option>
                  <i-option v-for="(item,index) in util.truckTypeList" :key="index" :value="item.dict_value">{{item.dict_text}}</i-option>
                </i-select>
              </Form-item>
              <Form-item :label-width="10" label=" " class="car-select ivu-form-item-required" prop="req_truck_length">
                <i-select placeholder="请选择车长" v-model="order.req_truck_length" :disabled="!editting">
                  <i-option value="">无</i-option>
                  <i-option v-for="(item,index) in util.truckLengthList" :key="index" :value="item.dict_value">{{item.dict_text}}</i-option>
                </i-select>
              </Form-item>
            </i-col>
          </Row>
        </div>
      </transition>
      <!-- 货物名称 -->
      <div class="row-box mb10">
        <Row class="tc" v-for="(cargo,index) in order.cargos" :key="index">
          <i-col span="4">
            <Form-item :label-width="1">
              <!-- {{item.c_name}} -->
              <editable-drop v-model="cargo.c_name" placeholder="品号/货物名称" :disabled="!editting">
                <editable-drop-option v-for="(item,i) in util.historyCargos" :value="item.c_name" :key="i">
                  {{item.c_name}}
                </editable-drop-option>
              </editable-drop>
            </Form-item>
          </i-col>
          <i-col span="4">
            <Form-item :label-width="1" :prop="'cargos.' + index + '.c_pack'" :rules="orderRule.cargos.c_pack(index)">
              <editable-drop v-model="cargo.c_pack" placeholder="包装" :disabled="!editting">
                <editable-drop-option v-for="(item,i) in util.historyPacks" :value="item.dict_value" :key="i">
                  {{item.dict_value}}
                </editable-drop-option>
              </editable-drop>
            </Form-item>
          </i-col>
          <i-col span="4">
            <Form-item :label-width="1" :prop="'cargos.' + index + '.c_amount'" :rules="orderRule.cargos.c_amount(index)">
              <i-input placeholder="件数（必填）" v-model='cargo.c_amount' :disabled="!editting"></i-input>
            </Form-item>
          </i-col>
          <i-col span="4">
            <Form-item :label-width="1" :prop="'cargos.' + index + '.c_weight'" :rules="orderRule.cargos.c_weight(index)">
              <i-input placeholder="重量（吨）" v-model='cargo.c_weight' :disabled="!editting"></i-input>
            </Form-item>
          </i-col>
          <i-col span="4">
            <Form-item :label-width="1" :prop="'cargos.' + index + '.c_volume'" :rules="orderRule.cargos.c_volume(index)">
              <i-input @on-blur="volumeCacl(cargo)" placeholder="长*宽*高（m³）" v-model='cargo.c_volume' :disabled="!editting"></i-input>
            </Form-item>
          </i-col>
          <i-col span="4">
            <Form-item :label-width="1" class="price-num" :prop="'cargos.' + index + '.c_price'" :rules="orderRule.cargos.c_price(index)">
              <i-input placeholder="单价" v-model='cargo.c_price' :disabled="!editting"></i-input>
            </Form-item>
            <Select class="price-unit" v-model='cargo.c_price_unit' :disabled="!editting">
              <Option value="元/吨">元/吨</Option>
              <Option value="元/件">元/件</Option>
              <Option value="元/方">元/方</Option>
            </Select>
          </i-col>
        </Row>
      </div>
      <!-- 回执信息 -->
      <div class="row-box">
        <Row>
          <Form-item label="回单：" class="back-type">
            <Radio-group v-model="order.back_type" :disabled="!editting">
              <Radio label="no" :disabled="!editting">
                <span>无</span>
              </Radio>
              <Radio label="0" :disabled="!editting">
                <span>回执</span>
              </Radio>
              <Radio label="1" :disabled="!editting">
                <span>原单</span>
              </Radio>
              <Radio label="2" :disabled="!editting">
                <span>收条</span>
              </Radio>
              <Radio label="3" :disabled="!editting">
                <span>电子回单</span>
              </Radio>
              <Radio label="4" :disabled="!editting">
                <span>其他</span>
              </Radio>
            </Radio-group>
          </Form-item>
          <Form-item class="back-type-other" :label-width="1" v-show="order.back_type == 4">
            <i-input v-model="order.back_type_other" placeholder="其他回单" :disabled="!editting"></i-input>
          </Form-item>
          <Form-item class="back-nums" :label-width="1" prop="back_nums">
            共
            <i-input v-model="order.back_nums" placeholder="0" :disabled="!editting"></i-input>份
          </Form-item>
        </Row>
        <Row>
          <i-col span="16">
            <Form-item label="备注：">
              <i-input placeholder="输入备注" v-model="order.shipper_remark" :disabled="!editting"></i-input>
            </Form-item>
          </i-col>
          <i-col span="8">
            <Form-item label="制单员：">
              <span>{{order.create_user ? order.create_user.user_name : ''}}</span>
            </Form-item>
          </i-col>
        </Row>
      </div>
      <!-- 保存
            <div class="cf mtb10" v-show="editting">
                <i-button type="primary" class="fr" @click="handlerSave">保存</i-button>
            </div>
             -->
    </i-form>
  </div>
</template>
<script>
import { fmt } from "@/utils";

// mixins
import sectionA from "./base-section-a.js";
import sectionB from "./base-section-b.js";
import sectionC from "./base-section-c.js";

/**
 * 事件备注
 * bus.$emit('save-base-info') ：点击保存时通知子组件验证信息
 * bus.$emit('updated-base-info') ：修改信息成功通知相关组件重新加载数据—— index.vue 、operation-record.vue
 */
export default {
  name: "baseInfo",
  model: {
    prop: "editting"
  },
  props: {
    order: {
      type: Object,
      default: null
    },
    editting: false
  },
  data: function() {
    return {
      util: {},
      orderRule: {}
    };
  },
  mixins: [sectionA, sectionB, sectionC],
  computed: {
    isEdit: {
      get() {
        return this.editting;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  watch: {},
  methods: {
    handlerSave() {
      let params = { ...this.order };
      this.$refs.baseForm.validate(valid => {
        if (valid) {
          let validCargos = this.order.cargos.filter(item => {
            return item.c_name;
          });
          if (validCargos.length) {
            params.fee_details = JSON.stringify(params.fee_details);
            params.pay_details = JSON.stringify(params.pay_details);
            params.cargos = JSON.stringify(validCargos);
            params.order_create_time = fmt.date(params.order_create_time,"yyyy-MM-dd hh:mm:ss")
            this.updateOrder(params);
            bus.$emit("save-result");
          } else {
            this.$Message.erro("至少输入一条完成货物信息，请检查货物信息");
          }
        } else {
        }
      });
    },
    updateOrder(params) {
      this.$api.order.editOrder(params).then(data => {
        this.$Message.info(data.resultInfo);
        this.editting = false;

        bus.$emit("order-detail-reload");
        bus.$emit("order-list-reload");
        bus.$emit("operation-reload");
        // bus.$emit('detail-fee-detail-update')
      });
    }
  },
  mounted() {
  }
};
</script>