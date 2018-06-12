<template>
    <div>
      <Modal v-model="visible" title="打印份数" width="360">
        <i-form :rules="rules" :model="entity" ref="form">
          <FormItem prop="count" label="请输入需要打印的份数">
            <InputNumber :max="100" :min="1" v-model="entity.count" placeholder="请输入打印份数" ></InputNumber>
          </FormItem>
          <p>该运单共有 {{orderCount}} 件货物</p>
        </i-form>
  
        <div slot="footer">
          <i-button @click="handlerCancel">取消</i-button>
          <i-button type="primary" @click="handlerOk">确定</i-button>
        </div>
      </Modal>
    </div>
  </template>
  
  
  <script>
  import { printTag } from "@/common/print-lodop/index.js";
  
  export default {
    props: {
      value: false,
      order: {
        default (){
          return {}
        }
      } // 订单
    },
    data() {
      return { 
        entity: {
          count: 1
        },
        rules: {
          count: [
            {required: true, message: '不能为空'},
          ]
        },
        // printSetting: {}
      };
    },
    computed: {
      // 先打开数量弹框
      visible: {
        get () {
          return this.value
        },
        set (n) {
          this.$emit('input',n)
        },
      },
      orderCount (){
        return +this.order.order_count || 1
      }
    },
    methods: {
      handlerOk(){
        let _valid = false
        this.$refs.form.validate(valid => _valid = valid)
        if (!_valid) { return }
     
        
        printTag({
          data: this.order,
          total: this.entity.count
        })
  
        this.$nextTick(() =>{
          this.handlerCancel()
        })
      },
      handlerCancel(){
        this.entity.count = 1
        this.visible = false
      }
    }
  
  };
  </script>