<template>
    <div>
        <!-- 操作头部 -->
        <div class="contain-head" style="position: relative;">
            <div v-show="!hasSelect">
                <RadioGroup v-model="searchForm.q_back_state" type="button" @on-change="onSearch">
                  <Radio v-for="(item,i) in conditionList" :key="i" :label="item.key">{{item.text}}</Radio>
                </RadioGroup>
                <i-form ref="searchForm" 
                        :model="searchForm" 
                        :label-width="80"
                        inline 
                        class="mt15">
                    <Form-item label="排序">
                        <i-select v-model="searchForm.order_by_type" class="w200">
                            <Option v-for="item in sortList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </i-select>
                    </Form-item>

                    <Form-item label="回执类型">
                        <multiple-select v-model="filterValue" placeholder="筛选" clearable>
                            <multiple-option v-for="(item,index) in filterList" :key="index" :value="item.value" :label="item.label"></multiple-option>
                        </multiple-select>
                    </Form-item>

                    <Form-item label="开单日期">
                        <DatePicker v-model="rangeTime" type="daterange" placeholder="选择日期范围" format="yyyy-MM-dd" @on-change="onRangeChange" class="w230"></DatePicker>
                    </Form-item>
                    <Form-item label="关键词" prop="q_keyword">
                        <i-input v-model="searchForm.q_keyword" placeholder="运单号/客户名称/货物名称" class="w200"></i-input>
                    </Form-item>
                    <div class="dib">
                      <i-button type="primary" @click="onSearch">搜索</i-button>
                      <i-button @click="onReset">重置</i-button>
                      <i-button @click="onExport" type="warning">导出</i-button>
                    </div>
                </i-form>
            </div>
            <div v-show="hasSelect">
                <i-button type="primary" :disabled="orderReceiptDisable" @click="showBackModal=true">
                    <i class="wm-icon wm-icon-add"></i>回收</i-button>
                <i-button type="primary" :disabled="orderSendDisable" @click="showSendModal=true">
                    <i class="wm-icon wm-icon-add"></i>发放</i-button>
            </div>
        </div>
        
        <!-- 列表内容 -->
        <div class="contain-main" style="padding-top: 20px;">
            <i-table :data="tableParams.list" :columns="columns" @on-selection-change="onSelectionChange" >
            </i-table>
            <div class="page-wrapper">
                <Page :total="tableParams.total" show-sizer show-elevator :current="currentPage" @on-change="onPageChange" @on-page-size-change="onPageSizeChange">
                </Page>
            </div>
        </div>

        <!-- 查看回单照片 -->
        <photo-detail-modal></photo-detail-modal>

        <!-- 上传回单照片 -->
        <photo-upload-modal></photo-upload-modal>
        <!-- 详情路由 -->
        <router-view></router-view>
        <!-- 回单回收 -->
        <back-modal v-model='showBackModal' @call-back="callBack" :selectArray="selectedIds"></back-modal>
        <!-- 回单发放 -->
        <send-modal v-model='showSendModal' @call-back="callBack" :selectArray="selectedIds"></send-modal>
    </div>
</template>
<script>
import tableMixin from "@/mixins/tableMixin";
import {
  orderBackListApi,
  orderBackUploadApi,
  orderBackReceiveApi,
  orderBackSendApi
} from "@/api/src/receiptApi";
import { ORDER_BACK_EXPORT } from "@/api/src/order";
import config from "@/config";
import photoDetailModal from "./photo-detail-modal.vue";
import photoUploadModal from "./photo-upload-modal.vue";
import { receiptV2Columns } from "./tableColumns";
import backModal from "./back";
import sendModal from "./send";
import moment from "moment";
import { exportExcel } from "@/utils/util";
import { mapState } from "vuex";
import clickoutside from "@/directives/clickoutside";
import multipleSelect from "@/wm-components/components/multiple-select";
import multipleOption from "@/wm-components/components/multiple-select/option";
const COLOR = ["#febf06", "#5ed25c", "#0071c0", "#fe850a", "#9b9b9b"];

export default {
  name: "receiptList",
  data() {
    return {
      conditionList: [
        { text: "全部", key: "" },
        { text: "待回单", key: "0" },
        { text: "回单中", key: "1" },
        { text: "已回收", key: "2" },
        { text: "已发放", key: "3" },
        { text: "已结束", key: "4" }
      ],
      customActive: false,
      dropDownVisible: false,
      showBackModal: false,
      showSendModal: false,
      pk: "order_id",
      filterValue: ['0','1','2','3','4'],
      rangeTime: [],
      searchForm: {
        q_keyword: "",
        order_by_type: "3",
        q_back_state: "",
        q_back_type: "",
        q_create_time_begin: "",
        q_create_time_end: "",
      },
      sortList: [
        {
          value: "0",
          label: "按开单日期排序（最早）"
        },
        {
          value: "1",
          label: "按开单日期排序（最新）"
        },
        {
          value: "2",
          label: "按完成时间排序（最早）"
        },
        {
          value: "3",
          label: "按完成时间排序（最新）"
        }
      ],
      filterList: [
        {
          value: "0",
          label: "回执"
        },
        {
          value: "1",
          label: "原单"
        },
        {
          value: "2",
          label: "收条"
        },
        {
          value: "3",
          label: "电子回单"
        },
        {
          value: "4",
          label: "其它"
        },
        {
          value: "no",
          label: "无"
        }
      ],
      columns: receiptV2Columns(this),
      search: {
        q_back_state: ""
      }
    };
  },
  mixins: [tableMixin],
  directives: { clickoutside },
  components: {
    photoDetailModal,
    photoUploadModal,
    backModal,
    sendModal,
    multipleSelect,
    multipleOption
  },
  created() {
    this.loadList();
    this.$watch("searchForm.order_by_type", function() {
      this.loadList();
    });
    this.$watch("filterValue", function() {
      if (this.filterValue.length) {
        this.searchForm.q_back_type = this.filterValue.join(",");
      } else {
        this.searchForm.q_back_type = "";
      }
      this.loadList();
    });
  },
  mounted() {
    let vm = this;
    bus.$on("receipt-list-reload", () => {
      vm.loadList();
    });
  },

  methods: {
    callBack() {
      this.loadList();
    },
    openCustom() {
      this.dropDownVisible = true;
      this.customActive = true;
    },
    closeCustom() {
      this.dropDownVisible = false;
      this.customActive = false;
    },
    filterReceiptType(input) {
      let text;
      switch (input) {
        case "0":
          text = "直接发放";
          break;
        case "1":
          text = "司机带回";
          break;
        case "2":
          text = "快递邮寄";
          break;
        default:
          text = "尚未发放";
      }
      return text;
    },
    loadList() {
      let params = this.assignQuery(this.searchForm);

      this.$api.receiptApi.orderBackListApi(params).then(data => {
        this.tableParams.list = data.resultObj.list;
        this.tableParams.total = data.resultObj.total;
        this.tableParams.selectList = [];
      });
    },
    openUploadModal(row, event) {
      event.stopPropagation();
      bus.$emit("open-upload-modal", [row]);
    },
    onReset() {
      if (this.$refs.searchForm) {
        this.$refs.searchForm.resetFields();
        if (this.onRangeChange && typeof this.onRangeChange === "function") {
          this.rangeTime = [];
          this.onRangeChange([]);
        }
        this.filterValue = [];
        this.searchForm.q_keyword = "";
        this.searchForm.q_back_state = "";
      }
    },
    handler2Detail(id) {
      this.$router.push({
        name: "receiptOmsDetail",
        query: { id: id }
      });
    },
    backType(row) {
      let backTypeText;
      let vm = this;
      vm.filterList.forEach((v, i) => {
        if (v.value == row.back_type) {
          backTypeText = v.label;
          return;
        }
      });
      return backTypeText;
    },
    backState(row) {
      let backStateText;
      let vm = this;
      vm.conditionList.forEach((v, i) => {
        if (v.key == row.back_state) {
          backStateText = v.text;
        }
      });
      return backStateText;
    },
    // 时间rangechange事件
    onRangeChange(times) {
      if (times[0]) {
        this.searchForm.q_create_time_begin =
          moment(times[0]).format("YYYY-MM-DD") + " 00:00:00";
        this.searchForm.q_create_time_end =
          moment(times[1]).format("YYYY-MM-DD") + " 23:59:59";
      } else {
        this.searchForm.q_create_time_begin = "";
        this.searchForm.q_create_time_end = "";
      }
    },
    onExport() {
      let params = this.assignQuery(this.searchForm);
      params.user_id = this.userInfo.user_id;
      params.company_id = this.userInfo.company_id;
      exportExcel(params, ORDER_BACK_EXPORT);
    },
    openPhotoModal(o, event) {
      event.stopPropagation();
      bus.$emit("open-photo-modal", o);
    },
    clickItem(item) {
      let vm = this;
      let index;
      if (vm.filterValue.includes(item.value)) {
        index = vm.filterValue.indexOf(item.value);
        vm.filterValue.splice(index, 1);
      } else {
        vm.filterValue.push(item.value);
      }
    }
  },

  computed: {
    ...mapState(["userInfo"]),
    orderReceiptDisable() {
      return (
        !!this.tableParams.selectList.length &&
        this.tableParams.selectList.some(item => {
          return item.back_state > 1;
        })
      );
    },
    orderSendDisable() {
      return (
        !!this.tableParams.selectList.length &&
        this.tableParams.selectList.some(item => {
          return item.back_state > 2;
        })
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.layout-content .contain-main {
  padding-top: 140px;
}
</style>
