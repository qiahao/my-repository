<template lang="html">
<div>
    <Modal
        v-model="modal"
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
                            <province-cascader v-if="lazyload" :opts="provinceOpts"  v-model="insureData.departure_bad"  style="width: 150px"></province-cascader>
                        </Form-item>
                    </Col>
                    <Col span="8">
                        <Form-item label="目的地" prop="departure_ead">
                            <province-cascader  v-if="lazyload" :opts="provinceOpts"  v-model="insureData.departure_ead"  style="width: 120px"></province-cascader>
                            
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
            <Button    @click="hideModel()">取消</Button>
            <Button type="primary" :disabled="!insureData.isProtocol"  @click="insureSubmit">确定</Button>
        </div>
    </Modal>
    <!--待支付-->
    <Modal
        v-model="insureTopay"
        title="待支付"
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
        v-model="insureSucess"
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
</div>    
</template>

<script> 
	import { utilCookie,getDateFormat,getCurDate } from '@/utils/util'
	import { mapState } from 'vuex'
    import { insuerOrder,insurePay,insureLoad,insuerReorder,insuerInfo} from '@/api/src/insureApi'
    import rule from '@/utils/validate-rule'
    import * as constants from './constants.js'
    import {INSURE_RULE} from './validate.js'
    import * as insureDatas from './insureData.js'
    //订单列表个格设置
    export default{
        data:function(){
             return {
                user: '',
                modal: false,
                insureTopay: false,
                insureSucess: false,
                lazyload: false,
                dataOrders: [],
                columnsOrders: Object.freeze(constants.driverColumnsOrders),
                ruleValidate: INSURE_RULE,
                insureData: insureDatas.insureData,
                //保单已成生的数据
                insureedData:insureDatas.insureedData,
                //保单完成数据
                insureSucessData:insureDatas.insureSucessData,
                insureObj: {},
                provinceOpts: { 'change-on-select': true },
            }
        },
        created () {
            this.user = this.userInfo
        },
        mounted () {
            let vm = this
            
            bus.$on('insure-order',(order)=>{
                vm.order_id = order.order_id
                vm.insureObj = order
                vm.insure()
            })
        },
        computed:{
			...mapState(['userInfo']),
		},
        methods :{
            insure (e){
                
                let _vm = this;
    
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
                    debugger
                    _vm.modal = true;
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
                            _vm.insureTopay=true;
                        }else{
                            _vm.$Message.error(json.resultInfo)
                        }
                    })  
                }
                
            },
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
                                bus.$emit("order-list-reload")
                                bus.$emit("order-detail-reload")
                                _vm.insureedData=json.resultObj;
                                _vm.modal=false;
                                _vm.insureTopay = true;
                                _vm.insureObj.insurance_state="D"
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
                let data={
                    order_id:_vm.insureObj.order_id
                };
    
                insuerInfo(data).then(json=>{
                    if(json.result==1){
                        if(json.resultObj.insurance_state!='Y'){
                            _vm.$Message.error('订单未出单')
                            return
                        }
                        bus.$emit("order-list-reload")
                        bus.$emit("order-detail-reload")
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
                        _vm.insureSucess=true;
                        _vm.insureTopay=false;
                        _vm.insureObj.insurance_state="Y"
                    }else{
                        _vm.$Message.error(json.resultInfo)
                    }
                });
            },
            //----去付支保单
            inusePay (e){
                let _vm = this;
                if(_vm.insureObj.order_state=="3" || _vm.insureObj.order_state=="6"){
                    _vm.$Message.error("运单已启运，无法投保支付")
                    return
                }
                let id = _vm.insureObj.order_id;
                
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
                let id = _vm.insureObj.order_id;
                insuerReorder({order_id:id}).then(json=>{
                    if(json.result==1){
                        bus.$emit("order-list-reload")
                        bus.$emit("order-detail-reload")
                        _vm.insureObj.insurance_state="N";
                        _vm.insuranceState = 'N';
                        _vm.insureTopay=false;
                        _vm.insure(id);
                    }else{
                        _vm.$Message.error(json.resultInfo)
                    }
                })
            },
            transBlur(){
				this.insureData.trans_no=this.insureData.trans_no.toUpperCase();
			},
            hideModel () {
                this.modal = false
            },
            dateChange:function(e){	
			},
        },
    }
</script>
<style lang="scss" rel="stylesheet/scss">
  
</style>