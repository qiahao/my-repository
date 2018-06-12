<template>
    <Modal :value="value" title="回单发放" @on-cancel="doCancel">
        <i-form :model="sendForm" ref="sendForm" :rules="sendFormRule" inline>
            <div class="cf">
                <Form-item label="发放人" class="fl" prop="receipt_user">
                    <i-input v-model="sendForm.receipt_user" class="w140"></i-input>
                </Form-item>
                <Form-item label="发放日期" class="fr mr0" prop="receipt_time">
                    <DatePicker :value="sendForm.receipt_time" class="w160" @on-change="onDateChange"></DatePicker>
                </Form-item>
            </div>
            <Form-item label="发放方式" prop="receipt_type">
                <RadioGroup v-model="sendForm.receipt_type">
                    <Radio v-for="item in receiptType" :label="item.value" :key="item.value">{{item.label}}</Radio>
                </RadioGroup>
            </Form-item>
            <Form-item label="车号" prop="driver_mobile" v-if="sendForm.receipt_type==1">
                <i-input v-model="sendForm.driver_mobile" placeholder="请输入车号" class="w200">
                </i-input>
            </Form-item>
            <Form-item label="快递号" prop="express_no" v-if="sendForm.receipt_type==2">
                <i-input v-model="sendForm.express_no" placeholder="请输入快递单号">
                </i-input>
            </Form-item>
            <Form-item class="content-block wp100">
                <i-input type="textarea" :rows="3" v-model="sendForm.receipt_remark" placeholder="请输入车辆或司机备注信息......">
                </i-input>
            </Form-item>
        </i-form>
        <div slot="footer">
            <i-button type="primary" size="large" @click="sendOk">确认</i-button>
            <i-button type="error" size="large" @click="doCancel">取消</i-button>
        </div>
    </Modal>
</template>
<script>
import { mapState } from 'vuex'
import { orderBackSendApi } from '@/api/src/receiptApi'
import validateRule from '@/utils/validate-rule'
import moment from 'moment'
export default {
    data() {
        return {
            sendForm: {
                order_id: '',
                receipt_user: '',
                receipt_time: '',
                receipt_remark: '',
                receipt_type: '0',
                driver_mobile: '',
                express_no: '',
                receipt_date: '',
            },
            sendFormRule: {
                receipt_user: [validateRule.required()],
                receipt_time: [validateRule.required()],
                driver_mobile: [validateRule.required()],
                express_no: [validateRule.required()]
            },
            receiptType: [{
                value: '0',
                label: '直接发放',
            },
            {
                value: '1',
                label: '司机带回',
            },
            {
                value: '2',
                label: '快递邮寄',
            }],
        }
    },
    props: {
        value: {
            type: Boolean,
        },
        selectArray: {
            type: Array,
            default: () => {
                return []
            },
        }
    },
    computed: {
        ...mapState(['userInfo'])
    },
    created() {
        let vm = this
        vm.sendForm.receipt_user = vm.userInfo.user_name
    },
    mounted(){
        let vm = this
        vm.sendForm.receipt_time = moment(new Date()).format('YYYY-MM-DD');
    },
    methods: {
        sendOk() {
            let vm = this
            
            this.$refs.sendForm.validate((valid) => {
                if (valid) {
                    let params = {
                        user_id: vm.userInfo.user_id,
                        company_id: vm.userInfo.company_id,
                        receipt_user: vm.sendForm.receipt_user,
                        receipt_time: vm.sendForm.receipt_time,
                        receipt_remark: vm.sendForm.receipt_remark,
                        receipt_type: vm.sendForm.receipt_type,
                        driver_mobile: vm.sendForm.driver_mobile,
                        express_no: vm.sendForm.express_no,
                    }
                    if (vm.selectArray.length) {
                        params.order_ids = vm.selectArray.join(',')
                    } else {
                        params.order_ids = vm.$route.query.id
                    }
                    orderBackSendApi(params).then(data => {
                        vm.$Message.success(data.resultInfo)
                        vm.$emit('call-back')
                        vm.$emit('input', false)
                    })
                } else {
                    // vm.$emit('input', true)
                    return
                }
            })
        },
        onDateChange(time) {
            this.sendForm.receipt_time = time
            
        },
        doCancel() {
            this.$emit('input', false)
        },
    }
}
</script>
