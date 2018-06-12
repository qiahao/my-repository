<template>
    <i-form 
        ref="receiptForm" 
        :label-width="80" 
        :model="order" 
        :rules="receiptRule" 
        class="order-store">
        <!-- 回执信息 -->
        <div class="row-box">
            <Row>
                <Form-item label="回单：" class="back-type">
                    <Radio-group  v-model="order.back_type">
                        <Radio label="no"><span>无</span></Radio>
                        <Radio label="0"><span>回执</span></Radio>
                        <Radio label="1"><span>原单</span></Radio>
                        <Radio label="2"><span>收条</span></Radio>
                        <Radio label="3"><span>电子回单</span></Radio>
                        <Radio label="4"><span>其他</span></Radio>
                    </Radio-group>
                </Form-item>
                <Form-item 
                    class="back-type-other" 
                    :label-width="1" 
                    v-show="order.back_type == 4">
                    <Input v-model="order.back_type_other" placeholder="其他回单"></Input>
                </Form-item>
                <Form-item class="back-nums" :label-width="1" prop="back_nums">
                    共<Input v-model="order.back_nums" placeholder="0"></Input>份
                </Form-item>
            </Row>
            <Row>
                <i-col span="16">
                    <Form-item label="备注：">
                        <Input placeholder="输入备注" v-model="order.shipper_remark"></Input>
                    </Form-item>
                </i-col>
                <i-col span="8">
                    <Form-item label="制单员：">
                        <span>{{order.create_user ? order.create_user.user_name : ''}}</span>
                    </Form-item>
                </i-col>
            </Row>
        </div>   
    </i-form> 
</template>
<script>
    import * as constants from './constant.js'
    const intRge = /^\d+$/
    export default {
        props: {
            order: {
                type: Object,
                default: () => {return {}}
            }
        },
        data () {
            // 回单份数验证
            const validateBackNums = (rule,value,callback) =>{
                if (this.order.back_type != 'no') {
                    if (value === undefined || value === '') callback(new Error('不能为空'))
                    else if (!constants.intRge.test(value) || value < 0 || value > 9) callback(new Error('请输入0到9的整数'))
                    else callback()
                }else{
                    callback()
                }
            }

            return {
                receiptForm: null,
                receiptRule: {
                    back_nums: {validator: validateBackNums, trigger: 'change' }
                },
            }
        },
        watch: {
            'order.back_type': function (n,o) {
                if (n != 4) this.order.back_type_other = ''
            },
            'order.back_nums': function (n,o) {
                if (n === undefined) this.order.back_nums = 0 
            },
        },
        mounted (){
            this.receiptForm = this.$refs.receiptForm
            bus.$on('save-base-info',()=>{
                this.receiptForm.validate((valid)=>{this.$emit('child-complete',valid) })
            })
        },
    }
        
</script>
<style lang="scss">
    .order-store{
        .back-type,
        .back-type-other,
        .back-nums{
            display: inline-block;
        }
        .back-type-other{
            input{
                width: 100px;
            }
        }
        .back-nums{
            .ivu-input-wrapper{
                display:inline-block;
                width: 40px;
            }
            input{
                text-align: center;
            }            
        }
    }
    
</style>