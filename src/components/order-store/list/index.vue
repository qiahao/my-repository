<template lang="html">
    <div class="order-store">
    <!-- v-show="!hasSelect" -->
    <!-- v-show="hasSelect" -->
        <div class="contain-head">
            <div v-show="!hasSelect">
                <RadioGroup v-model="search.q_order_state" type="button" @on-change="onSearch">
                    <Radio v-for="(item,i) in conditionList" :key="i" :label="item.key" > {{item.text}} </Radio>
                </RadioGroup>

                <top-filter-select @on-change="topFilterChange" 
                                  :bulkType="queryBulkType" 
                                  :orderState="queryOrderState" 
                                  :isCreateOwner="queryIsCreateOwner" 
                                  class="ml10"></top-filter-select>
                
                <Date-picker type="daterange" v-model="queryTime" placeholder="选择开单日期" style="width:210px;display:inline-block"></Date-picker>
                <i-input class="search-input" v-model.trim="search.q_keyword" placeholder="客户/收货人/收货人号码" style="width:180px"></i-input>
                <i-button type="primary" @click="onSearch">搜索</i-button>
                <i-button type="warning" @click="onReset">重置</i-button>
                <i-button type="info" @click="handlerExport">导出</i-button>
            </div>
            <div v-show="hasSelect">
                <i-button type="primary" 
                    :disabled="search.q_is_del == 'Y'" 
                    @click="assignDriver(tableParams.selectList)">分配司机</i-button>
                
                <i-button type="primary" 
                    :disabled="tableSelectLength != 1 || search.q_is_del == 'Y'" 
                    @click="assignMember(tableParams.selectList[0])">分配成员</i-button>
                    
                <i-button type="primary" 
                    :disabled="tableSelectLength != 1 || search.q_is_del == 'Y'" 
                    @click="assignFacilitator(tableParams.selectList[0])">分配承运商</i-button>

                <i-button type="primary" 
                    v-show = "order_type_zb"
                    :disabled="search.q_is_del == 'Y'" 
                    @click="specifyVipDriver(tableParams.selectList)">分配VIP司机</i-button>
                <i-button type="primary" 
                    v-show = "order_type_zb"
                    :disabled="tableSelectLength != 1 || search.q_is_del == 'Y'" 
                    @click="assignToApp(tableParams.selectList[0])">发布VIP货源</i-button>
                <i-button type="primary"
                    v-show = "order_type_zb" 
                    :disabled="tableSelectLength != 1 || search.q_is_del == 'Y'" 
                    @click="assignCarrier(tableParams.selectList[0])">自动分配</i-button>
                

                <i-button type="success" 
                    :disabled="tableSelectLength != 1 || search.q_is_del == 'Y'" 
                    @click="signOrder(tableParams.selectList[0])">运单签收</i-button>

                <i-button type="success" 
                    :disabled="tableSelectLength != 1 || search.q_is_del == 'Y'" 
                    @click="insure">运单投保</i-button>
                
                <i-button type="warning" 
                    :disabled="search.q_is_del == 'Y'" 
                    @click="printOrderCover">运单套打</i-button>
                
                <i-button type="warning" 
                    :disabled="tableSelectLength != 1 || search.q_is_del == 'Y'" 
                    @click="handlerPrintTag(tableParams.selectList[0])">打印货签</i-button>
                
                <i-button type="warning" 
                    :disabled="tableSelectLength != 1 || search.q_is_del == 'Y'" 
                    @click="printOrderAll(tableParams.selectList[0])">全打运单</i-button>

                <i-button type="error" 
                    :disabled="tableSelectLength != 1 || search.q_is_del == 'Y'" 
                    @click="del()">运单作废</i-button>

            </div>
        </div>
        <div class="contain-main">
            <i-table 
                :data="tableParams.list" 
                :columns="columns"
                @on-selection-change="onSelectionChange" >
            </i-table>
            <div class="page-wrapper">
                <Page :total="tableParams.total" show-sizer show-elevator
                    :current="currentPage" 
                    :page-size="tableParams.pageSize"
                    @on-change="onPageChange" 
                    @on-page-size-change="onPageSizeChange">
                </Page>
            </div>
        </div>

        <!-- 分配承运商 -->
        <assign-carrier></assign-carrier>
        <!-- 分配VIP司机 (发布到app) -->
        <!-- :truck-type-list="truckTypeList" :truck-length-list="truckLengthList" -->
        <assign-to-app ></assign-to-app>
        <!-- 指派司机(指派VIP司机) -->
        <specify-vip-driver></specify-vip-driver>
        <!-- 分配司机  -->
        <assign-driver></assign-driver>
        <!-- 分配承运商TMS  -->
        <assign-facilitator></assign-facilitator>
        <!-- 分配成员  -->
        <assign-member></assign-member>
        <!-- 签收  -->
        <sign-order></sign-order>
        <!-- 投保  -->
        <order-insure></order-insure>
        <!-- 详情路由 -->
        <keep-alive>
            <router-view></router-view>
        </keep-alive>

        <!-- 套打运单 -->
        <!-- <order-print style="display:none"></order-print> -->

        <!-- 打印货签 -->
        <print-tag v-model="printTagShow" :order="printTagOrder" ></print-tag>
        <!-- 全打运单 -->
        <div style="display:none;">
            <print-order-all></print-order-all>
        </div>

        <!-- <print-order></print-order> -->
    </div>
</template>
<script>
    import moment from 'moment'
    import tableMixin from '@/mixins/tableMixin'
    import assignCarrier from './assign-carrier' //分配承运商 
    import assignToApp from './assign-to-app' //分配VIP司机 (发布到app) 
    import specifyVipDriver from './specify-vip-driver.vue' //指派司机(指派VIP司机) 
    // import orderPrint from '@/components/print/print.vue'
    import signOrder from './sign-order.vue'
    import assignDriver from './assign-driver.vue'
    import assignFacilitator from './assign-facilitator.vue'
    import assignMember from './assign-member.vue'
    import orderInsure from './order-insure.vue'
    import { mapState,mapMutations } from 'vuex'
    import * as types from '@/store/mutation-types.js'
    import {print,subStringLimit,getDateFormat, exportExcel} from '@/utils/util'
    import * as constants from './constants.js'
    import topFilterSelect from './top-filter-select.vue'
    import printOrderAll from '@/common/print-order-all'
    import emitter from '@/mixins/emitter'
    
    import printTag from '@/common/print-lodop/components/print-tag' // 货签打印
    import {printOrderCover} from '@/common/print-lodop'// 套打方法
    

    /**
     * 事件备注
     * bus.$emit('assign-carrier')：通知分配承运商
     * bus.$emit('assign-to-app')：通知发布到app
     * bus.$emit('specify-vip-driver')：通知指派vip司机
     * bus.$on('order-store-reload')：分配、发布等操作修改运单库存状态后重新加载列表
     * bus.$on('detail-assign-carrier')：来自详情的分配承运商
     */
    // let colorArray = ['#0071c0', '#febf06', '#fe850a', '#48cc46', '#fe850a', '#febf06', '#fe850a']
    export default {
        
        name: 'orderStoreListIndex',
        data: function(){
            return { 
                queryTime: "",
                conditionList: Object.freeze(constants.listFilters),
                columns: constants.getColumns.call(this),
                search: {...constants.searchParams},
                printData: {},
                order_type_zb:false,
                order_type_liner:false,
                order_type_custom:false,


                // 打印货签 显示
                printTagShow: false,
                printTagOrder: {},
            }
        },
        mixins: [tableMixin,emitter],
        components: {
            assignCarrier,
            assignToApp,
            specifyVipDriver,
            // orderPrint,
            signOrder,
            assignDriver,
            assignFacilitator,
            assignMember,
            topFilterSelect,
            orderInsure,
            printTag,
            printOrderAll,
        },
        computed: {
            ...mapState([
              'userInfo',
              'funcMenu',
              'queryOrderNumber',
              'orderStoreQueryUserId'
            ]),

            queryBulkType () {
              return this.search.q_bulk_type
            },
            queryOrderState () {
              if (this.search.q_is_exception == 'Y') {
                return 'q_is_exception'
              }
              if (this.search.q_is_reject == 'Y') {
                return 'q_is_reject'
              }
              if (this.search.q_is_del == 'Y') {
                return 'q_is_del'
              }
              return ''
            },
            queryIsCreateOwner : {
              get (){
                return !!this.orderStoreQueryUserId 
              },
              set (val){
                this.setOrderStoreQueryUserId(val ? this.userInfo.user_id : '')
              },
            },
        },
        watch: {
            queryTime (n,o){
                if (n && n[0]) {
                    this.search.q_create_time_begin = getDateFormat(n[0]).substring(0,10)+' 00:00:00'
                    this.search.q_create_time_end = getDateFormat(n[1]).substring(0,10)+' 23:59:59'
                }else{
                    this.search.q_create_time_begin = ''
                    this.search.q_create_time_end = ''
                }
            },
            queryOrderNumber: {
              immediate: true,
              handler (n){
                this.search.q_order_no = n
              }
            },
            orderStoreQueryUserId: {
              immediate: true,
              handler (n){
                this.search.q_create_user_id = n
              }
            },
        },
        methods :{
            ...mapMutations({
              setQueryOrderNumber: types.setQueryOrderNumber, 
              setOrderStoreQueryUserId: types.setOrderStoreQueryUserId
            }),

            loadList (){
              let params = this.assignQuery(this.search)
              this.tableParams.selectList = []
              this.$api.order.getOrderList(params).then((data) => {
                  this.tableParams.list = data.resultObj.list
                  this.tableParams.total = data.resultObj.total
                  this.setQueryOrderNumber()
              })
            },
            topFilterChange: function(data){
                if (!data) { return }
                this.search.q_bulk_type = data.bulkType
                this.search.q_is_exception = ''
                this.search.q_is_reject = ''
                this.search.q_is_del = 'N'
                
                if(data.orderState){
                  this.search[data.orderState] = 'Y'
                }

                this.queryIsCreateOwner = data.isCreateOwner
                this.onSearch()
            },

            
            
            

            onReset (){
                this.queryTime = ''
                Object.assign(this.search, constants.searchParams)
                this.loadList()
            },
            handlerExport(){
                let params = this.assignQuery(this.search)
                params.company_id = this.userInfo.company_id
                
                exportExcel(params, '/api/utils/excel/orders/xhs')
            },

            handler2Detail (id){
                this.$router.push({name: 'orderStoreDetail', params: {id: id}})
            },
            // 指定司机
            specifyVipDriver (orders){
                bus.$emit('specify-vip-driver',orders)
            },
            // 分配VIP司机
            assignToApp (order){
                bus.$emit('assign-to-app',order)
            },
            // 分配承运商
            assignCarrier (order){
                // 限制操作一条
                // 分别处理来自详情和列表的分配 
                this.$api.order.getOrderAutoMatchLiner({order_id: order.order_id}).then((data) =>{
                    bus.$emit('assign-carrier', order.order_id, data.resultObj)
                })
            },
            // 分配司机
            assignDriver (order){
                bus.$emit('assign-to-driver',order)
            },
            // 分配承运商（TMS）
            assignFacilitator (order) {
                bus.$emit('assign-to-facilitator',order)
            },
            // 分配成员
            assignMember (order) {
                bus.$emit('assign-to-member',order)
            },
            // 运单签收
            signOrder (order) {
                bus.$emit('sign-order',order)
            },
            //投保
            insure () {
                bus.$emit('insure-order',this.tableParams.selectList[0])
            },
            // 运单作废
            del () {
                let _vm = this
                this.$Modal.confirm({
                    title: '确认提示',
                    content: '是否确认作废该运单？',
                    onOk (){
                        this.$api.order.getWaybillDEL({order_ids:_vm.tableParams.selectList[0].order_id}).then(json=>{
                            if(json.result==1){
                                _vm.$Message.success("操作成功")
                                _vm.loadList()
                            }
                        })
                    }
                })
                
            },

            
            // 打印货签
            handlerPrintTag(order){
                this.printTagShow = true
                this.printTagOrder = order
            },

            // 套打运单
            printOrderCover(){
                let orders = [...this.tableParams.selectList]
                printOrderCover({data: orders})
            },
            
            // 全打TODO
            printOrderAll(order){
                this.$emit('print-order-all', order)
            },
            handlerTopSearch (qOrderNo){
                this.search = {...constants.searchParams}
                this.search.q_order_no = qOrderNo
                this.search.q_order_state = ''
                this.tableParams.page = 1
                this.tableParams.selectList = []
                this.setOrderStoreQueryUserId()
                this.loadList()
            }
           
        },
        created(){
            if (this.queryOrderNumber) {
                this.handlerTopSearch(this.queryOrderNumber)
            }else{
                // 赋值开单人员ID
                this.loadList()
            }
        },
        mounted (){
            let vm = this
            // 分配、发布等操作修改运单库存状态后重新加载列表
            bus.$on('order-list-reload', () => {this.onSearch() })
            // 详情指派司机
            bus.$on('detail-specify-vip-driver', (order) => {this.specifyVipDriver([order])})
            // // 详情发布到app
            // bus.$on('detail-assign-to-app', (order) => {this.assignToApp(order)})
            // 详情分配承运商
            bus.$on('detail-assign-carrier', (order) => {this.assignCarrier(order) })

            bus.$on('detail-sign', (order) => {this.signOrder(order) })
            
            
            bus.$on('detail-assign-driver', (order) => {this.assignDriver(order) })
            bus.$on('detail-assign-facilitator', (order) => {this.assignFacilitator(order) })
            bus.$on('detail-assign-member', (order) => {this.assignMember(order) })

            this.order_type_liner=this.funcMenu.includes('ORDER_TYPE_LINER')
            this.order_type_zb=this.funcMenu.includes('ORDER_TYPE_ZB')
            this.order_type_custom=this.funcMenu.includes('ORDER_TYPE_COSTOM')

            bus.$on('order-store-top-search', qOrderNo => {
                this.handlerTopSearch(qOrderNo)
            })

            // 打印货签
            this.$on('print-tag', (order) => {
                this.handlerPrintTag(order)
            })
            // 套打运单
            this.$on('print-order', (order) => {
                this.broadcast('do-print-order', order)
            })
            // 全打运单
            this.$on('print-order-all', order => {
                this.broadcast('do-print-order-all', order)
            })

        },
        beforeDestroy (){
            bus.$off()
        }
    }
        
</script>
<style lang="scss" src="./style.scss"></style>