<template lang="html">
    <div class="mt20">
        <div class="clearfix">
            <Row>
                <i-col span='24'>
                    <i-select v-model="search.order_by"  v-show="tableParams.total!=0" size="small" style="width:150px" placeholder="请选择排序方式" @on-change="onSearch">
                        <i-option value="from">按出发地排序</i-option>
                        <i-option value="to">按目的地排序</i-option>
                    </i-select>
                    <i-button  v-show="tableParams.total!=0 &&  pm_pub == 0" size="small" @click="clearRoute">清空价格表</i-button>
                    
                    <i-button size="small"  @click="importRoute"  v-show="pm_pub == 0">导入价格</i-button>
                    <i-button  v-show="tableParams.total!=0" size="small"  @click="exportRoute">导出价格</i-button>
                    <i-button  v-show="pm_pub == 0" size="small"  @click="loadMb">下载价格模版</i-button>
                </i-col>
            </Row>
        </div>
        <p  v-show="tableParams.total==0"  class='mt10'>暂无价格表，您可以点击上方的“下载价格模板”下载价格模板文件，并点击上方的“导入价格”按钮导入您已编辑的价格表。</p>
        <i-table v-show="tableParams.total!=0" class='mt10'  size="small" :data="tableParams.list" :columns="columnData">
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

        <!--待支付-->
        <Modal
            v-model="uploadModel"
            title="提示"
            width="400" class-name="vertical-center-modal">
            <div class="insure-modal-content">
                <p>导入价格将刷新已有价格表，是否继续？</p>
            </div>
            <div slot="footer">
                <i-button   @click="cancelUpload">取消</i-button>
                <Upload
                    style="display:inline-block" 
                    :on-success="successHandle"
                    :before-upload="beforeLoadHandle"
                    :show-upload-list="false"
                    :action="excelUrl">
                    <i-button type="primary">确定</i-button>
                </Upload>
            </div>
        </Modal>
    </div>
</template>
<script>
    import vehicleModel from '@/components/price/v2/vehicleModel.vue'
    import tableMixin from '@/mixins/tableMixin'
    import { getPriceRouteList,addPriceRoute,editPriceRoute,delPriceRoute,clearPriceRoute } from '@/api/src/price'
    import { utilCookie} from '@/utils/util'
    import { mapState } from 'vuex'
    import config from '@/config'
    export default{
        props:{
            pm_pub:'',
        },
        data:function(){
             return {
                l_id: '',
                excelUrl: '',
                mbModel: false,
                uploadModel: false,
                search: {
                    order_by:'',
                    page_size:'999',
                    pm_id:''
                },
                columnData:[{
                        title:'始发地',
                        width:200,
                        key:'from_city',
                        
                    },],
                host:'',
                count:'',
                columnsDefault: [
                    {
                        title:'始发地',
                        width:200,
                        key:'from_city',
                        
                    },
                    {
                        title:'目的地',
                        width:200,
                        key:'to_city',
                        
                    },
                    {
                        title:'截单时间',
                        width:150,
                        key:'cut_off_hour',
                        
                    },
                    {
                        title:'发车时间',
                        key:'send_car_hour',
                        width:150,
                    },
                    {
                        title:'运输时效 (天)',
                        key:'trans_days',
                        width:150,
                    },
                    {
                        title:'回单时间 (天)',
                        key:'receipt_days',
                        width:150,
                    },
                    {
                        title:'货款返还时间 (天)',
                        key:'cash_days',
                        width:150,
                    },
                    
                ],
             }
        },
        mixins: [tableMixin],
        computed: {
            ...mapState(['userInfo']),
        },
        created(){
            
            
            
        },
        mounted(){
            let _vm = this
            this.host = ''
            this.pm_id=this.$route.query.id
            this.importPrice()
            this.onSearch()
        },
        methods :{
            onSearch(){
                let _vm = this;
                _vm.search.act_user_id=_vm.userInfo.user_id;
                _vm.search.pm_id=_vm.pm_id;
                let params = this.assignQuery(_vm.search);
                getPriceRouteList(params).then((data)=>{
                    if(data.resultObj.list.length>0){
                        let obj=JSON.parse(data.resultObj.list[0].route_price)
                        _vm.setColums(obj)
                        _vm.tableParams.list=data.resultObj.list.map(function(x){
                            return Object.assign(x,_vm.getColumsData(JSON.parse(x.route_price)))
                        })
                        bus.$emit('route-finish-load',data.resultObj.total)
                    }
                    else{
                        _vm.tableParams.list=[];
                    }
                    _vm.tableParams.total = data.resultObj.total
                })
            },
            //获取表头
            setColums (obj){
                let _vm = this
                _vm.columnData=_vm.columnsDefault.slice()
                obj.forEach(function(x){
                    let data={'title':x.name,'key':x.key,width:140}
                    _vm.columnData.push(data)
                })
            },
            //将数routeprice字段转成表格数据
            getColumsData(obj){
                let _vm = this
                let data={}
                obj.forEach(function(x){
                    data[x.key]=x.val
                })
                return data
            },
            //导入
            importPrice(){
                this.excelUrl=this.host+"/api/tms/price/route/member/excel/import?act_user_id="+this.userInfo.user_id+"&pm_id="+this.pm_id
            },
            importRoute(){
                this.uploadModel = true
            },
            successHandle(e,file){
                if(e.result!='1'){
                    this.$Message.error(e.resultInfo)
                }
                else{
                    this.uploadModel = false
                    this.onSearch()
                    bus.$emit('route-upload-load',e.resultObj.count)
                }
            },
            beforeLoadHandle(file){
                let array=file.name.split('.');
                let str = array[array.length-1]
                if(str!='xlsx' && str!="xls"){
                    this.$Message.error("请选择.xlsx或.xls后缀文件")
                    return false
                }
            },
            //取消上传
            cancelUpload(){
                this.uploadModel = false
            },
            //加载模版
            loadMb(){
                this.mbModel = true
            },
            //清理路由
            clearRoute(){
                let params={
                    act_user_id:this.userInfo.user_id,
                    pm_id:this.pm_id
                }
                this.$Modal.confirm({
                    title: '系统提示',
                    content: '您确认清除价格表？',
                    onOk: () => {
                        clearPriceRoute(params).then((json)=>{
                            if(json.result==1){
                                this.$Message.success("价格表已清空")
                                this.onSearch()
                                bus.$emit('route-upload-load',0)
                            }
                        })
                    }
                });
                
            },
            //路由导出
            exportRoute(){
                let url = this.host+"/api/tms/price/route/member/excel/export?act_user_id="+this.userInfo.user_id+"&pm_id="+this.pm_id
                window.open(url)
            },
            
        },
    }
        
</script>
