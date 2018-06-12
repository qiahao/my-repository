<template lang="html">
    <div>
        <div class="clearfix">
            <Row>
                <i-col span='5'><province-cascader  placeholder="请选择起始地" :opts="provinceOpts" v-model="begin_addr" style="width:170px" ></province-cascader></i-col>
                <i-col span='5'><province-cascader  placeholder="请选择目的地" :opts="provinceOpts" v-model="end_addr" style="width:170px" ></province-cascader></i-col>
                <i-col span='4'>
                    <i-button type="primary" @click="add">添加路线</i-button>
                </i-col>
                <i-col span='10'>
                    <i-button type="primary" @click="remove">删除路线</i-button>
                    <i-button type="primary" v-show="pm_bulk=='0'" @click="split">分段管理</i-button>
                    <i-button type="primary" v-show="pm_bulk=='1'" @click="vehicle">选择车型</i-button>
                    <i-button type="primary" @click="routeSubmit">保存路线</i-button>
                </i-col>
            </Row>
        </div>
        <i-table  class='mt10'  size="small" :data="tableParams.list" :columns="columns"
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
        <!--<router-detail :list_id="l_id" :trace_type="pm_bulk" v-model="showDetailModal"></router-detail>-->
        <Modal v-model="splitObj.model" width="360" title="分段管理">
            <div>
                <div>
                    <span>单位：</span> 
                    <Radio-group class="ml5"  v-model="splitObj.type">
                        <Radio label="0" >
                            <span>吨</span>
                        </Radio>
                        <Radio label="1">
                            <span>方</span>
                        </Radio>
                    </Radio-group>
                </div>
                <div class="mt10" v-show="splitObj.type=='0'">
                    <span>分段：</span>
                    <i-input v-model='splitObj.value0' placeholder="请输入分段值，用逗号隔开" style="width: 240px"></i-input>
                </div>
                <div class="mt10" v-show="splitObj.type=='1'">
                    <span>分段：</span>
                    <i-input v-model='splitObj.value1' placeholder="请输入分段值，用逗号隔开" style="width: 240px"></i-input>
                </div>
            </div>
            <div slot="footer">
                <i-button type="primary" size="large"  @click="getSplitList">确定</i-button>
            </div>
        </Modal>
        <vehicle-model v-model="vehicleObj.model"  :list='vehicleObj.list' @getList="getVehicleList"></vehicle-model>  
    </div>
</template>
<script>
    import vehicleModel from '@/components/price/v2/vehicleModel.vue'
    import tableMixin from '@/mixins/tableMixin'
    import { getPriceRouteList,addPriceRoute,editPriceRoute,delPriceRoute } from '@/api/src/price'
    import { utilCookie} from '@/utils/util'
    import { mapState } from 'vuex'
    export default{
        props: {
            pm_id:'',
            pm_bulk:'',
        },
        data:function(){
             return {
                l_id:'',
                showDetailModal:false,
                copyList:'',
                isPriceChange:false,
                route_add_index:0,
                begin_addr:'',
                end_addr:'',
                route_price_type:'1',
                splitObj:{
                    model:false,
                    type:'0',
                    value0:'',
                    value1:'',
                    list0:[],
                    list1:[],
                },
                vehicleObj:{
                    model:false,
                    list:''
                },
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
                search:{
                    act_user_id:'',
                },
                columns:[
                    {
                        name:"暂无",
                        key:'key',
                        width:700
                    } 
                ],
                lclData:[
                    {
                        key:'thf',
                        name:'提货费',
                        value:''
                    },
                    {
                        key:'shf',
                        name:'送货费',
                        value:''
                    },
                    {
                        key:'zdsf',
                        name:'最低收费',
                        value:''
                    },
                    {
                        key:'ldjg_weight',
                        name:'价格/吨',
                        value:''
                    },
                    {
                        key:'ldjg_cube',
                        name:'价格/方',
                        value:''
                    },
                ],
                lclSplitData:[
                    {
                        key:'thf',
                        name:'提货费',
                        value:''
                    },
                    {
                        key:'shf',
                        name:'送货费',
                        value:''
                    },
                    {
                        key:'zdsf',
                        name:'最低收费',
                        value:''
                    },
                ],
                //整车
                ltlData:[
                    {
                        key:'thf',
                        name:'提货费',
                        value:''
                    },
                    {
                        key:'shf',
                        name:'送货费',
                        value:''
                    },
                ],
                provinceOpts: { 'change-on-select': true },
             }
        },
        components: {
            //routerDetail,
            vehicleModel,
        },
        mixins: [tableMixin],
        computed: {
            ...mapState(['userInfo']),
        },
        created(){
            this.tableParams.list=[]
            this.setColums(this.lclData)
        },
        watch: {
            pm_id(n,o){
                if(n){
                    this.isPriceChange = true
                    this.route_add_index = 0
                    this.onSearch()
                }
            },
            pm_bulk(n,o){
                if(this.pm_bulk=='1'){
                    this.setColums(this.ltlData)
                }
                else{
                    this.setColums(this.lclData)   
                }
            }

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
        methods :{
            onSearch(){
                let _vm = this;
                _vm.search.act_user_id=_vm.userInfo.user_id;
                _vm.search.pm_id=_vm.pm_id;
                let params = this.assignQuery(_vm.search);
                getPriceRouteList(params).then((data)=>{
                    if(data.resultObj.list.length>0){
                        let obj=JSON.parse(data.resultObj.list[0].route_price)
                        _vm.route_price_type = data.resultObj.list[0].route_price_type
                        _vm.setColums(obj)
                        _vm.setOption(obj)
                        _vm.tableParams.list=data.resultObj.list.map(function(x){
                            return Object.assign(x,_vm.getColumsData(JSON.parse(x.route_price)))
                        })
                    }
                    else{
                        _vm.tableParams.list=[];
                    }
                    _vm.copyList=_vm.tableParams.list.slice()
                    _vm.tableParams.total = data.resultObj.total
                    _vm.tableParams.selectList = []
                })
            },
            //创建
            add (){
                let _vm = this
                if(_vm.begin_addr==''|| _vm.end_addr=='') 
                    return _vm.$Message.error("请先选择路线起止地再进行增加路线")

                let data = _vm.getColumsData(_vm.columns)
                _vm.route_add_index++
                data.route_id = 'route_add_id_' + _vm.route_add_index++
                let begin=_vm.begin_addr.split("$")
                let end=_vm.end_addr.split("$")
                data.from_city = begin[1]
                data.from_code = begin[0]
                data.to_city = end[1]
                data.to_code = end[0]
                _vm.tableParams.list.unshift(data);
            },
            remove (){
                let array = this.tableParams.selectList;
                let source = this.tableParams.list;
                let len = array.length
                let user_id=this.userInfo.user_id
                if(len == 0)
                    return this.$Message.error("请选择要删除的数据")
                
                for(let i=0;i<len;i++){
                    let data={
                        act_user_id:user_id,
                        route_id:array[i].route_id
                    }
                    let j = this.getListIndex('route_id',array[i].route_id)
                    this.tableParams.list = source.slice(0,j).concat(source.slice(j+1,source.length))
                    if(data.route_id.indexOf('route_add_id')==-1)
                        delPriceRoute(data).then(json=>{})
                }
            },
            split (){
                this.splitObj.model = true
            },
            getSplitList (){
                if(!this.splitObj.value0 && !this.splitObj.value1){
                    this.splitObj.model = false
                    return this.setColums(this.lclData)
                }
                let unit = this.splitObj.type=='0'?'weight':'cube'
                let unit2 = this.splitObj.type=='0'?'吨':'方'
                this.splitObj.value0=this.splitObj.value0.replace(new RegExp('，',"gm"),',')
                this.splitObj.value1=this.splitObj.value1.replace(new RegExp('，',"gm"),',')
                this.splitObj.list0 = this.splitDataFormat('0')
                this.splitObj.list1 = this.splitDataFormat('1')
                this.splitObj.model = false
                this.setColums(this.ltlData.concat(this.splitObj.list0).concat(this.splitObj.list1))
            },
            splitDataFormat(e){
                let unit = e=='0'?'weight':'cube'
                let unit2 = e=='0'?'吨':'方'
                let array = this.splitObj['value'+e]?this.splitObj['value'+e].split(','):[]
                if(array.length==0) 
                    return []
                let list= []
                for(var i=0;i<=array.length;i++){
                    let obj={};
                    let first,
                        last;
                    if(i===0){
                        first=0;
                        last=array[0]
                    }
                    else if(i===array.length){
                        first=array[array.length-1];
                        last=99999999
                    }
                    else{
                        first=array[i-1];
                        last=array[i]
                    }
                    obj.key = 'fd_'+unit+'_'+first+'_'+last
                    if(last!=99999999){
                        obj.name = first+'-'+last+' '+unit2
                    }
                    else{
                        obj.name = first+'-X'+' '+unit2+"以上"
                    }
                    
                    obj.value = ''
                    list.push(obj)
                }
                return list
            },
            vehicle (){
                this.vehicleObj.model = true
            },
            //接受车型组件返回车型信息
            getVehicleList (e){
                //将原来的字段重置之后，再和新增加的车型拼合
                this.ltlData.length=2
                this.ltlData=this.ltlData.concat(e)
                this.setColums(this.ltlData)
                this.vehicleObj.list = e
            },
            //根据返回数据设置分段和车辆信息
            setOption(obj){
                let _vm = this
                let array=[]
                let list=[]
                for(let i=0,len=obj.length;i<len;i++){
                    if(obj[i].key!='shf' && obj[i].key!='thf' &&obj[i].key!='zdsf'){
                        array.push(obj[i].key)
                        list.push({key:obj[i].key,name:obj[i].name})
                    }
                }
                _vm.splitObj.value0 = ''
                _vm.splitObj.value1 = ''
                _vm.splitObj.type = '0'
                //_vm.vehicleObj.list = []
                if(_vm.route_price_type == '1'){}
                else if(_vm.route_price_type == '0'){
                    _vm.vehicleObj.list=list
                }
                else if(_vm.route_price_type == '2'){
                    array.forEach(function(x){
                        let item = x.split('_')
                        if(item[1].indexOf('weight')>-1){
                            if(item[3]!=99999999){
                                _vm.splitObj.value0 += item[3]+','
                            }
                        }
                        else if(item[1].indexOf('cube')>-1){
                            if(item[3]!=99999999){
                                _vm.splitObj.value1 += item[3]+','
                            }
                        }   
                    })
                    let str0=_vm.splitObj.value0;
                    let str1=_vm.splitObj.value1;
                    if(str0[str0.length-1]==','){
                        _vm.splitObj.value0=str0.substring(0,str0.length-1)
                    }
                    if(str1[str1.length-1]==','){
                        _vm.splitObj.value1=str1.substring(0,str1.length-1)
                    }
                }
            },
            //根据返回数据设置表格头部
            setColums (obj){
                let _vm = this
                _vm.columns=[
                    {type: 'selection', width: 60, align: 'center'},
                    {title: '始发地城市',key: 'from_city', width : 170}, 
                    {title: '目的地城市',key: 'to_city', width :170 },
                ];
                obj.forEach(function(x){
                    let data={'title':x.name,'key':x.key,width:140,render: (h,params)=>{
                        let key= x.key
                        let value=params.row[key]?params.row[key]:'0'
                        return h('div',[h('i-input',{
                            props:{
                                value,
                            },
                            on: {
                                'on-blur': function (e){
                                    _vm.changehandle(e,params.row.route_id,key)
                                },
                            },
                        })])
                    }
                    }
                    _vm.columns.push(data)
                })
                let hours={title: '运输时间(小时)',key: 'trans_hours', width :240 ,render: (h,params)=>{
                    let value=params.row.trans_hours
                    value=value?value:''
                    return h('div',[h('i-input',{
                        props:{
                            value,
                        },
                        on: {
                            'on-blur': function (e){
                                _vm.changehandle(e,params.row.route_id,'trans_hours')
                            },
                        },
                    })])
                }}
                _vm.columns.push(hours)
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
            changehandle(e,id,key){
                e=typeof e=='string'?e:e.target.value
                let array = this.tableParams.list
                let i = this.getListIndex('route_id',id)
                array[i][key]=e;
            },
            dataFormat(e){
                let data = {},
                    routeObj=[];
                data.act_user_id = this.userInfo.user_id;
                data.pm_id = this.pm_id;
                data.from_city = e.from_city
                data.from_code = e.from_code
                data.to_city = e.to_city
                data.to_code = e.to_code
                data.trans_hours = e.trans_hours
                this.columns.forEach(function(item,i){
                    let priceObj={}
                    if(i!=0 && item.key!='from_city' && item.key!='to_city' && item.key!='trans_hours'){
                        priceObj.key=item.key
                        priceObj.name=item.title
                        priceObj.val=e[item.key]?e[item.key]:'0'
                        routeObj.push(priceObj)
                    }
                })
                data.route_price=JSON.stringify(routeObj)
                return data
            },
            getListIndex(key,value){
                let array = this.tableParams.list
                for(let i=0,length=array.length;i<length;i++){
                    if(array[i][key] == value){
                        return i
                        break
                    }
                }
            },
            routeSubmit(){
                let vm = this
                let array = this.tableParams.list
                if(vm.pm_bulk=='1' && vm.ltlData.length==2  && vm.vehicleObj.list.length==0){
                    return vm.$Message.error("请选择车型！")
                }
                for(let i=0,length=array.length;i<length;i++){
                    let item=this.dataFormat(array[i])
                    item.pm_id = vm.pm_id
                    if(array[i].route_id.indexOf('route_add_id')>-1){
                        addPriceRoute(item).then(json=>{})
                    }
                    else{
                        item.route_id=array[i].route_id
                        editPriceRoute(item).then(json=>{})
                    }
                }
                setTimeout(()=>{
                    vm.onSearch()
                },500)
            }
        },
    }
        
</script>
