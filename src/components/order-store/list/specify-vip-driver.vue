<template>
    <div>
        <Modal v-model="modal" width="1000" class="order-store-vip-driver">
            <div slot="header">
                <span>指派司机</span>
            </div>
            <i-form :label-width="100" ref="orderForm" :model="order" :rules="orderRule">
                <!-- 内容 -->
                <i-table :data="dataOrders" :columns="columnsOrders"></i-table>
                <div class="row-box mtb10">
                    <Row>
                        <i-col span="24">
                            <Form-item :label-width="160" label="司机姓名/联系方式：">
                                <Dropdown class="specity-vip-driver-drop" trigger="custom" placement="bottom-start" :visible="dropdownVisible" v-clickoutside="dropCloseHandler">
                                    <i-input type="text" placeholder="请输入司机姓名/联系方式" v-model="driverSearch.keyword" @on-focus="dropFocusHandler" @on-change="getMatchDrivers"></i-input>
                                    <div slot="list">
                                        <i-table :data="dataDriverList" :columns="columnsDriver" @on-row-click="selectDriver"></i-table>
                                    </div>
                                </Dropdown>
                            </Form-item>
                        </i-col>
                    </Row>
                </div>
                <i-table :data="dataDriver" :columns="columnsDriver"></i-table>
                <div class="row-box mtb10">
                    <Row>
                        <i-col span="8">
                            <Form-item label="司机运费：" prop="driver_fee_detail.driver_fee_y" :rules="orderRule.driver_fee_detail.driver_fee_y">
                                <i-input type="text" placeholder="输入金额" v-model="order.driver_fee_detail.driver_fee_y"></i-input>
                            </Form-item>
                        </i-col>
                        <i-col span="8">
                            <Form-item label="其他：" prop="driver_fee_detail.driver_fee_qt" :rules="orderRule.driver_fee_detail.driver_fee_qt">
                                <i-input type="text" placeholder="输入金额" v-model="order.driver_fee_detail.driver_fee_qt"></i-input>
                            </Form-item>
                        </i-col>
                    </Row>
                </div>
                <div class="row-box mtb10">
                    <Row>
                        <i-col span="8">
                            <Form-item label="合计：" prop="driver_fee">
                                <i-input type="text" placeholder="输入金额" readonly :value="order.driver_fee"></i-input>
                            </Form-item>
                        </i-col>
                        <!-- 付款详情 隐藏项 -->
                        <i-col span="8" v-for="(item,i) in driverPayTypes" v-if="item.type != 'driver_pay_dbf'" v-show="order.driver_pay_type == 'driver_pay_dbf' || order.driver_pay_type == item.type" :key="i">
                            <Form-item :label="item.text + '：'">
                                <i-input type="text" :placeholder="'请输入' + item.text" v-model="order.driver_pay_detail[item.type]"></i-input>
                            </Form-item>
                        </i-col>
                        <i-col span="8">
                            <Form-item :label-width="1">
                                <Dropdown trigger="click" placement="top-start" style="margin-left: 10px; display: block" @on-click="changePayTypeHandler">
                                    <div>选择付款方式
                                        <Icon type="arrow-down-b"></Icon>
                                    </div>
                                    <Dropdown-menu slot="list">
                                        <Dropdown-item v-for="(item,i) in driverPayTypes" :key="i" :selected="order.driver_pay_type == item.type" :name="item.type">{{item.text}}</Dropdown-item>
                                    </Dropdown-menu>
                                </Dropdown>
                            </Form-item>
                        </i-col>
                    </Row>
                </div>
                <div class="row-box mtb10">
                    <Row>
                        <Form-item label="运费分摊：">
                            <Radio-group v-model="order.fee_divide_type">
                                <Radio label="0">按运费分摊</Radio>
                                <Radio label="1">按单分摊</Radio>
                                <Radio label="2">按体积分摊</Radio>
                                <Radio label="3">按重量分摊</Radio>
                                <Radio label="4">按折算重量分摊</Radio>
                            </Radio-group>
                        </Form-item>
                    </Row>
                </div>
                <div class="row-box row-box-auto mtb10">
                    <Row>
                        <i-col span="24">
                            <Form-item label="备注：">
                                <i-input type="textarea" placeholder="输入备注" v-model="order.remark"></i-input>
                            </Form-item>
                        </i-col>
                    </Row>
                </div>
                <!-- 内容 end -->
            </i-form>
            <div slot="footer">
                <Button type="primary" size="large" @click="doOk">确定</Button>
                <Button type="error" size="large" @click="doCancel">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import { getNumber, getInteger } from '@/utils/util'
import clickoutside from '@/directives/clickoutside'
import * as constants from './constants.js'
import * as staticDict from '@/utils/static-dict.js'
const intRge = /^\d+$/
const numRge = /^\d*(\.\d+)?$/

export default {
    name: 'orderStoreListSpecifyVipDriver',
    data: function() {

        const validateDriverFee = (rule, value, callback) => {
            let total = 0;
            for (let key in this.order.driver_pay_detail) {
                total += getNumber(this.order.driver_pay_detail[key])
            }
            if (getNumber(this.order.driver_fee) != total) callback(new Error('合计费用与付款总和不相等'))
            else callback()
        }

        const validateNumber = (rule, value, callback) => {
            if (!numRge.test(value)) callback(new Error('必须是数字'))
            else callback()
        }



        return {
            modal: false,
            // 订单信息数据 合并成一条
            dataOrders: [],
            // 订单表格设置
            columnsOrders: Object.freeze(constants.driverColumnsOrders),
            // 查询司机表格设置
            columnsDriver: Object.freeze(constants.driverColumnsDriver),
            // 查询司机列表 多条
            dataDriverList: [],
            // 选中司机列表 只有一条
            dataDriver: [],
            // 选中司机表格设置
            // 提交数据
            order: Object.assign({}, constants.driverOrder, {
                driver_fee_detail: { ...staticDict.driverFees },
                driver_pay_detail: { ...staticDict.driverPays }
            }),
            orderRule: {
                driver_fee: { validator: validateDriverFee, trigger: 'none' },
                driver_fee_detail: {
                    driver_fee_y: { validator: validateNumber, trigger: 'change' },
                    driver_fee_qt: { validator: validateNumber, trigger: 'change' },
                },
            },
            // 付款方式列表 用于简化dom 输出
            driverPayTypes: [...constants.driverPayTypes],
            // 司机列表查询条件
            driverSearch: {
                keyword: '',
                page: 1,
                page_size: 999,
            },
            dropdownVisible: false,
        }
    },
    directives: { clickoutside },
    // mixins: [listCommonMixin],
    components: {},
    computed: {
        payFeeTotal() {
            return getNumber(this.order.driver_fee_detail.driver_fee_qt) + getNumber(this.order.driver_fee_detail.driver_fee_y)
        }
    },
    watch: {
        modal: function(n, o) {
            // 关闭弹框 重置信息
            if (!n) {
                this.driverSearch.keyword = ''
                this.dataDriverList = []
                this.dataDriver = []
                this.order = { ...constants.driverOrder }
                this.order.driver_fee_detail = { ...constants.driverFeeDetail }
                this.order.driver_pay_detail = { ...constants.driverPayDetail }
                this.$refs.orderForm.resetFields()
            } else {
                this.getMatchDrivers()
            }
        },
        payFeeTotal: function(n, o) {
            this.order.driver_fee = n
            if (this.order.driver_pay_type != 'driver_pay_dbf') {
                this.order.driver_pay_detail[this.order.driver_pay_type] = n
            }
        },
    },
    methods: {
        changePayTypeHandler(type) {
            this.order.driver_pay_type = type
            if (type != 'driver_pay_dbf') {
                for (let key in this.order.driver_pay_detail) {
                    if (key != this.order.driver_pay_type) this.order.driver_pay_detail[key] = ''
                    else this.order.driver_pay_detail[key] = this.order.driver_fee
                }
            }
        },
        // 点击外面 关闭司机查询下拉
        dropCloseHandler() { this.dropdownVisible = false },
        // 获取焦点显示司机查询下拉
        dropFocusHandler() { this.dropdownVisible = true },
        // 模糊查询司机列表
        getMatchDrivers() {
            this.$api.order.getOrderMatchVipDriver({ ...this.driverSearch }).then((data) => {
                this.dataDriverList = data.resultObj
            })
        },
        // 选择查询司机
        selectDriver(row) {
            this.dataDriver = [row]
            this.order.yb_driver_id = row.yb_driver_id
            this.dropdownVisible = false
        },

        // 发布
        doOk() {
            let params;
            if (!this.order.yb_driver_id) { return this.$Message.info('请选择要指派的司机') }
            this.$refs.orderForm.validate((valid) => {
                if (valid) {
                    params = { ...this.order }
                    this.$api.order.assignOrderToVipDriver(params).then((data) => {
                        this.$Message.success(data.resultInfo)
                        this.modal = false
                        // 列表刷新
                        bus.$emit('order-list-reload')
                        // 改变运单状态 通知运单详情关闭
                        bus.$emit('order-detail-close')
                    })
                }
            })
        },
        doCancel() {
            this.modal = false
        },

    },
    created() {
    },
    mounted() {
        let vm = this
        bus.$on('specify-vip-driver', (orders) => {
            let order = { total: orders.length, pay_total: 0, pay_hdf: 0, fee_dshk: 0, pay_df: 0 }
            let ids = []
            orders.forEach((item) => {
                let _feeDetail = item.fee_details
                let _payDetails = item.pay_details
                order.pay_total += getNumber(item.pay_total)
                order.fee_dshk += getNumber(_feeDetail.partner_fee_dshk)
                order.pay_hdf += getNumber(_payDetails.partner_pay_back)
                order.pay_df += getNumber(_payDetails.partner_pay_arrive)
                ids.push(item.order_id)
            })
            vm.order.order_ids = ids.join(',')
            vm.$set(vm.dataOrders, 0, order)
            vm.modal = true
        })
    }
}
</script>