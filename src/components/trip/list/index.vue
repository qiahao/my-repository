<template lang="html">
    <div>
        <div class='contain-head' >
            <div v-show='!hasSelect'>
              <RadioGroup v-model="search.q_trip_state" 
                          type="button" 
                          @on-change="onSearch">
                  <Radio v-for="(item,i) in tripStateTypes" 
                          :key="item.key"
                          :label="item.key">{{item.text}}</Radio>
              </RadioGroup>
              <RadioGroup v-model="search.q_trip_source" 
                          type="button" 
                          @on-change="onSearch" >
                  <Radio v-for="(item,i) in tripSourceTypes" 
                          :key="item.key"
                          :label="item.key">{{item.text}}</Radio>
              </RadioGroup>

              <i-input v-model="search.q_keyword" class="w200" placeholder="车牌号、司机姓名、联系方式"></i-input>
              <i-input v-model="search.q_trip_no" class="w200" placeholder="输入车次号"></i-input>
              <div class="dib">
                  <i-button type="primary" @click="onSearch">查询</i-button>
                  <i-button type="warning" @click="onSearchReset">重置</i-button>
              </div>
            </div>
            <div v-show='hasSelect'>
                <i-button type="primary" @click="tripCancel" :disabled="tripCancelVisible" class="mr5">取消车次</i-button>
                <i-button type="primary" @click="tripSend" :disabled="tripSendVisible" class="mr5">确认发车</i-button>
                <i-button type="primary" @click="tripArrive" :disabled="tripArriveVisible" class="mr5">确认到车</i-button>
                <i-button type="success" @click="handlerTripInsure" v-if="isXHS" :disabled="!insureButtonActivated">整车投保</i-button>
            </div>
        </div>
        
        <div class="contain-main">
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

        <!-- 投保 -->
        <template v-if="isXHS">
          <trip-insure v-model="tripInsureVisible"
                        :entry="tripInsureTripEntry"
                        @after-save="afterSaveTripInsure" 
                        @on-cancel="onCancelTripInsure"></trip-insure>
        </template>
    </div>
</template>
<script>
import { mapState } from "vuex";
import emitter from '@/mixins/emitter.js'
import tripDetailModal from "../detail/index.vue";
import tableMixin from "@/mixins/tableMixin";
import tripInsure from "../components/trip-insure";
import * as constants from "./constant.js";


const tripInsureTripEntry = {
    trip_id: '',
    trip_line_begin: '',
    trip_line_end: '',
  }

export default {
  name: "tripV1List",
  data() {
    return {
      tripStateTypes: constants.tripStateTypes,
      tripSourceTypes: constants.tripSourceTypes,
      
      search: { ...constants.searchParams },

      // 整车投保
      tripInsureVisible: false,
      tripInsureTripEntry: {...tripInsureTripEntry},

    };
  },
  components: { 
    tripDetailModal,
    tripInsure
  },
  mixins: [tableMixin,emitter],
  computed: {
    ...mapState(["userInfo"]),
    insureButtonActivated () {
      let activeStatus = ['N','U']
      return this.tableParams.selectList && this.tableParams.selectList.length == 1 && activeStatus.includes(this.tableParams.selectList[0].insure_status)
    },
    // 鑫合顺 显示整车投保按钮
    isXHS (){
      const xhsCompanyId = 'cd9bbbb2-80d5-42f0-9696-dcddf49588d3'
      return this.userInfo && this.userInfo.company_id == xhsCompanyId
    },
    columns (){
      return this.isXHS ? constants.getXHSCulomns.call(this) : constants.getCulomns.call(this) 
    },
    tripCancelVisible () {
      return this.tableParams.selectList.length != 1
    },
    tripSendVisible () {
      return this.tableParams.selectList.length != 1 || this.tableParams.selectList[0].trip_state === '1'
    },
    tripArriveVisible () {
      return this.tableParams.selectList.length != 1 || this.tableParams.selectList[0].trip_state === '0'
    },
  },
  methods: {
    loadList() {
      let params = this.assignQuery(this.search);
      this.$api.tripApi.getTripList(params).then(data => {
        this.tableParams.list = data.resultObj.list;
        this.tableParams.total = data.resultObj.total;
        this.tableParams.selectList = [];
      });
    },
    onSearchReset() {
      this.search = { ...constants.searchParams };
      this.loadList();
    },
    //取消车次
    tripCancel() {
      let trip;
      if (this.tableSelectLength > 1) {
        return this.$Message.warning("只能操作一条数据！");
      }
      trip = this.tableParams.selectList[0];
      this.doTripCancel(trip);
    },
    doTripCancel(trip) {
      if (trip.trip_state != "0") {
        return this.$Message.warning("只有待发车车次才能进行该操作！");
      }
      this.$Modal.confirm({
        title: "确认提示",
        content: "是否确定取消该车次？",
        onOk: () => {
          this.$api.tripApi
            .setTripCancel({ trip_ids: trip.trip_id })
            .then(json => {
              this.$Message.success("车次取消成功");
              this.loadList();
              if (this.$route.name != "tripV1List") {
                this.$router.push({ name: "tripV1List" });
              }
            });
        }
      });
    },

    //确认发车
    tripSend() {
      let trip;
      if (this.tableSelectLength > 1) {
        return this.$Message.warning("只能操作一条数据！");
      }
      trip = this.tableParams.selectList[0];
      this.doTripSend(trip);
    },
    doTripSend(trip) {
      let tripState = trip.trip_state;
      if (tripState == "1") {
        return this.$Message.warning("该车次已发车，无法再进行该操作！");
      }
      if (tripState == "2") {
        return this.$Message.warning("该车次已到车，无法再进行该操作！");
      }

      this.$Modal.confirm({
        title: "确认提示",
        content: "是否确定发车？",
        onOk: () => {
          this.$api.tripApi
            .setTripSend({ trip_ids: trip.trip_id })
            .then(json => {
              this.loadList();
              this.$Message.warning("操作成功");
              this.afterChangeDetail();
            });
        }
      });
    },

    //确认到车
    tripArrive() {
      let trip;
      if (this.tableSelectLength > 1) {
        return this.$Message.warning("只能操作一条数据！");
      }
      trip = this.tableParams.selectList[0];
      this.doTripArrive(trip);
    },
    
    // 整车投保
    handlerTripInsure(){
      let entry = {
        trip_id: this.tableParams.selectList[0].trip_id,
        trip_line_begin: this.tableParams.selectList[0].send_area,
        trip_line_end: this.tableParams.selectList[0].arrive_area,
      }
      this.doTripInsure(entry)
    },
    doTripInsure(entry){
      this.tripInsureVisible = true
      this.tripInsureTripEntry = entry
    },
    afterSaveTripInsure(){
      this.loadList()
      // 列表投保成功通知投保详情刷新
      if (this.$refs.detail) {
        this.$refs.detail.reloadInsureDetail()
      }
    },
    onCancelTripInsure(){
      this.tripInsureTripEntry = {...tripInsureTripEntry}
    },

    
    // 到车
    doTripArrive(trip) {
      let tripState = trip.trip_state;
      if (tripState == "0") {
        return this.$Message.warning("该车次还未发车，无法进行该操作！");
      }
      if (tripState == "2") {
        return this.$Message.warning("该车次已到车，无法再进行该操作！");
      }
      this.$Modal.confirm({
        title: "确认提示",
        content: "是否确定到车？",
        onOk: () => {
          this.$api.tripApi
            .setTripArrive({ trip_ids: trip.trip_id })
            .then(json => {
              this.loadList();
              this.$Message.warning("操作成功");
              this.afterChangeDetail();
            });
        }
      });
    },
    afterChangeDetail() {
      if (this.$route.name == "tripDetail") {
        this.$refs.detail.loadDetail();
      }
    },
    //打开详情弹窗
    openTripDetailModal(id) {
      this.$router.push({ path: "/trip/detail/" + id });
    },
    
  },
  created() {
    this.loadList();
  },
  mounted() {
    bus.$on("trip-list-reload", e => {
      this.onSearch();
    });
   
    // 详情取消车次
    this.$on("trip-cancel", trip => {
      this.doTripCancel(trip);
    });

    // 详情确认发车
    this.$on("trip-send", trip => {
      this.doTripSend(trip);
    });
    // 详情确认到车
    this.$on("trip-arrive", trip => {
      this.doTripArrive(trip);
    });
    // 详情=>投保详情 触发投保
    this.$on("trip-insure", tripId => {
      this.doTripInsure(tripId);
    });
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
</style>