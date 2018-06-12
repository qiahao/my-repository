<template lang="html">
<div>
    <Modal
        v-model="modal"
        title="签收"
        width="800" class-name="vertical-center-modal">
        <Table :columns="signColumnsOrders" :data="dataOrders"></Table>
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
        <div slot="footer">
            <Button   @click="hideModel">取消</Button>
            <Button type="primary"  @click="signSubmits">确定</Button>
        </div>
    </Modal>
</div>    
</template>

<script> 
	import { utilCookie,getDateFormat,getCurDate } from '@/utils/util'
	import { mapState } from 'vuex'
    import {orderSign} from '@/api/src/waybillApi'
    import rule from '@/utils/validate-rule'
    import * as constants from './constants.js'
    //订单列表个格设置
    export default {
        data (){
             return {
                user:'',
                modal:false,
                dataOrders:[],
                currentOrder: null,
                columnsOrders: Object.freeze(constants.driverColumnsOrders),
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
                signColumnsOrders:[
                    {title: '运单号', key: 'order_no' },
                    {title: '收货人', key: 'end_link_man' },
                    {title: '联系方式', key: 'end_link_mobile' },
                    {title: '代收货款', key: 'partner_fee_dshk' },
                ]
            }
        },
        created () {
            this.user = this.userInfo
            this.signData.sign_date=getCurDate()
            
        },
        mounted () {
            
            bus.$on('sign-order',async (order)=>{
                this.order_id = order.order_id
                this.$set(this.dataOrders, 0, order)
                // 确认运单是否到站：未到站提示，到站直接显示签收弹框
                
                this.$api.order
                .checkSignOrderAllow(this.order_id)
                .then((data) => {
                    if (data.resultObj.is_allow == 'N') {
                        this.$Modal.confirm({
                            title: '提示',
                            content: `<p>${data.resultObj.msg}，是否继续签收</p>`,
                            onOk: () => {
                                this.modal = true
                            },
                            onCancel: () => {
                                this.order_id = ''
                                this.dataOrders = []
                            }
                        });
                    }else{
                        this.modal = true    
                    }
                })
            })
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
                                bus.$emit("order-list-reload")
                                _vm.modal = false
                            }else{
                                _vm.$Message.error(json.resultInfo)
                            }
                        })
                    }
                })
            },
            hideModel () {
                this.modal = false
            },
          
        },
    }
</script>
