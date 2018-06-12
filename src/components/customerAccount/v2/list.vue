<template lang="html">
    <div>
        <div class='contain-head' >
            <div v-show='!hasSelect'>
                <top-filter-select @reload="filterSelectChange" class="ml10"  ref="refSearchFilter"></top-filter-select>
                <i-input  size="large" v-model="search.keyword" placeholder="请输入账号、企业名称" style="width: 200px;"></i-input>
                
                
                <i-button type="primary" @click="onSearch">搜索</i-button>
                <!--
                <i-button  type="primary" @click="clearFilter">重置</i-button>
                -->
                <i-button type="primary" @click="createdProject">添加客户</i-button>
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
    import tripDetailModal from '@/components/customerAccount/v2/detail.vue'
    import tableMixin from '@/mixins/tableMixin'
    import { getPartnerList,agreePartnerAudit,refusePartnerAudit,cancelPartnerAudit} from '@/api/src/customerAccount'
    import { utilCookie} from '@/utils/util'
    import { mapState } from 'vuex'
    import topFilterSelect from './top-filter-select.vue'

    export default{
        name:'customerAccountV2List',
        data:function(){
             return {
                conditionList:[
                    {
                        text:'全部',
                        key:''
                    },
                    {
                        text:'待审核',
                        key:'D'
                    },
                    {
                        text:'已合作',
                        key:'Y'
                    },
                    {
                        text:'已拒绝',
                        key:'N'
                    },
                    {
                        text:'已取消合作',
                        key:'CN'
                    },
                    {
                        text:'未邀请',
                        key:'NULL'
                    },
                ],
                columns: [
                    {title: '账号',key: 'invite_mobile'
                    }, 
                    {title: '状态',key: 'account_status', render: (h,params)=>{
                        return h('span', params.row.account_status=='Y'?"启用":"禁用")
                        } },
                    {title: '企业名称',key: 'partner_name' }, 
                    {title: '所在地',key: 'partner_area'}, 
                    {title: '客户归属',key: 'account_belong',render: (h,params)=>{
                        return h('span', params.row.account_belong=='1'?"园外":"浙江未名公路港")
                        } },
                    {title: '联系人',key: 'partner_link_name'}, 
                    {title: '联系电话',key: 'partner_link_mobile'},
                
                ],
                projectDetail:false,
                //列表查询条件
                search:{
                    act_user_id:'',
                    pm_bulk:'',
                    order_by_type:'',
                    account_belong:'',
                    account_status: '',
                },
                l_id: '',
                showDetailModal:false,
            
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
                    account_belong:'',
                    keyword:'',
                    invite_type:'',
                    account_status:'',
                    act_user_id:'',
                }
                this.$refs.refSearchFilter.clearCondion();
                this.onSearch();
            },
            //详情
            detailModel(e){
                let _vm = this
                _vm.l_id=e.pcid
                _vm.projectDetail = true
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
                margin-right: 10px
            }
        }
    }
    
</style>