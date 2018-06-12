<template lang="html">
<div>
    <div class='contain-head' >
        <div>
            <div slot="head" class="clearfix">
                <h3 class="fl">
                    <i-button size="small" class="mr10"  @click="routeBack"><返回</i-button>
                    {{operateType=='add'?'新增项目':'项目详情'}}
                </h3>
                <span class="fr">
                    <i-button size="small" type="primary" @click="saveProject"  v-if="mainData.pm_pub!='2' && isEditAble">保存</i-button>
                    <i-button size="small" type="primary" @click="public"  v-if="mainData.pm_pub=='0'  && !isEditAble">发布</i-button>
                    <i-button size="small" type="primary" @click="edit"  v-if="mainData.pm_pub=='0' && operateType=='detail' && !isEditAble">编缉</i-button>
                    <i-button size="small" type="primary" @click="cancelEdit"  v-if="mainData.pm_pub=='0' && operateType=='detail' && isEditAble">取消</i-button>
                    <i-button size="small" type="primary" @click="del" v-if="mainData.pm_pub=='0'  && !isEditAble">删除</i-button>
                    <i-button size="small" type="primary" @click="cancel"  v-if="mainData.pm_pub=='1'">作废</i-button>
                    <i-button size="small" type="primary" @click="recovery"  v-if="mainData.pm_pub=='2'">恢复</i-button>
                </span>
            </div>
        </div>
    </div>
    <div class="contain-main" >
        <!-- 运单信息 -->

            
            <div slot="default">
                <Tabs value="customer-01">
                    <Tab-pane label="基本信息" name="customer-01" style="height:500px">
                        <div>
                        <i-form  ref="mainData" :model="mainData" :rules="ruleObj"  >
                            <div class="row-box mb10">
                                <Row>
                                    <i-col span="12" > 
                                        <Form-item label="项目名称：" prop="prj_name" :label-width="110">
                                            <i-input :disabled="!isEditAble" v-model='mainData.prj_name' class="fl" placeholder="请输入目名称" style="width: 300px"></i-input>
                                            <span :class="[{ stategreen: mainData.pm_pub == '1' },{ statered: mainData.pm_pub == '2' }]" class="state-status" v-show="operateType=='detail'">{{["草稿","已发布","已作废"][mainData.pm_pub]}}</span>

                                        </Form-item>
                                    </i-col>
                                    <i-col span="12" > 
                                        <Form-item label="客户名称：" prop="partner_id" :label-width="110">
                                            <i-select  :disabled="!isEditAble"  v-model="mainData.partner_id"  placeholder="请选择客户">
                                                <i-option value="">请选择</i-option>
                                                <i-option v-for="item in partnerList"  :key="item" :value="item.pcid">{{item.partner_name}}</i-option>
                                            </i-select>
                                            <!--<span v-if="operateType=='detail'">{{mainData.partner_name}}</span>-->
                                        </Form-item>
                                    </i-col>
                                </Row>
                            </div>
                            <div class="row-box mb10">
                                <Row>
                                    
                                    <i-col span="12">
                                        <Form-item label="项目类型：" prop="prj_self" :label-width="110">
                                            <Radio-group class="ml5"  v-model="mainData.prj_self">
                                                <Radio :disabled="!isEditAble" label="Y" >
                                                    <span>自营</span>
                                                </Radio>
                                                <Radio :disabled="!isEditAble" label="N">
                                                    <span>非自营</span>
                                                </Radio>
                                            </Radio-group>
                                            <!--<span v-if="operateType=='detail'">{{mainData.prj_self=='Y'?"自营":"非自营整车"}}</span>-->
                                        </Form-item>
                                    </i-col>
                                    <i-col span="12" > 
                                        <Form-item label="项目推介商户：" prop="prj_recommend" :label-width="110">
                                            <i-input :disabled="!isEditAble" v-model="mainData.prj_recommend"   placeholder="项目推介商户"></i-input>
                                        </Form-item>
                                    </i-col>
                                </Row>
                            </div>
                            <div class="row-box mb10">
                                <Row>
                                    <i-col span="12">
                                        <Form-item label="有效期(起止)：" prop="dateRange" :label-width="110">
                                            <DatePicker :disabled="!isEditAble" v-model="mainData.dateRange"  class="fl" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="选择日期"  style="width: 330px"></DatePicker>
                                            <span :class="[{ stategreen: mainData.pm_state == '1' } ]" class="state-status stategray" v-if="mainData.pm_pub == '1'">{{priceStatus}}</span>
                                        </Form-item>
                                    </i-col>
                                </Row>  
                            </div>
                            <div class="row-box mb10">
                                <Row>
                                    <i-col span="6">
                                        <Form-item label="合同编号：" prop="contract_no" :label-width="110">
                                            <i-input :disabled="!isEditAble" v-model="mainData.contract_no"   placeholder="请输入合同编号"></i-input>
                                        </Form-item>
                                    </i-col>
                                    <i-col span="6">
                                        <Form-item label="项目经理：" prop="prj_manager_id" :label-width="110">
                                            <i-select  :disabled="!isEditAble"  v-model="mainData.prj_manager_id"  placeholder="请选择项目经理">
                                                <i-option v-for="item in userList"  :key="item" :value="item.user_id">{{item.user_name}}</i-option>
                                            </i-select>
                                        </Form-item>
                                    </i-col>
                                    <i-col span="6">
                                        <Form-item label="合规专员：" prop="prj_officer_id" :label-width="110">
    
                                            <i-select  :disabled="!isEditAble"  v-model="mainData.prj_officer_id"  placeholder="请选择合规专员">
                                                <i-option v-for="item in userList"  :key="item" :value="item.user_id">{{item.user_name}}</i-option>
                                            </i-select>
                                        </Form-item>
                                    </i-col>
                                    <i-col span="6">
                                        <Form-item label="客服专员：" prop="prj_cussrv_id" :label-width="110">
                                            <i-select  :disabled="!isEditAble"  v-model="mainData.prj_cussrv_id"  placeholder="请选择客服专员">
                                                <i-option v-for="item in userList"  :key="item" :value="item.user_id">{{item.user_name}}</i-option>
                                            </i-select>
                                        </Form-item>
                                    </i-col>
                                </Row>  
                            </div>
                            <div class="row-box mb10">
                                <Row>
                                    <i-col span="12">
                                        <Form-item label="项目服务费："  :label-width="110" prop="prj_rate">
                                            <i-input :disabled="!isEditAble" v-model="mainData.prj_rate"  style="width:60px;border-bottom:1px solid #888"></i-input>%
                                        </Form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <Form-item label="" prop="daterange" :label-width="0">
                                            <Checkbox  :disabled="!isEditAble" class="ml20" v-model="mainData.prj_advance">垫付资金</Checkbox>
                                            
                                        </Form-item>
                                    </i-col>
                                </Row>  
                            </div>
                            <div class="row-box mb10">
                                <Row>
                                    <i-col span="24">
                                        <Form-item label="回单："  class="fl" :label-width="110">
                                            <Radio-group  v-model="mainData.back_order_type">
                                                <Radio :disabled="!isEditAble" label="NO">
                                                    <span>无</span>
                                                </Radio>
                                                <Radio :disabled="!isEditAble" label="0">
                                                    <span>回执</span>
                                                </Radio>
                                                <Radio :disabled="!isEditAble" label="1">
                                                    <span>原单</span>
                                                </Radio>
                                                <Radio :disabled="!isEditAble" label="2">
                                                    <span>收条</span>
                                                </Radio>
                                                <Radio :disabled="!isEditAble" label="3">
                                                    <span>电子回单</span>
                                                </Radio>
                                                <Radio :disabled="!isEditAble" label="4">
                                                    <span>其他</span>
                                                </Radio>
                                            </Radio-group>
                                        </Form-item>
                                        <i-input :disabled="!isEditAble" class="fl" v-model="mainData.back_type_other"  v-show="mainData.back_order_type=='4'"  prop="back_type_other"  placeholder="请输入其他"  style="width:120px; text-align:center；border-bottom:1px solid #ccc"></i-input>
                                        <Form-item :label-width="60" label="共"  prop="back_order_nums"  class="fl"  :rules="mainData.back_order_type!='NO'?[{required: true, message: '不能为空', trigger: 'change'},{ pattern:/^[1-9]{1}$/,  message: '请输1~9之间的整数', trigger: 'change' }]:{}">
                                            <i-input :disabled="!isEditAble" v-model="mainData.back_order_nums"   placeholder="" style="width:40px; text-align:center"></i-input>份
                                        </Form-item>
                                        
                                    </i-col>
                                </Row>
                            </div>
                        </i-form>
                            
                        </div> 
                    </Tab-pane>
                    <Tab-pane label="项目报价表" name="customer-02" v-if="operateType=='detail'">
                        <route-list
                            :pm_pub="mainData.pm_pub"
                        >
                        </route-list>
                    </Tab-pane>
                    <Tab-pane label="分包信息" name="customer-03" v-if="operateType=='detail' && routeCount>0">
                        <route-assign>
                        
                        </route-assign>
                    </Tab-pane>
                </Tabs>
            </div>
    </div>
</div>
</template>
<script>
    import { getPartnerList} from '@/api/src/customer'
    import { getPriceRouteList} from '@/api/src/price'
    import routeList from '@/components/project/v2/routeList.vue'
    import routeAssign from '@/components/project/v2/routeAssign.vue'
    import { mapState } from 'vuex'
    import slideModalMixin from '@/mixins/slideModalMixin'
    import rule from '@/utils/validate-rule'
    import {getDateFormat,getCurDate} from '@/utils/util'
    

    export default{
        name:'projectDetail',
        data:function(){
             return {
                user:'',
                operateType:'add',
                curid:'',
                ruleObj: {
                    prj_name: [
                        { required: true, message: '这是必填项' }
                    ],
                    partner_id: [
                        { required: true, message: '这是必填项' }
                    ],
                    dateRange: [
                        { required: true, message: '这是必填项' }
                    ],
                    contract_no: [
                        { required: true, message: '这是必填项' }
                    ],
                    prj_manager_id: [
                        { required: true, message: '这是必填项' }
                    ],
                    prj_officer_id: [
                        { required: true, message: '这是必填项' }
                    ],
                    prj_cussrv_id: [
                        { required: true, message: '这是必填项' }
                    ],
                    partner_id: [
                        { required: true, message: '这是必填项',trigger: 'change'  }
                    ],
                    partner_link_mobile: [
                        { required: true, message: '这是必填项' },
                        { pattern:/^1[34578]\d{9}$/, message: '正确输入号码格式' }
                    ],
                    prj_rate: [
                        { required: true, message: '这是必填项' },
                        {  pattern:/^\d{1,2}(\.\d{1,2})?$/, message: '小于100，小数点不能超过两位' }
                    ],
                },
                routeColumns: [
                    {title: '始发地城市',key: 'from_city', width : 410
                    }, 
                    {title: '目的地城市',key: 'to_city', width :410
                    },
                ],
                mainData:{
                    act_user_id : '',
                    prj_name : '',
                    partner_id:'',
                    back_order_type: 'NO',
                    back_order_nums: '',
                    back_type_other: '',
                    pm_id:"",
                    pm_pub:"",
                    pm_name:"",
                    prj_self:'Y',
                    effect_time_begin:'',
                    effect_time_end:'',
                    prj_id:'',
                    prj_recommend:'',
                    dateRange:'',
                    prj_rate:'',
                    prj_advance: false
                },
                search:{
                    page:1,
                    page_size:9999,
                    is_del:'N',
                    is_account:'N'
                },
                prj_id:'',
                partner_ids:'',
                partnerList : [],
                userList: [],
                routeList : [],
                slideModal : false,
                priceModel : false,
                isEditAble : false,
                routeCount : 0
             }
        },
        created(){
            
        },
        activated(){
            this.watchRouteIdHandler(this.$route.query.id)
         },
        components:{
            routeAssign,
            routeList
        },
        mounted() {
            this.mainData.act_user_id=this.userInfo.user_id
            this.search.act_user_id = this.userInfo.user_id
            this.watchRouteIdHandler(this.$route.query.id)
            bus.$on('route-total-compute',(x)=>{
                this.routeCount = x
            })
            
        },
        mixins: [slideModalMixin],
        computed: {
            ...mapState(['userInfo']),
            priceStatus(){
                if(this.mainData.pm_state == '1'){
                    return '生效'
                }
                else if(this.mainData.pm_state == '2'){
                    return '无效'
                }
                else if(this.mainData.pm_state == '3'){
                    return '已过期'
                }
                else if(this.mainData.pm_state == '0'){
                    return '未生效'
                }
            }
        },
        methods :{
            watchRouteIdHandler (id){
                this.loadUserList()
                this.loadPartnerList()
                this.$refs.mainData.resetFields()
                if (id) {
                    this.isEditAble = false
                    this.prj_id=id
                    this.operateType = 'detail'
                    this.loadDetail(id)
                }else{
                    this.operateType = 'add'
                    this.routeList=[]
                    this.isEditAble = true
                }
            },
            //载入详情数据和配载运单列表
            loadDetail(id){
                let _vm = this;
                
                this.$api.projectApi.projectDetail({prj_id:id,act_user_id:_vm.userInfo.user_id}).then(json=>{
                    this.mainData =Object.assign({},json.resultObj) 
                    this.mainData.dateRange=[this.mainData.effect_time_begin,this.mainData.effect_time_end]
                    this.mainData.prj_advance = json.resultObj.prj_advance=="Y"?true:false
                })
            },
            //客户列表
            loadPartnerList(){
                let _vm = this
                let params = Object.assign({},this.search)
                getPartnerList(params).then((data)=>{
                    _vm.partnerList = data.resultObj.list
                })
            },
            //用户列表
            loadUserList(){
                let _vm = this
                let params = Object.assign({},this.search)
                params.company_id = this.userInfo.company_id
                this.$api.projectApi.projectUserlist(params).then((data)=>{
                    _vm.userList = data.resultObj.list
                })
            },
            saveProject(){
                let _vm = this;
                let params = Object.assign({},this.mainData) 
                
                _vm.$refs.mainData.validate((valid) => {
                    if (valid) {
                        if(_vm.mainData.prj_self == 'Y' && parseFloat(_vm.mainData.prj_rate)<3){
                            return _vm.$Message.error("自营项目服务费不能小于3%")
                        }
                        if(_vm.mainData.prj_self == 'N' && parseFloat(_vm.mainData.prj_rate)<1){
                            return _vm.$Message.error("非自营项目服务费不能小于1%")
                        }
                        let dateArray=_vm.dateRangeFormate(this.mainData.dateRange)
                        params.effect_time_begin=dateArray[0]
                        params.effect_time_end=dateArray[1]
                        params.prj_advance = params.prj_advance?"Y":"N"
                        if(_vm.operateType=='detail'){
                            this.$api.projectApi.projectUpdate(params).then((json)=>{
                                _vm.$Message.success("修改成功")
                                _vm.isEditAble = false
                                this.routeBack()
                            })
                        }
                        else{
                            this.$api.projectApi.projectCreate(params).then((json)=>{
                                _vm.$Message.success("新增成功")
                                this.routeBack()
                            })
                        }
                    }
                })
            },
            edit(){
                this.isEditAble = true
            },
            cancelEdit(){
                let _vm = this
                this.$Modal.confirm({
                    title: '确认提示',
                    content: '是否确认取消编缉？',
                    onOk (){
                        _vm.isEditAble = false
                        _vm.loadDetail(_vm.prj_id)
                    }
                })
            },
            public(){
                let _vm = this
                if(_vm.routeCount == 0){
                    return _vm.$Message.error("该项目未导入价格表，不可发布")
                }
                this.$Modal.confirm({
                    title: '确认提示',
                    content: '是否确认发布？',
                    onOk (){
                        _vm.mainData.pm_pub = "1"
                        _vm.saveProject()
                    }
                })
                
            },
            del(){
                let _vm = this
                this.$Modal.confirm({
                    title: '确认提示',
                    content: '是否确认删除？',
                    onOk (){
                        _vm.mainData.is_del = "Y"
                        _vm.saveProject()
                    }
                })
                
            },
            cancel(){
                let _vm = this
                this.$Modal.confirm({
                    title: '确认提示',
                    content: '是否确认作废？',
                    onOk (){
                        _vm.mainData.pm_pub = "2"
                        _vm.saveProject()
                    }
                })
                
            },
            recovery(){
                let _vm = this
                this.$Modal.confirm({
                    title: '确认提示',
                    content: '是否确认恢复？',
                    onOk (){
                        _vm.mainData.pm_pub = "1"
                        _vm.saveProject()
                    }
                })
                
            },
            
            routeBack(){
                this.$router.go(-1)
            },
            dateRangeFormate(e){
                if(typeof(e[0]) == 'string'){
                    return e
                }else if(typeof(e[0]) == 'object'){
                    let a1 = getDateFormat(e[0]).substring(0,10)
                    let a2 = getDateFormat(e[1]).substring(0,10)
                    return [a1,a2]
                }
            },
        }
    }
        
</script>
<style  scoped="">
.state-status{
    margin-right:10px;
    margin-top:7px;
    padding:0 10px;
    border-radius:10px;
    background:rgba(22, 155, 213, 1);
    line-height: 20px;
    font-size: 12px;
    float: right;
    color:#fff
}
span.stategreen{
    background:green; 
    color:#fff
}
.statered{
    background:red;
    color:#fff
}
.stategray{
    background:#ccc;
    color:#000
}
</style>