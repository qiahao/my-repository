<template lang="html">
    <i-form ref="feePayForm" :label-width="90" :model="feePay" :rules="feePayRule">

        <!-- 客户运费 -->
        <h4 class="mtb10">客户运费</h4>
        
        
        <!-- 费用信息 -->
        <div class="row-box mb10">
            <Row>
                <i-col span="8">
                    <Form-item label="运费：" :rules="feePayRule.numberFixed">
                        <i-input v-model="feePay.partner_fees.partner_fee_y" placeholder="请输入运费" :disabled="!editting"></i-input>
                    </Form-item>
                </i-col>
                <!-- 隐藏项 -->
                <!-- 默认显示了运费 在此排除运费选项 -->
                <i-col span="8" v-show="partnerFeesShowed.includes(item.type)" v-if="item.type != 'partner_fee_y'" v-for="(item,i) in partnerFeeTypes" :key="i">
                    <Form-item :label="item.text + '：'" :prop="'partner_fees.' + item.type" :rules="feePayRule.numberFixed">
                        <i-input v-model="feePay.partner_fees[item.type]" :placeholder="'请输入' + item.text" icon="close-circled" @on-click="hidePartnerFees(item.type)" :disabled="!editting"></i-input>
                    </Form-item>
                </i-col>
                <!-- 隐藏项 end -->
                <!-- 更多费用 -->
                <!-- 默认显示了运费 在此排除运费选项 -->
                <i-col span="8">
                    <Dropdown class="full-dropdown" @on-click="showPartnerFees" trigger="click">
                        <span> 更多费用
                            <Icon type="arrow-down-b" class="fr mt10"></Icon>
                        </span>
                        <Dropdown-menu slot="list">
                            <Dropdown-item v-for="(item,i) in partnerFeeTypes" v-if="item.type != 'partner_fee_y'" :name="item.type" :key="i">{{item.text}}</Dropdown-item>
                        </Dropdown-menu>
                    </Dropdown>
                </i-col>
            </Row>
        </div>
        <!-- 付款方式 -->
        <div class="row-box mb10">
            <Row>
                <i-col span="8">
                    <Form-item label="合计费用：" prop="partner_fee">
                        <i-input placeholder="合计费用" :value="feePay.partner_fee" readonly></i-input>
                    </Form-item>
                </i-col>
                <i-col span="8">
                    <Form-item label="付款方式：">
                        <i-select placement="top" v-model="feePay.partner_pay_type" @on-change="changePartnerPayType" :disabled="!editting">
                            <i-option v-for="(item,i) in partnerPayTypes" :value="item.type" :key="i">{{item.text}}</i-option>
                        </i-select>
                    </Form-item>
                </i-col>
                <i-col span="8" v-for="(item,i) in partnerPayTypes" v-if="item.type != 'partner_pay_dbf'" v-show="feePay.partner_pay_type == 'partner_pay_dbf' || feePay.partner_pay_type == item.type" :key="i">
                    <Form-item :label="item.text + '：'" :prop="'partner_pays.' + item.type" :rules="feePayRule.numberFixed">
                        <i-input v-model="feePay.partner_pays[item.type]" :placeholder="'请输入' + item.text" :disabled="!editting"></i-input>
                    </Form-item>
                </i-col>
            </Row>
        </div>
        <!-- 客户运费 end -->

        
        <!-- 其他费用 根据对应pay_type 判断是否显示 -->
        <!-- 承运商费用 -->
        <template v-if="feePay.liner_pay_type">
            <h4 class="mtb10">承运商费用</h4>
            <!-- 承运信息 -->
            <div class="row-box mb10">
                <Row>
                    <i-col span="8">
                        <Form-item label="运费：" :rules="feePayRule.numberFixed">
                            <i-input v-model="feePay.liner_fees.liner_fee_y" placeholder="请输入运费" :disabled="!editting"></i-input>
                        </Form-item>
                    </i-col>
                    <!-- 隐藏项 -->
                    <!-- 默认显示了运费 在此排除运费选项 -->
                    <i-col span="8" v-show="linerFeesShowed.includes(item.type)" v-if="item.type != 'liner_fee_y'" v-for="(item,i) in linerFeeTypes" :key="i">
                        <Form-item :label="item.text + '：'" :prop="'partner_fees.' + item.type" :rules="feePayRule.numberFixed">
                            <i-input v-model="feePay.liner_fees[item.type]" :placeholder="'请输入' + item.text" icon="close-circled" @on-click="hidePartnerFees(item.type)" :disabled="!editting"></i-input>
                        </Form-item>
                    </i-col>
                    <!-- 隐藏项 end -->
                </Row>
            </div>
            <div class="row-box mb10" v-if="order.assign && order.assign.assign_company_name">
                <Row>
                    <i-col span="24">
                        <Form-item label="承运名称：">
                            <i-input placeholder="承运名称" :value="order.assign ? order.assign.assign_company_name : ''" readonly></i-input>
                        </Form-item>
                    </i-col>
                </Row>
            </div>
            <!-- 付款方式 -->
            <div class="row-box mb10">
                <Row>
                    <i-col span="8">
                        <Form-item label="合计费用：" prop="liner_fee">
                            <i-input placeholder="合计费用" :value="feePay.liner_fee" readonly></i-input>
                        </Form-item>
                    </i-col>
                    <i-col span="8">
                        <Form-item label="付款方式：">
                            <i-select placement="top" v-model="feePay.liner_pay_type" @on-change="changeLinerPayType" :disabled="!editting">
                                <i-option v-for="(item,i) in linerPayTypes" :value="item.type" :key="i">{{item.text}}</i-option>
                            </i-select>
                        </Form-item>
                    </i-col>
                    <i-col span="8" v-for="(item,i) in linerPayTypes" v-if="item.type != 'liner_pay_dbf'" v-show="feePay.liner_pay_type == 'liner_pay_dbf' || feePay.liner_pay_type == item.type" :key="i">
                        <Form-item :label="item.text + '：'" :prop="'liner_pays.' + item.type" :rules="feePayRule.numberFixed">
                            <i-input v-model="feePay.liner_pays[item.type]" :placeholder="'请输入' + item.text" :disabled="!editting"></i-input>
                        </Form-item>
                    </i-col>
                </Row>
            </div>
        </template>
        <!-- 承运商费用 end -->


        <!-- 司机费用 -->
        <template v-if="feePay.driver_pay_type">
            <h4 class="mtb10">司机费用</h4>
            <!-- 承运信息 -->
            <div class="row-box mb10">
                <Row>
                    <i-col span="8">
                        <Form-item label="承运信息："> 指派司机 </Form-item>
                    </i-col>
                    <i-col span="16">
                        <Form-item :label-width="1" v-if="order.assign" class="pl10">
                            <span class="pl10">{{order.assign.assign_driver_name}}</span>
                            <span class="pl10">{{order.assign.assign_truck_plate}}</span>
                            <span class="pl10">{{order.assign.assign_truck_length}}</span>
                            <span class="pl10">{{order.assign.assign_truck_type}}</span>
                            <span class="pl10">{{order.assign.assign_driver_mobile}}</span>
                        </Form-item>
                    </i-col>
                </Row>
            </div>
            <!-- 付款方式 -->
            <div class="row-box mb10">
                <Row>
                    <i-col span="8">
                        <Form-item label="运费：" prop="driver_fees.driver_fee_y" :rules="feePayRule.numberFixed">
                            <i-input placeholder="运费" v-model="feePay.driver_fees.driver_fee_y" :disabled="!editting"></i-input>
                        </Form-item>
                    </i-col>
                    <i-col span="8">
                        <Form-item label="其他：" prop="driver_fees.driver_fee_qt" :rules="feePayRule.numberFixed">
                            <i-input placeholder="其他费用" v-model="feePay.driver_fees.driver_fee_qt" :disabled="!editting"></i-input>
                        </Form-item>
                    </i-col>
                </Row>
            </div>
            <div class="row-box mb10">
                <Row>
                    <i-col span="8">
                        <Form-item label="合计费用：">
                            <!-- todo : feePay.driver_fee == 710.53 时 会显示为 710.530000000001 原因未知 -->
                            {{feePay.driver_fee ? feePay.driver_fee.toFixed(2) : 0}}
                        </Form-item>
                    </i-col>
                    <i-col span="8">
                        <Form-item label="付款方式：">
                            <i-select placement="top" v-model="feePay.driver_pay_type" @on-change="changeDriverPayType" :disabled="!editting">
                                <i-option v-for="(item,i) in driverPayTypes" :value="item.type" :key="i">{{item.text}}</i-option>
                            </i-select>
                        </Form-item>
                    </i-col>
                    <i-col span="8" v-for="(item,i) in driverPayTypes" v-if="item.type != 'driver_pay_dbf'" v-show="feePay.driver_pay_type == 'driver_pay_dbf' || feePay.driver_pay_type == item.type" :key="i">
                        <Form-item :label="item.text + '：'" :prop="'driver_pays.' + item.type" :rules="feePayRule.numberFixed">
                            <i-input v-model="feePay.driver_pays[item.type]" :placeholder="'请输入' + item.text" :disabled="!editting"></i-input>
                        </Form-item>
                    </i-col>
                </Row>
            </div>
        </template>
        <!-- 司机费用 end -->
    </i-form>
</template>
<script>
import { getOrderFeepayDetail, editOrderFeepay } from '@/api/src/order'
import { getNumber } from '@/utils/util'
import * as staticDict from '@/utils/static-dict'
import * as constants from '../constant.js'

// mixins
import detailChildMixin from '@/mixins/detail-child-mixin.js'

import sectionA from './fee-section-a.js'
import sectionB from './fee-section-b.js'
import sectionC from './fee-section-c.js'


// 组件用到的字段
export default {
    name: 'orderStoreDetailFeeDetail',
    props: {
        order: {
            type: Object,
            default: () => { return { partner_fees: {} } }
        },
        isEditable: {type: Boolean },
        ieEdit:false,
    },
    watch: {
        ieEdit(n,o){
            this.editting =  n
        }
    },
    data: function() {
        // 两位小数
        const fixed2Rge = /^\d*(\.\d{1,2})?$/
        const numberFixed = (rule, value, callback) => {
            if (!!value && !fixed2Rge.test(value)) callback(new Error('请输入1到2位小数'))
            else callback()
        }
        return {
            feePayForm: null,
            // 费用 付款详情
            feePay: {
                partner_fees: {},
                partner_pays: {},
                liner_fees: {},
                liner_pays: {},
                driver_fees: {},
                driver_pays: {},
            },
            feePayRule: {
                numberFixed: { validator: numberFixed, trigger: 'change blur' },
            },
            editting:false
        }
    },
    mixins: [detailChildMixin,sectionA, sectionB, sectionC],

    methods: {
        init() {
            this.loadFeepay()
            this.editting = false
        },
        // 初始化数据
        loadFeepay() {
            let vm = this
            getOrderFeepayDetail({ order_id: this.id }).then((data) => {
                // 重置接口为给出的费用字段为0
                if (!data.resultObj) {
                    
                    return this.feePay = {
                        partner_fees: {},
                        partner_pays: {},
                        liner_fees: {},
                        liner_pays: {},
                        driver_fees: {},
                        driver_pays: {},
                    }
                }
                this.feePay = Object.assign({}, data.resultObj)
                if (this.feePay.driver_fee) {
                    this.feePay.driver_fee = Number(this.feePay.driver_fee)
                }
                this.$set(this.feePay, 'partner_fees', Object.assign({}, staticDict.partnerFees, data.resultObj.partner_fees))
                this.$set(this.feePay, 'partner_pays', Object.assign({}, staticDict.partnerPays, data.resultObj.partner_pays))
                this.$set(this.feePay, 'liner_fees', Object.assign({}, staticDict.linerFees, data.resultObj.liner_fees))
                this.$set(this.feePay, 'liner_pays', Object.assign({}, staticDict.linerPays, data.resultObj.liner_pays))
                this.$set(this.feePay, 'driver_fees', Object.assign({}, staticDict.driverFees, data.resultObj.driver_fees))
                this.$set(this.feePay, 'driver_pays', Object.assign({}, staticDict.driverPays, data.resultObj.driver_pays))

                this.partnerFeesShowed = Object.keys(data.resultObj.partner_fees)
                this.linerFeesShowed = Object.keys(data.resultObj.liner_fees || {})
                this.feePay.liner_fee = Math.abs(data.resultObj.liner_fee)
            })
        },
        // 保存费用
        saveFees() {

            this.feePayForm.validate((valid) => {
                if (valid) {
                    let params = {
                        order_id: this.id,
                        order_feepay_detail: JSON.stringify(this.feePay),
                        remark: ''
                    }
                    editOrderFeepay(params).then((data) => {
                        this.editting = false
                        this.$Message.info(data.resultInfo)
                        bus.$emit('order-detail-reload')
                        bus.$emit('order-list-reload')
                        bus.$emit('operation-reload')
                        bus.$emit('save-result')
                        this.loadFeepay()
                    })
                }
            })
        }
    },
    created() {},
    mounted() {
        this.feePayForm = this.$refs.feePayForm
        // 路由跟新
        bus.$on('detail-fee-detail-update', () => { this.loadFeepay() })
        bus.$on("fee-save",()=>{this.saveFees()})
    },
}
</script>