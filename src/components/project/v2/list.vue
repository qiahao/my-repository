<template lang="html">
    <div>
        <div class='contain-head' >
            <div>
                <i-select size="large"  v-model="search.pm_pub" style="width: 120px;" @on-change="loadList">
                    <i-option value="">全部</i-option>
                    <i-option value="1">已发布</i-option>
                    <i-option value="2">已作废</i-option>
                    <i-option value="0">草稿</i-option>
                </i-select>

                <top-filter-select @reload="filterSelectChange" class="ml10"  ref="refSearchFilter"></top-filter-select>
                <i-input  size="large" v-model="search.query_string" placeholder="请输入项目名称，客户名称" style="width: 250px;"></i-input>
                <i-button type="primary" @click="onSearch">搜索</i-button>
                <!--
                <i-button type="primary" @click="clearFilter">重置</i-button>
                -->
                <i-button type="primary" @click="createdProject">添加项目</i-button>
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
        <router-view></router-view>
    </div>
</template>
<script>
    import tableMixin from '@/mixins/tableMixin'
    import { getProjectList,projectCreate,projectDetail,projectUpdate,projectDel } from '@/api/src/projectApi'
    import { mapState } from 'vuex'
    import topFilterSelect from './top-filter-select.vue'

    export default{
        name:'projectV2List',
        data:function(){
             return {
                conditionList:[
                    {
                        text:'全部',
                        key:''
                    },
                    {
                        text:'零担项目',
                        key:'0'
                    },
                    {
                        text:'整车项目',
                        key:'1'
                    },
                ],
                columns: [
                    {title: '名称',key: 'prj_name'}, 
                    {title: '发布状态',key: 'pm_pub',render: (h,params)=>{
                        let pmFor=['草稿','已发布','已作废']
                        return h('span', pmFor[params.row.pm_pub])
                        }
                    },
                    {title: '状态',key: 'pm_state', render: (h,params)=>{
                        let list=['未生效','生效','无效','过期']
                        return h('span', list[params.row.pm_state])
                        } },
                    {title: '项目类型',key: 'prj_self',render: (h,params)=>{
                        return h('span', params.row.prj_self=='Y'?"自营":"非自营")
                        } }, 
                    {title: '项目服务费率%',key: 'prj_rate' },
                    
                    {title: '客户名称',key: 'partner_name'}, 
                    {title: '有效日期（起始）',key: 'effect_time_begin'},
                    {title: '有效日期（截止）',key: 'effect_time_end'},
                    
                ],
                projectDetail:false,
                //列表查询条件
                search:{
                    act_user_id:'',
                    pm_bulk:'',
                    pm_state:'0,1,2',
                    query_string:'',
                    prj_self:'',

                },
                l_id: '',
                showDetailModal:false,
            
             }
        },
        mixins: [tableMixin],
        computed: {
            ...mapState(['userInfo'])
        },
        created(){
            this.onSearch();
        },
        mounted(){
            let _vm = this
        },
        components: {
            topFilterSelect,
        },
        methods :{
            loadList(){
                this.onSearch();
            },
            onSearch(){
                let _vm = this;
                _vm.search.act_user_id=_vm.userInfo.user_id;
                let params = this.assignQuery(_vm.search);
                getProjectList(params).then((data)=>{
                    _vm.tableParams.list = data.resultObj.list
                    _vm.tableParams.total = data.resultObj.total
                    _vm.tableParams.selectList = []
                    _vm.hasSelect = false
                })
            },
            filterSelectChange: function(e){
                this.search=Object.assign(this.search,e)
                this.search.pm_state = e.pm_state.join(',')
                this.loadList();
            },
            clearFilter(){
                this.search={
                    pm_bulk : '',
                    pm_state:'',
                    keyword:'',
                }
                this.onSearch();
            },
            //详情
            detailModel(e){
                let _vm = this
                _vm.directDetail(e.prj_id)
            },
            directDetail (id){
                let params = {name: 'projectDetail'}
                if (id) 
                    params.query = {id: id}
                this.$router.push(params)
            },
            //创建
            createdProject(){
                this.directDetail()
            },
  
        },
    }
        
</script>