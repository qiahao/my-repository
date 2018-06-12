<template>
    <div>
        <i-form ref="basicForm" :label-width="85" :model="order" :rules="orderRule">
            <!-- 项目名称 -->
            <div class="row-box mb10">
                <Row>
                    <i-col span="16" v-if="order.prj_id">
                        <Form-item label="项目名称：">
                            {{order.project.prj_name}}
                        </Form-item>
                    </i-col>
                    <i-col span="8">
                        <Form-item label="订单号：">
                            {{order.order_no}}
                        </Form-item>
                    </i-col>
                </Row>
            </div>

            <div class="row-box mb10">
                <Row>
                    <i-col span="8">
                        <Form-item label="委托单号：">
                            <i-input v-model="order.shipper_order_no" placeholder="委托单号"></i-input>
                        </Form-item>
                    </i-col>
                    <i-col span="8">
                        <Form-item label="运输方式：">
                            <Radio-group v-model="order.bulk_type">
                                <Radio label="0">零担</Radio>
                                <Radio label="1">整车</Radio>
                            </Radio-group>
                        </Form-item>
                    </i-col>
                    <i-col span="8"  class="error-left">
                        <Form-item label="开单时间：" prop="order_create_time">
                            <Date-picker  :options='timeOption' type="datetime" v-model="order.order_create_time" placeholder="选择日期和时间"></Date-picker>
                        </Form-item>
                    </i-col>
                </Row>
            </div>

            <!-- 收发货人信息 -->
            <div class="row-box mb10">
                <!-- 
                        项目单只允许选择
                        非项目单只允许手动修改
                         -->
                <Row>
                    <i-col span="6">
                        <Form-item label="客户名称：" prop="send_company">
                            <i-select v-if="order.prj_id" v-model="order.send_company" placeholder="请输入客户名称">
                                <i-option v-for="(item,index) in sendCompanyList" :key="index" :value="item.cs_company"></i-option>
                            </i-select>
                            <i-input v-else v-model="order.send_company" placeholder="请输入客户名称"></i-input>
                        </Form-item>
                    </i-col>
                    <i-col span="6">
                        <Form-item label="起始地：" prop="begin_code">
                            <province-cascader placeholder="请选择起始地" :opts="provinceOpts" v-model="order.begin_code" @input="beginAreaChange"></province-cascader>
                        </Form-item>
                    </i-col>
                    <i-col span="6">
                        <Form-item label="目的地：" prop="end_code">
                            <province-cascader placeholder="请选择目的地" :opts="provinceOpts" v-model="order.end_code" @input="endAreaChange"></province-cascader>
                        </Form-item>
                    </i-col>
                    <i-col span="6">
                        <Form-item label="是否加急：">
                            <!-- <Checkbox v-model="isSpeed">急</Checkbox> -->
                            <Checkbox :value="order.is_speed === 'Y'" @on-change="order.is_speed = arguments[0] ? 'Y' : 'N'">急</Checkbox>
                        </Form-item>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="6">
                        <Form-item label="托运人：" prop="begin_link_man">
                            <i-input v-model="order.begin_link_man" placeholder="请输入托运人"></i-input>
                        </Form-item>
                    </i-col>
                    <i-col span="6">
                        <Form-item label="联系电话：" prop="begin_link_mobile">
                            <i-input v-model="order.begin_link_mobile" placeholder="请输入联系电话"></i-input>
                        </Form-item>
                    </i-col>
                    <i-col span="10">
                        <Form-item label="详细地址：" prop="begin_address">
                            <i-input placeholder="请输入详细地址" v-model="order.begin_address"></i-input>
                        </Form-item>
                    </i-col>
                    <i-col span="2">
                        <Form-item :label-width="5">
                            <Checkbox :value="order.is_pickup === 'Y'" @on-change="order.is_pickup = arguments[0] ? 'Y' : 'N'">提货</Checkbox>
                        </Form-item>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="6">
                        <Form-item label="收货人：" prop="end_link_man">
                            <i-input placeholder="请输入收货人" v-model="order.end_link_man"></i-input>
                        </Form-item>
                    </i-col>
                    <i-col span="6">
                        <Form-item label="联系电话：" prop="end_link_mobile">
                            <i-input placeholder="请输入联系电话" v-model="order.end_link_mobile"></i-input>
                        </Form-item>
                    </i-col>
                    <i-col span="10">
                        <Form-item label="详细地址：" prop="end_address">
                            <i-input placeholder="请输入详细地址" v-model="order.end_address"></i-input>
                        </Form-item>
                    </i-col>
                    <i-col span="2">
                        <Form-item :label-width="5">
                            <Checkbox :value="order.is_delivery === 'Y'" @on-change="order.is_delivery = arguments[0] ? 'Y' : 'N'">送货</Checkbox>
                        </Form-item>
                    </i-col>
                </Row>
            </div>
            <!-- 车型选择 -->
            <transition name="fade">
                <div class="row-box mb10" v-show="order.bulk_type == 1">
                    <Row>
                        <i-col span="24">
                            <Form-item class="ivu-form-item-required" label="选择车型：" style="display: inline-block;"></Form-item>
                            <Form-item :label-width="1" class="car-select" prop="req_truck_type">
                                <i-select placeholder="请选择车型" v-model="order.req_truck_type">
                                    <i-option value="">无</i-option>
                                    <i-option v-for="(item,index) in truckTypeList" :key="index" :value="item.dict_value">{{item.dict_text}}</i-option>
                                </i-select>
                            </Form-item>
                            <Form-item :label-width="10" label=" " class="car-select ivu-form-item-required" prop="req_truck_length">
                                <i-select placeholder="请选择车长" v-model="order.req_truck_length">
                                    <i-option value="">无</i-option>
                                    <i-option v-for="(item,index) in truckLengthList" :key="index" :value="item.dict_value">{{item.dict_text}}</i-option>
                                </i-select>
                            </Form-item>
                        </i-col>
                    </Row>
                </div>
            </transition>

        </i-form>

    </div>
</template>
<script>
import {mapActions} from 'vuex'
import { getPartnerAll } from '@/api/src/partner'
import { dictTruckTypeApi, dictTruckLengthApi } from '@/api/src/dictApi'

const phoneRge = /^\d{11,12}$/
export default {
    name: 'orderStoreDetailBaseInfoBasic',
    props: {
        order: {
            type: Object,
            default: () => { return {} }
        }
    },
    data: function() {
        const linkPhoneRule = function(rule, value, callback) {
            if (!phoneRge.test(value)) { callback(new Error('输入11-12位手机或电话号码')) } else { callback() }
        }
        const truckTypeRule = (msg) => {
            let s = this
            return function(rule, value, callback) {
                if (s.order.bulk_type == 1 && !value) { callback(new Error(msg)) } else { callback() }
            }
        }
        const curDateLimit = (rule, value, callback) => {
            if (typeof (value) == 'object' && (new Date()).valueOf() <= value.valueOf()) {
                callback(new Error('不能选将来时间'));
            } else {
                callback();
            }
        }
        return {
            basicForm: null,
            timeOption: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            sendCompanyList: [], // 客户列表
            truckTypeList: [], // 车型
            truckLengthList: [], // 车长
            // 验证
            provinceOpts: { 'change-on-select': true },
            orderRule: {
                send_company: { required: true, message: '客户名称不能为空' },
                order_create_time: [
                    { required: true, message: '开单时间不能为空' },
                    { validator: curDateLimit, message: '开单时间不能为空' },
                ],
                begin_code: { required: true, message: '起始地不能为空' },
                end_code: { required: true, message: '目的地不能为空' },
                begin_link_man: { required: true, message: '托运人不能为空' },
                begin_link_mobile: [
                    { required: true, message: '联系电话不能为空' },
                    { validator: linkPhoneRule, trigger: 'blur' },
                ],
                begin_address: { required: true, message: '地址不能为空' },
                end_link_man: { required: true, message: '收货人不能为空' },
                end_link_mobile: [
                    { required: true, message: '联系电话不能为空' },
                    { validator: linkPhoneRule, trigger: 'blur' },
                ],
                end_address: { required: true, message: '地址不能为空' },
                req_truck_type: { validator: truckTypeRule('车型不能为空'), trigger: 'change' },
                req_truck_length: { validator: truckTypeRule('车长不能为空'), trigger: 'change' },
            },
        }
    },
    mixins: [],
    components: {},
    computed: {},
    watch: {},
    methods: {
        ...mapActions(['getTruckTypes' ,'getTruckLengths']),
        // 初始化
        initGetData() {
            // 初始 获取操作人客户列表
            getPartnerAll({}).then((data) => { this.sendCompanyList = data.resultObj })
            // 获取车型 车长
            this.getTruckTypes().then((list) => {this.truckTypeList = list})
            this.getTruckLengths().then((list) => {this.truckLengthList = list})
        },
        // 出发地
        beginAreaChange (val) {
            this.order.begin_code = val.split('$')[0]
            this.order.begin_area = val.split('$')[1] || this.order.begin_area
        },
        // 目的地
        endAreaChange (val) {
            this.order.end_code = val.split('$')[0]
            this.order.end_area = val.split('$')[1] || this.order.end_area
        },
    },
    created() {
        this.initGetData()
    },
    mounted() {
        this.basicForm = this.$refs.basicForm
        bus.$on('save-base-info', () => {
            this.basicForm.validate((valid) => { this.$emit('child-complete', valid) })
        })
    }
}

</script>