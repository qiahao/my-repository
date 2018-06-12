<template lang="html">
    <div>
        <!-- 运单信息 -->
        <detail-modal v-model="detailShow" style="width: 900px;" @on-detail-close="close">
            <div slot="head">车次详情</div>
            <div slot="default">
                <div>
                    <span class="fs26">{{datailReturnData.send_area_p}}</span>
                    <span class="fs16">{{datailReturnData.send_area_c}}</span>
                    <img src="/static/images/common/lineto-icon.png">
                    <span class="fs26">{{datailReturnData.arrive_area_p}}</span>
                    <span class="fs16">{{datailReturnData.arrive_area_c}}</span>
                    <span>{{datailReturnData.trip_length}}km</span>
                </div>
                <Row>
                    <Col span="6">
                        <span>车次号：{{datailReturnData.trip_no}}</span>
                    </Col>
                    <Col span="4">
                        <span>车次状态：{{datailReturnData.trip_state_str}}</span>
                    </Col>
                    <Col span="6">
                        <span>司机：{{datailReturnData.driver_name}} {{datailReturnData.driver_mobile}}</span>
                    </Col>
                    <Col span="6">
                         <span>配载率：{{datailReturnData.trip_load}}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span="10">
                        <span>
                            车辆信息：{{datailReturnData.truck_plate}} {{datailReturnData.truck_length}}米 {{datailReturnData.truck_type}} {{datailReturnData.truck_weight}}吨
                        </span>
                    </Col>
                    <Col span="14" v-show="datailReturnData.is_self_trip=='Y'">
                         <span>备注：{{datailReturnData.remark}}</span>
                    </Col>
                </Row>
                <Row v-show="datailReturnData.is_self_trip=='Y'">
                    <Col span="18">
                        <span>
                            车次运费：{{datailReturnData.pay_detail_str}}
                        </span>
                    </Col>
                    <Col span="4">
                         <a @click='openEditPage'>查看/修改</a> 
                    </Col>
                </Row>


                <!-- 运单信息 -->
                <Tabs value="loadOrderList">
                    <Tab-pane label="配载运单" name="loadOrderList">
                        <div class="mb10">
                            <i-button type="primary" @click="cancelAssign">取消配载</i-button>
                            <i-button type="primary" @click="tripCancel">取消车次</i-button>
                            <i-button type="primary" @click="tripSend">确认发车</i-button>
                            <i-button type="primary" @click="tripArrive">确认到车</i-button>
                            <i-button type="primary" @click="handlerPrintTrip">打印车次</i-button>
                            <i-button type="primary" @click="handlerExportTripOrders">导出运单</i-button>
                        </div>

                        <i-table :data="tableParams.list" :columns="columns" @on-selection-change="onSelectionChange" class="print-scale"></i-table>
                 
                    </Tab-pane>

                    <!-- 地图轨迹 -->
                    <Tab-pane label="地图轨迹" name="mapMsg">
                        <el-amap :center="center" :map-manager="amapManager" :zoom="zoom" :plugin="plugins" style="height:550px; width: 100%;">
                        </el-amap>
                    </Tab-pane>

                    <!-- 物流跟踪 -->
                    <Tab-pane label="物流跟踪" name="followMsg">
                        <Row class="time-line" v-for="(item,index) in follows" :key="index">
                            <i-col :span="4" class="time-line-time">{{item.op_time | dateFormat('YYYY-MM-DD') }}<br/>{{item.op_time | dateFormat('HH:mm') }}</i-col>
                            <i-col :span="20">{{item.content}}</i-col>
                            <i class="s"></i>
                        </Row>
                    </Tab-pane>

                    <!-- 操作记录 -->
                    <Tab-pane label="操作记录" name="actionMsg">
                        <Row class="time-line" v-for="(item,index) in logs" :key="index">
                            <i-col :span="4" class="time-line-time">{{item.date_str}}<br>{{item.time_str}}</i-col>
                            <i-col :span="4">{{item.user_name}}</i-col>
                            <i-col :span="16">{{item.content}}</i-col>
                            <i class="s"></i>
                        </Row>
                    </Tab-pane>

                    <!-- 操作记录 -->
                    <Tab-pane label="投保详情" name="insureDetail" v-if="isXHS">
                        <!-- 投保详情 -->
                        <insure-detail ref="insureDetail" :trip-id="id"></insure-detail>
                    </Tab-pane>
                </Tabs>
            </div>
        </detail-modal>


        <!-- 编辑弹框 -->
        <Modal  v-model="editModal.modal" ref="editTripModel" title="修改" @on-ok="saveEditMsg" width="1000">
            <Form ref="editTripForm" :model="editModal.modalData" :label-width="100">
                <Form-item label="到站地址：">
                    <Select v-model="editModal.modalData.arrive_company_id">
                        <Option value="0" >直达</Option>
                        <Option v-for="item in companyList" :value="item.partener_id" :key="item">{{ item.company_name }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="运费：">
                    <i-input v-model="editModal.modalData.fee"  placeholder="输入运费" style="width:120px"></i-input>
                    <Radio-group class="ml20" v-model="editModal.modalData.pay_method">
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
                </Form-item>
                <div class="cf-all">
                    <Row>
                        <Col span="5" v-show="editModal.modalData.pay_method==0 || editModal.modalData.pay_method==4" class="mr15">
                            <Form-item label="现付现金：">
                                <i-input v-model="editModal.modalData.payDetailData.pay_cash"  placeholder="请输入现金" style="width:100px"></i-input>  
                            </Form-item>
                        </Col>
                        <Col span="4" v-show="editModal.modalData.pay_method==0 || editModal.modalData.pay_method==4" class="mr15">
                            <Form-item label="现付油卡：">
                                <i-input v-model="editModal.modalData.payDetailData.pay_oil"  placeholder="请输入油卡" style="width:100px"></i-input>  
                            </Form-item>
                        </Col>
                        <Col span="4" v-show="editModal.modalData.pay_method==1 || editModal.modalData.pay_method==4" class="mr15">
                            <Form-item label="到付：">
                                <i-input v-model="editModal.modalData.payDetailData.pay_arrive"  placeholder="请输入到付" style="width:100px"></i-input>  
                            </Form-item>
                        </Col>
                        <Col span="4" v-show="editModal.modalData.pay_method==2 || editModal.modalData.pay_method==4" class="mr15">
                            <Form-item label="回单付：">
                                <i-input v-model="editModal.modalData.payDetailData.pay_back"  placeholder="请输入回单付" style="width:100px"></i-input>  
                            </Form-item>
                        </Col>
                        <Col span="4" v-show="editModal.modalData.pay_method==3 || editModal.modalData.pay_method==4">
                            <Form-item label="月结：">
                                <i-input v-model="editModal.modalData.payDetailData.pay_month" placeholder="请输入月结" style="width:100px"></i-input>  
                            </Form-item>
                        </Col>

                    </Row>
                </div>
                <Form-item label="备注：" >
                    <i-input type="textarea" v-model="editModal.modalData.remark" placeholder="请输入备注" ></i-input>
                </Form-item>
            </Form>
            <div slot="footer">
                <i-button   @click="cancelEdit">取消</i-button>
                <i-button type="primary"  @click="saveEditMsg">确定</i-button>
            </div>
        </Modal>
        
        
    </div>
</template>
<script>
    import { getCurDate} from '@/utils/util'
    import { mapState } from 'vuex'
    import tableMixin from '@/mixins/tableMixin'
    import detailModal from '@/common/detail-modal'
    import detailMixin from '@/mixins/detail-mixin.js'
    import emitter from '@/mixins/emitter.js'
    import * as constants from './constant.js'
    import {printTrip} from '@/common/print-lodop'

    import insureDetail from '../components/trip-insure-detail'
    


    import { AMapManager } from 'vue-amap';
    let amapManager = new AMapManager();
    export default {
        name: 'tripDetailModal',
        data:function(){
             return {
                user:'',
                columns: constants.getColumns.call(this),
                // columnsPrint: constants.getPrintColumns.call(this),
                datailReturnData: {...constants.datailReturnData},
                logs:null,
                follows:null,
                editModal: {
                    modal: false,
                    modalData: {
                        fee:'',
                        trip_id: '',
                        trip_state: '',
                        is_b2c: '',
                        pay_method: '',
                        send_company_id: '',
                        arrive_company_id: '',
                        remark: '',
                        create_user_id: '',
                        pay_detail:'',
                        payDetailData:{
                            pay_month:'',
                            pay_back:'',
                            pay_arrive:'',
                            pay_oil:'',
                            pay_cash:'',
                        },
                        
                    }
                },
                companyList:null,
                //地图相关
                zoom: 12,
                center: [119.527875, 25.959757],
                amapManager: amapManager,
                map: null,
                mapRoadPoint: [],
                plugins: [ {
                    pName: 'AMap.Geolocation',
                    events: {
                        init(o) {
                            let _vm = this
                            o.getCurrentPosition((status, result) => {
                                if (result && result.position) {
                                    _vm.center = [result.position.lng, result.position.lat]
                                }
                            });
                        }
                    }
                }],

             }
        },
        created(){
            this.user = this.userInfo
        },
        mixins: [tableMixin,detailMixin,emitter],
        components: {
            detailModal,
            insureDetail
        },
        computed:{
            ...mapState(['userInfo']),
            
            isXHS (){
                const xhsCompanyId = 'cd9bbbb2-80d5-42f0-9696-dcddf49588d3'
                return this.userInfo && this.userInfo.company_id == xhsCompanyId
            },
		},
        watch: {},
        methods :{
            init () {
                this.loadDetail()
            },
            //载入详情数据和配载运单列表
            loadDetail(){
                let _vm = this;
                this.$api.tripApi.getTripDetailMsg({trip_id:this.id}).then((data)=>{
                    _vm.datailReturnData = data.resultObj;
                    _vm.datailReturnData.orders = _vm.datailReturnData.orders || []

                    _vm.tableParams.list = _vm.datailReturnData.orders;
                    let sendArea = data.resultObj.send_area.split("-");
                    _vm.setArrData("send",sendArea,data.resultObj.send_area);
                    let arriveArea = data.resultObj.arrive_area.split("-");
                    _vm.setArrData("arrrive",arriveArea,data.resultObj.send_area);
                
                    _vm.datailReturnData.pay_details=data.resultObj.pay_detail;
                    
                    _vm.setPayData(_vm.datailReturnData.pay_details);
                    _vm.loadList();
                    _vm.loadMapMsg(data.resultObj.truck_plate,data.resultObj.send_time?data.resultObj.send_time:getCurDate(),data.resultObj.arrive_time?data.resultObj.arrive_time:getCurDate());
                    let dshk='';
                    let df='';
                    _vm.tableParams.list.forEach(function(x){
                        dshk+=x.fee_dshk;
                        df+=x.pay_df;
                    })
                    _vm.datailReturnData.fee_dshk=dshk;
                    _vm.datailReturnData.pay_df=df;

                    console.log('datailReturnData',this.datailReturnData)
                });
            },
            //载入物流跟踪和操作记录
            loadList(){
                let _vm = this;
                let user = this.userInfo
                _vm.logs = null;
                _vm.follows = null;
                this.$api.tripApi.getTripActLog({trip_id:this.id,act_user_id:user.user_id}).then((data)=>{
                    _vm.logs = data.resultObj;
                });
                this.$api.tripApi.getTripFollow({trip_id:this.id}).then((data)=>{
                    _vm.follows = data.resultObj;
                });
            },
            //载入地图轨迹相关
            loadMapMsg(truckPlate,beginTime,endTime){
                let map = amapManager.getMap();
                // 构造路线导航类
                var driving = new AMap.Driving({
                    map: map
                });
                // 清空图层和数据
                map.clearMap();
                this.mapRoadPoint = null;
                this.mapRoadPoint = [];

                let user = this.userInfo
                let params = {vehicle_no: truckPlate, loc_time_begin: beginTime, loc_time_end: endTime, pattern: "GD"}
                /*let params = {vehicle_no: "闽C34128", loc_time_begin: "2017-04-01 00:00:00", loc_time_end: "2017-07-01 00:00:00", pattern: "GD"}*/
                
                this.$api.tripApi.getTripTrace(params).then((data)=>{
                    this.mapRoadPoint = data.resultObj;
                    var startPoint = this.mapRoadPoint[this.mapRoadPoint.length-1];
                    var endPoint = this.mapRoadPoint[0];
                    var waypoints = [];
                    for (var i = this.mapRoadPoint.length - 2; i >= 1; i--) {
                        var point = this.mapRoadPoint[i];
                        if (point) {
                            waypoints.push([point.lng, point.lat]);
                        }
                    }
                    this.drawLoadLine(driving,startPoint,endPoint,waypoints);

                })
            },
            drawLoadLine(driving,startPoint,endPoint,waypoints){
                // 根据起终点经纬度规划驾车导航路线
                if (startPoint && endPoint 
                    && startPoint.lng && startPoint.lng!='' 
                    && endPoint.lng && endPoint.lng!='') {
                    driving.search(new AMap.LngLat(startPoint.lng, startPoint.lat), new AMap.LngLat(endPoint.lng, endPoint.lat),{waypoints: waypoints});
                }
            },
            //地区展示调整
            setArrData(type,arr,allAreaStr){
                let _this=this;
                if (type == "send") {
                    if(arr.length == 3){
                        _this.datailReturnData.send_area_p = arr[1];
                        _this.datailReturnData.send_area_c = arr[2];
                    }else if(arr.length == 2){
                        _this.datailReturnData.send_area_p = arr[0];
                        if(arr[0] == arr[1]){
                            _this.datailReturnData.send_area_c = "";
                        }else{
                            _this.datailReturnData.send_area_c = arr[1];
                        }
                    }else if(arr.length == 1){
                        _this.datailReturnData.send_area_p = arr[0];
                        _this.datailReturnData.send_area_c = "";
                    }else{
                        _this.datailReturnData.send_area_p = allAreaStr;
                        _this.datailReturnData.send_area_c = "";
                    }
                }else{
                    if(arr.length == 3){
                        _this.datailReturnData.arrive_area_p = arr[1];
                        _this.datailReturnData.arrive_area_c = arr[2];
                    }else if(arr.length == 2){
                        _this.datailReturnData.arrive_area_p = arr[0];
                        if(arr[0] == arr[1]){
                            _this.datailReturnData.arrive_area_c = "";
                        }else{
                            _this.datailReturnData.arrive_area_c = arr[1];
                        }
                    }else if(arr.length == 1){
                        _this.datailReturnData.arrive_area_p = arr[0];
                        _this.datailReturnData.arrive_area_c = "";
                    }else{
                        _this.datailReturnData.arrive_area_p = allAreaStr;
                        _this.datailReturnData.arrive_area_c = "";
                    }
                }
            },
            //费用详情解析
            setPayData(json){
                let _vm=this;
                _vm.datailReturnData.pay_detail_str = "";
                if("pay_cash" in json && json.pay_cash != ""){
                    _vm.datailReturnData.pay_detail_str += "￥"+json.pay_cash+"(现付现金) ";
                }
                if("pay_oil" in json && json.pay_oil != ""){
                    _vm.datailReturnData.pay_detail_str += "￥"+json.pay_oil+"(现付油卡) ";
                }
                if("pay_arrive" in json && json.pay_arrive != ""){
                    _vm.datailReturnData.pay_detail_str += "￥"+json.pay_arrive+"(到付) ";
                }
                if("pay_back" in json && json.pay_back != ""){
                    _vm.datailReturnData.pay_detail_str += "￥"+json.pay_back+"(回单付) ";
                }
                if("pay_month" in json && json.pay_month != ""){
                    _vm.datailReturnData.pay_detail_str += "￥"+json.pay_month+"(月结) ";
                }
            },
            //打开查看编辑弹窗
            openEditPage(){
                this.$api.tripApi.getTripNextCompanyList({}).then((data)=>{//设置网点下拉框
                    this.companyList = data.resultObj.list;
                    this.$api.tripApi.getTripPayMsg({trip_id:this.id}).then((data)=>{//获取信息
                        this.setPayDetailData(data.resultObj);//回填信息
                        this.editModal.modal = true;
                        this.$refs.editTripForm.resetFields();
                    });
                });
            },
            //回填信息
            setPayDetailData(obj){
                let _vm=this;
                _vm.editModal.modalData.fee = (obj.fee==null || obj.fee=="")?"":obj.fee;
                _vm.editModal.modalData.trip_id = (obj.trip_id==null || obj.trip_id=="")?"":obj.trip_id;
                _vm.editModal.modalData.trip_state = (obj.trip_state==null || obj.trip_state=="")?"":obj.trip_state;
                _vm.editModal.modalData.is_b2c = (obj.is_b2c==null || obj.is_b2c=="")?"":obj.is_b2c;
                _vm.editModal.modalData.pay_detail = (obj.pay_detail==null || obj.pay_detail=="")?"":obj.pay_detail;
                _vm.editModal.modalData.pay_method = (obj.pay_method==null || obj.pay_method=="")?"":obj.pay_method;
                _vm.editModal.modalData.send_company_id = (obj.send_company_id==null || obj.send_company_id=="")?"":obj.send_company_id;
                if(_vm.editModal.modalData.is_b2c=="Y"){
                    _vm.editModal.modalData.arrive_company_id='0';
                }
                else{
                    _vm.editModal.modalData.arrive_company_id = (obj.arrive_company_id==null || obj.arrive_company_id=="")?"":obj.arrive_company_id;
                }
                _vm.editModal.modalData.remark = (obj.remark==null || obj.remark=="")?"":obj.remark;
                _vm.editModal.modalData.create_user_id = (obj.create_user_id==null || obj.create_user_id=="")?"":obj.create_user_id;
                let json =  obj.pay_detail
                if (typeof json == 'string') {
                    json = JSON.parse(json)
                }
                if("pay_cash" in json && json.pay_cash != ""){
                    _vm.editModal.modalData.payDetailData.pay_cash = json.pay_cash;
                }else{
                    _vm.editModal.modalData.payDetailData.pay_cash = "";
                }
                if("pay_oil" in json && json.pay_oil != ""){
                    _vm.editModal.modalData.payDetailData.pay_oil = json.pay_oil;
                }else{
                    _vm.editModal.modalData.payDetailData.pay_oil = "";
                }
                if("pay_arrive" in json && json.pay_arrive != ""){
                    _vm.editModal.modalData.payDetailData.pay_arrive = json.pay_arrive;
                }else{
                    _vm.editModal.modalData.payDetailData.pay_arrive = "";
                }
                if("pay_back" in json && json.pay_back != ""){
                    _vm.editModal.modalData.payDetailData.pay_back = json.pay_back;
                }else{
                    _vm.editModal.modalData.payDetailData.pay_back = "";
                }
                if("pay_month" in json && json.pay_month != ""){
                    _vm.editModal.modalData.payDetailData.pay_month = json.pay_month;
                }else{
                    _vm.editModal.modalData.payDetailData.pay_month = "";
                }    
            },
            cancelEdit(){
                this.editModal.modal=false
            },
            //保存修改
            saveEditMsg(){
                let _vm=this;
                if(_vm.editModal.modalData.trip_state != 0 && _vm.editModal.modalData.trip_state != '0'){
                    this.editModal.modal = true
                    this.$refs.editTripModel.visible = true
                    _vm.$Message.warning('只有待发车车次才能进行修改！');
                }else{
                    let total = 0;
                    //构建付款详情json和fee总数components/trip/detail/index.vue
                    switch(_vm.editModal.modalData.pay_method){
                    case '0':
                        total = Number(_vm.editModal.modalData.payDetailData.pay_cash) + Number(_vm.editModal.modalData.payDetailData.pay_oil);
                        _vm.editModal.modalData.pay_detail = '{"pay_cash":"' + _vm.editModal.modalData.payDetailData.pay_cash + '","pay_oil":"' +_vm.editModal.modalData.payDetailData.pay_oil + '"}';
                        break;
                    case '1':
                        total = Number(_vm.editModal.modalData.payDetailData.pay_arrive);
                        _vm.editModal.modalData.pay_detail = '{"pay_arrive":"' + _vm.editModal.modalData.payDetailData.pay_arrive + '"}';
                        
                        break;
                    case '2':
                        total = Number(_vm.editModal.modalData.payDetailData.pay_back);
                        _vm.editModal.modalData.pay_detail = '{"pay_back":"' + _vm.editModal.modalData.payDetailData.pay_back + '"}';
                        break;
                    case '3':
                        total = Number(_vm.editModal.modalData.payDetailData.pay_month);
                        _vm.editModal.modalData.pay_detail = '{"pay_month":"' + _vm.editModal.modalData.payDetailData.pay_month + '"}';
                        break;
                    case '4':
                        total = Number(_vm.editModal.modalData.payDetailData.pay_cash) + Number(_vm.editModal.modalData.payDetailData.pay_oil) + Number(_vm.editModal.modalData.payDetailData.pay_arrive) + Number(_vm.editModal.modalData.payDetailData.pay_back) + Number(_vm.editModal.modalData.payDetailData.pay_month);
                        _vm.editModal.modalData.pay_detail = '{"pay_cash":"' + _vm.editModal.modalData.payDetailData.pay_cash + '","pay_oil":"' +_vm.editModal.modalData.payDetailData.pay_oil + '","pay_arrive":"' +_vm.editModal.modalData.payDetailData.pay_arrive + '","pay_back":"' +_vm.editModal.modalData.payDetailData.pay_back + '","pay_month":"' +_vm.editModal.modalData.payDetailData.pay_month + '"}';
                        break;
                    }
                    if(Number(_vm.editModal.modalData.fee)!=total){
                        return this.$Message.error("运费与支付金额不一致！"); 
                    }
                    _vm.editModal.modalData.fee = total;
                    if(_vm.editModal.modalData.arrive_company_id==0){
                        _vm.editModal.modalData.is_b2c="Y";
                    }
                    else{
                        _vm.editModal.modalData.is_b2c="N";
                    }
                    this.$api.tripApi.setTripPayMsg(_vm.editModal.modalData).then((data)=>{//保存信息
                        if("1" == data.result){
                            this.$Message.success("修改成功！"); 
                            this.loadDetail();
                            this.editModal.modal=false
                        }else{
                            this.$Message.error("修改失败！原因："+data.resultInfo); 
                        }
                    });
                }
            },
            // 取消配载
            cancelAssign (){
                let orderIds, tripState, tripId = this.id;
                if (this.datailReturnData.is_self_trip != 'Y') {
                    return this.$Message.info('不是本网点车次，不能进行取消配载操作')
                }
                if (this.datailReturnData.trip_state == '2') {
                    return this.$Message.info('该车次已到车，不能进行取消配载操作')
                }
                if (this.tableParams.list.length == 1) {
                    orderIds = this.tableParams.list[0].order_id
                }else if(this.tableParams.selectList.length == 0){
                    return this.$Message.info('请选择要取消配载的运单')
                }else{
                    orderIds = this.tableParams.selectList.map((item)=> item.order_id).join(',')
                }

                this.$Modal.confirm({
                    title: '确认提示',
                    content: '是否确认取消配载？',
                    onOk: () => {
                        let params = {trip_id: tripId, order_ids: orderIds }
                        this.$api.tripApi.cancelAssign(params).then((data)=>{
                            bus.$emit('trip-list-reload')
                            this.$router.push({name: 'tripV1List'})
                        })
                    }
                })
                
            },
            tripCancel(){
                this.dispatch('trip-cancel', this.datailReturnData)
            },
            tripSend(){
                this.dispatch('trip-send', this.datailReturnData)
            },
            tripArrive(){
                this.dispatch('trip-arrive', this.datailReturnData)
            },
            // 打印车次
            handlerPrintTrip(){
                let orderList = this.tableParams.selectList && this.tableParams.selectList.length ? [...this.tableParams.selectList] : this.datailReturnData.orders
                
                printTrip({
                    data: this.datailReturnData,
                    orderList: orderList
                })
            },

            // 导出车次运单列表
            handlerExportTripOrders () {
                let params = {
                    company_id: this.userInfo.company_id,
                    trip_id: this.id
                }
                this.$api.tripApi.exportTripOrders(params)
            },
            // 关闭
            close(){
                setTimeout(()=>{
                    this.$router.push({name: 'tripV1List'})
                },300)
            },

            // 列表通知更新事件
            // 更新投保详情
            reloadInsureDetail (){
                this.$refs.insureDetail.loadInsureDetail()
            }
            
        },
        mounted () {
            // 投保详情 触发投保 => 通知 列表进行投保操作
            this.$on('trip-detail-insure', () => {
                this.dispatch('trip-insure', this.id)
            })
        }
    }
        
</script>

