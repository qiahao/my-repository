<template>
  <div>
    <div class="contain-head" style="position:static;padding-right:15px">
      <Form :label-width="90" inline class="order-statistics">
        <Form-item label="付款方式">
          <Select v-model="searchOption.q_pay_type">
            <Option value="">全部</Option>
            <Option value="pay_xfu">现付</Option>
            <Option value="pay_df">到付</Option>
            <Option value="pay_yj">月结</Option>
            <Option value="pay_hdf">回单付</Option>
            <Option value="pay_hkk">货款扣</Option>
            <Option value="pay_dbf">多笔付</Option>
          </Select>
        </Form-item>
        
        <Form-item label="签收状态">
          <Select v-model="searchOption.q_is_sign">
            <Option value="">全部</Option>
            <Option value="Y">已签收</Option>
            <Option value="N">未签收</Option>
          </Select>
        </Form-item>
        
        <Form-item label="回单状态">
          <Select v-model="searchOption.q_back_state">
            <Option value="">全部</Option>
            <Option v-for="(state,i) in backState" :value="i" :key="state">{{state}}</Option>
          </Select>
        </Form-item>
        
        <Form-item label="发货人">
          <i-input v-model="searchOption.q_begin_link_man" placeholder="请输入发货人"></i-input>
        </Form-item>
        
        <Form-item label="发货人电话">
          <i-input v-model="searchOption.q_begin_link_mobile" placeholder="输入发货人电话"></i-input>
        </Form-item>
        
        <Form-item label="收货人">
          <i-input v-model="searchOption.q_end_link_man" placeholder="请输入收货人"></i-input>
        </Form-item>
        
        <Form-item label="收货人电话">
          <i-input v-model="searchOption.q_end_link_mobile" placeholder="请输入收货人电话"></i-input>
        </Form-item>
        
        <Form-item label="网点">
          <i-input v-model="searchOption.q_next_company" placeholder="请输入网点"></i-input>
        </Form-item>
        
        <Form-item label="司机">
          <i-input v-model="searchOption.q_driver_name" placeholder="请输入司机"></i-input>
        </Form-item>
        
        <Form-item label="承运商">
          <i-input v-model="searchOption.q_common_carrier" placeholder="请输入承运商"></i-input>
        </Form-item>

        <Form-item label="客户名称">
          <i-input v-model="searchOption.q_send_company" placeholder="请输入客户名称"></i-input>
        </Form-item>

        <Form-item label="运单号">
          <i-input v-model="searchOption.q_order_no" placeholder="请输入运单号"></i-input>
        </Form-item>

        <Form-item label="签收时间" class="date-time-box date-range">
          <DatePicker v-model="searchOption.q_finish_time_begin" format="yyyy-MM-dd" type="date" placeholder="起始日期" style="width:120px;display:inline-block"></DatePicker> -
          <DatePicker v-model='searchOption.q_finish_time_end' type="date" format="yyyy-MM-dd" placeholder="终止日期" style="width:120px;display:inline-block"></DatePicker>
        </Form-item>
        
        <Form-item label="开单时间" class="date-time-box date-range">
          <DatePicker v-model="searchOption.q_create_time_begin" format="yyyy-MM-dd" type="date" placeholder="起始日期" style="width:120px;display:inline-block"></DatePicker> -
          <DatePicker v-model='searchOption.q_create_time_end' type="date" format="yyyy-MM-dd" placeholder="终止日期" style="width:120px;display:inline-block"></DatePicker>
        </Form-item>

        <Form-item label="">
          <Button type="primary" @click="onSearch">查询</Button>
          <Button type="warning" @click="reset">重置</Button>
          <Button type="success" @click="excel">导出</Button>
        </Form-item>
        
      </Form>
    </div>
    <div class="contain-main" style="padding-top:15px">
      <i-table stripe :columns="columns" :data="tableParams.list">
      </i-table>
      <div class='page-wrapper clearfix'>
        <div class="fl" v-show='tableParams.total'>
          <label>总重量：
            <span>{{responeData.total_weights}}</span> 吨</label> &nbsp;&nbsp;
          <label>总体积：
            <span>{{responeData.total_volumes}}</span> 方</label> &nbsp;&nbsp;
          <label>总运费：
            <span>{{responeData.total_fee}}</span> 元</label> &nbsp;&nbsp;
          <label>总件数：
            <span>{{responeData.total_count}}</span>
          </label>
        </div>
        <Page :total="tableParams.total" show-sizer show-total show-elevator :current="currentPage" @on-change="onPageChange" @on-page-size-change="onPageSizeChange">
        </Page>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import config from "@/config/index";
import tableMixin from "@/mixins/tableMixin";
import { getDateFormat, fmt } from "@/utils/util";
import {
  orderState,
  backState,
  columns,
  query
} from "./constants"

const {host: HOST} = config

export default {
  name: "reportV1List",
  data() {
    return {
      columns: Object.freeze(columns),
      orderState: Object.freeze(orderState),
      backState: Object.freeze(backState),
      searchOption: Object.assign({}, query),
      responeData: {}, // 所有返回数据 用于填写总重量等
    };
  },
  mixins: [tableMixin],
  computed: {
    ...mapState(["userInfo"])
  },
  watch: {
  },

  methods: {
    loadList: function() {
      let params = this.assignQuery(this.searchOption);

      params.q_finish_time_begin = fmt.date(params.q_finish_time_begin,'yyyy-MM-dd')
      params.q_finish_time_end = fmt.date(params.q_finish_time_end,'yyyy-MM-dd')
      params.q_create_time_begin = fmt.date(params.q_create_time_begin,'yyyy-MM-dd')
      params.q_create_time_end = fmt.date(params.q_create_time_end,'yyyy-MM-dd')

      if (params.q_create_time_begin > params.q_create_time_end) {
        return this.$Message.error("结束日期不能小于起始日期,请重新选择");
      }
      this.$api.reportApi.reportOrderStatistics(params).then(data => {
        this.responeData = data.resultObj;
        this.tableParams.list = data.resultObj.list;
        this.tableParams.total = data.resultObj.total;
      });
    },
    queryCreateTime: function(datetime) {
      let time = datetime.split(" - ");
      this.searchOption.q_create_time_begin = time[0] || "";
      this.searchOption.q_create_time_end = time[1] || "";
    },
    reset: function() {
      this.searchOption = Object.assign({}, query);
      this.loadList();
    },
    excel: function() {
      let url = "/api/utils/excel/order/report?";
      if (
        HOST.indexOf("http://") > -1 ||
        HOST.indexOf("https://") > -1
      ) {
        url = HOST + url;
      } else {
        var curWwwPath = window.document.location.href;
        var pathName = window.document.location.pathname;
        var pos = curWwwPath.indexOf(pathName);
        //获取主机地址，如： http://localhost:7070
        var localhostPaht = curWwwPath.substring(0, pos);
        url = localhostPaht + url;
      }
      let excelParams = Object.assign(this.searchOption, {
        company_id: this.userInfo.company_id,
        act_user_id: this.userInfo.user_id
      });
      excelParams.q_finish_time_begin = fmt.date(excelParams.q_finish_time_begin,'yyyy-MM-dd')
      excelParams.q_finish_time_end = fmt.date(excelParams.q_finish_time_end,'yyyy-MM-dd')
      excelParams.q_create_time_begin = fmt.date(excelParams.q_create_time_begin,'yyyy-MM-dd')
      excelParams.q_create_time_end = fmt.date(excelParams.q_create_time_end,'yyyy-MM-dd')

      let queryArray = [],queryString = ''
      
      for (let k in excelParams) {
        if (excelParams.hasOwnProperty(k) && excelParams[k]) {
          queryArray.push(k + '=' + excelParams[k])
        }
      }
      url += queryArray.join('&')
      window.open(url);
    }
  },
  created() {
    // 默认查询最近15日的运单
    let endDate = new Date(), beginDate = endDate - 15 * 24 * 3600 * 1000
    this.searchOption.q_create_time_begin = new Date(beginDate)
    this.searchOption.q_create_time_end = endDate

    this.loadList();
  }
};
</script>
<style lang="scss">

.order-statistics {
  .ivu-select-selection ,input {
    width: 140px;
  }
  .ivu-date-picker input {
    width: 120px;
  }
}
.page-wrapper .fl {
  line-height: 34px;
}
</style>