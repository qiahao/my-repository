<template lang="html">
    <div>
        <div class='contain-head' >
            <div v-show='!hasSelect'>
                <search-filter :list='conditionList' v-model="search.pm_type"  @on-change="onSearch">
                </search-filter>
                <search-filter :list='conditionList2' v-model="search.pm_state"  @on-change="onSearch">
                </search-filter>
                
                <i-input  size="large" v-model="search.keyword" placeholder="请输入关键字" style="width: 150px;"></i-input>
                <i-button type="primary" @click="onSearch">搜索</i-button>
                <i-button  type="primary" @click="clearFilter">重置</i-button>
            </div>
            <div class='mt10'>
                <i-button type="primary" @click="add">添加价格</i-button>
                <i-button type="primary" style='display:none'  @click="importPrice" :disabled="tableParams.selectList.length!=1">导入价格</i-button>
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
            title="上传模版"
            width="420"
            >   
                <Upload 
                    :on-success="successHandle"
                    :show-upload-list="false"
                    :action="url">
                    <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                </Upload>
                <p class="mt20">您可以跟据下列模版进行填写：</p>
                <div class="mt10">
                    <a href="http://192.168.60.219:8889/api/utils/excel/route-price/demo?type=0">整车报价模板</a>
                    <a class="ml30" href="http://192.168.60.219:8889/api/utils/excel/route-price/demo?type=1">零担报价模板</a>
                    <a class="ml30" href="http://192.168.60.219:8889/api/utils/excel/route-price/demo?type=2">零担分段报价模板</a>
                </div>
        </Modal>
    </div>
</template>
<script>
    import tableMixin from '@/mixins/tableMixin'
    import { getPriceList,uploadPriceRoute,downloadPriceRoute} from '@/api/src/price'
    import { utilCookie} from '@/utils/util'
    import { mapState } from 'vuex'
    export default{
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
                    {title: '报价表名称',key: 'pm_name', width : 350}, 
                    {title: '报价成员',key: 'liner_name', width : 250}, 
                    {title: '报价类型',key: 'pm_for', width : 150,render: (h,params)=>{
                        let pmFor=['成员价','公布价','特定对象价']
                        return h('span', pmFor[params.row.pm_for])
                        }
                    },
                    {title: '发布状态',key: 'pm_pub', width : 150,render: (h,params)=>{
                        let pmFor=['草稿','已发布','已作废']
                        return h('span', pmFor[params.row.pm_pub])
                        }
                    },
                    {title: '生效状态',key: 'pm_state', width : 150,render: (h,params)=>{
                        let pmFor=['','生效','失效','已过期']
                        return h('span', pmFor[params.row.pm_state])
                        }
                    },
                    {title: '成员归属',key: 'account_belong', width :160 },
                    {title: '报价有效日期',key: 'pm_type', width : 250,render: (h,params)=>{
                        return h('span', params.row.effect_time_begin+" 至 "+params.row.effect_time_end)
                        }
                    },
                ],
                search:{
                    act_user_id:'',
                    pm_bulk:'',
                    pm_state:''
                },
                l_id: '',
                showDetailModal:false,
                mbModel:false,
                file:null,
                loadingStatus: false,
                url:'',
            
             }
        },
        components: {
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
            bus.$on('price-list-reload', (e)=>{
                if(e===false){
                    _vm.showDetailModal = false;
                }
                _vm.onSearch()
            })
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
            clearFilter(){
                this.search={
                    pm_type : '',
                    pm_state:'',
                    keyword:'',
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
                if (id) 
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
                this.url=""
            },
            successHandle(e,file){
                if(e.result!='1'){
                    this.$Message.error(e.resultInfo)
                }
            }
            
        },
    }
        
</script>