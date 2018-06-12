<template>
  <div>
    <div class='contain-head cf'>
      <i-button type="primary" @click="handlerBack" icon="ios-arrow-left" class="mr5">返回</i-button>
      <h3 class="dib">对账单详情</h3>
      <div class="fr">
        <i-button type="primary" @click="handlerEdit" v-if="bill.finance_status == 'N'">编辑</i-button>
        <i-button type="error" @click="handlerCancel">作废</i-button>
        <i-button type="primary" @click="handlerOpenRecord(1)">核销记录</i-button>
        <i-button type="primary" @click="handlerOpenRecord(2)">反向核销</i-button>
      </div>
      
      
    </div>
    <div class="contain-main">
      <div class="row-box row-box-text mb20">
        <Row>
          <i-col span="10">
            <div class="ell">对账单名称：{{bill.finance_name}} </div>
          </i-col>
          <i-col span="10">
            <div class="ell">对账对象：{{bill.finance_obj}}</div>
          </i-col>
          <i-col span="4">
            <div class="ell">对账编号：{{bill.finance_no}}</div>
          </i-col>
          <i-col span="5">
            <div class="ell">核销状态：{{billStatusMap[bill.finance_status]}}</div>
          </i-col>
          <i-col span="5">
            <div class="ell">应付金额：{{bill.finance_pay}}</div>
          </i-col>
          <i-col span="5">
            <div class="ell">已付金额：{{bill.finance_pay_already}}</div>
          </i-col>
          <i-col span="5">
            <div class="ell">应收金额：{{bill.finance_income}}</div>
          </i-col>
          <i-col span="4">
            <div class="ell">已收金额：{{bill.finance_income_already}}</div>
          </i-col>
        </Row>
      </div>
      <!-- table -->
      <i-table :data="bill.list" :columns="columns"> </i-table>
        
    </div>

    <!-- 核销记录 -->
    <Modal v-model="modalVisible" :title="modalTitle" width="800">
      <!-- 反向核销 -->
      <div>
        <i-table :data="tableParams.list" :columns="verificationColumns" @on-selection-change="onSelectionChange"> </i-table>
      </div>

      <div slot="footer" class="cf">
          <div class="fr" v-show="verificationType == 2">
              <i-button @click="hanlderModalCancel">取消</i-button>
              <i-button type="primary" @click="hanlderModalOk">确定</i-button>
          </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import tableMixin from "@/mixins/tableMixin";
import * as constant from "./constant";
export default {
  name: "financeBillDetail",
  data() {
    return {
      bill: {
        finance_id: "",
        finance_name: "",
        finance_no: "",
        finance_obj: "",
        finance_status: "",
        finance_pay: "",
        finance_pay_already: "",
        finance_income: "",
        finance_income_already: "",
        list: []
      },
      columns: constant.getDetailCulomns(this),
      billStatusMap: {...constant.billStatusMap},

      // 核销记录弹框
      modalTitle: '核销记录',
      modalVisible: false,
      verificationType: 1,
      verificationColumns: constant.getVerificationRecordColumns(this),
      verificationRecordColumns: constant.getVerificationRecordColumns(this),
      verificationRecordSelecionColumns: constant.getVerificationRecordSelectionColumns(this),
      
    };
  },
  mixins: [tableMixin],
  computed: {
    billId() {
      return this.$route.params.billId;
    },
  },
  watch: {
    verificationType (n) {
      if (n ==1) {
        this.verificationColumns = this.verificationRecordColumns
        this.modalTitle = '核销记录'
      }else if(n == 2){
        this.verificationColumns = this.verificationRecordSelecionColumns
        this.modalTitle = '反向核销'
      }
    }
  },
  methods: {
    init(){
      this.loadDetail()
      this.loadList()
    },
    async loadDetail() {
      let data = await this.$api.finance.getBillDetail({
        finance_id: this.billId
      }).catch((data)=>{
        return data
      });
      if (data.result == 2) {
        return this.$router.replace({name: 'financeBill'})
      }
      this.bill = data.resultObj
      this.bill.list.forEach(item => {
        item.cargos = JSON.parse(item.cargos || "[]")
      })
    },
    handlerBack () {
      this.$router.push({name: 'financeBill'})
    },
    handlerEdit () {
      this.$router.push({name: 'financeBillEdit',params: {billId: this.billId}})
    },
    handlerCancel () {
      this.$Modal.confirm({
          title: '作废确认',
          content: '<p>确定作废该对账单？</p>',
          onOk: () => {
              this.$api.finance.cancelBill({finance_ids: this.billId}).then(()=>{
                this.$Message.success('操作成功')
                this.$router.replace({name: 'financeBill'})
              })
          }
      });
      
    },
    handlerOpenRecord (type) {
      this.verificationType = type
      this.modalVisible = true
    },
    async loadList(){
      this.tableParams.selectList = []
      let data =  await this.$api.finance.getVerificationRecord({finance_id: this.billId})
      this.tableParams.list = data.resultObj
      this.tableParams.list.forEach(item => {
        if (item.record_status == 'N') {
          item._disabled = true
        }
      })
    },
    hanlderModalCancel () {
      this.modalVisible = false
    },
    async hanlderModalOk () {
      if (this.verificationType == 2) {
        let l = this.tableParams.selectList.length
        if (!l) {
          return this.$Message.warning('请选择反向核销记录')
        }else if(l > 1){
          return this.$Message.warning('单次只能反向核销一条记录')
        }else{
          let params = {finance_id: this.billId,record_ids: this.tableParams.selectList[0].record_id}
          await this.$api.finance.updateVerificationBack(params)
          this.$Message.success('操作成功')
          this.init()
          this.hanlderModalCancel()
        }
      }else{
        this.hanlderModalCancel()
      }
      
    },
  },
  created() {
    this.init()
  }
};
</script>
