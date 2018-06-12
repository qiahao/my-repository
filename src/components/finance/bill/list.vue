<template>
    <div>
        <div class='contain-head'>
            <RadioGroup v-model="query.finance_status" type="button" @on-change="handlerSearch"> <!-- 千万不能用click.native = handlerSearch -->
                <Radio v-for="(item, i) in billStatusMapList" :key="i" :label="item.status">{{item.label}}</Radio>
            </RadioGroup>
            <i-input v-model="query.keyword" type="text" placeholder="请输入账单名称、对账对象" style="width: 280px;"></i-input>
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
                        <h3 class="dib">对账单</h3>
                        <span class="fc-gray">请勾选您需要核销的对账单，并在右侧列表中进行核销</span>
                    </div>
                    <!-- table -->
                    <i-table :data="tableData" :columns="columns" @on-selection-change="handlerLeftSelectionChange">
                    </i-table>
                    <!-- page -->
                    <div class="page-wrapper">
                        <Page :total="tableDataTotal" show-sizer show-elevator :current="currentPage" @on-change="handlerPageChange" @on-page-size-change="handlerPageSizeChange">
                        </Page>
                    </div>
                </i-col>
                <!-- 右侧 -->
                <i-col span="12 pl5">
                    <div>
                        <h3 class="dib">待核销</h3>
                        <span class="fc-gray">您可以勾选 不需要 核销的对账单，将其移除列表</span>
                    </div>
                    <!-- table -->
                    <i-table :data="tableRightSelection" :columns="columns" @on-selection-change="handlerRightSelectionChange">
                    </i-table>
                    <div class="mt10">
                        <div class="mb10">未核销应收金额：
                            <InputNumber :max="financeIncomeUnMax" :min="0" v-model="financeIncomeUn"></InputNumber>
                        </div>
                        <div>未核销应付金额：
                            <InputNumber :max="financePayUnMax" :min="0" v-model="financePayUn"></InputNumber>
                        </div>
                    </div>
                    <div class="mtb25">
                        <i-button class="fr" type="primary" :disabled="!tableRightSelection.length" @click="handlerBillVerification">费用核销</i-button>
                    </div>
                </i-col>
            </Row>
        </div>

        <!-- 费用核销 -->
        <Modal v-model="billModalVisible" title="费用核销">
            <i-form ref="refForm" :label-width="100">
                
                <FormItem label="付款方式：">
                    现金支付
                </FormItem>
                
                <FormItem label="财务记账号：">
                    <i-input v-model="newBillModal.pay_no" type="text" placeholder="请输入财务记账号"></i-input>
                </FormItem>
                <FormItem label="备注：">
                    <i-input v-model="newBillModal.finance_remark" type="textarea" placeholder="请输入核销备注"></i-input>
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
import tableSelectionMixin from "@/mixins/table-selection-mixin";
import * as constant from "./constant";
import { fmt,getFalsyInteger } from "@/utils/util";

export default {
  name: "financeBill",
  data() {
    return {
      idFlag: "finance_id",
      query: { ...constant.query },
      queryCreateTime: [], // 查询时间
      billStatusMapList: { ...constant.billStatusMapList }, // 筛选对象
      columns: constant.getCulomns(this),
      financeIncomeUn: 0,
      financePayUn: 0,
        // 弹框数据
      billModalVisible: false,
      newBillModal: {
          finance_remark: '',
          pay_no: ''
      }
      
    };
  },
  mixins: [tableSelectionMixin],
  computed: {
        financeIncomeUnMax (){
            let max = 0,times = 100
            if (!this.tableRightSelection.length) {
                return 0
            }else{
                this.tableRightSelection.forEach(item => {
                    max += getFalsyInteger(item.finance_income) - getFalsyInteger(item.finance_income_already)
                })
                
                if (!max) {
                    return 0
                }else{
                    max -= 1
                }
                return max / times
            }

            
        },
        financePayUnMax () {
            let max = 0, times = 100
            if (!this.tableRightSelection.length) {
                return 0
            }else{
                this.tableRightSelection.forEach(item => {
                    max += getFalsyInteger(item.finance_pay) - getFalsyInteger(item.finance_pay_already)
                })
                if (!max) {
                    return 0
                }else{
                    max -= 1
                }
                return max / times
            }
        },
        tableRightSelectionLength () {
            return this.tableRightSelection.length
        },

  },
  watch: {
    queryCreateTime(n) {
      let format = "yyyy-MM-dd";
      this.query.create_time_begin = n[0] ? fmt.dateFormat(n[0], format) : "";
      this.query.create_time_end = n[0] ? fmt.dateFormat(n[1], format) : "";
    },
    financeIncomeUnMax (n) {
        if (this.financeIncomeUn > n) {
            this.financeIncomeUn = n
        }
    },
    financePayUnMax (n) {
        if (this.financePayUn > n) {
            this.financePayUn = n
        }
    },
    financeIncomeUn (n) {
        
        this.setNewFee(this.financeIncomeUn,'finance_income','finance_income_already','finance_income_un')
    },
    financePayUn () {
        this.setNewFee(this.financePayUn,'finance_pay','finance_pay_already','finance_pay_un')
    },
    tableRightSelectionLength(){
        this.setNewFee(this.financeIncomeUn,'finance_income','finance_income_already','finance_income_un')
        this.setNewFee(this.financePayUn,'finance_pay','finance_pay_already','finance_pay_un')
    }
  },
  methods: {
    async loadList() {
      this.tableLeftSelection = [];
      let query = this.assignQuery(this.query);
      let data = await this.$api.finance.getBillList(query);
      this.callBackLoadList(data);
    },
    handlerSearch() {
      this.tableQuery.page = 1;
      this.loadList();
    },
    handlerReset() {
      this.query = { ...constant.query };
      this.queryCreateTime = [];
      this.handlerSearch();
    },
    handlerExport() {
    },
    handlerRedirectDetail(id) {
      this.$router.push({ name: "financeBillDetail", params: { billId: id } });
    },
    handlerBillVerification() {
        this.billModalVisible = true
    },
    hanlderModalCancel () {
        this.billModalVisible = false
        this.billModalRemark = ''
    },
    async hanlderModalOk () {
        let params = {
            content: [],
            finance_remark: this.newBillModal.finance_remark,
            pay_no: this.newBillModal.pay_no
        }
        params.content = this.tableRightSelection.map(item => {
            let obj = {}
            obj.finance_id = item.finance_id
            obj.last_pay_money = item.finance_pay_un
            obj.last_income_money = item.finance_income_un
            return obj
        })
        params.content = JSON.stringify(params.content)
        
        await this.$api.finance.updateVerification(params)
        this.$Message.success('操作成功')
        this.tableSelectionTotalMap = []
        this.hanlderModalCancel()
        this.tableQuery.page = 1
        this.loadList()
    },
    setNewFee(unPayTotal,totalPro,areadyPro,restPro){
        let times = 100, total = getFalsyInteger(unPayTotal)
        let l = this.tableRightSelection.length
        for(let i = 0;i < l; i++ ){
            let item = this.tableRightSelection[i]
            let short = (getFalsyInteger(item[`${totalPro}`]) - getFalsyInteger(item[`${areadyPro}`]))
            if (!total) {
                item[`${restPro}`] = 0
            }else if(total <= short){
                item[`${restPro}`] = total / times
                total = 0
            }else {
                item[`${restPro}`] = short / times
                total -= short
            }
        }
    }
  },
  created() {
    this.loadList();
  }
};
</script>
