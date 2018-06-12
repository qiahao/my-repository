<template lang="html">
<div class="tmp-to-driver">
    <Form  :label-width="90"   ref="driverSubmitData" :model="driverSubmitData" :rules="driver_rule">
        <Form-item label="到站地址" class="mt15" prop="arrive_company_id" style="width:610px;z-index:20">
            <Select v-model="driverSubmitData.arrive_company_id" style="width:520px;">
                <Option value>请选择到站网点</Option>
                <Option value="0">直达</Option>
                <Option v-for="item in stationList" :value="item.partener_id" :key="item">{{ item.company_name}}</Option>
            </Select>
        </Form-item>
        
        <Form-item label="选择司机"  prop="driver_id" style="width:610px;">
            <div  class="driver-list-content">
                <div v-show='model.showDriverlist' class="driver-search-list" id="driver_search_list">
                    <div style="padding:10px">
                        <i-input v-model="driverQueryData.key" placeholder="根据联系人、手机号等进行搜索" style="width: 200px"></i-input>
                        <label class="ml20 mr5">车型</label><Select style="width:120px" v-model="driverQueryData.truck_type">
                            <Option value='-1'>不限</Option>
                            <Option v-for="item in truckType" :value="item.dict_value" :key="item">{{item.dict_text}}</Option>
                        </Select>
                        <label class="ml20 mr5">车长</label><Select style="width:120px" v-model="driverQueryData.truck_length">
                            <Option value='-1'>不限</Option>
                            <Option v-for="item in truckLength" :value="item.dict_value" :key="item">{{item.dict_text}}</Option>
                        </Select>
                        <label class="ml20 mr5">状态</label><Select style="width:120px" v-model="driverQueryData.truck_state">
                            <Option value='-1'>不限</Option>
                            <Option value="0">空车中</Option>
                            <Option value="1">待发车</Option>
                        </Select>
                        <Button class="ml20 mr5" type="primary" @click="driverListFilter">搜索</Button>
                    </div>
                    <i-table class="small-table"  size='small' stripe :columns="driverListColumns1" :data="driverList" @on-row-click="deiverChange"></i-table>
                    <div class='list-page-footer'>
                        <div style="float:left">
                            <span>共{{drivernum}}名司机</span>
                        </div>
                        <div style="float: right;">
                            <Page :page-size="4" :total="drivernum"  @on-change="changedriverPage"> </Page>
                        </div>
                    </div>
                </div>
            </div>
            <div @click="showDrivers" style="width:520px;position:relative">
                
                <Select v-model="driverSubmitData.driver_id" >
                    <Option :value="driverSubmitData.driver_id">{{drivername}}</Option>
                </Select>
                <span style="position:absolute;left:10px;top:2px;">{{drivername}}</span>
            </div>
        </Form-item>
        <Row>
            <Col  span="6">
                <Form-item label="运费" prop="fee"  style="width:210px;">
                    <i-input v-model="driverSubmitData.fee"  placeholder="请输入运费" style="width:120px"></i-input>  
                </Form-item>
            </Col>
            <Col span="12">
                <Radio-group class="ml20 mt5" v-model="driverSubmitData.pay_method">
                    <Radio label="0">
                        <span>现付</span>
                    </Radio>
                    <Radio label="1">
                        <span>到付</span>
                    </Radio>
                    <Radio label="2">
                        <span>回单付</span>
                    </Radio>
                    <Radio label="3">
                        <span>月结</span>
                    </Radio>
                    <Radio label="4">
                        <span>多笔付</span>
                    </Radio>
                    
                </Radio-group>
            </Col>
        </Row>    
        
        <div class="cf-all">
            <Row>
                <Col span="4" v-show="driverSubmitData.pay_method==0 || driverSubmitData.pay_method==4" class="mr15">
                    <Form-item label="现付现金">
                        <i-input v-model="driverSubmitData.pay_details.pay_cash"  placeholder="请输入现金" style="width:100px"></i-input>  
                    </Form-item>
                </Col>
                <Col span="4" v-show="driverSubmitData.pay_method==0 || driverSubmitData.pay_method==4" class="mr15">
                    <Form-item label="现付油卡">
                        <i-input v-model="driverSubmitData.pay_details.pay_oil"  placeholder="请输入油卡" style="width:100px"></i-input>  
                    </Form-item>
                </Col>
                <Col span="4" v-show="driverSubmitData.pay_method==1 || driverSubmitData.pay_method==4" class="mr15">
                    <Form-item label="到付">
                        <i-input v-model="driverSubmitData.pay_details.pay_arrive"  placeholder="请输入到付" style="width:100px"></i-input>  
                    </Form-item>
                </Col>
                <Col span="4" v-show="driverSubmitData.pay_method==2 || driverSubmitData.pay_method==4" class="mr15">
                    <Form-item label="回单付">
                        <i-input v-model="driverSubmitData.pay_details.pay_back"  placeholder="请输入回单付" style="width:100px"></i-input>  
                    </Form-item>
                </Col>
                <Col span="4" v-show="driverSubmitData.pay_method==3 || driverSubmitData.pay_method==4">
                    <Form-item label="月结">
                        <i-input v-model="driverSubmitData.pay_details.pay_month" placeholder="请输入月结" style="width:100px"></i-input>  
                    </Form-item>
                </Col>

            </Row>
        </div>
        <Form-item label="备注" >
            <i-input type="textarea" v-model="driverSubmitData.remark" placeholder="请输入备注" ></i-input>
        </Form-item>
        
    </Form>
    
</div>    
</template>

<script>   
	import { utilCookie } from '@/utils/util'
	import { mapState } from 'vuex'
    import {getCompanyList,getDriverList,tripCreate } from '@/api/src/waybillApi'
    import *  as DICTS from '@/api/src/dictApi'
    const COMMON_PARAM_DRRIVER_LIST = [
        {
            title: '司机',
            key: 'driver_name',
            width:80
        },
        {
            title: '类型',
            key: 'truck_type',
            width:100
        },
        {
            title: '联系电话',
            key: 'driver_mobile',
            width:120
        },
        {
            title: '状态',
            key: 'truck_state',
            width:80
        },
        {
            title: '车牌号',
            key: 'truck_plate',
            width:100
        },
        {
            title: '车型',
            key: 'truck_type',
            width:100
        },
        {
            title: '车长',
            key: 'truck_length',
            width:70
        },
        {
            title: '常跑路线',
            key: 'driver_routes',
            width:227
        }
    ];
    //订单列表个格设置
    export default{
        props: {
			order_ids:''
		},
        data:function(){
             return {
                user:'',
                model:{
                    showDriverlist:false
                },
                driver_rule: {
                    arrive_company_id: [
                        { required: true, message: '这是必填项', trigger: 'change' }
                    ],
                    driver_id: [
                        { required: true, message: '这是必填项', trigger: 'change' },
                    ],
                    fee: [
                        { required: true, message: '这是必填项', trigger: 'change' }
                    ],
                },
                driverListColumns1: COMMON_PARAM_DRRIVER_LIST,
                driverQueryData:{
                    page_size:4,
                    page:1,
                    act_user_id:'',
                    key:'',
                    truck_length:'',
                    truck_type:'',
                    truck_state:''
                },
                //----到站网点数据
                stationList:'',
                //----司机列表数据
                driverList:[],
                //----司机数量
                drivernum:0,
                drivername:'',
                //----司机分配
                truckType:[],
                truckLength:[],
                //----司机提交数据
                driverSubmitData:{
                    send_company_id:'',
                    order_ids:'',
                    arrive_company_id:'',
                    driver_id:'',
                    is_b2c:'',
                    fee:'',
                    pay_method:'0',
                    create_user_id:'',
                    remark:'',
                    pay_detail:{
                        pay_cash:'',
                        pay_oil:'',
                        pay_arrive:'',
                        pay_back:'',
                        pay_month:'',
                    },
                    pay_details:{
                        pay_cash:'',
                        pay_oil:'',
                        pay_arrive:'',
                        pay_back:'',
                        pay_month:'',
                    },
                },
            }
        },
        created () {
            let _vm = this
            this.user = this.userInfo
            setTimeout(function(){
                _vm.getCompany();
                _vm.getDrivers();
                _vm.getderiverDicts();
            },3000)
            
        },
        computed:{
			...mapState(['userInfo']),
		},
        methods :{
            getCompany (){
                let _vm = this;
                getCompanyList({company_id:_vm.user.company_id}).then(json=>{
                    if(json.result==1){
                        _vm.stationList = json.resultObj.list;
                    }else{
                        _vm.$Message.error(json.resultInfo)
                    }
                })
            },
            //----司机列表
            getDrivers (){
                let _vm = this;
                _vm.driverQueryData.act_user_id = _vm.user.user_id;
                getDriverList(_vm.driverQueryData).then(json=>{
                    if(json.result==1){
                        _vm.driverList = json.resultObj.list;
                        _vm.drivernum = parseInt(json.resultObj.total);
                    }else{
                        _vm.$Message.error(json.resultInfo)
                    }
                })
            },
            //----司机列表页码变换
            changedriverPage (e){
                let _vm = this;
                _vm.driverQueryData.page=e;
                _vm.getDrivers()
            },
            //----司机列表筛选
            driverListFilter (){
                let _vm = this;
                _vm.getDrivers ()

            },
            //----点击列表择司机
            deiverChange (e){
                let _vm = this;
                _vm.model.showDriverlist = false;
                _vm.driverSubmitData.driver_id = e.driver_id;
                _vm.drivername = e.driver_name;

            },
            //----显示司机列表
            showDrivers (){
                let _vm = this;
                _vm.model.showDriverlist = _vm.model.showDriverlist?false:true;
            },
            //----获取字典
            
            getderiverDicts(){
                let _vm = this;
                DICTS.dictTruckLengthApi().then(json=>{
                    if(json.result==1){
                        _vm.truckLength = json.resultObj;
    
                    }else{
                        _vm.$Message.error(json.resultInfo)
                    }
                   
                });
                DICTS.dictTruckTypeApi().then(json=>{
                    if(json.result==1){
                        _vm.truckType = json.resultObj;
                    }else{
                        _vm.$Message.error(json.resultInfo)
                    }
                });
                
            },
            //----分配司机提交
            disbutetipSubmits (){
                let _vm=this;
                _vm.$refs['driverSubmitData'].validate((valid) => {
					if (valid) {
                        let o=_vm.driverSubmitData.pay_details;
                        let total;
                        switch(_vm.driverSubmitData.pay_method){
                            case '0':
                                total = Number(o.pay_cash) + Number(o.pay_oil);
                                _vm.driverSubmitData.pay_detail = '{"pay_cash":"' + o.pay_cash + '","pay_oil":"' +o.pay_oil + '"}';
                                break;
                            case '1':
                                total = Number(o.pay_arrive);
                                _vm.driverSubmitData.pay_detail = '{"pay_arrive":"' + o.pay_arrive + '"}';
                                
                                break;
                            case '2':
                                total = Number(o.pay_back);
                                _vm.driverSubmitData.pay_detail = '{"pay_back":"' + o.pay_back + '"}';
                                break;
                            case '3':
                                total = Number(o.pay_month);
                                _vm.driverSubmitData.pay_detail = '{"pay_month":"' + o.pay_month + '"}';
                                break;
                            case '4':
                                total = Number(o.pay_cash) + Number(o.pay_oil) + Number(o.pay_arrive) + Number(o.pay_back) + Number(o.pay_month);
                                _vm.driverSubmitData.pay_detail = '{"pay_cash":"' + o.pay_cash + '","pay_oil":"' +o.pay_oil + '","pay_arrive":"' +o.pay_arrive + '","pay_back":"' +o.pay_back + '","pay_month":"' +o.pay_month + '"}';
                                break;
                        }
                        if(_vm.driverSubmitData.arrive_company_id=="0"){
                            _vm.driverSubmitData.is_b2c="Y"
                        }
                        else{
                            _vm.driverSubmitData.is_b2c="N"
                        }
                        if (total != Number(_vm.driverSubmitData.fee)) {
                            _vm.$Message.error('运费和付款总和不相等！')
                            return;
                        }
                        _vm.driverSubmitData.send_company_id=_vm.user.company_id;
                        _vm.driverSubmitData.order_ids=_vm.order_ids
                        _vm.driverSubmitData.create_user_id=_vm.user.user_id;
                        tripCreate(_vm.driverSubmitData).then(json=>{
                            if(json.result==1){
                                _vm.$Message.success("运单分配成功！")
                                _vm.$emit("disbutetipSubmit",true)
                            }else{
                                _vm.$Message.error(json.resultInfo)
                            }
                        })
                    }
                    else{}
                })
                
            },
        },
    }
</script>
<style lang="scss" rel="stylesheet/scss">
  
</style>