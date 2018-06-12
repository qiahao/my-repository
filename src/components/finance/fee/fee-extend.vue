<template>
    <div>
        <div class='contain-head'>
            <i-select v-model="query.catalog" placeholder="请选择核销类型" class="w160"> <!-- 千万不能用on-change = handlerSearch -->
                <i-option v-for="(v,k) in billTypeMap" :key="k" :label="v" :value="k" @click.native="handlerChangeCatalog" ></i-option>
            </i-select>
            <i-input v-model="query.truck_owner" type="text" placeholder="车辆所有人" class="w160" :disabled="query.catalog != '2'"></i-input>
            <i-input v-model="query.keyword" type="text" placeholder="请输入运单号/车次号、客户、收支对象" style="width: 280px;"></i-input>
            <DatePicker v-model="queryCreateTime" type="daterange" placement="bottom-end" placeholder="选择开单时间" class="dib"></DatePicker>
            <i-button type="primary" @click="handlerSearch">搜索</i-button>
            <i-button type="warning" @click="handlerReset">重置</i-button>
            <!-- <i-button type="info" @click="handlerExport">导出全部</i-button> -->
        </div>

        <div class="contain-main">
            <Row>
                <!-- 左侧 -->
                <i-col span="12 pr5">
                    <div>
                        <h3 class="dib">未核销</h3>
                        <span class="fc-gray">请勾选您需要核销的费用，然后在右侧的列表中 生成对账单</span>
                    </div>
                    <!-- table -->
                    <i-table :data="tableData" :columns="columns" @on-selection-change="handlerLeftSelectionChange">
                    </i-table>
                    <!-- page -->
                    <div class="page-wrapper">
                        <Page :total="tableDataTotal" 
                            show-sizer 
                            show-elevator 
                            :current="currentPage" 
                            :page-size="tableQuery.page_size" 
                            @on-change="handlerPageChange" 
                            @on-page-size-change="handlerPageSizeChange">
                        </Page>
                    </div>
                </i-col>
                <!-- 右侧 -->
                <i-col span="12 pl5">
                    <div>
                        <h3 class="dib">待核销</h3>
                        <span class="fc-gray">您可以勾选 不需要 生成对账单的费用，将其移除列表</span>
                    </div>
                    <!-- table -->
                    <i-table :data="tableRightSelection" :columns="columns" @on-selection-change="handlerRightSelectionChange">
                    </i-table>

                    <div class="mtb25 cf">
                        <span class="fr">
                        <i-button type="primary" v-if="billId" @click="handlerCancelEditBill">取消编辑</i-button>
                        <i-button type="primary" :disabled="!tableRightSelection.length" @click="handlerAddBill">{{saveBtnText}}</i-button>
                        </span>
                    </div>
                </i-col>
            </Row>
        </div>

        <!-- 生成对账单 -->
        <Modal v-model="billModalVisible" title="对账单">
            <i-form ref="refForm" :model="bill" :rules="rules" :label-width="100">
                <FormItem label="对账单名称" prop="finance_name">
                    <i-input v-model="bill.finance_name" type="text" placeholder="请输入对账单名称"></i-input>
                </FormItem>
                <FormItem label="对账单对象" prop="finance_obj">
                    <i-input v-model="bill.finance_obj" type="text" placeholder="请输入对账单对象"></i-input>
                </FormItem>
            </i-form>
            <div slot="footer" class="cf">
                <div class="fr">
                    <i-button @click="hanlderModalCancel">取消</i-button>
                    <i-button type="primary" @click="hanlderModalOk">确定</i-button>
                </div>
            </div>
        </Modal>
    </div>
</template>
<script>
import * as constant from "./constant";
import tableSelectionMixin from "@/mixins/table-selection-mixin";
import { fmt } from "@/utils/util";
/**
 *  todo: 编辑功能未开发
 */
export default {
  name: "financeFee",
  data() {
    return {
      query: { ...constant.feeQuery },
      queryCreateTime: [], // 添加项
      columns: constant.getCulomns(this),
      billModalVisible: false,
      bill: { ...constant.newBill }, // 新增编辑数据
      rules: {
        finance_name: [{ required: true, message: "必填字段" }],
        finance_obj: [{ required: true, message: "必填字段" }]
      },
      refForm: null,
      billTypeMap: constant.billTypeMap,
      saveBtnText: '生成对账单'
    };
  },
  mixins: [tableSelectionMixin],
  computed: { 
      billId () {
        return this.$route.params.billId
      }
  },
  watch: {
    billModalVisible(n) {
      if (n) {
        if (!this.refForm) {
            this.$nextTick(() => {
                this.refForm = this.$refs.refForm;
            })
        }
      }
    },
    queryCreateTime(n) {
      let format = "yyyy-MM-dd";
      this.query.create_time_begin = n[0] ? fmt.dateFormat(n[0], format) : "";
      this.query.create_time_end = n[0] ? fmt.dateFormat(n[1], format) : "";
    },
  },
  methods: {
    async loadList() {
      this.tableLeftSelection = [];
      let query = this.assignQuery(this.query);
      let data = await this.$api.finance.getFeeList(query);
      data.resultObj.list.forEach((item)=>{
        // 格式化货物
        item.cargos = JSON.parse(item.cargos || "[]")
      })
      this.callBackLoadList(data);
    },
    handlerChangeCatalog(){
        this.$nextTick(() => {
            if (this.query.catalog != '2') { this.query.truck_owner = '' }
            this.handlerSearch()
        })
    },
    handlerSearch() {
      this.tableQuery.page = 1;
      this.loadList();
    },
    handlerReset() {
      this.query = { ...constant.feeQuery };
      this.queryCreateTime = [];
      this.handlerSearch()
    },
    handlerExport() {
    },
    handlerAddBill() {
      this.billModalVisible = true;
    }

  },
  
};
</script>