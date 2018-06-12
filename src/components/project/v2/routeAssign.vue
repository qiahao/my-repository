<template lang="html">
    <div>
        <div class="contain-main">
            <div class="clearfix">
                <Row>
                    <i-col span='24'>
                        <i-select v-model="search.is_contract"  size="small" style="width:150px" @on-change="onSearch">
                            <i-option value="1">所有路线</i-option>
                            <i-option value="Y">已分包路线</i-option>
                            <i-option value="N">未分包路线</i-option>
                        </i-select>
                        <i-select v-model="search.order_by"  size="small" style="width:150px" placeholder="请选择排序方式" @on-change="onSearch">
                            <i-option value="from">按出发地排序</i-option>
                            <i-option value="to">按目的地排序</i-option>
                            <i-option value="liner">按承运商排序</i-option>
                        </i-select>
                        <i-button size="small" @click="add">选择承运商</i-button>
                        <i-button size="small"  @click="cancel">取消分包</i-button>
                    </i-col>
                </Row>
            </div>
            <i-table class="mt10" size="small" :data="routeReadyList" :columns="columns"
                @on-selection-change="onSelectionChange"
                >
            </i-table>
            <!--
            <div class="page-wrapper">
                <Page :total="tableParams.total" show-sizer show-elevator
                    :current="currentPage" 
                    @on-change="onPageChange" 
                    @on-page-size-change="onPageSizeChange">
                </Page>
            </div>
            -->
        </div>
        <Modal
            v-model="routeAssignModel"
            title="选择成员"
            width="415"
            >  
            <div class="contain-main">
                <p>请选择成员：</p>
                <i-select v-model="liner_id" class="mt10">
                    <i-option v-for="item in linerData.list" :key="item" :value="item.lcid">{{item.liner_name}}</i-option>
                </i-select>
            </div>
            <div slot="footer">
                <i-button @click="cancelModel">取消</i-button>
                <i-button type="primary"  @click="submit">确定</i-button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import tableMixin from '@/mixins/tableMixin'
    import { projectTractList,projectTractCreate} from '@/api/src/projectApi'
    import { getLinerList } from '@/api/src/linerApi'
    import { mapState } from 'vuex'
    import { getArrayIds} from '@/utils/util'

    export default{
        props:{
        },
        data:function(){
             return {
                columns: [
                    {type: 'selection', width: 90, align: 'center'},
                    {title: '始发地城市',key: 'from_city'
                    }, 
                    {title: '目的地城市',key: 'to_city'
                    },
                    {title: '承运商',key: 'liner_name'
                    },
                ],
                projectDetail:false,
                //列表查询条件
                search:{
                    act_user_id:'',
                    order_by:'',
                    is_contract:'1',
                },
                liner_id:'',
                project_id: '',
                showDetailModal:false,
                routeReadyList: [],
                routeAlreadyList: [],
                routeLinerList:[],
                routeAssignModel:false,
                linerData: {
                    list: [],
                }
             }
        },
        mixins: [tableMixin],
        computed: {
            ...mapState(['userInfo'])
        },
        created(){
            
        },
        activated(){
            this.project_id=this.$route.query.id
            if(this.project_id){
                this.onSearch()
            }
            
        },
        mounted(){
            this.project_id=this.$route.query.id
            this.onSearch()
        },
        methods :{
            loadList (){
                this.onSearch();
            },
            onSearch (){
                let _vm = this;
                _vm.search.act_user_id=_vm.userInfo.user_id;
                _vm.search.prj_id = _vm.project_id
                _vm.search.page_size = 999

                let params = this.assignQuery(_vm.search);
                params.is_contract === '1'? params.is_contract ='':''
                projectTractList(params).then((data)=>{
                    _vm.routeReadyList = data.resultObj.list
                    _vm.tableParams.total = data.resultObj.total
                    _vm.tableParams.selectList = []
                })
            },
            //选中
            onSelectionChange (e){
                let _vm = this
                _vm.tableParams.selectList = e
            },
            //增加计划
            add (){
                let _vm = this
                if(_vm.tableParams.selectList.length==0){
                    return this.$Message.error("请选择一条数据")
                }
                let arr=[]
                arr = this.tableParams.selectList.filter((item)=>{
                    return item.is_contract == 'Y'
                })
                if(arr.length == 0){
                    _vm.routeAssignModel = true
                }else{
                    this.$Modal.confirm({
                        title: '确认提示',
                        content: '您选择的部分线路已被承运，是否替换？',
                        onOk (){
                            _vm.routeAssignModel = true
                        }
                    })
                }
                
                _vm.loadLinerList()
                
            },
            loadLinerList(){
                let params={
                    act_user_id : this.userInfo.user_id,
                    page : 1,
                    page_size : 999,
                    is_account:'Y',
                    account_status: 'Y',
                }
                getLinerList(params).then(json=>{
                    this.linerData.list = json.resultObj.list
                    this.linerData.total = json.resultObj.total
                })
            },
            partnerBlur(e){
                this.linerId = e.route_id
            },
            //删除分包
            cancel(e){
                let _vm = this
                if(_vm.tableParams.selectList.length==0){
                    return this.$Message.error("请选择一条数据")
                }
                let params={
                    act_user_id:_vm.userInfo.user_id,
                    prj_id:this.project_id,
                    liner_id:'',
                    route_ids:getArrayIds(this.tableParams.selectList,'route_id'),
                }
                this.$Modal.confirm({
                    title: '确认提示',
                    content: '是否确认取消分包？',
                    onOk (){
                        projectTractCreate(params).then(json=>{
                            _vm.onSearch()
                            _vm.$Message.success('操作成功！');
                        })
                    }
                })
                
            },
            submit(){
                let _vm = this
                if(this.liner_id == ''){
                    return this.$Message.error("请选择承运商")
                }
                let params={
                    act_user_id : this.userInfo.user_id,
                    prj_id : this.project_id,
                    route_ids : getArrayIds(this.tableParams.selectList,'route_id'),
                    liner_id : this.liner_id,
                }
                projectTractCreate(params).then(function(){
                    _vm.onSearch()
                    _vm.routeAssignModel = false
                })
            },
            cancelModel(){
                this.routeAssignModel = false
            }
  
        },
    }
        
</script>
<style>
ul.route-liner-list li{
    background:#f6f6f6;
    border:1px  solid #ccc;
    border-radius:5px;
    padding:0 15px;
    height:32px;
    line-height:32px;
}
</style>