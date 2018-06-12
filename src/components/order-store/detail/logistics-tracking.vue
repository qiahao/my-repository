<template>
    <div class="order-traking">
        <!-- 物流节点 -->
        <div :class="{pd30:point.log.length||point.arrive||point.gps}">
            <div class="ivu-steps ivu-steps-horizontal">
                <div class="ivu-steps-item 1" :class="[index==point.log.length-1?'ivu-steps-status-process':'ivu-steps-status-finish']" :style="{width:(100/(point.log.length+2))+'%'}" v-for="(item,index) in point.log" :key="index">
                    <div class="ivu-steps-tail">
                        <i></i>
                    </div>
                    <div class="ivu-steps-head">
                        <div class="ivu-steps-head-inner">
                            <span>{{index+1}}</span>
                        </div>
                    </div>
                    <div class="ivu-steps-main">
                        <div class="ivu-steps-title">{{item.op_method}}</div>
                        <div class="ivu-steps-content">{{item.op_time}}</div>
                    </div>
                </div>
                <div class="ivu-steps-item ivu-steps-status-finish 2" :style="{width:(100/(point.log.length+2))+'%'}" v-if="point.gps">
                    <div class="ivu-steps-tail">
                        <i></i>
                    </div>
                    <div class="ivu-steps-head">
                        <div class="ivu-steps-head-inner">
                            <span>{{point.log.length+1}}</span>
                        </div>
                    </div>
                    <div class="ivu-steps-main">
                        <div class="ivu-steps-title">{{point.gps.op_desc}}</div>
                        <div class="ivu-steps-content">{{point.gps.op_time}}</div>
                        <!---->
                    </div>
                </div>
                <div class="ivu-steps-item ivu-steps-status-finish 3" :style="{width:(100/(point.log.length+2))+'%'}" v-if="point.arrive">
                    <div class="ivu-steps-tail">
                        <i></i>
                    </div>
                    <div class="ivu-steps-head">
                        <div class="ivu-steps-head-inner">
                            <span>{{point.gps?point.log.length+2:point.log.length+1}}</span>
                        </div>
                    </div>
                    <div class="ivu-steps-main">
                        <div class="ivu-steps-title">{{point.arrive.op_desc}}</div>
                        <div class="ivu-steps-content">{{point.arrive.op_time}}</div>
                        <!---->
                    </div>
                </div>
            </div>
        </div>
        <!-- 地图轨迹 -->
        <!-- 承运商承运 -->
        <div class="row-box row-box-auto" v-if="order.assign" v-show="hasCarrier">
            <Row>
                <i-col :span="24" class="plr10"> 由成员 {{order.assign.assign_company_name}} 承运 </i-col>
            </Row>
        </div>
        <!-- 司机承运： 只有司机承运 有车辆轨迹（地图） -->
        <div class="row-box row-box-auto" v-if="order.assign" v-show="hasDriver">
            <Row>
                <i-col :span="24">
                    <span v-if="order.trip">
                        由司机
                        <span class="text-primary" @click="derecteToVehicleDetail">{{order.trip.driver_name}} {{order.trip.driver_mobile}}</span>
                        承运
                    </span>
                    <span v-if="order.trip && order.trip.trip_no">
                        车次号
                        <span class="text-primary" @click="derecteToTripDetail">{{order.trip.trip_no}}</span>
                    </span>
                </i-col>
            </Row>

            <Row v-show="point.gps && point.gps.op_desc">
                <i-col :span="8">车辆定位： {{point.gps ? point.gps.op_time : ''}} 魔盒</i-col>
                <i-col :span="16">{{point.gps ? point.gps.op_desc : ''}}
                    <span @click="openMap" class="text-primary">地图</span>
                </i-col>
            </Row>
        </div>
        <tracking-map v-model="mapModel"></tracking-map>
        <!-- 地图轨迹 end -->

        <!-- 物流跟踪 -->
        <div class="pt20 pb50 mb50">
            <Row class="time-line" v-for="(item,index) in track" :key="index">
                <i-col :span="4" class="time-line-time tr">{{item.op_time | dateFormat('YYYY-MM-DD') }}<br/>{{item.op_time | dateFormat('HH:mm') }}</i-col>
                <i-col :span="6">{{item.op_user_name}}</i-col>
                <i-col :span="14">{{item.op_desc}}</i-col>
                <i class="s"></i>
            </Row>
        </div>

        <div class="bottom-block plr30" >
            <editable-drop v-model="opDesc" placeholder="输入物流跟踪信息">
                <editable-drop-option v-for="(item,i) in orderStatuList" :value="item" :key="i">
                    {{item}}
                </editable-drop-option>
            </editable-drop>
            <div>
                <i-button class="fr mtb20" type="primary" @click="submit">确认提交</i-button>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import trackingMap from './tracking-map'

import detailChildMixin from '@/mixins/detail-child-mixin.js'

export default {
    name: 'orderDetailTrack',
    props: ['order'],
    data() {
        return {
            track: null,
            point: {
                arrive: null,
                gps: null,
                log: []
            },
            opDesc: '',
            orderStatuList: [
                '已分配',
                '已装车',
                '已发车',
                '运输中',
                '已签收',
            ],
            mapModel: false
        }
    },
    mixins: [detailChildMixin],
    components: {
        trackingMap
    },
    computed: {
        ...mapState(['userInfo']),
        hasDriver (){
            let arr = ['1','4','5']
            if (!this.order || !this.order.assign) return false
            if (arr.includes(this.order.assign.assign_type)) return true
            else return false
        },
        hasCarrier (){
            let arr = ['0','2','3']
            if (!this.order || !this.order.assign) return false
            if (arr.includes(this.order.assign.assign_type)) return true
            else return false
        },
    },
    methods: {
        loadTracking() {
            let _vm = this;

            let params = {
                act_company_id: this.userInfo.company_id,
                order_id: this.id
            }
            _vm.track = null;
            this.$api.order.getOrderTrack(params).then((data) => {
                _vm.track = data.resultObj;
            })
        },
        loadTrackPoint() {
            let vm = this
            let params = {
                act_company_id: this.userInfo.company_id,
                order_id: this.id
            }

            this.$api.order.getOrderTrackPoint(params).then(data => {
                vm.point = data.resultObj
            })
        },

        // 初始化数据 以及 监听路由id变化 加载新数据
        init() {
            this.mapModel = false
            this.loadTracking()
            this.loadTrackPoint()
        },
        openMap() {
            this.mapModel = true
        },
        submit() {
            let vm = this
            let params = {
                act_company_id: vm.userInfo.company_id,
                order_id: vm.id,
                op_desc: vm.opDesc
            }
            this.$api.order.addTrackPoint(params).then(data => {
                this.$Message.success(data.resultInfo);
                this.init()
                if (data.result == 1) { vm.opDesc = "" }
            })
        },
        derecteToVehicleDetail (){
            this.$router.push({path: '/vehicle/detail/' + this.order.trip.driver_id})
        },
        derecteToTripDetail (){
            this.$router.push({path: '/trip/detail/' + this.order.trip.trip_id})
        },
    },
}
</script>
<style lang="scss">
.order-traking{
    .bottom-block{
        position: absolute;
        right: 0;
        bottom:0;
        width: 100%;
        background:#fff;
        padding: 10px 20px;
    }
}
</style>