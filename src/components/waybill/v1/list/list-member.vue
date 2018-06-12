<template lang="html">
    <div>
        <Form  :label-width="90"   ref="facilitatorSubmitData" :model="facilitatorSubmitData" :rules="fa_rule">
            <i-input placeholder="根据承运商、线路、联系人、手机号等进行搜索" v-model="facilitatorQueryData.query" style="width:360px" class="mt10">
                <Button slot="append" icon="ios-search" @click="searchfacilitator"></Button>
            </i-input>
            <Table  size="small" highlight-row :columns="columns" :data="facilitatorList"  @on-current-change="farowChange"  class="mt10 facilitator"></Table>
            <div class='list-page-footer clearfix mt5'>
                <div style="float:left">
                    <Checkbox v-model="facilitatorSubmitData.is_hide_senders">隐藏上游托运人信息</Checkbox>
                </div>
                <div style="float: right;">
                    <Page :page-size="4" :current="facilitatorQueryData.page" :total="facilitatorNum"  @on-change="changeFacilitatorPage"> </Page>
                </div>
            </div>
            <div class="form-table cf-all mt5">
                <div class="form-item w-facili">
                    <Form-item label="运费"  prop="fee_transport">
                        <i-input v-model="facilitatorSubmitData.fee_transport"  placeholder="请输入运费"></i-input>
                    </Form-item>
                </div> 
                <div class="form-item w-facili">
                    <Form-item label="提货费"  prop="fee_detail">
                        <i-input v-model="facilitatorSubmitData.fee_detail.fee_th"  placeholder="请输入提货费"></i-input>
                    </Form-item>
                </div> 
                <div class="form-item w-facili">
                    <Form-item label="送货费"  prop="fee_detail">
                        <i-input v-model="facilitatorSubmitData.fee_detail.fee_sh"  placeholder="请输入送货费"></i-input>
                    </Form-item>
                </div> 
                <div class="form-item w-facili">
                    <Form-item label="声明价值"  prop="fee_detail">
                        <i-input v-model="facilitatorSubmitData.fee_detail.fee_smjz"  placeholder="请输入保价费"></i-input>
                    </Form-item>
                </div>
                <div class="form-item w-facili">
                    <Form-item label="保价费"  prop="fee_detail">
                        <i-input v-model="facilitatorSubmitData.fee_detail.fee_bj"  placeholder="请输入保价费"></i-input>
                    </Form-item>
                </div> 
                <div class="form-item w-facili">
                    <Form-item label="保险费"  prop="fee_detail">
                        <i-input v-model="facilitatorSubmitData.fee_detail.fee_bx"  placeholder="请输入保险费"></i-input>
                    </Form-item>
                </div>
                <div class="form-item w-facili">
                    <Form-item label="装卸费"  prop="fee_detail">
                        <i-input v-model="facilitatorSubmitData.fee_detail.fee_zx"  placeholder="请输入装卸费"></i-input>
                    </Form-item>
                </div>
                <div class="form-item w-facili">
                    <Form-item label="上楼费"  prop="fee_detail">
                        <i-input v-model="facilitatorSubmitData.fee_detail.fee_sl"  placeholder="请输入上楼费"></i-input>
                    </Form-item>
                </div>
                <div class="form-item w-facili">
                    <Form-item label="包装费"  prop="fee_detail">
                        <i-input v-model="facilitatorSubmitData.fee_detail.fee_bz"  placeholder="请输入包装费"></i-input>
                    </Form-item>
                </div>
                <div class="form-item w-facili">
                    <Form-item label="安装费"  prop="fee_detail">
                        <i-input v-model="facilitatorSubmitData.fee_detail.fee_az"  placeholder="请输入安装费"></i-input>
                    </Form-item>
                </div>
                <div class="form-item w-facili">
                    <Form-item label="保管费"  prop="fee_detail">
                        <i-input v-model="facilitatorSubmitData.fee_detail.fee_bg"  placeholder="请输入保管费"></i-input>
                    </Form-item>
                </div>
                <div class="form-item w-facili">
                    <Form-item label="进仓费"  prop="fee_detail">
                        <i-input v-model="facilitatorSubmitData.fee_detail.fee_jc"  placeholder="请输入进仓费"></i-input>
                    </Form-item>
                </div> 
                <div class="form-item w-facili">
                    <Form-item label="代收货款"  prop="fee_detail">
                        <i-input v-model="facilitatorSubmitData.fee_detail.fee_dshk"  placeholder="请输入代收货款"></i-input>
                    </Form-item>
                </div> 
                <div class="form-item w-facili">
                    <Form-item label="代收手续费"  prop="fee_detail">
                        <i-input v-model="facilitatorSubmitData.fee_detail.fee_dssx"  placeholder="请输入代收手续费"></i-input>
                    </Form-item>
                </div> 
                <div class="form-item w-facili">
                    <Form-item label="其它费"  prop="fee_detail">
                        <i-input v-model="facilitatorSubmitData.fee_detail.fee_qt"  placeholder="请输入其它费"></i-input>
                    </Form-item>
                </div>                 
            </div>
            <Form-item label="合计费用" >
                <i-input v-model="facilitatorSubmitData.pay_total" readonly :value="payTotal" style="width:120px"></i-input>  
                <Radio-group class="ml20" v-model="facilitatorSubmitData.pay_type">
                    <Radio label="pay_xfu"> 
                        <span>现付</span>
                    </Radio>
                    <Radio label="pay_df">
                        <span>到付</span>
                    </Radio>
                    <Radio label="pay_yj">
                        <span>月结</span>
                    </Radio>
                    <Radio label="pay_hdf">
                        <span>回单付</span>
                    </Radio>
                    <Radio label="pay_hkk">
                        <span>货款扣</span>
                    </Radio>
                    <Radio label="pay_dbf">
                        <span>多笔付</span>
                    </Radio>
                </Radio-group>
            </Form-item>
            <div class="form-table cf-all" v-show="facilitatorSubmitData.pay_type=='pay_dbf'">
                <div class="form-item w-facili">
                    <Form-item label="现付">
                        <i-input v-model="facilitatorSubmitData.pay_detail.pay_xfu"  placeholder="请输入现付"></i-input>
                    </Form-item>
                </div> 
                <div class="form-item w-facili">
                    <Form-item label="月结">
                        <i-input v-model="facilitatorSubmitData.pay_detail.pay_yj"  placeholder="请输入月结"></i-input>
                    </Form-item>
                </div>
                <div class="form-item w-facili">
                    <Form-item label="到付">
                        <i-input v-model="facilitatorSubmitData.pay_detail.pay_df"  placeholder="请输入到付"></i-input>
                    </Form-item>
                </div> 
                <div class="form-item w-facili">
                    <Form-item label="回单付">
                        <i-input v-model="facilitatorSubmitData.pay_detail.pay_hdf"  placeholder="请输入回单付"></i-input>
                    </Form-item>
                </div> 
                <div class="form-item w-facili">
                    <Form-item label="货到打款">
                        <i-input v-model="facilitatorSubmitData.pay_detail.pay_hdfk"  placeholder="请输入货到打款"></i-input>
                    </Form-item>
                </div>
                <div class="form-item w-facili">
                    <Form-item label="货款扣">
                        <i-input v-model="facilitatorSubmitData.pay_detail.pay_hkk"  placeholder="请输入货款扣"></i-input>
                    </Form-item>
                </div>
                <div class="form-item w-facili">
                    <Form-item label="现返">
                        <i-input v-model="facilitatorSubmitData.pay_detail.pay_xfan"  placeholder="请输入现返"></i-input>
                    </Form-item>
                </div>
                <div class="form-item w-facili">
                    <Form-item label="欠返">
                        <i-input v-model="facilitatorSubmitData.pay_detail.pay_qfan"  placeholder="请输入欠返"></i-input>
                    </Form-item>
                </div>
                <div class="form-item w-facili">
                    <Form-item label="欠付">
                        <i-input v-model="facilitatorSubmitData.pay_detail.pay_qfu"  placeholder="请输入欠付"></i-input>
                    </Form-item>
                </div> 
            </div>
            <Form-item label="备注" >
                <i-input type="textarea" v-model="facilitatorSubmitData.shipper_remark" placeholder="请输入备注" ></i-input>
            </Form-item> 
            <p style="text-align:right">
            <span>经办人：{{user.user_name}}</span>
            </p>
        </Form>
    </div>
</template>

<script>   
	import { getMemberList,memberCreate } from '@/api/src/waybillApi'
	import { utilCookie,getArrayIds} from '@/utils/util'
	import { mapState } from 'vuex'
    import rule from '@/utils/validate-rule'
    //订单列表个格设置
    const COMMON_PARAM_FA_LIST = [
        {
            title: '成员',
            key: 'partener_name',
            width:220,
        },
        {
            title: '线路',
            key: 'partener_route',
        },
        {
            title: '报价',
            key: 'partener_price',
        },
        {
            title: '联系人',
            key: 'partener_link_man',
        }
        ,
        {
            title: '联系电话',
            key: 'partener_link_tel',
        }
        ,
        {
            title: '操作',
            key: 'partener_link_tel',
            width:100,
            render: (h, params) => {
                return h('div', [
                    h('Button', {
                        props: {
                            size: 'small'
                        },
                        style: {
                            marginRight: '5px'
                        },
                        on: {
                            click: () => {
  
                            }
                        }
                    }, '选择'),
                ]);
            }
        }

        
        
    ];

    export default{
        props: {
			order_id:''
		},
        watch: {
			order_id(value) {
                if(value){
                    this.getFacilitatorList();
                }
				
			}
		},
        data:function(){
             return {
                 fa_rule: {
                    fee_transport: [
                        { required: true, message: '这是必填项', trigger: 'change' },
                        { validator: rule.pointLimit, },
                    ],
                    driver_id: [
                        { required: true, message: '这是必填项', trigger: 'change' },
                    ],
                    fee: [
                        { required: true, message: '这是必填项', trigger: 'change' }
                    ],
                    fee_detail:{
                        type: "object",
                        fields: {
                            fee_smjz: { validator: rule.pointLimit, },
                            fee_zx: { validator: rule.pointLimit, },
                            fee_az: { validator: rule.pointLimit, },
                            fee_dshk: { validator: rule.pointLimit, },
                            fee_th: { validator: rule.pointLimit, },
                            fee_bj: { validator: rule.pointLimit, },
                            fee_sl: { validator: rule.pointLimit, },
                            fee_bg: { validator: rule.pointLimit, },
                            fee_dssx: { validator: rule.pointLimit, },
                            fee_sh: { validator: rule.pointLimit, },
                            fee_bx: { validator: rule.pointLimit, },
                            fee_bz: { validator: rule.pointLimit, },
                            fee_jc: { validator: rule.pointLimit, },
                            fee_qt: { validator: rule.pointLimit, },
                        }
                    },
                },
                user:'',//用户缓存
                columns: COMMON_PARAM_FA_LIST.slice(),
                //--分配服务商列表数据
                facilitatorList :[],
                checkObj:{},
                //----分配服务商查询条件
                facilitatorQueryData:{
                    page_size:4,
                    page:1,
                    user_id:'',
                    query:'',
                    order_ids:''
                },
                //----服务商数量
                facilitatorNum:0,
                //----服务商提交数据
                
                //服务商提交的数据
                facilitatorSubmitData:{
                    user_id:'',
                    order_ids:'',
                    partener_company_id:'',
                    partener_name:'',
                    is_hide_senders:true,
                    is_hide_sender:"",
                    fee_transport:'',
                    fee_details:{},
                    fee_detail:{
                        fee_smjz:"",
                        fee_zx:"",
                        fee_az:"",
                        fee_dshk:"",
                        fee_th:"",
                        fee_bj:"",
                        fee_sl:"",
                        fee_bg:"",
                        fee_dssx:"",
                        fee_sh:"",
                        fee_bx:"",
                        fee_bz:"",
                        fee_jc:"",
                        fee_qt:""
                    },
                    pay_total:'',
                    pay_type:'pay_xfu',
                    pay_detail:{
                        pay_xfu:"",
                        pay_df:"",
                        pay_qfu:"",
                        pay_yj:"",
                        pay_hdf:"",
                        pay_hkk:"",
                        pay_xfan:"",
                        pay_qfan:"",
                        pay_hdfk:"",
                    },
                    pay_details:{},
                    shipper_remark:'',
                },       
            }
        },
        created () {
            this.user = this.userInfo
        },
        computed :{
            payTotal (){
                var fee=parseFloat(this.facilitatorSubmitData.fee_transport);
                fee=isNaN(fee)?0:fee;
                for(name in this.facilitatorSubmitData.fee_detail){
                    if(this.facilitatorSubmitData.fee_detail[name] && name!="fee_smjz" && name!="fee_dshk"){
                        fee+=parseFloat(isNaN(this.facilitatorSubmitData.fee_detail[name])?0:this.facilitatorSubmitData.fee_detail[name]);
                    }
                }
                this.facilitatorSubmitData.pay_total=fee
                return fee;
            },
            ...mapState(['userInfo'])
        },
        methods :{
            //--分配服务商
            distributeToFa (){
                let _vm = this;
                _vm.model.modelFacilitator=true;
                _vm.getFacilitatorList()
                
            },
            //----服务商列表
            getFacilitatorList (){
                let _vm = this;
                _vm.facilitatorQueryData.user_id = _vm.user.user_id;
                _vm.facilitatorQueryData.order_ids = _vm.order_id;
                getMemberList(_vm.facilitatorQueryData).then(json=>{
                    if(json.result==1){
                        _vm.facilitatorList = json.resultObj.list;
                        _vm.facilitatorNum = json.resultObj.total;
                    }else{
                        _vm.$Message.error(json.resultInfo)
                    }
                })
                
            },
            //----服务商列表行选中
            farowChange (e,e2){ 
                this.checkObj = e
            },
            //----服务商列分页
            changeFacilitatorPage (e){
                let _vm = this;
                _vm.facilitatorQueryData.page = e;
                _vm.getFacilitatorList();
            },
            //----服务商模糊查询
            searchfacilitator(){
                let _vm = this;
                _vm.facilitatorQueryData.page = 1;
                _vm.getFacilitatorList();
            },
            //----分配服务商提交
            memberSubmit (){
                let _vm = this;
                _vm.$refs['facilitatorSubmitData'].validate((valid) => {
                    if(valid){
                        if(!_vm.checkObj.partener_company_id){
                            return _vm.$Message.error("请选择成员！")
                            
                        }
                        _vm.facilitatorSubmitData.fee_details = JSON.stringify(_vm.facilitatorSubmitData.fee_detail);
                        _vm.facilitatorSubmitData.user_id=_vm.user.user_id,
                        _vm.facilitatorSubmitData.order_ids=_vm.order_id;
                        _vm.facilitatorSubmitData.is_assign_offline_liner = false;
                        _vm.facilitatorSubmitData.is_hide_sender=_vm.facilitatorSubmitData.is_hide_senders?"Y":"N"
                        _vm.facilitatorSubmitData.partener_company_id=_vm.checkObj.partener_company_id
                        _vm.facilitatorSubmitData.partener_name=_vm.checkObj.partener_name
                        if(_vm.facilitatorSubmitData.pay_type=="多笔付" || _vm.facilitatorSubmitData.pay_type=="pay_dbf"){
                            _vm.facilitatorSubmitData.pay_details=JSON.stringify(_vm.facilitatorSubmitData.pay_detail);                   
                        }
                        
                        else{
                            _vm.facilitatorSubmitData.pay_detail={};
                            _vm.facilitatorSubmitData.pay_details='{"'+_vm.facilitatorSubmitData.pay_type+'":"' + _vm.facilitatorSubmitData.pay_total + '"}';
                            //JSON.stringify({_vm.facilitatorSubmitData.pay_type:})
                        }
                        if((_vm.facilitatorSubmitData.pay_type=="多笔付"||_vm.facilitatorSubmitData.pay_type=="pay_dbf") && getPaydetailTotal(_vm.facilitatorSubmitData.pay_detail)!=_vm.facilitatorSubmitData.pay_total){
                            _vm.$Message.error("多笔付总额不正确！")
                            return false;
                        }
                        if(_vm.facilitatorSubmitData.pay_type=="pay_hkk"){
                            var payhdf=isNaN(parseFloat(_vm.facilitatorSubmitData.fee_detail.fee_dshk))?0:_vm.facilitatorSubmitData.fee_detail.fee_dshk;

                            if(parseFloat(_vm.facilitatorSubmitData.pay_total)>payhdf){
                                _vm.$Message.error("您选择了货款扣，代收货款不能小于合计费用！")
                                return false;
                            }
                        }
                        memberCreate(_vm.facilitatorSubmitData).then(json=>{
                            if(json.result==1){
                                this.$Message.success("分配成功")
                                this.facilitatorSubmitData.partener_company_id=''
                                _vm.$emit("memberSubmit",true)
                            }else{
                                _vm.$Message.error(json.resultInfo)
                            }
                        })
                    }
                    else{}
                })   
            },
        },
        filters: {
            stateFilter: function (i){
                var arr = ['#0071c0','#febf06','#fe850a','#48cc46','#fe850a','#febf06','#fe850a']
                return arr[i]
            }
        }
    }
    function getPaydetailTotal(e){
        var paynum=0;
        $.each(e,function(name,value){
            if(!(isNaN(parseFloat(value)))){
                paynum+=parseFloat(value)
            }
        });
        return paynum;
    }
</script>
<style>
  .w-facili{
      width:241.7px !important;
  }
  .facilitator .ivu-table .ivu-table-row-highlight td{
        background-color: #2db7f5;
        color: #fff;
    }
</style>