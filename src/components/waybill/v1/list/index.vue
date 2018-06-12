<template lang="html">
    <div>
        <div  class='contain-head' v-show='selectedData.length==0'>
            <search-filter :list='conditionList' v-model="queryData.q_order_state"  @on-change="stateChange">
            </search-filter>
            <top-filter-select @reload="filterSelectChange" class="ml10"></top-filter-select>
            <div class="text-filter">
                <Date-picker type="daterange" v-model="queryTime" placeholder="选择开单日期" style="width:210px"></Date-picker>
            </div>
            <i-input v-model="queryData.q_keyword" placeholder="运单号、收货人、联系方式、货物" style="width:230px"></i-input>
            <Button type="primary" @click="search">查询</Button>
            <Button type="primary" @click="doSearchReset">重置</Button>  
        </div>
        <div v-show='selectedData.length>0'  class='contain-head'>
            <Button  type="primary" @click='distributetoDriver' v-show="!selectDel">
                分配司机
            </Button>
            <Button class='ml5' type="primary"  @click='distributeToFa' v-show="!selectDel&&selectedData.length===1">
                分配承运商
            </Button>
            <Button class='ml5' type="primary"  @click='distributeToMember' v-show="!selectDel&&selectedData.length===1">
                分配成员
            </Button>
            <Button class='ml5' type="success" @click='sign(0)' v-show="!selectDel&&selectedData.length===1">
                运单签收
            </Button>
            <Button class='ml5' type="success" @click='insure(0)' v-show="!selectDel&&selectedData.length===1">
                在线投保
            </Button>
            <Button class='ml5' type="warning" @click='del' v-show="!selectDel&&selectedData.length===1">
                运单作废
            </Button>
            <Button class='ml5' type="warning" @click='printOrder' v-show="!selectDel&&selectedData.length===1">
                运单打印
            </Button>
        </div>
        <div class="contain-main">
 
            <i-table 
                :columns="columns" 
                :data="isShowSelected?selectedData:soruceData"   
                @on-selection-change="selectChange"
                @on-row-click="rowClick"
                >
            </i-table>

            <div class='page-wrapper clearfix'>
                <div  style="float: left;"   v-show='selectedData.length>0'>
                    <label>总重量<span>{{cacultaeData[0].totalWeight}}</span>吨</label>
                    <label>总体积:<span>{{cacultaeData[0].totalVolume}}</span>&nbsp;方</label> 
                    <label>总运费:&nbsp;<span>{{cacultaeData[0].totalFee}}</span>元</label>
                    <label>总件数<span>{{cacultaeData[0].totalAmount}}</span></label>
                </div>           
                <div style="float: right;">
                    <Page :total="total" show-sizer show-total show-elevator
                        :current="curPage" 
                        @on-change="changePage" 
                        @on-page-size-change="changePageSize">
                    </Page>
                </div>
            </div>
        </div>
        <!-- 分配司机 -->
        <Modal
            v-model="model.modelDriver"
            title="分配司机"
            width="1000" class-name="vertical-center-modal">
            <Table :columns="driveColumns1" :data="cacultaeData"></Table>
            <order-driver :order_ids="order_ids" ref="drivercompent" @disbutetipSubmit="disbutetipSubmit"></order-driver>
            <div slot="footer">
                <Button   @click="hideModel('modelDriver')">取消</Button>
                <Button type="primary"  @click="disbutetipSubmit">确定</Button>
            </div>
        </Modal>
        <!--签收弹框-->
        <Modal
            v-model="model.modelSign"
            title="签收"
            width="800" class-name="vertical-center-modal">
            <Table size="small" :columns="signColumns" :data="signData"></Table>
            <order-sign @signSubmit="signSubmit" :order_id="order_id" ref="signcompent">
            </order-sign>
            <div slot="footer">
                <Button   @click="hideModel('modelSign')">取消</Button>
                <Button type="primary"  @click="signSubmit">确定</Button>
            </div>
        </Modal>
        <!-- 分配承运商 -->
        <Modal
            v-model="model.modelFacilitator"
            title="分配承运商"
            width="997" class-name="vertical-center-modal">
            <Table size="small" :columns="driveColumns1" :data="cacultaeData"></Table>
            <order-facilitator  @facilitatorSubmit="facilitatorSubmit" :order_id="order_id" ref="faciltatorcompent"></order-facilitator>
            <div slot="footer">
                <Button  @click="hideModel('modelFacilitator')">取消</Button>
                <Button type="primary"  @click="facilitatorSubmit">确定</Button>
            </div>
        </Modal>

        <!-- 分配成员 -->
        <Modal
            v-model="model.modelNbmber"
            title="分配成员"
            width="997" class-name="vertical-center-modal">
            <Table size="small" :columns="driveColumns1" :data="cacultaeData"></Table>
            <order-member  @memberSubmit="memberSubmit" :order_id="order_id" ref="membercompent"></order-member>
            <div slot="footer">
                <Button  @click="hideModel('modelNbmber')">取消</Button>
                <Button type="primary"  @click="memberSubmit">确定</Button>
            </div>
        </Modal>

         <!--投保弹框-->
         <Modal
            v-model="model.insureOrder"
            title="投保"
            width="1000" class-name="vertical-center-modal">
            <Form ref="insureData" :model="insureData" :rules="ruleValidate"  :label-width="120">
                <div class="cf-all mt15">
                    <Row>
                        <Col span="9"  class="">
                            <Form-item label="选择险种"  prop="product_type">
                                <Select v-model="insureData.product_type"  style="width:220px">
                                    <Option value="1">普通货物综合险</Option>
                                    <Option value="2">普通货物基本险</Option>
                                    <Option value="3">普通货物综合险（不含盗抢）</Option>
                                    <Option value="6">冷藏基本险</Option>
                                    <Option value="7">生鲜果蔬基本险</Option>
                                </Select>
                            </Form-item>
                        </Col>
                    </Row>
                    <Row>
						<Col span="11" class="pt5">
							<Form-item label="选择险种">
								<Radio-group v-model="insureData.holder_type">
									<Radio label="100" >
										<span>公司</span>
									</Radio>
									<Radio label="201">
										<span>个人</span>
									</Radio>
								</Radio-group>
							</Form-item>
						</Col>
						<Col span="9"  offset="1">
							<Row>
								<Form-item label="投保公司名称" prop="holder_name" >
									<i-input v-model="insureData.holder_name" placeholder="请输入公司名称" style="width: 220px"></i-input>
								</Form-item>
							</Row>
						</Col>
                    </Row>
                    <Row>
						<Col span="9">
							<Form-item label="投保联系人" prop="holder_link_name">
								<i-input v-model="insureData.holder_link_name" placeholder="请输入投保联系人姓名" style="width: 220px"></i-input>
							</Form-item>
						</Col>
						<Col span="9" offset="3">
							<Form-item label="联系方式" prop="holder_tel">
								<i-input v-model="insureData.holder_tel" placeholder="请输入联系电话" style="width: 220px"></i-input>
							</Form-item>
						</Col>
					</Row>
                    <Row>
						<Col span="11"  class="pt5">
							<Form-item label="被投险人类型">
								<Radio-group v-model="insureData.insure_type">
									<Radio label="100" >
										<span>公司</span>
									</Radio>
									<Radio label="201">
										<span>个人</span>
									</Radio>
								</Radio-group>
							</Form-item>					
						</Col>
						<Col span="9" offset="1">
							<Form-item label="被保险人名称" prop="insure_name">
								<i-input v-model="insureData.insure_name" placeholder="请输入实际货主名称" style="width: 220px"></i-input>
							</Form-item>
						</Col>
					</Row>
                    <Row>
		
						<Col span="8">
							<Form-item label="单证信息" prop="order_no">
								<i-input readonly v-model="insureData.order_no" placeholder="请输入发票号/提单号/运单号" style="width: 220px"></i-input>
							</Form-item>
						</Col>
                        <Col span="8">
                            <Form-item label="起运地" prop="departure_bad">
                                <province-cascader v-if="lazyload"   v-model="insureData.departure_bad"  style="width: 150px"></province-cascader>
                            </Form-item>
                        </Col>
                        <Col span="8">
                            <Form-item label="目的地" prop="departure_ead">
                                <province-cascader  v-if="lazyload"  v-model="insureData.departure_ead"  style="width: 120px"></province-cascader>
                                
                            </Form-item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="6">
							<Form-item label="货物名称" prop="goods_name">
								<i-input v-model="insureData.goods_name" placeholder="请输入货物名称" style="width: 120px"></i-input>
							</Form-item>
						</Col>
						<Col span="6">
							<Form-item label="包装类型" prop="pack_type">
								<Select v-model="insureData.pack_type"  style="width:150px">
									<Option value="101">托盘包装</Option>
									<Option value="201">捆包状包装</Option>
									<Option value="301">袋状包装</Option>
									<Option value="401">箱状包装</Option>
									<Option value="501">桶状包装</Option>
									<Option value="601">其他形状包装</Option>
									<Option value="701">裸状包装</Option>
								</Select>
							</Form-item>
							
						</Col>
                        <Col span="6">
							<Form-item label="件数" prop="amount">
								<i-input  v-model="insureData.amount" placeholder="请输入件数" style="width: 120px" class="no-slot-left">
									<span slot="append">件</span>
								</i-input>
							</Form-item>
						</Col>
						<Col span="6">
							<Form-item label="货物价值" prop="goods_value">
								<i-input  v-model="insureData.goods_value"  placeholder="请输入货物价值" style="width: 100px"></i-input>
							</Form-item>
						</Col>
                    </Row>
                    <Row>
						<Col span="9">
							<Form-item label="车牌号" prop="trans_no">
								<i-input v-model="insureData.trans_no" placeholder="请输入陆运车辆车牌号" style="width: 220px" @on-blur='transBlur'></i-input>
							</Form-item>
						</Col>
						<Col span="9"  offset="3">
							<Form-item label="起运日期" prop="expect_start_time">
								<Date-picker type="datetime" placement='top'  v-model="insureData.expect_start_time" placeholder="选择日期和时间" style="width: 220px;display:inline-block"></Date-picker>
							</Form-item>
						</Col>
					</Row>
                    <Row >
						<Col span="24">
							<Form-item label="">
								<Checkbox  v-model="insureData.isProtocol">我已阅读并同意<a href="./html/procotol.html" target="_blank">《保险条款》</a>请如实填写以上信息，并在核对无误后确认投保。</Checkbox>
							</Form-item>
						</Col>
						<Col span="12" style="display:none">
							<Form-item label="" >
								<Checkbox v-model="insureData.is_einvoice">是否需要电子发票</Checkbox>
							</Form-item>
						</Col>
					</Row>
                    
                </div>
            </Form>
            <div slot="footer">
                <Button    @click="hideModel('insureOrder')">取消</Button>
                <Button type="primary" :disabled="!insureData.isProtocol"  @click="insureSubmit">确定</Button>
            </div>
        </Modal>


        <!--待支付-->
        <Modal
            v-model="model.insureTopay"
            title="待支付"
            @on-ok="inusePay"
            width="600" class-name="vertical-center-modal">
            <div class="insure-modal-content">
                <p>您已投保：<span class="blue">{{insureedData.cargo_product}}</span></p>
                <p>订单号：{{insureedData.channel_order_no}}</p>
                <p> 投保人：{{insureedData.holder_name}}</p>
                <p>被保险人：{{insureedData.insure_name}}</p>
                <p>保险起止日期：{{insureedData.policy_start}}（起）{{insureedData.policy_end}}（止）
                </p>
                <p>保额：¥{{insureedData.coverage}}</p>
                <p>保费：¥{{insureedData.premium}}</p>
                <p class="blue">
                    <span class="require-icon">*</span>请在30分钟内完成支付
                </p>
            </div>
            <div slot="footer">
                <Button   @click="reInsure('')">重新投保</Button>
                <Button   @click="payfinish('')">支付完成</Button>
                <Button type="primary"  @click="inusePay('')">去支付</Button>
            </div>
        </Modal>

        <!--出单成功-->
        <Modal
            v-model="model.insureSucess"
            title="出单成功"
            width="800" class-name="vertical-center-modal">
            <div class="insure-modal-content">
                <p>
                    您已投保：<span class="blue">{{insureSucessData.product_name}}</span>
                </p>
                <p>
                    订单号：{{insureSucessData.channel_order_no}}
                </p>
                <p>
                    保订号：{{insureSucessData.policy_no}}
                </p>
                <p>
                    投保人：{{insureSucessData.holder_name}}
                </p>
                <p>
                    被保险人：{{insureSucessData.insure_name}}
                </p>
                <p>
                    保险起止日期：{{insureSucessData.policy_start}}（起）{{insureSucessData.policy_end}}（止）
                </p>
                <p>
                    保额：¥{{insureSucessData.coverage}}
                </p>
                <p>
                    保费：¥{{insureSucessData.premium}}
                </p>
                <p>
                    电子保单下载：<br><a :href="insureSucessData.epolicy_downloadlink" target="_blank">{{insureSucessData.epolicy_downloadlink}}</a>
                </p>
                <p v-if="insureSucessData.iseinvoice">
                    电子发票下载：<br><a :href="insureSucessData.einvoice_url" target="_blank">{{insureSucessData.einvoice_url}}</a>
                </p>
            </div>
        </Modal>
        <!--作废弹框-->
        <Modal
            v-model="model.modelDel"
            title="确认提示"
            width="300"
            @on-ok="delOk">
            <p>是否确定作废该运单？</p>
        </Modal>
        <order-detail  v-model="model.slideModal" :order_id="select_order_id" 
            :dsearch="search"
            :oninsurance="insure"
            :onpayfinish="payfinish"
            :oninusePay="inusePay"
            :onreInsure="reInsure"
            :insureStatus="insuranceState"
            @orderSign="sign"
            ></order-detail>
        
        <!--详情弹框--> 
        <div id="PrintContentDiv"  style="display:none">
            <order-print :printDatas='printData'  :order_id="order_id">
            </order-print>
        </div>

    </div>
  
   
</template>

<script>   
	import { getWaybillList,getWaybillDEL} from '@/api/src/waybillApi'
    import tableMixin from '@/mixins/tableMixin'
    import { insuerOrder,insurePay,insureLoad,insuerReorder,insuerInfo} from '@/api/src/insureApi'
	import { utilCookie,getArrayIds,print,getDateFormat ,subStringLimit} from '@/utils/util'
    import detail from './detail.vue'
    import listSign from './list-sign.vue'
    import listDriver from './list-driver.vue'
    import listFacilitator from './list-facilitator.vue'
    import listMember from './list-member.vue'
    import printComponent from '@/components/print/print.vue'
    import topFilterSelect from './top-filter-select.vue'
    import { mapState } from 'vuex'
    import * as CONST_TABLE from './tableColumn.js'
    import {INSURE_RULE} from './validate.js'
    import * as insureDatas from './insureData.js'
    
    var agent=navigator.userAgent.toLowerCase();
    const COMMON_SIGN_LIST = [
        {
            title: '运单号',
            key: 'order_no'
        },
        {
            title: '收货人',
            key: 'end_link_man'
        },
        {
            title: '电话号码',
            key: 'end_link_mobile'
        },
        {
            title: '代收货款',
            key: 'fee_dshk'
        }
    ]
    
    //列表查询条件
    export default{
        name:"waybillV1List",
        data:function(){
             return {
                lazyload:false,
                insuranceState: '', // 保险状态
                select_order_id:'', //当前选中的运单ID
                order_ids:'',//多选id
                order_id:'',//单个id
                selectDel:false,//是否含有被作废的运单
                detailInit:false,
                printData:{},
                queryTime: '',
                user: '',
                conditionList :[
                    {
                        text:'全部',
                        key:''
                    },
                    {
                        text:'待分配',
                        key:'dfp'
                    },
                    {
                        text:'待发车',
                        key:'dfc'
                    },
                    {
                        text:'运输中',
                        key:'ysz'
                    },
                    {
                        text:'待签收',
                        key:'dqs'
                    },
                    {
                        text:'已签收',
                        key:'yqs'
                    },
                ],
                columns:CONST_TABLE.INDEX_LIST,
                selectedData: [],
                soruceData: [],
                signData:[],
                total:0,
                isShowSelected:false,
                driveColumns1: CONST_TABLE.COMMON_PARAM_DRRIVER_DETAIL,
                facilitatorListColumns1: CONST_TABLE.COMMON_PARAM_FA_LIST,
                signColumns:COMMON_SIGN_LIST,
                //弹框
                model: {
                    slideModal:false,
                    modelDriver: false,
                    modelFacilitator: false,
                    modelNbmber: false,
                    modelDel: false,
                    modelDetail:false,
                    showDriverlist:false,
                    modelSign:false,
                    insureOrder:false,
                    insureTopay:false,
                    insureSucess:false,
                },
                //列表查询条件
                queryData: {
                    page_size:10,
                    page:1,
                    user_id:'',
                    company_id:'',
                    q_order_state:'',
                    q_order_type:'',
                    q_bulk_type:'',
                    q_is_exception:'',
                    q_is_reject:'',
                    q_is_del:'N',
                    q_keyword: '',
                    q_create_time_begin: '',
                    q_create_time_end: '',

                },
                //--司机列表查询
                
                selectOrderData:{
                    order_no:'',
                    begin_area:'',
                    end_area:''
                },
                
                //统计数据
                cacultaeData: [{
                    totalWeight:0,
                    totalVolume:0,
                    totalFee:0,
                    totalAmount:0,
                    totalCount:0,
                    totalDshk:0,
                    totalDf:0
                }],
                //要投保单子的数据
                insureObj:'',
                //保单生成的数据
                insureData:insureDatas.insureData,
                //保单已成生的数据
                insureedData:insureDatas.insureedData,
                //保单完成数据
                insureSucessData:insureDatas.insureSucessData,
                ruleValidate: INSURE_RULE
            }
        },
        computed: {
            ...mapState(['userInfo']),
            curPage () {
                return this.queryData.page
            },
        },
        created (){
            this.user = this.userInfo
            this.queryData.user_id = this.userInfo.user_id;
            this.queryData.company_id = this.userInfo.company_id;
            this.search();
        },
        mounted (){
            bus.$on('waybill-list-reload',()=>{
                this.search() 
                })
        },
        mixins: [tableMixin],
        components: {
            orderDetail: detail,
            orderSign: listSign,
            orderDriver: listDriver,
            orderFacilitator: listFacilitator,
            orderPrint: printComponent,
            topFilterSelect: topFilterSelect,
            orderMember: listMember,
        },
        methods :{
            search: function (e) {
                let _vm = this
                if(typeof e == 'object'){
                    if(e&&e.q_bulk_type!=''){
                        _vm.queryData.q_bulk_type=e.q_bulk_type
                    }
                    else{
                        _vm.queryData.q_bulk_type=''
                    }
                    if(e&&e.q_bulk_types!=''){
                        _vm.queryData.q_is_exception = ''
                        _vm.queryData.q_is_reject = ''
                        _vm.queryData.q_is_del = 'N'
                        _vm.queryData[e.q_bulk_types]='Y'
                    }
                    else{
                        _vm.queryData.q_is_exception = ''
                        _vm.queryData.q_is_reject = ''
                        _vm.queryData.q_is_del = 'N'
                    }
                }
                getWaybillList(_vm.queryData).then(json=>{
                    if(json.result==1){
                        _vm.soruceData = json.resultObj.list;
                        _vm.total = json.resultObj.total;
                        _vm.selectedData = [];
                    }else{
                        
                    }
                })
            }, 
            doSearchReset (){
                // todo 修改 重置后所有条件重置 并刷新数据
                // “筛选” 没有找到重置的方式
                this.queryData.q_keyword = ''
                this.queryTime = ''
                this.queryData.q_order_state = ''
                this.queryData.page = 1
                this.queryData.q_create_time_begin = ''
                this.queryData.q_create_time_end = ''
                this.search()
            }, 
            changePage: function(page) {
                let _vm = this;
                _vm.queryData.page = page;
                _vm.search();
            }, 
            //每页条数修改
            changePageSize:function(pageSize){
                let _vm = this;
                _vm.queryData.page_size = pageSize;
                _vm.search();
            },
            //筛选状态改变
            stateChange: function(){
                this.queryData.page = 1;
                this.search();
            },
            
            //筛选状态改变
            filterSelectChange: function(e){
                this.queryData.page = 1;
                this.search(e);
            },
            rowClick(item){
                let _vm = this
                setTimeout(function(){
                    if(_vm.tableParams.isCheckBoxClick){
                        _vm.tableParams.isCheckBoxClick=false;
                    }
                    else{
                        _vm.loadDetail(item)
                    }
                },10)  
            },
            selectChange: function(items) {
                this.tableParams.isCheckBoxClick=true;
                let _vm = this,
                    totalWeight = 0,
                    totalVolume = 0,
                    totalFee = 0,
                    totalAmount = 0,
                    totalDshk = 0,
                    totalDf = 0,
                    count = 0;
                _vm.selectDel=false;
                items.forEach(function(i){
                    i._checked=true;
                    if(i.is_del=="Y"){
                        _vm.selectDel=true;
                    }
                    else{
                        totalWeight += caculateTotal(i.c_weights);
                        totalVolume += caculateTotal(i.c_volumes);
                        totalFee += caculateTotal(i.fee_transport);
                        totalAmount += caculateTotal(i.c_amounts);
                        totalDshk += caculateTotal(i.fee_dshk?i.fee_dshk:0);
                        totalDf+= i.pay_df==null?0:parseFloat(i.pay_df?i.pay_df:0);
                        count++
                    }
                })
                _vm.cacultaeData[0].totalWeight = Math.round(totalWeight*1000)/1000;
                _vm.cacultaeData[0].totalVolume = Math.round(totalVolume*100)/100;
                _vm.cacultaeData[0].totalFee = Math.round(totalFee*100)/100;
                _vm.cacultaeData[0].totalAmount = Math.round(totalAmount*100)/100;
                _vm.cacultaeData[0].totalDshk = Math.round(totalDshk*100)/100;
                _vm.cacultaeData[0].totalCount = count;
                _vm.cacultaeData[0].totalDf = Math.round(totalDf*100)/100;
                _vm.selectedData = items;
                if(_vm.selectedData.length>0){
                    _vm.select_order_id=_vm.selectedData[0].order_id
                }
                this.signData = items
            },
            //列表行点击触发事件
            loadDetail (e){
                let _vm = this;
                if(e.is_del==="Y"){
                    _vm.model.slideModal = false
                    _vm.$Message.error("该运单已作废")
                }
                else{
                    if(_vm.select_order_id == e.order_id){
                        _vm.model.slideModal = _vm.model.slideModal?false:true
                    }
                    else{
                        _vm.model.slideModal = true
                    }
                    _vm.select_order_id = e.order_id
                    _vm.insuranceState = e.insurance_state
                    
                }
            },
            hideModel (e){
                let _vm = this;
                _vm.model[e] = false;
            },
            //分页
            changePage (page){
                let _vm = this;
                _vm.queryData.page = page;
                _vm.search();
            }, 
            //分配司机
            distributetoDriver (){
                let _vm = this;
                _vm.order_ids=getArrayIds(_vm.selectedData,"order_id")
                _vm.model.modelDriver = true;
            },
            disbutetipSubmit(e){
                let _vm = this;
                if(e==true){
                    _vm.model.modelDriver=false;
                    _vm.search();
                    return
                }
                _vm.$refs.drivercompent.disbutetipSubmits(); 
            },
            
            //--分配服务商
            distributeToFa (){
                let _vm = this;
                _vm.order_id=_vm.selectedData[0].order_id;
                _vm.model.modelFacilitator=true;
            },
            //--分配成员
            distributeToMember (){
                let _vm = this;
                _vm.order_id=_vm.selectedData[0].order_id;
                _vm.model.modelNbmber=true;
            },
            //----分配服务商提交
            facilitatorSubmit (e){
                let _vm = this;
                if(e==true){
                    _vm.model.modelFacilitator=false;
                    _vm.search();
                    return
                }
                _vm.$refs.faciltatorcompent.facilitatorSubmits();

            },
            //----成员提交
            memberSubmit (e){
                let _vm = this;
                if(e==true){
                    _vm.model.modelNbmber=false;
                    _vm.search();
                    return
                }
                _vm.$refs.membercompent.memberSubmit();

            },
            //--签收
            sign (e){
                let _vm = this;
                let orderState = '';

                if(e=='0'){
                    _vm.order_id=_vm.selectedData[0].order_id;
                }
                else{
                    _vm.order_id=e;
                }
                _vm.soruceData.forEach(function(x){
                    if(x.order_id == _vm.order_id){
                       orderState = x.order_state
                       _vm.signData = []
                       _vm.signData[0] = x

                    }
                    
                })
                if(orderState==3){
                    return _vm.$Message.error("运单已签收！")
                }
                _vm.model.modelSign=true;
                
            },
            //----签收
            signSubmit (e){
                let _vm = this;
                if(e===true){
                    _vm.model.modelSign=false;
                    _vm.search();
                    return 
                }
                _vm.$refs.signcompent.signSubmits();
            },
            //--投保弹出
            insure (e){
                let _vm = this;
                if(!!e){
                    _vm.soruceData.forEach(function(x){
                        if(x.order_id == e){
                            _vm.insureObj = x
                        }
                    })
                }
                else{
                    if(_vm.selectedData.length==1) {
                        _vm.insureObj=_vm.selectedData[0];
                    }
                    else{
                        return _vm.$Message.error("请选择1条数据进行投保")
                    }
                }
                if(_vm.insureObj.order_state=="3" || _vm.insureObj.order_state=="6"){
                    _vm.$Message.error("运单已启运，无法投保")
                    return
                }
                _vm.insureData.order_no=_vm.insureObj.order_no;  
                let insurance_state=_vm.insureObj.insurance_state;
                if(insurance_state=="N"||insurance_state=="E"){
                    _vm.lazyload=true;
                    _vm.insureData.user_id=_vm.user.user_id;
                    _vm.insureData.order_id=_vm.insureObj.order_id;
                    _vm.insureData.departure_bad=_vm.insureObj.begin_code+"$"+_vm.insureObj.begin_area;
                    _vm.insureData.departure_place=_vm.insureObj.begin_code;
                    _vm.insureData.destination_place=_vm.insureObj.end_code;
                    _vm.insureData.departure_ead=_vm.insureObj.end_code+"$"+_vm.insureObj.end_area;
                    _vm.insureData.departure_place_name=_vm.insureObj.begin_area;
                    _vm.insureData.destination_place_name=_vm.insureObj.end_area;
                    _vm.model.insureOrder=true;
                }
                //已投保
                else if(insurance_state=="Y"){
                    _vm.payfinish();
                }
                //待支付
                else if(insurance_state=="D"){
                    var orderid=_vm.insureObj.order_id;
                    insuerInfo({order_id:orderid}).then(json=>{
                        if(json.result==1){
                            _vm.insureedData.cargo_product=json.resultObj.order.product_name;
                            _vm.insureedData.channel_order_no=json.resultObj.order.channel_order_no;
                            _vm.insureedData.holder_name=json.resultObj.order.holder_name;
                            _vm.insureedData.insure_name=json.resultObj.order.insure_name;
                            _vm.insureedData.policy_start=json.resultObj.order.policy_start;
                            _vm.insureedData.policy_end=json.resultObj.order.policy_end;
                            _vm.insureedData.coverage=json.resultObj.order.coverage;
                            _vm.insureedData.premium=json.resultObj.order.premium;
                            _vm.model.insureTopay=true;
                        }else{
                            _vm.$Message.error(json.resultInfo)
                        }
                    })  
                }
                
            },
            dateChange:function(e){	
                var _vm = this;
                _vm.insureData.expect_start_time = e;
			},
            //----投保提交
            insureSubmit (){
                let _vm = this;
                let bgAddr = _vm.insureData.departure_bad.split("$");
                let endAddr = _vm.insureData.departure_ead.split("$");
                _vm.insureData.departure_place = bgAddr[0];
                _vm.insureData.departure_place_name = bgAddr[1];
                _vm.insureData.destination_place = endAddr[0];
                _vm.insureData.destination_place_name = endAddr[1];
                _vm.insureData.einvoice=_vm.insureData.is_einvoice?"Y":"N"
                let str=_vm.insureData.departure_place+_vm.insureData.destination_place;
                if(str.indexOf("710000")>=0||str.indexOf("810000")>=0||str.indexOf("820000")>=0){
                    return _vm.$Message.error("港澳台暂不提供投保服务")
                }
                if(typeof _vm.insureData.expect_start_time=="object"){
                    _vm.insureData.expect_start_time=getDateFormat(_vm.insureData.expect_start_time)
                }
                _vm.$refs['insureData'].validate((valid) => {
                    if(valid){
                        insuerOrder(_vm.insureData).then(json=>{
                            if(json.result==1){
                                _vm.insureedData=json.resultObj;
                                _vm.model.insureOrder=false;
                                _vm.model.insureTopay=true;
                                _vm.insureObj.insurance_state="D"
                                _vm.insuranceState = 'D';
                            }else{
                                _vm.$Message.error(json.resultInfo)
                            }
                        })
                        
                    }
                    else{}
                });
                
            },
            //----投保支付完成
            payfinish (e){
                let _vm = this;
                let id=e?e:_vm.insureObj.order_id;
                let data={
                    order_id:id
                };
    
                insuerInfo(data).then(json=>{
                    if(json.result==1){
                        _vm.selectedData.length=0;
                        
                        if(json.resultObj.insurance_state!='Y'){
                            _vm.$Message.error('订单未出单')
                            return
                        }
                        _vm.search();
                        _vm.insuranceState = json.resultObj.insurance_state;
                        _vm.insureSucessData.product_name=json.resultObj.order.product_name;
                        _vm.insureSucessData.policy_no=json.resultObj.order.policy_no;
                        _vm.insureSucessData.channel_order_no=json.resultObj.orderchannel_order_no;
                        _vm.insureSucessData.holder_name=json.resultObj.order.holder_name;
                        _vm.insureSucessData.insure_name=json.resultObj.order.insure_name;
                        _vm.insureSucessData.policy_start=json.resultObj.order.policy_start;
                        _vm.insureSucessData.policy_end=json.resultObj.order.policy_end;
                        _vm.insureSucessData.coverage=json.resultObj.order.coverage;
                        _vm.insureSucessData.premium=json.resultObj.order.premium;
                        _vm.insureSucessData.epolicy_downloadlink=json.resultObj.order.epolicy_downloadlink;
                        _vm.insureSucessData.einvoice_url=json.resultObj.order.epolicy_downloadlink;
                        if(json.resultObj.einvoice=="Y"){
                            _vm.insureSucessData.iseinvoice=true;
                        }
                        else{
                            _vm.insureSucessData.iseinvoice=false;
                        }
                        _vm.model.insureSucess=true;
                        _vm.model.insureTopay=false;
                        _vm.insureObj.insurance_state="Y"
                    }else{
                        _vm.$Message.error(json.resultInfo)
                    }
                });
            },
            //----去付支保单
            inusePay (e){
                let _vm = this;
                if(!!e){
                    _vm.soruceData.forEach(function(x){
                        if(x.order_id == e){
                            _vm.insureObj = x
                        }
                    })
                }
                if(_vm.insureObj.order_state=="3" || _vm.insureObj.order_state=="6"){
                    _vm.$Message.error("运单已启运，无法投保支付")
                    return
                }
                let id=e?e:_vm.insureObj.order_id;
                
                insurePay({order_id:id}).then(json=>{
                    if(json.result==1){
                        $("body").append('<a id="tbLink"  href="'+json.resultObj.pay_url+'" target="_blank">支付</a>')
                        document.getElementById("tbLink").click();
                        $("#tbLink").remove();
                    }else{
                        _vm.$Message.error(json.resultInfo)
                    }
                })
            },
            //----去付支保单
            reInsure (e){
                let _vm = this;
                let id=e?e:_vm.insureObj.order_id;
                if(!!e){
                    _vm.soruceData.forEach(function(x){
                        if(x.order_id == e){
                            _vm.insureObj = x
                        }
                    })
                }
                insuerReorder({order_id:id}).then(json=>{
                    if(json.result==1){
                        _vm.insureObj.insurance_state="N";
                        _vm.insuranceState = 'N';
                        _vm.model.insureTopay=false;
                        _vm.insure(id);
                    }else{
                        _vm.$Message.error(json.resultInfo)
                    }
                })
            },
            //运单作废
            del (){
                let _vm = this;
                this.model.modelDel = true;
            },
            delOk (){
                let _vm=this;
                getWaybillDEL({act_user_id:_vm.user.user_id,order_ids:_vm.selectedData[0].order_id}).then(json=>{
                    if(json.result==1){
                        _vm.search();
                        //_vm.soruceData = json.resultObj.list;
                    }else{
                        
                    }
                })
            },
            printOrder(){
                let _vm=this;
                _vm.printData=Object.assign({},_vm.selectedData[0])  
                setTimeout(function(){
                    print(document.getElementById('PrintContentDiv'));
                },300)
            },
			transBlur(){
				this.insureData.trans_no=this.insureData.trans_no.toUpperCase();
			}
        },
        watch: {
            queryTime (n,o){
                if (n && n[0]) {
                    this.queryData.q_create_time_begin = getDateFormat(n[0]).substring(0,10)+' 00:00:00'
                    this.queryData.q_create_time_end = getDateFormat(n[1]).substring(0,10)+' 23:59:59'
                }else{
                    this.queryData.q_create_time_begin = ''
                    this.queryData.q_create_time_end = ''
                }
            }
        },
        filters: {
            stateFilter: function (i){
                let arr = ['#0071c0','#febf06','#fe850a','#48cc46','#fe850a','#febf06','#fe850a']
                return arr[i]
            }
        },
        
    }

    function caculateTotal(e){
        if(!e){
            return 0
        }
        let array=e.split("|")||[]
        let l=array.length;
        let n=0;
        for(let i=0;i<l;i++){
            n+=Number(array[i]);
        }
        return n;
    }
    
</script>
<style lang="scss" scoped>
    .contain-head{
        .text-filter{
            display: inline-block;
            .ivu-input-wrapper,
            .ivu-date-picker{
                display: inline-block;
            }
            .ivu-input-wrapper{
                width: 250px;
            }
            .ivu-date-picker{
                width: 200px;
            }

        }
    }
</style>
<style lang="scss"  src="./style.scss">

</style>