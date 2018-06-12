<template lang="html">
    <div>
        <div class='contain-head' >
           <Form ref="formInline" :model="formModel" inline>
            <div>
              <FormItem>
                <RadioGroup type="button" 
                            @on-change="changeRadio" v-model="dateRadio">
                    <Radio v-for="(item,i) in dateTypes" 
                            :key="item.key"
                            :label="item.key"
                    >{{item.text}}</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem>
                <date-picker v-model="dateRange" type="daterange" @on-change="resetRadio" split-panels placeholder="日期" style="width: 200px"></date-picker>
              </FormItem>
              <FormItem>
                <i-select v-model="formModel.q_payment_type" class="w150" placeholder="收支类型" @on-change="changePaymentType">
                    <Option v-for="item in paymentTypes" :value="item.dict_value" :key="item.dict_value">{{ item.dict_text }}</Option>
                </i-select>
              </FormItem>
              <FormItem>
                <i-select v-model="formModel.q_pay_type" class="w150"  placeholder="支付方式" @on-change="changePayType">
                    <Option v-for="item in payTypes" :value="item.dict_value" :key="item.dict_value">{{ item.dict_text }}</Option>
                </i-select>
                <i-input v-model="formModel.q_cost_use" class="w150" placeholder="费用用途"></i-input>
              </FormItem>
              <FormItem>
                <i-input v-model="formModel.q_truck_plate" class="w150" placeholder="车牌号"></i-input>
              </FormItem>
              <FormItem>
                <i-input v-model="formModel.q_number" class="w150" placeholder="运单号/车次号"></i-input>
              </FormItem>

                <div class="dib">
                    <i-button type="primary" @click="onSearch">搜索</i-button>
                    <i-button  @click="onSearchReset">重置</i-button>
                    <i-button type="warning" @click="exportOrderList">导出</i-button>
                    <i-button type="primary" @click="openPaymentDetailModal('')">新增</i-button>
                </div>
              </div>
            </Form>
        </div>
        

        <div class="contain-main">
          <div class="total-desc">
            <span>支出：<span style="color:red">{{payTatol}} </span>元</span> <span style="margin-left: 25px;">收入：<span style="color:red">{{incomeTotal}} </span>元</span>
            
          </div>
            <i-table :data="tableParams.list" :columns="columns" @on-selection-change="onSelectionChange"> </i-table>
            <div class="page-wrapper">
                <Page :total="tableParams.total" show-sizer show-elevator
                    :current="currentPage" 
                    @on-change="onPageChange" 
                    @on-page-size-change="onPageSizeChange">
                </Page>
            </div>
        </div>
      
      <!-- 车次详情 todo -->
      <keep-alive>
          <router-view ref="detail"></router-view>
      </keep-alive>

    </div>
</template>
<script>
import { mapState } from "vuex";
import tripDetailModal from "./detail/index.vue";
import tableMixin from "@/mixins/tableMixin";
import * as constants from "./constant.js";
import * as dateUtil from "@/utils/dateUtil";

export default {
  name: "cashFlow",
  data() {
    return {
      formModel: {
        q_payment_type: "",
        q_pay_type: "",
        q_cost_use: "",
        q_truck_plate: "",
        q_number: "",
        q_start_time: "",
        q_end_time: "",
        page: 1,
        page_size: 10
      },
      dateTypes: constants.dateTypes,
      dateRange: "",
      paymentTypes: [],
      payTypes: [],
      incomeTotal: "",
      payTatol: "",
      dateRadio:"0"
    };
  },
  components: {
    tripDetailModal
  },
  mixins: [tableMixin],
  computed: {
    ...mapState(["userInfo"]),
    columns() {
      return constants.getCulomns.call(this);
    }
  },
  methods: {
    loadList() {
      this.formModel.page = this.tableParams.page;
      this.formModel.page_size = this.tableParams.pageSize;
      this.$api.dailyApi.paymentList(this.formModel).then(data => {
        this.tableParams.list = data.resultObj.list;
        this.tableParams.total = parseInt(data.resultObj.total);
        this.tableParams.selectList = [];
        this.incomeTotal = data.resultObj.income_total;
        this.payTatol = data.resultObj.pay_tatol;
      });
    },
    onSearchReset() {
      this.formModel.q_payment_type = "";
      this.formModel.q_pay_type = "";
      this.formModel.q_cost_use = "";
      this.formModel.q_truck_plate = "";
      this.formModel.q_number = "";
      this.formModel.q_start_time = dateUtil.getMonthStartDate();
      this.formModel.q_end_time = dateUtil.getMonthEndDate();
      this.formModel.page = 1;
      this.formModel.page_size = 10;
      this.dateRange = "";
      this.dateRadio = "0";
      this.loadList();
    },
    resetRadio(){
      this.dateRadio = "";
    },
    dictPaymentTypeApi() {
      this.$api.dictApi.dictPaymentTypeApi().then(data => {
        this.paymentTypes = data.resultObj;
        this.paymentTypes.splice(0,0,{"dict_type":"日常收支类型","dict_key":"PAYMENT_TYPE","dict_value":"","dict_text":"全部"})
      });
    },
    dictPayTypeApi() {
      this.$api.dictApi.dictPayTypeApi().then(data => {
        this.payTypes = data.resultObj;
        this.payTypes.splice(0,0,{"dict_type":"日常支付类型","dict_key":"PAY_TYPE","dict_value":"","dict_text":"全部"})
      });
    },
    changeRadio(key) {
      this.dateRange = "";
      switch (key) {
        case "1": {
          this.formModel.q_start_time = dateUtil.getLastMonthStartDate();
          this.formModel.q_end_time = dateUtil.getLastMonthEndDate();
          break;
        }
        case "3": {
          this.formModel.q_start_time = dateUtil.getPreMonthStartDay(2);
          this.formModel.q_end_time = dateUtil.getMonthEndDate();
          break;
        }
        default: {
          this.formModel.q_start_time = dateUtil.getMonthStartDate();
          this.formModel.q_end_time = dateUtil.getMonthEndDate();
          break;
        }
      }
      this.loadList();
    },
    changePaymentType() {
      this.loadList();
    },
    changePayType(){
      this.loadList();
    },
     //导出
    exportOrderList() {
      let exportParam = this.formModel;
      exportParam.company_id = this.userInfo.company_id;
      exportParam.act_user_id = this.userInfo.user_id;
      this.$api.dailyApi.exportPaymentOrders(exportParam)
    },
    //删除单子
    paymentDel(id){
      let vm = this;
      this.$Modal.confirm({
        title: "删除？",
        content: "确定删除这条信息吗？",
        onOk: function(){
          vm.$api.dailyApi.paymentDel({payment_id: id});
          vm.loadList();
        }
      });
      
    },
    //打开详情弹窗
    openPaymentDetailModal(id='') {
      this.$router.push({ path: "/daily/detail", query: {payment_id: id}});
    }
  },
  created() {
    this.loadList();
    this.dictPaymentTypeApi();
    this.dictPayTypeApi();
  },
  mounted () {
    bus.$on("payment-list-reload", e => {
      this.loadList();
    });
  },
  watch: {
    dateRange(n, o) {
      if (n && n[0]) {
        this.formModel.q_start_time = dateUtil.formatDate(n[0]);
        this.formModel.q_end_time = dateUtil.formatDate(n[1]);
      } else {
        this.formModel.q_start_time = dateUtil.getMonthStartDate();
        this.formModel.q_end_time = dateUtil.getMonthEndDate();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.contain-head {
  .text-filter {
    display: inline-block;
    .ivu-input-wrapper {
      width: 200px;
      display: inline-block;
      margin-right: 10px;
    }
  }
}

.total-desc {
  font-size: 15px;
  margin: 5px 0;
}

@media screen and (max-width: 1500px) {
  .contain-main {
    margin-top: 50px;
  }
}

@media screen  and (min-width: 1550px) and (max-width: 1700px) {
  .total-desc {
    margin: 38px 0 0 0;
  }
}
</style>
<style lang="scss" >
.middle-line {
  height: 20px;
  border-right: 1px solid #2d8cf0;
  display: inline;
  margin: 0 5px;
}
</style>
