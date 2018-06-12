<template>
    <div>
        <Modal v-model="modal"
               title="异常登记"
               @on-cancel="doCancel">
            <i-form ref="exceptionForm"
                    :label-width="100"
                    :model="exceptionInfo"
                    :rules="exceptionRule">
                <Form-item label="异常信息："
                           prop="ex_content">
                    <i-input type="text"
                             v-model="exceptionInfo.ex_content"></i-input>
                </Form-item>
                <Form-item label="处理状态：">
                    <Radio-group v-model="exceptionInfo.ex_state">
                        <Radio label="0">未处理</Radio>
                        <Radio label="1">已处理</Radio>
                    </Radio-group>
                </Form-item>
                <Form-item label="处理情况："
                           prop="ex_result">
                    <i-input type="textarea"
                             v-model="exceptionInfo.ex_result"></i-input>
                </Form-item>
            </i-form>
            <div slot="footer">
                <i-button type="primary"
                          size="large"
                          @click="doOk">确认</i-button>
                <i-button type="error"
                          size="large"
                          @click="doCancel">取消</i-button>
            </div>
        </Modal>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import moment from 'moment'


const exceptionInfoBase = {
    order_id: '',
    ex_user_name: '',
    ex_company_name: '',
}
const exceptionInfo = {
    ex_content: '',
    ex_state: '0',
    ex_result: '',
    ex_report_type: '0',
    ex_result_time: '',
    ex_time: ''
}

export default {
    data() {
        return {
            modal: false,
            exceptionForm: null,
            exceptionInfo: Object.assign(exceptionInfoBase, exceptionInfo),
            exceptionRule: {
                ex_content: { required: true, message: '不能为空' },
                ex_result: { required: true, message: '不能为空' },
            }
        }
    },
    computed: {
        ...mapState(['userInfo']),
    },
    watch: {
        modal: function (n, o) {

            if (!n) {
                Object.assign(this.exceptionInfo, exceptionInfo)
                this.exceptionForm.resetFields()
            }
        }
    },
    methods: {
        doOk() {
            this.exceptionForm.validate((valid) => {
                if (valid) {
                    let _time = moment().format('YYYY-MM-DD HH:mm:ss')
                    let params = Object.assign({}, this.exceptionInfo, { ex_result_time: _time, ex_time: _time })
                    this.$api.exception.addException(params).then((data) => {
                        this.$Message.success({ content: data.resultInfo, duration: 1 })
                        this.modal = false
                        bus.$emit('expeption-reload')
                        bus.$emit('operation-reload')
                        bus.$emit('order-list-reload')
                    })
                }
            })

        },
        doCancel() {
            this.modal = false
        },
    },
    created() {
        this.exceptionInfo.ex_user_name = this.userInfo.user_name
        this.exceptionInfo.ex_company_name = this.userInfo.company_name
    },
    mounted() {
        this.exceptionForm = this.$refs.exceptionForm

        bus.$on('add-exception', (id) => {
            this.exceptionInfo.order_id = id
            this.modal = true
        })
    }

}
</script>
