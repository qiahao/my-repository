<template>
    <div>
        <Modal v-model="modal" width="1000" class="order-store-to-app">
            <div slot="header">
                <span>分配VIP司机</span>
            </div>
            <i-form 
                :label-width="100" 
                ref="orderForm" 
                :model="order" 
                :rules="orderRule">
                <!-- 内容 -->
                <i-table :data="orders" :columns="columns"></i-table>

                <div class="row-box mtb10">
                    <Row>
                        <i-col span="8">
                            <Form-item 
                                label="司机运费：" 
                                prop="driver_fee_detail.driver_fee_y"
                                :rules="orderRule.driver_fee_detail.driver_fee_y">
                                <i-input 
                                    type="text" 
                                    placeholder="输入金额" 
                                    v-model="order.driver_fee_detail.driver_fee_y"></i-input>
                            </Form-item>
                        </i-col>
                        <i-col span="8">
                            <Form-item 
                                label="其他：" 
                                prop="driver_fee_detail.driver_fee_qt"
                                :rules="orderRule.driver_fee_detail.driver_fee_qt">
                                <i-input 
                                    type="text" 
                                    placeholder="输入金额" 
                                    v-model="order.driver_fee_detail.driver_fee_qt"></i-input>
                            </Form-item>
                        </i-col>
                    </Row>
                </div>
                <div class="row-box mtb10">
                    <Row>
                        <i-col span="8">
                            <Form-item 
                                label="合计：" 
                                prop="driver_fee">
                                <i-input 
                                    type="text" 
                                    placeholder="输入金额" 
                                    readonly 
                                    :value="order.driver_fee"></i-input>
                            </Form-item>
                        </i-col>


                        <!-- 付款详情 隐藏项 -->
                        <i-col 
                            span="8" 
                            v-for="(item,i) in driverPayTypes"
                            v-if="item.type != 'driver_pay_dbf'"
                            v-show="order.driver_pay_type == 'driver_pay_dbf' || order.driver_pay_type == item.type"
                            :key="i"
                            >
                            <Form-item 
                                :label="item.text + '：'">
                                <i-input 
                                    type="text" 
                                    :placeholder="'请输入' + item.text" 
                                    v-model="order.driver_pay_detail[item.type]"></i-input>
                            </Form-item>
                        </i-col>

                        <i-col span="8">
                            <Form-item :label-width="1">
                                <Dropdown 
                                    trigger="click" 
                                    placement="bottom-start" 
                                    style="margin-left: 10px; display: block" 
                                    @on-click="changePayTypeHandler">
                                    <div>选择付款方式 <Icon type="arrow-down-b"></Icon> </div>
                                    <Dropdown-menu slot="list">
                                        <Dropdown-item 
                                            v-for="(item,i) in driverPayTypes" 
                                            :key="i" 
                                            :selected="order.driver_pay_type == item.type" 
                                            :name="item.type">{{item.text}}</Dropdown-item>
                                    </Dropdown-menu>
                                </Dropdown>
                            </Form-item>
                        </i-col>
                    </Row>
                </div>

                <div class="row-box mtb10 time-box">
                    <Row>
                        <Form-item :label-width="1" prop="cargo_publish_minutes">
                            <i-input type="text" v-model="order.cargo_publish_minutes"></i-input>
                        </Form-item>
                        <span>分钟后该运单对普通司机可见</span>
                    </Row>
                </div>

                <div class="row-box mtb10">
                    <Row>
                        <i-col span="8">
                            <Form-item label="选择车型：" prop="req_truck_type">
                                <i-select placeholder="请选择车型" v-model="order.req_truck_type">
                                    <i-option value="不限">不限</i-option>
                                    <i-option v-for="(item,index) in truckTypeList" :key="index" :value="item.dict_value">{{item.dict_text}}</i-option>
                                </i-select>
                            </Form-item>
                        </i-col>
                        <i-col span="8">
                            <Form-item :label-width="1" prop="req_truck_length">
                                <i-select placeholder="请选择车长" v-model="order.req_truck_length">
                                    <i-option value="不限">不限</i-option>
                                    <i-option v-for="(item,index) in truckLengthList" :key="index" :value="item.dict_value">{{item.dict_text}}</i-option>
                                </i-select>
                            </Form-item>
                        </i-col>
                    </Row>
                </div>
                <div class="row-box mtb10">
                    <Row>
                        <i-col span="24" class="height-auto">
                            <Form-item label="备注：">
                                <i-input type="textarea" placeholder="输入备注" v-model="order.remark"></i-input>
                            </Form-item>
                        </i-col>
                    </Row>
                </div>
                <!-- 内容 end -->
            </i-form>

            <div slot="footer">
                <i-button type="primary" size="large" @click="doOk">确定</i-button>
                <i-button type="error" size="large" @click="doCancel">取消</i-button>
            </div>
        </Modal>

    </div>
</template>
<script>
import { mapActions } from 'vuex'
import { assignOrderToApp } from '@/api/src/order'
import { getNumber, getInteger } from '@/utils/util'
import * as constants from './constants.js'

const intRge = /^\d+$/
const numRge = /^\d*(\.\d+)?$/
export default {
    name: 'orderStoreListAssignToApp',

    data: function() {
        const validateMinutes = (rule, value, callback) => {
            if (!intRge.test(value)) callback(new Error('请输入正整数'))
            else callback()
        }
        const validateNumber = (rule, value, callback) => {
            if (!numRge.test(value)) {
                callback(new Error('必须是数字'))
            } else {
                callback()
            }
        }

        const validateDriverFee = (rule, value, callback) => {
            let total = 0;
            for (let key in this.order.driver_pay_detail) {
                total += getNumber(this.order.driver_pay_detail[key])
            }
            if (getNumber(this.order.driver_fee) != total) callback(new Error('合计费用与付款总和不相等')) 
            else callback() 
        }
       

        return {
            modal: false,
            columns: Object.freeze(constants.appColumns),
            orders: [], // 只有一条
            order: { ...constants.appOrder },
            orderRule: {
                driver_fee: {validator: validateDriverFee, trigger: 'none'},
                driver_fee_detail: {
                    driver_fee_y: { validator: validateNumber, trigger: 'change' },
                    driver_fee_qt: { validator: validateNumber, trigger: 'change' },
                },
                cargo_publish_minutes: { validator: validateMinutes },
                req_truck_type: { required: true, message: '请选择车型', trigger: 'change' },
                req_truck_length: { required: true, message: '请选择车长', trigger: 'change' },
            },
            // 付款方式列表 用于简化dom 输出
            driverPayTypes: [...constants.driverPayTypes], 
            truckTypeList: [],
            truckLengthList: [],
        }
    },
    components: {},
    computed: {
        payFeeTotal (){
            return getNumber(this.order.driver_fee_detail.driver_fee_qt) + getNumber(this.order.driver_fee_detail.driver_fee_y)
        }
    },
    watch: {
        modal: function(n, o) {
            if (n) {
                this.order = {...constants.appOrder}
                // 司机运费详情重置问题
                this.order.driver_fee_detail = {...constants.driverFeeDetail}
                this.order.driver_pay_detail = {...constants.driverPayDetail}
                this.$refs.orderForm.resetFields()
            }
        },
        payFeeTotal: function (n,o){
            this.order.driver_fee = n
            if (this.order.driver_pay_type != 'driver_pay_dbf') {
                this.order.driver_pay_detail[this.order.driver_pay_type] = n
            }
        },
    },
    methods: {
        ...mapActions(['getTruckTypes' ,'getTruckLengths']),
        changePayTypeHandler (type) {
            this.order.driver_pay_type = type
            if (type != 'driver_pay_dbf') {
                for (let key in this.order.driver_pay_detail) {
                    if (key != this.order.driver_pay_type ) {
                        this.order.driver_pay_detail[key] = 0
                    }else{
                        this.order.driver_pay_detail[key] = this.order.driver_fee
                    }
                }
            }
        },
        getTruckType (){
            // 获取车型 车长
            this.getTruckTypes().then((list) => {this.truckTypeList = list})
            this.getTruckLengths().then((list) => {this.truckLengthList = list})
        },
        // 发布
        doOk() {
            let params;
            this.$refs.orderForm.validate((valid) => {
                if (valid) {
                    params = Object.assign({}, this.order)
                    // todo
                    params.order_id = this.orders[0].order_id
                    if (params.cargo_publish_minutes === '') {params.cargo_publish_minutes = 0}
                    assignOrderToApp(params).then((data) => {
                        this.$Message.success(data.resultInfo)
                        this.modal = false
                        bus.$emit('order-list-reload')
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
        this.getTruckType()
    },
    mounted() {
        let vm = this
        bus.$on('assign-to-app', (order) => {
            vm.orders = [order]
            vm.modal = true
        })
    }
}

</script>
