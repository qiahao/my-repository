<template lang="html">
    <div>
        <div class='contain-head' >
            <div v-show='!hasSelect'>
                <i-select size="large"  v-model="search.pm_pub" style="width: 120px;" @on-change="loadList">
                    <i-option value="">全部</i-option>
                    <i-option value="1">已发布</i-option>
                    <i-option value="2">已作废</i-option>
                    <i-option value="0">草稿</i-option>
                </i-select>
                <i-select size="large"  v-model="search.order_by" style="width: 120px;" @on-change="loadList">
                    <i-option value="create_time_up">按添加时间升序</i-option>
                    <i-option value="create_time_down">按添加时间降序</i-option>
                    <i-option value="liner_name">按承运商排序</i-option>
                </i-select>

                <top-filter-select @reload="filterSelectChange" class="ml10"  ref="refSearchFilter"></top-filter-select>
                <i-input  size="large" v-model="search.liner_name" placeholder="请输入报价成员" style="width: 150px;"></i-input>
                <i-button type="primary" @click="onSearch">搜索</i-button>
                <!--
                <i-button  type="primary" @click="clearFilter">重置</i-button>
                -->
                <i-button type="primary" @click="add">添加价格</i-button>
                <i-button type="primary"  @click="loadMb">下载价格模版</i-button>
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
        
        <!-- 详情 todo -->
        
        <Modal
            v-model="mbModel"
            title="模版下载"
            width="420"
            >   
                <p class="mt10">您可以选择对应的模版进行填写：</p>
                <div class="mt10">
                    <a :href="host+'/api/utils/excel/route-price/demo?type=0'">整车报价模板</a>
                    <a class="ml30" :href="host+'/api/utils/excel/route-price/demo?type=1'">零担报价模板</a>
                    <a class="ml30" :href="host+'/api/utils/excel/route-price/demo?type=2'">零担分段报价模板</a>
                </div>
        </Modal>
        
    </div>
</template>
<script>
    import tableMixin from '@/mixins/tableMixin'
    import { getPriceList,uploadPriceRoute,downloadPriceRoute} from '@/api/src/price'
    import topFilterSelect from './top-filter-select.vue'
    import { utilCookie} from '@/utils/util'
    import { mapState } from 'vuex'
    import config from '@/config'
    export default{
        name:'priceV2List',
        data:function(){
             return {
                conditionList:[
                    {
                        text:'全部',
                        key:''
                    },
                    {
                        text:'承运价格',
                        key:'0'
                    },
                    {
                        text:'托运价格',
                        key:'1'
                    },
                ],
                conditionList2:[
                    {
                        text:'全部',
                        key:''
                    },
                    {
                        text:'失效',
                        key:'2'
                    },
                    {
                        text:'生效',
                        key:'1'
                    },
                ],
                columns: [
                    {title: '报价表名称',key: 'pm_name'}, 
                    {title: '报价成员',key: 'liner_name'}, 
                    {title: '报价类型',key: 'pm_for', render: (h,params)=>{
                        let pmFor=['成员价','公布价','特定对象价']
                        return h('span', pmFor[params.row.pm_for])
                        }
                    },
                    {title: '发布状态',key: 'pm_pub',render: (h,params)=>{
                        let pmFor=['草稿','已发布','已作废']
                        return h('span', pmFor[params.row.pm_pub])
                        }
                    },
                    {title: '生效状态',key: 'pm_state', render: (h,params)=>{
                        let pmFor=['未生效','生效','无效','已过期']
                        return h('span', pmFor[params.row.pm_state])
                        }
                    },
                    {title: '成员归属',key: 'account_belong', render: (h,params)=>{
                        let pmFor=['浙江未名公路港','园外']
                        return h('span', pmFor[params.row.account_belong])
                        }},
                    {title: '报价有效日期',key: 'pm_type', width : 250,render: (h,params)=>{
                        return h('span', params.row.effect_time_begin+" 至 "+params.row.effect_time_end)
                        }
                    },
                ],
                search:{
                    act_user_id:'',
                    pm_bulk:'',
                    pm_state:'0,1,2',
                    order_by:'',
                    account_belong:'',
                    liner_name:'',
                    pm_for:'0,1',
                    pm_pub:'',
                },
                l_id: '',
                showDetailModal:false,
                mbModel:false,
                file:null,
                loadingStatus: false,
                url:'',
                host:'',
            
             }
        },
        components: {
            topFilterSelect,
        },
        mixins: [tableMixin],
        computed: {
            ...mapState(['userInfo'])
        },
        created(){
            this.onSearch();
            this.host = ''
        },
        mounted(){
            let _vm = this
        },
        activated(){
            this.onSearch();
        },
        methods :{
            loadList(){
                let _vm = this;
                _vm.search.act_user_id=_vm.userInfo.user_id;
                let params = this.assignQuery(_vm.search);
                getPriceList(params).then((data)=>{
                    _vm.tableParams.list = data.resultObj.list
                    _vm.tableParams.total = data.resultObj.total
                    _vm.tableParams.selectList = []
                    _vm.hasSelect=false
                })
            },
            filterSelectChange: function(e){
                this.search=Object.assign(this.search,e)
                this.search.pm_for = e.pm_for.join(',')
                this.search.pm_state = e.pm_state.join(',')
                this.loadList();
            },
            clearFilter(){
                this.search={
                    pm_type : '',
                    pm_state:'',
                    keyword:'',
                    account_belong:'',
                    order_by:'',
                    liner_name:'',
                }
                this.onSearch();
            },
            //详情
            detailModel(e){
                let _vm = this
                _vm.directDetail(e.pm_id)
            },
            //创建
            add(){
                this.directDetail()
            },
            directDetail (id){
                let params = {path: '/price/v2/detail'}
                if (id) {}
                    params.query = {id: id}
                this.$router.push(params)
            },
            //导入
            importPrice(){
                this.mbModel = true
                let pmid = this.tableParams.selectList[0].pm_id
                this.url="http://192.168.60.219:8889/api/utils/excel/route-price/upload?act_user_id="+this.userInfo.user_id+"&pm_id="+pmid
            },
            loadMb(){
                this.mbModel = true
            },
            successHandle(e,file){
                if(e.result!='1'){
                    this.$Message.error(e.resultInfo)
                }
            }
            
        },
    }
        
</script>