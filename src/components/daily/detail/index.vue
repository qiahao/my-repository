<template>
    <div>
        <!-- 运单信息 -->
        <detail-modal v-model="detailShow" style="width:700px" @on-detail-close="close">
            <div slot="head">
                <h3 class="fl">{{isEdit ? "编辑":"新增" }}</h3>
                <div class="fr" >
                    <i-button type="primary" @click="paymentAddOrEdit('formDailyInfo')">保存</i-button>
                </div>
            </div>
            <Form ref="formDailyInfo" :model="formData" inline class="order-model-from" :label-width="90" :rules="ruleValidate">
            <Row :gutter="10" >
                <Col span="12">
                    <FormItem label="收/支" >
                        <i-select @on-change="changePaymentType"  v-model="formData.payment_type" class="w170"  placeholder="收支类型">
                            <Option v-for="item in paymentTypes" :value="item.dict_value" :key="item.dict_value">{{ item.dict_text }}</Option>
                        </i-select>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem :label="formData.payment_type == '1' ? '收款人' : '付款人'" prop="temp_u_ame">
                        <Input v-model="formData.temp_u_ame"  class="w170"></Input>
                    </FormItem>
                </Col>
            </Row>

            <Row :gutter="10" class-name="detail-row">
                <Col span="12">
                    <FormItem label="金额" prop="money">
                        <Input v-model="formData.money" placeholder="金额" class="w170"></Input>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="车牌号" prop="truck_plate">
                        <Input v-model="formData.truck_plate" placeholder="车牌号" class="w170"></Input>
                    </FormItem>
                </Col>
            </Row>

            <Row :gutter="10" class-name="detail-row">
                <Col span="12">
                    <FormItem label="运单号" prop="order_no">
                        <Input v-model="formData.order_no" placeholder="运单号" class="w170"></Input>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="车次号" prop="trip_no">
                        <Input v-model="formData.trip_no" placeholder="车次号" class="w170"></Input>
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="10" class-name="detail-row">
                <Col span="24">
                    <FormItem label="费用用途" prop="cost_use">
                        <Input v-model="formData.cost_use" placeholder="费用用途" style="width:480px"></Input>
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="10" class-name="detail-row">
                <Col span="24">
                    <FormItem label="支付方式" >
                        <RadioGroup v-model="formData.pay_type">
                            <Radio v-for="item in payTypes" :key="item.dict_value" :label="item.dict_value" >{{item.dict_text}}</Radio>
                        </RadioGroup>
                    </FormItem>
                </Col>
            </Row>

            <Row :gutter="10" >
                <Col span="12">
                    <FormItem label="银行名称" prop="bank_name">
                        <Input v-model="formData.bank_name" placeholder="银行名称" class="w170" :disabled="formData.pay_type == '39' ? false : true" ></Input>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="微信号码" prop="wx_no">
                        <Input v-model="formData.wx_no" placeholder="微信号码" class="w170" :disabled="formData.pay_type == '72' ? false : true"></Input>
                    </FormItem>
                </Col>
            </Row>

            <Row :gutter="10" class-name="detail-row">
                <Col span="12">
                    <FormItem label="银行卡号" prop="bank_no">
                        <Input v-model="formData.bank_no" placeholder="银行卡号" class="w170" :disabled="formData.pay_type == '39' ? false : true"></Input>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="支付宝号" prop="ali_no">
                        <Input v-model="formData.ali_no" placeholder="支付宝号" class="w170" :disabled="formData.pay_type == '71' ? false : true"></Input>
                    </FormItem>
                </Col>
            </Row>

            <Row :gutter="10" class-name="detail-row">
                <Col span="12">
                    <FormItem label="开户人" prop="bank_holder">
                        <Input v-model="formData.bank_holder" placeholder="开户人" class="w170" :disabled="formData.pay_type == '39' ? false : true"></Input>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="油卡号" prop="oil_no">
                        <Input v-model="formData.oil_no" placeholder="油卡号" class="w170" :disabled="formData.pay_type == '91' ? false : true"></Input>
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="10" class-name="detail-row">
                <Col span="24">
                    <FormItem label="备注" prop="remark">
                        <Input v-model="formData.remark" placeholder="备注" style="width:480px"></Input>
                    </FormItem>
                </Col>
            </Row>

            </Form>
            
        </detail-modal>     
        
    </div>
</template>
<script>
    import tableMixin from '@/mixins/tableMixin'
    import detailModal from '@/common/detail-modal'
    import detailMixin from '@/mixins/detail-mixin.js'
    import * as constants from './constant.js'
    
    export default {
        name: 'tripDetailModal',
        data(){
             return {
                formData: {
                    payment_type: "",
                    money: "",
                    truck_plate:"",
                    order_no: "",
                    trip_no: "",
                    cost_use: "",
                    pay_type: "",
                    cost_use: "",
                    bank_name: "",
                    wx_no: "",
                    bank_no: "",
                    ali_no: "",
                    bank_holder: "",
                    oil_no: "",
                    remark: "",
                    payer: "",//付款人
                    payee:"",//收款人
                    temp_u_ame:""//用于表单验证使用的临时字段
                },
                paymentTypes: [],
                payTypes: [],
                ruleValidate: {
                    money: [
                        { required: false, message: "", trigger: "blur" },
                        {
                            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
                            message: "金额格式有误",
                            trigger: "blur"
                        },
                        { type: 'string', max: 15, message: '输入内容过长', trigger: 'blur' }
                    ],
                    truck_plate: [
                        { required: false, message: "", trigger: "blur" },
                        {
                            pattern: /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/,
                            message: "车牌号码格式有误",
                            trigger: "blur"
                        }
                    ],
                    temp_u_ame: [
                        { required: false, message: "", trigger: "blur" },
                        { type: 'string', max: 10, message: '输入内容过长', trigger: 'blur' }
                    ],
                    order_no: [
                        { required: false, message: "", trigger: "blur" },
                        { type: 'string', max: 20, message: '输入内容过长', trigger: 'blur' }
                    ],
                    trip_no: [
                        { required: false, message: "", trigger: "blur" },
                        { type: 'string', max: 20, message: '输入内容过长', trigger: 'blur' }
                    ],
                    cost_use: [
                        { required: false, message: "", trigger: "blur" },
                        { type: 'string', max: 30, message: '输入内容过长', trigger: 'blur' }
                    ],
                    bank_name: [
                        { required: false, message: "", trigger: "blur" },
                        { type: 'string', max: 20, message: '输入内容过长', trigger: 'blur' }
                    ],
                    wx_no: [
                        { required: false, message: "", trigger: "blur" },
                        { type: 'string', max: 20, message: '输入内容过长', trigger: 'blur' }
                    ],
                    bank_no: [
                        { required: false, message: "", trigger: "blur" },
                        {
                            pattern: /^[0-9]*$/,
                            message: "卡号只能包含数字",
                            trigger: "blur"
                        },
                        { type: 'string', max: 25, message: '输入内容过长', trigger: 'blur' }
                    ],
                    ali_no: [
                        { required: false, message: "", trigger: "blur" },
                        { type: 'string', max: 20, message: '输入内容过长', trigger: 'blur' }
                    ],
                    bank_holder: [
                        { required: false, message: "", trigger: "blur" },
                        { type: 'string', max: 10, message: '输入内容过长', trigger: 'blur' }
                    ],
                    oil_no: [
                        { required: false, message: "", trigger: "blur" },
                        { type: 'string', max: 20, message: '输入内容过长', trigger: 'blur' }
                    ],
                    remark: [
                        { required: false, message: "", trigger: "blur" },
                        { type: 'string', max: 30, message: '输入内容过长', trigger: 'blur' }
                    ]
                },
                isEdit: false
             }
        },
        created(){
            this.dictPaymentTypeApi();
            this.dictPayTypeApi();
        },
        mixins: [tableMixin,detailMixin],
        components: {
            detailModal
        },
        methods :{
            init(){
                if(this.$route.query.payment_id) {
                    this.isEdit = true;
                    this.loadDetail()
                }else{
                    this.isEdit = false;
                }
            },
            //载入详情数据和配载运单列表
            loadDetail(){
                let _vm = this;
                this.$api.dailyApi.paymentGet({payment_id:this.$route.query.payment_id}).then((data)=>{
                    Object.assign(this.formData, data.resultObj);
                    if(data.resultObj.payment_type == '1') {
                        this.formData.temp_u_ame = data.resultObj.payee
                    }else{
                        this.formData.temp_u_ame = data.resultObj.payer
                    }                
                });
            },
            dictPaymentTypeApi() {
                this.$api.dictApi.dictPaymentTypeApi().then(data => {
                    this.paymentTypes = data.resultObj;
                    this.formData.payment_type = this.paymentTypes[0].dict_value
                });
            },
            dictPayTypeApi() {
                this.$api.dictApi.dictPayTypeApi().then(data => {
                    this.payTypes = data.resultObj;
                    
                    this.formData.pay_type = this.payTypes[0].dict_value
                });
            },
            paymentAddOrEdit(name) {
                let vm = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if(vm.formData.payment_type == '1') {
                            vm.formData.payee = vm.formData.temp_u_ame;
                        }else{
                            vm.formData.payer = vm.formData.temp_u_ame;
                        }
                        if(vm.isEdit) {
                            vm.$api.dailyApi.paymentEdit(vm.formData).then(data => {
                                if(data.result == "1") {
                                    vm.$Message.success(data.resultInfo);
                                    bus.$emit('payment-list-reload')
                                    vm.close()
                                }else {
                                    vm.$Message.error(data.resultInfo);
                                }
                            });
                        }else {
                            vm.$api.dailyApi.paymentAdd(vm.formData).then(data => {
                                if(data.result == "1") {
                                    vm.$Message.success(data.resultInfo);
                                    this.handleReset('formDailyInfo');
                                    bus.$emit('payment-list-reload');
                                    vm.close()
                                }else {
                                    vm.$Message.error(data.resultInfo);
                                }
                            });
                        }
                    }
                })
            },
            changePaymentType(value) {
                if(value == '1') {
                    this.formData.temp_u_ame = this.formData.payee
                }else{
                    this.formData.temp_u_ame = this.formData.payer
                }
            },
            // 关闭
            close(){
                // setTimeout(()=>{
                    this.$router.push({name: 'dailyCashFlow'});
                // },300)
            },
            handleReset (name) {
                this.$refs[name].resetFields();
                this.formData.temp_u_ame = "";
            }
            
        },
        watch: {
            $route(){
                if(this.$route.query.payment_id) {
                    this.isEdit = true;
                    this.loadDetail();
                }else{
                    this.isEdit = false;
                    this.handleReset('formDailyInfo');
                }

            }
        }
    }
        
</script>

<style lang="scss">
.detail-row {
    margin-top: 10px
}

.order-model-from {
    margin-right: 66px;
    // .ivu-form-item-content {
    //     display: inline-block;
    //     vertical-align: middle;
    //     margin: 0 !important; 
    // }
}

</style>

