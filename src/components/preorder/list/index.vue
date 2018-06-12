<template lang="html">
    <div>
        <div class='contain-head'>
            <div v-show='!hasSelects'>
                <RadioGroup v-model="search.forward_state" type="button" @on-change="handlerChangeState">
                    <Radio v-for="(item,i) in conditionList" :key="i" :label="item.key">{{item.text}}</Radio>
                </RadioGroup>
                
                <i-input v-model="search.order_no" placeholder="请输入订单号" style="width: 200px;"></i-input>
                <i-button @click="onSearch">搜索</i-button>
                <i-button @click="onReset">重置</i-button>
            </div>
            <div v-show='hasSelects'>
                <i-button :disabled="!isOperate" type="primary" @click='accept'>接受</i-button>
                <i-button :disabled="!isOperate" type="primary" @click='reject' class='ml5'>拒绝</i-button>
            </div>
        </div>
        <div class="contain-main">
            <i-table :data="tableParams.list" :columns="columns"
                @on-selection-change="onSelectionChange"
                
                >
            </i-table>
            <div class="page-wrapper">
                <Page :total="tableParams.total" show-sizer show-elevator
                    :current="currentPage" 
                    @on-change="onPageChange" 
                    @on-page-size-change="onPageSizeChange">
                </Page>
            </div>
        </div>
      
        <!-- 订单详情 -->
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
      
    </div>
</template>
<script>
    import { getArrayIds } from '@/utils/util'
    import tableMixin from '@/mixins/tableMixin'
    import * as constants from './constants.js'

    export default {
        name: 'preorderV1List',
        data: function(){
             return {
                conditionList: constants.getConditionList(),
                columns: constants.getColumns.call(this),
                //列表查询条件
                search:{
                    forward_state:'0',
                    order_no: ''
                },
                hasSelects: false,
                isOperate: true,
                order_ids: '',
             }
        },
        mixins: [tableMixin],
        methods :{
            loadList (){
                let params = this.assignQuery(this.search)
                this.$api.preorderApi.getPreorderList(params).then((data)=>{
                    this.tableParams.list = data.resultObj.list
                    this.tableParams.total = data.resultObj.total
                    this.tableParams.selectList = []
                    this.hasSelects = false;
                })
            },
            handler2Detail (id){
                this.$router.push({path: '/preorder/detail/'+ id})
            },
            //拒绝
            reject (){
                let _vm = this;
                let params = {forward_ids:_vm.order_ids}
                this.$Modal.confirm({
                    content: '是否确定拒绝该运单？',
                    onOk (){
                        _vm.$api.preorderApi.setPreorderReject(params).then(json=>{
                           _vm.loadList();
                        })
                    }
                })
            },
           
            //接收
            accept (){
                let _vm = this;
                let params = {forward_ids:_vm.order_ids}
                this.$Modal.confirm({
                    content: '是否确定接受该运单',
                    onOk (){
                        _vm.$api.preorderApi.setPreorderAccept(params).then(json=>{
                            _vm.loadList();
                        })
                    }
                })
            },
            onReset (){
                this.search.order_no = ''
                this.search.forward_state = '0'
                this.onSearch()
            },
            handlerChangeState(){
                this.$nextTick(() => {
                    this.onSearch()
                })
            },
            onSelectionChange(e){
                let _vm=this;
                this.hasSelects=e.length>0?true:false;
                let num=0;
                e.forEach(function(x){
                    if(x.forward_state!=0){
                        num++
                    }
                })
                _vm.isOperate=num==0?true:false
                _vm.order_ids=getArrayIds(e,"forward_id")
            }
            
        },
        created(){
            this.loadList();
        },
    }
        
</script>