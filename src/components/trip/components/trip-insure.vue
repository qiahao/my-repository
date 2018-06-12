<template>
  <div >
    <Modal v-model="visible" 
            title="整车投保" 
            width="600"
            @on-ok="handlerSave" 
            @on-cancel="handlerCancel">
      <div v-if="visible">
        <i-form ref="form" 
                :model="entity" 
                :rules="rules" 
                :label-width="120"
                class="error-button">

          <FormItem label="保险公司">
            {{entity.insure_company}}
          </FormItem>

          <FormItem label="被保险人" prop="insure_insurant">
            {{entity.insure_insurant}}
            <!-- <i-input type="text" v-model="entity.insure_insurant" placeholder="输入被保险人"></i-input> -->
          </FormItem>

          <FormItem label="发货日期" prop="trip_send_time">
            <DatePicker type="datetime" 
                        v-model="entity.trip_send_time"
                        placeholder="选择发货日期" 
                        format="yyyy-MM-dd HH:mm" 
                        class="w200"></DatePicker>
          </FormItem>

          <FormItem label="运输路线">
            <FormItem  prop="trip_line_begin" class="dib">
              <i-input v-model="entity.trip_line_begin" class="w200" placeholder="请输入起始地" ></i-input>
            </FormItem>
            至
            <FormItem  prop="trip_line_end" class="dib">
              <i-input v-model="entity.trip_line_end" class="w200" placeholder="请输入目的地" ></i-input>
            </FormItem>                
          </FormItem>

          <FormItem label="货物类型">
            <RadioGroup v-model="entity.trip_cargo_type">
              <Radio label="0">普通货物</Radio>
              <Radio label="1">整车机械设备、电子产品、工程机械</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem label="货物声明价值">
            <InputNumber :max="200" :min="0" :precision="2" v-model="entity.insure_amount"></InputNumber> 万元
          </FormItem>

          <FormItem label="预估保费">
            <InputNumber :min="0" :value="estimateAmount" :editable="false" :precision="2" disabled></InputNumber> 元
          </FormItem>

          <FormItem :label-width="1" prop="insure_is_agree">
              <Checkbox v-model="entity.insure_is_agree"></Checkbox>
              <span>我已阅读并同意 <a href="/static/files/insure-protocol.pdf" target="_blank">《富邦国内货物运输保险协议》</a> 投保信息及理赔情况请与相关保险公司洽谈请您谨慎填写以上信息，并在核实无误后点击确认投保</span>
          </FormItem>


          
        </i-form>
      </div>
      <div slot="footer">
        <i-button @click="handlerSave" type="primary">确定</i-button>
        <i-button @click="handlerCancel">取消</i-button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { fmt } from "@/utils/util";
import { mapState } from "vuex";
const entity = {
  trip_id: '' , //	String	是	车次ID
  insure_company: '富邦保险' , //	String	是	保险公司
  insure_insurant: '福建鑫合顺物流有限公司' , //	String	是	被保险人
  trip_send_time: '' , //	String	是	发货日期
  trip_line_begin: '' , //	String	是	运输线路起始地
  trip_line_end: '' , //	String	是	运输线路目的地
  trip_cargo_type: '0' , //	String	是	货物类型 0普通货物 1 整车机械设备、电子产品、工程机械
  insure_amount: 0 , //	String	是	声明价值
  insure_is_agree: true , //	String	是	是否同意 Y同意 N不同意
}
export default {
  props: {
    value: false,
    entry: {
      type: Object,
      default() {
        return {
          trip_id: '',
          trip_line_begin: '',
          trip_line_end: '',
        };
      }
    }
  },
  data() {
    let agreeValidator = (rules,value, callback) => {
      if (value) {
        callback()
      }else{
        callback(new Error('请选择同意保险协议'))
      }
    }
    
    return {
      entity: {...entity},
      rules: {
          insure_insurant: [{required: true, message: '必填字段'}],
          trip_send_time: [{required: true, message: '必填字段'}],
          trip_line_begin: [{required: true, message: '必填字段', trigger: 'change'}],
          trip_line_end: [{required: true, message: '必填字段', trigger: 'change'}],
          insure_is_agree: [{validator: agreeValidator}],
      },
      provinceOption: { 'change-on-select': true },
    };
  },
  computed: {
    ...mapState(['userInfo']),
    visible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    // 预估保额
    estimateAmount (){
      return this.getValidateEstimateAmount(this.entity.insure_amount)
    }
  },
  watch: {
    value (n) {
      if (n) {
        this.entity = Object.assign({},this.entity,this.entry)
      }
    }
  },
  methods: {
    async handlerSave() {
      let _valid = false
      this.$refs.form.validate(valid => _valid = valid)
      if (!_valid) {return }
      
      let postData = {...this.entity}
      postData.insure_is_agree = postData.insure_is_agree ? 'Y' : 'N'
      postData.trip_send_time = fmt.date(postData.trip_send_time,'yyyy-MM-dd hh:mm')

      await this.$api.tripApi.tripInsure(postData)
      this.$emit('after-save')
      this.$Message.success('已发起投保！')
      this.handlerCancel()
    },
    handlerCancel() {
      this.visible = false
      this.entity = {...entity}
      this.$emit('on-cancel')
    },
    getValidateEstimateAmount (input) {
      if (!input) return 0 
      // input 单位万元 
      let t1 = 10000, intInput = parseInt(input * t1); 
      let n1 = 0.0001, n2 = 0.00025, t2 = 100000, intBaseTimes = parseInt(n1 * t2);
      if (this.entity.trip_cargo_type == '1') {
        intBaseTimes = parseInt(n2 * t2)
      }
      let rst = (intInput * intBaseTimes) / t2
      return Math.round(rst * 100) / 100
    }
  },
  created () {
    
  }
};
</script>

<style>

</style>
