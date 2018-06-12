
<script>
import extendCompo from "./fee-extend.vue";
export default {
  name: "financeFee",
  data () {
    return {
      saveBtnText: '生成对账单'
    }
  },
  extends: extendCompo,
  watch: {
    
  },
  methods: {
    
    hanlderModalCancel() {
        this.bill.finance_name = ''
        this.bill.finance_obj = ''
        this.billModalVisible = false;
        this.refForm.resetFields()
    },
    hanlderModalOk() {
      this.refForm.validate(valid => {
        if (valid) {
          let bill = Object.assign({}, this.bill);
          bill.item_ids = Object.keys(this.tableSelectionTotalMap).join(",");
          this.addBill(bill);
        }
      });
    },
    async addBill(bill) {
      await this.$api.finance.addBill(bill);
      this.tableSelectionTotalMap = {};
      this.loadList(); // 包含了清空 tableLeftSelection
      this.hanlderModalCancel();
      this.$Message.success("操作完成");
    }
  },
  created() {
    this.loadList();
  }
};
</script>