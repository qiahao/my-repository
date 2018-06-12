<template lang="html">
    <Modal
            v-model="mbModel"
            title="选择报价"
            width="815"
            >  
        <p></p>
        <i-form  :label-width="100">
            <Form-item  class="mt10" label="价格表名称：">
                <i-input placeholder="请输入价格表名称" v-model='search.keyword' style="width:200px"></i-input>
                <i-button type="primary"  @click="onSearch">搜索</i-button>
            </Form-item>
        </i-form>
        <div class="contain-main">
            <i-table :data="tableParams.list" :columns="columns"
                highlight-row
                @on-current-change="rowSelect">
            </i-table>
            <div class="page-wrapper">
                <Page :total="tableParams.total" show-sizer show-elevator
                    :current="currentPage" 
                    @on-change="onPageChange" 
                    @on-page-size-change="onPageSizeChange">
                </Page>
            </div>
        </div>
        <div slot="footer">
             <i-button @click="cancelModel">取消</i-button>
             <i-button type="primary"  @click="submit">确定</i-button>
        </div>


         
                
    </Modal>
</template>
<script>
    import tableMixin from '@/mixins/tableMixin'
    import { getPriceList} from '@/api/src/price'
    import { mapState } from 'vuex'
    export default{
        props: {
            partner_id: '', 
            type: '',
            value: {require:true}
        },
        data:function(){
             return {
                columns: [
                    {title: '名称',key: 'pm_name', width : 220}, 
                    {title: '最近更新时间',key: 'modify_time', width :160 },
                    {title: '最近更新人员',key: 'modify_user_name', width : 120}, 

                    {title: '有效日期（起始）',key: 'effect_time_begin', width : 140},
                    {title: '有效日期（截止）',key: 'effect_time_end', width : 140},
                ],
                search:{
                    act_user_id:'',
                    pm_bulk:'',
                    page_size:9999,
                    keyword:'',
                    is_time_effect : 'Y'
                },
                mbModel:false,
                pm_id:'',
            
             }
        },
        mixins: [tableMixin],
        computed: {
            ...mapState(['userInfo'])
        },
        mounted(){
            let _vm = this
            bus.$on('list-reload', (e)=>{
                if(e===false){
                    _vm.showDetailModal = false;
                }
                _vm.onSearch()
            })
        },
        watch:{
            value(n,o){
                if(n){
                    this.onSearch()
                    this.mbModel=true
                }
            },
            mbModel(n,o){
                this.$emit('input',this.mbModel)
            },
        },
        methods :{
            onSearch(){
                let _vm = this;
                _vm.search.act_user_id = _vm.userInfo.user_id;
                _vm.search.partner_id = _vm.partner_id
                _vm.search.pm_bulk = _vm.type
                let params = this.assignQuery(_vm.search);
                getPriceList(params).then((data)=>{
                    _vm.tableParams.list = data.resultObj.list
                    _vm.tableParams.total = data.resultObj.total
                    _vm.tableParams.selectList = []
                    _vm.hasSelect=false
                })
            },
            rowSelect(e,e1){
                this.pm_id = e.pm_id
            },
            submit(){
                if(!this.pm_id){
                    return this.$Message.error("请选择报价")
                }
                this.$emit("loadRoutes",this.pm_id)
                this.mbModel = false
            },
            cancelModel(){
                this.mbModel = false
            },
            blur(){
                this.onSearch()
            }

            
        },
    }
        
</script>