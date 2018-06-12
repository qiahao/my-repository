<template lang="html">
    <div>
        <div class='contain-head' >
            <div v-show='!hasSelect'>
                <i-select size="large" placeholder="排序" v-model="search.order_by_type" style="width: 120px;" @on-change="onSearch">
                    <Option value="">取消</Option>
                    <Option value="2">最近发货时间</Option>
                </i-select>
                <search-filter :list='conditionList' v-model="search.invite_state"  @on-change="onSearch">
                </search-filter>
                <i-input  size="large" v-model="search.keyword" placeholder="请输入关健字" style="width: 150px;"></i-input>
                <top-filter-select @reload="filterSelectChange" class="ml10"  ref="refSearchFilter"></top-filter-select>
                <i-button type="primary" @click="onSearch">搜索</i-button>
                <i-button  type="primary" @click="clearFilter">重置</i-button>
                <i-button type="primary" @click="createdProject">添加客户</i-button>
            </div>
            <div v-show='hasSelect'>
                <i-button type="primary" @click="createdProject">添加客户</i-button>
                <i-button  type="primary" @click="cancel">取消合作</i-button>    
            </div>
        </div>
        
        <div class="contain-main">
            <i-table :data="tableParams.list" :columns="columns"
                @on-selection-change="onSelectionChange"
                @on-row-click="detailModel">
            </i-table>
            <div class="page-wrapper">
                <Page :total="tableParams.total" show-sizer show-elevator
                    :current="currentPage" 
                    @on-change="onPageChange" 
                    @on-page-size-change="onPageSizeChange">
                </Page>
            </div>
        </div>
        
        <!-- 车次详情 todo -->
        <trip-detail-modal :list_id="l_id" v-model="projectDetail" >
        </trip-detail-modal>
    </div>
</template>
<script>
    import tripDetailModal from '@/components/customer/v2/detail.vue'
    import tableMixin from '@/mixins/tableMixin'
    import { getPartnerList,agreePartnerAudit,refusePartnerAudit,cancelPartnerAudit} from '@/api/src/customer'
    import { utilCookie} from '@/utils/util'
    import { mapState } from 'vuex'
    import topFilterSelect from './top-filter-select.vue'

    export default{
        name: 'customerV2List',
        data:function(){
             return {
                conditionList:[
                    {
                        text:'全部',
                        key:''
                    },
                    {
                        text:'已合作',
                        key:'Y'
                    },
                    {
                        text:'已取消合作',
                        key:'CN'
                    },
                ],
                columns: [
                    {type: 'selection', width: 60, align: 'center'},
                    {title: '单位名称',key: 'partner_name', width : 180
                    }, 
                    {title: '所在地',key: 'partner_area', width : 120}, 
                    {title: '公司类型',key: 'partner_type', width :160,render: (h,params)=>{
                        return h('span', params.row.partner_type=='1'?"项目客户":"普通客户")
                        } },
                    
                    {title: '联系人',key: 'partner_link_name', width : 180}, 
                    {title: '联系电话',key: 'partner_link_mobile', width : 140},
                    {title: '客户经理',key: 'partner_manager', width : 140},
                    {title: '下单方式',key: 'partner_order_form', width : 140,render: (h,params)=>{
                        return h('span', params.row.partner_order_form=='1'?"在线":"人工 ")
                        } },
                    {title: '邀请状态',key: 'invite_state', width : 100, render: (h,params)=>{
                        let obj={
                            D: '审核中',
                            N: '拒绝',
                            Y: '同意',
                            CN: '取消合作'
                        }
                        if(!params.row.invite_state){
                            return h('span', '未邀请/绑定')
                        }
                        else{
                            return h('span', obj[params.row.invite_state])
                        }
                        
                        } },

                    {title: '最近下单时间',key: 'send_last_time_desc', width : 160},
                    {title: '备注',key: 'partner_remark', width : 140},
                ],
                projectDetail:false,
                //列表查询条件
                search:{
                    act_user_id:'',
                    pm_bulk:'',
                    order_by_type:'',
                    invite_state:'',
                    is_account: 'N',
                },
                l_id: '',
                showDetailModal:false,
                isRecive: false,
                isRefuse: false,
                isCancel: false,
            
             }
        },
        components: {
            tripDetailModal,
            topFilterSelect
        },
        mixins: [tableMixin],
        computed: {
            ...mapState(['userInfo','funcMenu'])
        },
        watch:{
            "tableParams.selectList": {
                handler: function(n,o){
                    if(n.length==1){
                        if(n[0].invite_state=='D'){
                            this.isRecive= true
                            this.isRefuse= true
                            this.isCancel= false
                        }
                        else if(n[0].invite_state=='CN'){
                            this.isRecive= false
                            this.isRefuse= false
                            this.isCancel= false
                        }
                        else {
                            this.isCancel= true
                            this.isRecive= false
                            this.isRefuse= false
                        }
                        
                    }
                    else{
                        this.isRecive= false
                        this.isRefuse= false
                        this.isCancel= false
                   }
    　　　　　　　},
                deep:true
            },
        },
        created(){
            this.onSearch();
            
        },
        mounted(){
            let _vm = this
            bus.$on('customer-list-reload', (e)=>{
                if(e===false){
                    _vm.projectDetail = false;
                }
                _vm.onSearch()
            })
        },
        methods :{
            loadList(){
                let _vm = this;
                _vm.search.act_user_id=_vm.userInfo.user_id;
                let params = this.assignQuery(_vm.search);
                getPartnerList(params).then((data)=>{
                    _vm.tableParams.list = data.resultObj.list
                    _vm.tableParams.total = data.resultObj.total
                    _vm.tableParams.selectList = []
                    _vm.hasSelect = false
                })
                
            },
            filterSelectChange: function(e){
                this.search=Object.assign(this.search,e)
                this.onSearch();
            },
            clearFilter(){
                this.search={
                    invite_state : '',
                    order_by_type:'',
                    partner_type:'',
                    keyword:'',
                    invite_type:'',
                    partner_order_form:'',
                    act_user_id:'',
                }
                this.$refs.refSearchFilter.clearCondion();
                this.onSearch();
            },
            //详情
            detailModel(e){
                let _vm = this
                setTimeout(function(){
                    _vm.$nextTick(()=>{
                        if (_vm.tableParams.isCheckBoxClick) {
                            _vm.tableParams.isCheckBoxClick = false
                        }else{
                            _vm.l_id=e.pcid
                            _vm.projectDetail = true
                        }
                    })
                },10)
            },
            //创建
            createdProject(){
                let _vm = this
                _vm.projectDetail = true
                _vm.l_id=''
            },
            //拒绝
            refuse (){
                let _vm = this;
                if(this.tableParams.selectList.length > 1){
                    return this.$Message.warning('只能操作一条数据！');
                }
                if(this.tableParams.selectList[0].invite_type!=='1'){
                    return  this.$Message.warning('未收到邀请，不能进行拒绝操作！');
                }
                let params = {
                    act_user_id: this.userInfo.user_id,
                    audit_id: this.tableParams.selectList[0].audit_id
                }
                this.$Modal.confirm({
                    title: '确认提示',
                    content: '是否确认拒绝？',
                    onOk (){
                        refusePartnerAudit(params).then(json=>{
                            _vm.onSearch()
                            _vm.$Message.success('操作成功！');
                        })
                    }
                })
            },
            //接受
            recive (){
                let _vm = this;
                if(this.tableParams.selectList.length > 1){
                    return this.$Message.warning('只能操作一条数据！');
                }
                if(this.tableParams.selectList[0].invite_type!=='1'){
                    return  this.$Message.warning('未收到邀请，不能进行接受操作！');
                }
                let params = {
                    act_user_id: this.userInfo.user_id,
                    audit_id: this.tableParams.selectList[0].audit_id
                }
                this.$Modal.confirm({
                    title: '确认提示',
                    content: '是否确认接受？',
                    onOk (){
                        agreePartnerAudit(params).then(json=>{
                            _vm.onSearch()
                            _vm.$Message.success('操作成功！');
                        })
                    }
                })
            },
            //取消合作
            cancel (){
                let _vm = this;
                if(this.tableParams.selectList.length > 1){
                    return this.$Message.warning('只能操作一条数据！');
                }
                let params = {
                    act_user_id: this.userInfo.user_id,
                    audit_id: this.tableParams.selectList[0].audit_id,
                    pcid: this.tableParams.selectList[0].pcid
                }
                this.$Modal.confirm({
                    title: '确认提示',
                    content: '是否确认取消合作？',
                    onOk (){
                        cancelPartnerAudit(params).then(json=>{
                            _vm.onSearch()
                            _vm.$Message.success('操作成功！');
                        })
                    }
                })
            },
        },
    }
        
</script>

<style lang="scss" scoped>
    .contain-head{
        .text-filter{
            display: inline-block;
            margin-left: 10px;
            margin-top: 10px;
            .ivu-input-wrapper{
                width: 250px;
                display: inline-block;
                margin-right: 10px
            }
        }
    }
    
</style>