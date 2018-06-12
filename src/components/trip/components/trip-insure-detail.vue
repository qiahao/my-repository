<template>
  <div>
    <!-- top 信息 -->
    <div class="cf">
      <span class="fl tc w60">
        <Icon :type="topInfo.iconType" class="fs30" :class="topInfo.iconClass"></Icon>
      </span>
      <div class="ml60">
        <h3>{{topInfo.title}}</h3>
        <div v-show="detail.insure_status == 'Y'">{{detail.insure_date}} 投保成功 ！</div>
        <div v-show="detail.insure_status == 'D'">投保时间： {{detail.create_time}}</div>
        <div v-show="detail.insure_status == 'N'">{{detail.insure_date}} 投保失败,<span @click="handlerInsure" class="text-link">点击此处</span>重试！</div>
        <div v-show="detail.insure_status == 'U'">您可以<span @click="handlerInsure" class="text-link">点击此处</span>进行投保！</div>
      </div>
    </div>

    <!-- 投保信息 -->
    <template v-if="detail.insure_status == 'Y' || detail.insure_status == 'D'">
      <div class="tc bb mt30 mb20">投保信息</div>
      <div class="row-box row-box-text">
        <Row>
          <i-col span="6">被保险人</i-col> <i-col span="18">{{detail.insure_insurant}}</i-col>
        </Row>
        <Row>
          <i-col span="6">发货日期</i-col> <i-col span="18">{{detail.trip_send_time}}</i-col>
        </Row>
        <Row>
          <i-col span="6">路线</i-col> <i-col span="18">{{detail.trip_line_begin + ' 至 ' + detail.trip_line_end}}</i-col>
        </Row>
        <Row>
          <i-col span="6">车辆牌照</i-col> <i-col span="18">{{detail.trip_truck_plate}}</i-col>
        </Row>
        <Row>
          <i-col span="6">货物类型</i-col> <i-col span="18">{{detail.trip_cargo_type | tripCargoType}}</i-col>
        </Row>
        <Row>
          <i-col span="6">声明价值</i-col> <i-col span="18">{{detail.insure_amount}} 万元</i-col>
        </Row>
        <Row>
          <i-col span="6">预估保费</i-col> <i-col span="18">{{detail.insure_premium}} 元</i-col>
        </Row>
        <Row>
          <i-col span="6">货物名称</i-col> <i-col span="18">{{detail.trip_cargos}}</i-col>
        </Row>
      </div>
    </template>




  </div>
</template>

<script>
import emitter from '@/mixins/emitter.js'
const detail = {
  insure_id: '', //	String	否	投保ID
  trip_id: '', //	String	否	车次ID
  insure_status: 'Y', //	String	否	投保状态 D投保中 Y已投保 N投保失败 U未投保
  insure_company: '', //	String	否	保险公司
  insure_policy_holder: '', //	String	否	投保人
  insure_insurant: '', //	String	否	被保险人
  insure_date: '', //	String	否	投保时间
  insure_amount: '', //	String	否	投保保额/货物声明价值
  insure_premium: '', //	String	否	投保保费/预估保费
  insure_is_agree: 'Y', //	String	否	是否同意 Y同意 N不同意
  trip_send_time: '', //	String	否	发货时间
  trip_line_begin: '', //	String	否	运输路线起始地
  trip_line_end: '', //	String	否	运输路线目的地
  trip_cargo_type: '0', //	String	否	货物类型 0普通货物 1 整车机械设备、电子产品、工程机械
  trip_truck_plate: '', //	String	否	车辆牌照
  trip_cargos: '' //	String	否	货物信息
};

const titles = { 'Y' : '投保成功！', 'D' : '投保中...', 'N' : '投保失败！', 'U' : '车次未投保！' }
const iconTypes = { 'Y' : 'checkmark-circled', 'D' : 'information-circled', 'N' : 'close-circled', 'U' : 'help-circled' }
const iconClasses = { 'Y' : 'text-success', 'D' : 'text-warning', 'N' : 'text-error', 'U' : 'text-warning' }

const cargoTypes = {'0': '普通货物', '1': '整车机械设备、电子产品、工程机械'}


export default {
  props: {
    tripId: '',
  },
  data() {
    return {
      detail: { ...detail},
    };
  },
  computed: {
    topInfo () {
      return {
        title: titles[`${this.detail.insure_status}`],
        iconType: iconTypes[`${this.detail.insure_status}`],
        iconClass: iconClasses[`${this.detail.insure_status}`],
      }
    }
  },
  mixins: [emitter],
  watch: {
    tripId: {
      handler (n) {
        if (n) {
            this.loadInsureDetail();
        }
      },
      immediate: true
    }
  },
  filters: {
    tripCargoType (k){
      return cargoTypes[k]
    }
  },
  methods: {
    async loadInsureDetail() {
      let data = await this.$api.tripApi.getTripInsureDetail(this.tripId);
      this.detail = data.resultObj
      
    },
    handlerInsure() {
      this.dispatch('trip-detail-insure')
    }
  },
};
</script>