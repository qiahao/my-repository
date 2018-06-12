<template lang="html">
    <div>
        <div class='contain-head' >
           <Form ref="formInline" :model="formModel" inline>
            <div>
              <FormItem>
                <RadioGroup type="button" 
                            @on-change="changeRadio"  v-model="dateRadio" >
                    <Radio v-for="(item,i) in dateTypes" 
                            :key="item.key"
                            :label="item.key"
                    >{{item.text}}</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem>
                <date-picker v-model="dateRange" type="daterange" @on-change="resetRadio" split-panels placeholder="发车日期（起）" style="width: 200px"></date-picker>
              </FormItem>
              <FormItem>
                <i-input v-model="formModel.q_condition" class="w230" placeholder="输入司机名称/联系方式/车牌号"></i-input>
              </FormItem>

                <div class="dib">
                    <i-button type="primary" @click="onSearch">搜索</i-button>
                    <i-button type="warning" @click="onSearchReset">重置</i-button>
                    <i-button type="warning" @click="exportOrderList">导出</i-button>
                </div>
              </div>
            </Form>
        </div>
        

        <div class="contain-main">

            <div class="mb10">
              <h4>总计信息：</h4>
              <i-table :columns="totalColumns" :data="totalData" :loading="loading"></i-table>
            </div>
          
            <i-table :data="tableParams.list" :columns="columns" @on-selection-change="onSelectionChange" :loading="loading"> </i-table>
            
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
import tableMixin from "@/mixins/tableMixin";
import * as constants from "./constant.js";
import * as dateUtil from "@/utils/dateUtil";

export default {
  name: "vehicleProfit",
  data() {
    return {
      loading: true,
      formModel: {
        q_condition: "",
        q_start_time: "",
        q_end_time: "",
        page: 1,
        page_size: 10
      },
      dateTypes: constants.dateTypes,
      dateRange: "",
      countTotal: 0,
      feeTotal: 0,
      incomeFeeTotal: 0,
      orderFeeTotal: 0,
      orderNumberTotal: 0,
      payArriveTotal: 0,
      tripTotal: 0,
      volumesTotal: 0,
      weightsTotal: 0,
      totalData: [],
      dateRadio:"0"
    };
  },
  mixins: [tableMixin],
  computed: {
    ...mapState(["userInfo"]),
    columns() {
      return constants.getCulomns.call(this);
    },
    totalColumns() {
      return constants.getTotalCulomns.call(this);
    }
  },
  methods: {
    loadList() {
      this.formModel.page = this.tableParams.page;
      this.formModel.page_size = this.tableParams.pageSize;
      this.loading = true;
      this.$api.reportApi.queryTripAnalyzeList(this.formModel).then(data => {
        this.tableParams.list = data.resultObj.list;
        this.tableParams.total = parseInt(data.resultObj.total[0].trip_total);
        this.tableParams.selectList = [];
        this.totalData = data.resultObj.total;
        this.loading = false;
      });
    },
    onSearchReset() {
      this.formModel.q_condition = "";
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
     //导出
    exportOrderList() {
      let exportParam = this.formModel;
      exportParam.company_id = this.userInfo.company_id;
      exportParam.act_user_id = this.userInfo.user_id;
      this.$api.reportApi.exportTripAnalyze(exportParam)
    }
  },
  created() {
    this.loadList();
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
  padding-top: 10px;
  span {
    display: inline-block;
    margin-right: 30px;
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
