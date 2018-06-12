<template lang="html">
<div>
    <Form  :label-width="85"  ref="signData" :model="signData" :rules="sign_rule">
        <div class="cf-all mt15">
            <Row>
                <Col span="8"  class="">
                    <Form-item label="签收人" prop="sign_name">
                        <i-input v-model="signData.sign_name"  placeholder="请输入签收人" style="width:165px"></i-input>  
                    </Form-item>
                </Col>
                <Col span="8"  class="">
                    <Form-item label="身份证号" prop="sign_id_card">
                        <i-input v-model="signData.sign_id_card"  placeholder="请输入身份证号" style="width:165px"></i-input>  
                    </Form-item>
                </Col>
                <Col span="8"  class="">
                    <Form-item label="签收时间"  prop="sign_date">
                        <Date-picker  v-model="signData.sign_date"  type="datetime" placeholder="选择日期" style="width:165px"></Date-picker>
                    </Form-item>
                </Col>
            </Row>
        </div>

        <Form-item label="备注" >
            <i-input type="textarea" v-model="signData.sign_note" placeholder="请输入备注" ></i-input>
        </Form-item>
    </Form>
    
</div>    
</template>

<script> 
	import { utilCookie,getDateFormat,getCurDate } from '@/utils/util'
	import { mapState } from 'vuex'
    import {orderSign} from '@/api/src/waybillApi'
    import rule from '@/utils/validate-rule'
    
    //订单列表个格设置
    export default{
        props: {
			order_id:''
		},
        data:function(){
             return {
                user:'',
                model:false,
                sign_rule: {
                    sign_name: [
                        { required: true, message: '这是必填项', trigger: 'change' }
                    ],
                    sign_id_card: [
                        { required: true, message: '这是必填项', trigger: 'change' },
                         { validator: rule.idCard,  trigger: 'blur'},
                    ],
                    sign_date: [
                        { required: true, message: '这是必填项' }
                    ],
                },
                signData:{
                    act_user_id:'',
                    act_company_id:'',
                    order_ids:'',
                    sign_name:'',
                    sign_id_card:'',
                    sign_date:'',
                    sign_note:''
                },
            }
        },
        created () {
            this.user = this.userInfo
            this.signData.sign_date=getCurDate()
            
        },
        computed:{
			...mapState(['userInfo']),
		},
        methods :{
            signSubmits(){
                let _vm = this;
                _vm.$refs['signData'].validate((valid) => {
					if (valid) {
                        _vm.signData.act_user_id = _vm.user.user_id;
                        _vm.signData.act_company_id = _vm.user.company_id;
                        _vm.signData.order_ids = _vm.order_id;
                        if(typeof _vm.signData.sign_date=="object"){
                            _vm.signData.sign_date=getDateFormat(_vm.signData.sign_date)
                        }
                        orderSign(_vm.signData).then(json=>{
                            if(json.result==1){
                                this.$Message.success("签收成功")
                                this.$emit("signSubmit",true)
                            }else{
                                _vm.$Message.error(json.resultInfo)
                            }
                        })
                    }
                    else{}
                })
                
                
            },
            dateChange:function(e){	
			},
        },
    }
</script>
<style lang="scss" rel="stylesheet/scss">
  
</style>