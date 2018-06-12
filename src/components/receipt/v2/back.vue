<template>
    <!-- 回单回收 -->
    <Modal :value="value" title="回单回收" @on-cancel="doCancel">
        <i-form :model="backForm" ref="backForm" :rules="backFormRule" inline>
            <div class="cf">
                <Form-item label="回收人" class="fl" prop="receipt_user">
                    <i-input v-model="backForm.receipt_user" class="w140"></i-input>
                </Form-item>
                <Form-item label="回收日期" class="fr mr0" prop="receipt_time">
                    <DatePicker v-model="backForm.recipt_date" class="w170" @on-change="onDateRange"></DatePicker>
                </Form-item>
            </div>
            <Form-item class="content-block wp100" prop="receipt_remark">
                <i-input type="textarea" :rows="4" v-model="backForm.receipt_remark" class="wp100" placeholder="请输入备注信息...">
                </i-input>
            </Form-item>
        </i-form>
        <div slot="footer">
            <i-button type="primary" size="large" @click="backOk">确认</i-button>
            <i-button type="error" size="large" @click="doCancel">取消</i-button>
        </div>
    </Modal>
</template>
<script>
import { mapState } from 'vuex'
import { orderBackReceiveApi } from '@/api/src/receiptApi'
import validateRule from '@/utils/validate-rule'
import moment from 'moment'
export default {
    name:'receiptBack',
    data() {
        return {
            backForm: {
                order_id: '',
                receipt_user: '',
                receipt_time: '',
                receipt_remark: '',
                recipt_date: ''
            },
            backFormRule: {
                receipt_user: [validateRule.required()],
                recipt_date: [validateRule.required()]
            },
        }
    },
    props: {
        value: {
            type: Boolean,
            default: false,
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
        vm.backForm.receipt_user = vm.userInfo.user_name
        vm.backForm.recipt_date = new Date();

    },
    methods: {
        backOk() {
            let vm = this
            let params = {
                user_id: vm.userInfo.user_id,
                company_id: vm.userInfo.company_id,
                receipt_user: vm.backForm.receipt_user,
                receipt_time: moment(vm.backForm.recipt_date).format('YYYY-MM-DD'),
                receipt_remark: vm.backForm.receipt_remark
            }
            if (vm.selectArray && vm.selectArray.length) {
                params.order_ids = vm.selectArray.join(',')
            } else {
                params.order_ids = vm.$route.query.id
            }
            this.$refs.backForm.validate((valid) => {
                if (valid) {
                    orderBackReceiveApi(params).then(data => {
                        vm.$Message.success(data.resultInfo)
                        vm.$emit('call-back')
                        vm.$emit('input', false)
                    })
                } else {
                    return
                }
            })
        },
        onDateRange(time) {
            this.backForm.receipt_time = moment(time).format('YYYY-MM-DD')
        },
        doCancel() {
            this.$emit('input', false)
        },
    }
}
</script>