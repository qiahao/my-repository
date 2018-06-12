<script>
import extendCompo from "@/components/finance/fee/fee-extend.vue";
export default {
  name: "financeBillEdit",
  data () {
    return {
      originBill: {},
      saveBtnText: '完成编辑',

    }
  },
  extends: extendCompo,
  computed: {
      
  },
  methods: {
    async init(){
      await this.loadDetail().catch(() => {})
      this.loadList()
    },
    async loadDetail() {
      let data = await this.$api.finance.getBillDetail({ finance_id: this.billId });
      this.originBill = data.resultObj
      this.bill.finance_name = data.resultObj.finance_name
      this.bill.finance_obj = data.resultObj.finance_obj
      this.tableSelectionTotalMap = {}
      data.resultObj.list.forEach(item => {
          item.cargos = JSON.parse(item.cargos || "[]")
          item._checked = true
          this.tableSelectionTotalMap[item.item_id] = item
      })

    },
    handlerCancelEditBill () {
      this.$router.push({name: 'financeBillDetail',params: {billId: this.billId}})
    },
    handlerAddBill() {
      this.billModalVisible = true;
      this.bill.finance_name = this.originBill.finance_name
      this.bill.finance_obj = this.originBill.finance_obj
    },
    hanlderModalCancel() {
      this.billModalVisible = false
      this.refForm.resetFields()
    },
    hanlderModalOk() {
      this.refForm.validate(valid => {
        if (valid) {
          let bill = Object.assign({}, this.bill);
          bill.item_ids = Object.keys(this.tableSelectionTotalMap).join(",");
          bill.finance_id = this.billId
          this.updateBill(bill);
        }
      });
    },
    async updateBill(bill) {
      await this.$api.finance.updateBill(bill);
      // this.init()
      this.hanlderModalCancel();
      this.$Message.success("操作完成");
      this.handlerCancelEditBill()

    }
  },
  created() {
    this.init();
  }
};
</script>
