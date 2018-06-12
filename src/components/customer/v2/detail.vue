<template lang="html">
    <div>
        <!-- 信息 -->
        <slide-modal v-model="slideModal" style="width: 860px;">
            <div slot="head" class="clearfix">
                <h3 class="fl">
                    {{operateType=='add'?'新增客户':'客户详情'}}
                </h3>
                <span class="fr">
                    <i-button size="small" v-show="operateType=='add'" type="primary" @click="addPartnernew">保存</i-button>
                    <i-button size="small" :disabled="detailData.audit_state=='CN'" v-show="operateType=='detail'" type="primary" @click="editPartner">保存</i-button>
                </span>
            </div>
            <div slot="default">
                <Tabs value="customer-01">
                    <Tab-pane label="基本信息" name="customer-01">
                        <div  style="width:690px">
                        <i-form  ref="detailData" :model="detailData" :rules="ruleObj"  :label-width="105">
                            <div class="row-box mb10">
                                <Row>
                                    <i-col span="24" style="padding:10px 15px"  v-show="!isBinded"> 
                                        <a href="javascript:void(0)" @click='bindCount'>绑定/邀请账号</a>
                                    </i-col>
                                    <i-col span="24"  v-show="isBinded"> 
                                        <Form-item label="账号：" prop="invite_mobile" >
                                            <span>{{detailData.invite_mobile}}</span>
                                            <a  v-show="(detailData.invite_type!=='1'  && detailData.audit_state!='Y')||operateType=='add'" class='ml10' href="javascript:void(0)" @click='bindCount' >更换绑定</a>
                                        </Form-item>
                                    </i-col>
                                </Row>
                            </div>
                            <div class="row-box mb10">
                                <Row>
                                    <i-col span="24" > 
                                        <Form-item label="公司名称：" prop="partner_name">
                                            <i-input v-model='detailData.partner_name' placeholder="请输入公司名称" style="width: 220px"></i-input>
                                        </Form-item>
                                    </i-col>
                                </Row>
                            </div>
                            <div class="row-box mb10">
                                <Row>
                                    <i-col span="12">
                                        <Form-item label="所在地：" prop="partner_ad">
                                            <province-cascader   placeholder="请选择地址" :opts="provinceOpts" v-model="detailData.partner_ad"></province-cascader>
                                        </Form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <Form-item label="地址：" prop="partner_address">
                                            <i-input v-model='detailData.partner_address'  placeholder="请输入地址" style="width: 220px"></i-input>
                                        </Form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <Form-item label="联系人：" prop="partner_link_name">
                                            <i-input v-model='detailData.partner_link_name' placeholder="请输入联系人" style="width: 220px"></i-input>
                                        </Form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <Form-item label="联系方式：" prop="partner_link_mobile">
                                            <i-input v-model='detailData.partner_link_mobile'  placeholder="请输入联系电话" style="width: 220px"></i-input>
                                        </Form-item>
                                    </i-col>
                                </Row>
                                
                            </div>
                            <div class="row-box mb10">
                                <Row>
                                    <i-col span="12">
                                        <Form-item label="客户类别：" prop="partner_type">
                                            <i-select v-model="detailData.partner_type" class="w220 partner-type">
                                                <i-option value="0">普通客户</i-option>
                                                <i-option value="1">项目客户</i-option>
                                            </i-select>
                                        </Form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <Form-item label="客户经理：" prop="partner_manager">
                                            <i-input v-model='detailData.partner_manager'  placeholder="请输入客户经理" style="width: 220px"></i-input>
                                        </Form-item>
                                    </i-col>
                                </Row>
                            </div>
                            <div class="row-box mb10">
                                <Row>
                                    <i-col span="12">
                                        <Form-item label="银行账号：" prop="partner_bank_no">
                                            <i-input v-model='detailData.partner_bank_no'  placeholder="请输入银行账号" style="width: 220px"></i-input>
                                        </Form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <Form-item label="发票抬头：" prop="partner_invoice">
                                            <i-input v-model='detailData.partner_invoice'  placeholder="请输入发票抬头" style="width: 220px"></i-input>
                                        </Form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <Form-item label="开户人：" prop="partner_bank_holder">
                                            <i-input v-model='detailData.partner_bank_holder' placeholder="请输入银行开户人" style="width: 220px"></i-input>
                                        </Form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <Form-item label="纳税人识别号：" prop="partner_taxpayer_credit">
                                            <i-input v-model='detailData.partner_taxpayer_credit' placeholder="请输入纳税人识别号" style="width: 220px"></i-input>
                                        </Form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <Form-item label="开户行：" prop="partner_bank_name">
                                            <i-input v-model='detailData.partner_bank_name' placeholder="请输入开户行" style="width: 220px"></i-input>
                                        </Form-item>
                                    </i-col>
                                </Row>
                            </div>
                            
                            <div class="row-box mb10">
                                <Row>
                                    <i-col span="12"> 
                                        <Form-item label="微信号："  prop="partner_wx">
                                            <i-input v-model='detailData.partner_wx' placeholder="请输入微信账号" style="width: 220px"></i-input>
                                        </Form-item>
                                    </i-col>
                                    <i-col span="12"> 
                                        <Form-item label="支付宝号："  prop="partner_ali">
                                            <i-input v-model='detailData.partner_ali' placeholder="请输入支付宝账号" style="width: 220px"></i-input>
                                        </Form-item>
                                    </i-col>
                                </Row>
                            </div>
                            <div class="row-box mb10">
                                <Row>
                                    <i-col span="24">
                                        <Form-item label="备注：" prop="partner_remark">
                                            <i-input v-model='detailData.partner_remark'  placeholder="请输入备注" style="width: 100%"></i-input>
                                        </Form-item>
                                    </i-col>
                                </Row>
                            </div>
                        </i-form>
                        </div>
                    </Tab-pane>
                    <Tab-pane label="发货联系人" name="customer-02" :disabled="curid==''">
                        <send-list :cs_id='curid'></send-list>
                    </Tab-pane>
                    <Tab-pane label="收货联系人" name="customer-03" :disabled="curid==''">
                        <recive-list :cs_id='curid'></recive-list>
                    </Tab-pane>
                    <Tab-pane label="价格管理" name="customer-04" :disabled="curid==''" v-if="isPrice">
                        <div class="ml30" v-show="priceList.length==0">暂无客户报价，请在价格管理中<a href="javascript:;"  @click="jumpToPrice('')">添加报价单</a></div>
                        <div class="ml30" v-show="priceList.length>0">
                            <p class="mb10" v-for='item in priceList'><a href="javascript:;" @click="jumpToPrice(item.pm_id)">{{item.pm_name}}</a></p>
                        </div>
                        
                    </Tab-pane>
                    <Tab-pane label="项目管理" name="customer-05" :disabled="curid==''" v-if="isProject">
                        <div class="ml30" v-show="projectList.length==0">暂无客户项目，请在项目管理中<a href="javascript:;" @click="jumpToObject('')">添加项目</a></div>
                        <div class="ml30" v-show="projectList.length>0">
                            <p class="mb10"  v-for='item in projectList'><a href="javascript:;" @click="jumpToObject(item.prj_id)">{{item.prj_name}}</a></p>
                        </div>
                    </Tab-pane>
                </Tabs>
            </div>
        </slide-modal>
       <Modal
            width="360"
            ref="bindM"
            v-model="bindMdal"
            title="绑定账号"
            @on-ok="modelok"
            >
            <p>
                客户账号：<i-input class="ml10" v-model='invite_mobile'  placeholder="请输入客户账号"  style="width: 200px"></i-input>
            </p>
        </Modal>
    </div>
</template>
<script>
    import { addPartner,getPartner,editPartner } from '@/api/src/customer'
    import reciveList from '@/components/customer/v2/reciveList.vue'
    import sendList from '@/components/customer/v2/sendList.vue'
    import { mapState } from 'vuex'
    import tableMixin from '@/mixins/tableMixin'
    import slideModalMixin from '@/mixins/slideModalMixin'
    import rule from '@/utils/validate-rule'
    import { getPriceList} from '@/api/src/price'
    import { getProjectList} from '@/api/src/projectApi'

    export default{
        name: 'tripDetailModal',
        props: {list_id: '', value: {require:true}},
        data:function(){
             return {
                user:'',
                operateType:'add',
                isBinded :false,
                invite_mobile:'',
                bindMdal: false,
                curid:'',
                search:{
                    page_size: 99,
                    act_user_id:''
                },
                ruleObj: {
                    partner_name: [
                        { required: true, message: '这是必填项' }
                    ],
                    partner_link_name: [
                        { required: true, message: '这是必填项' }
                    ],
                    partner_link_mobile: [
                        rule.required({ message: '联系人电话不能为空'}),
                        { validator: rule.phone, message: '请输入正确的手机号', trigger: 'blur' }
                    ],
                    partner_ad: [
                        { required: true, message: '这是必填项' }
                    ],
                    partner_manager: [
                        { required: true, message: '这是必填项' }
                    ],
                    partner_address: [
                        { required: true, message: '这是必填项' }
                    ],
                    invite_mobile:[
                        { pattern:/^1[34578]\d{9}$/, message: '正确输入手机号码格式' }
                    ],
                },
                detailData:{
                    act_user_id: '',
                    partner_name: '',
                    partner_type: '0',
                    partner_link_name: '',
                    partner_link_mobile: '',
                    partner_ad: '',
                    partner_area: '',
                    partner_area_code: '',
                    partner_address: '',
                    partner_remark: '',
                    invite_mobile: '',
                    partner_bank_no: '',
                    partner_bank_name: '',
                    partner_invoice: '',
                    partner_bank_holder: '',
                    invite_mobile: '',
                    partner_taxpayer_credit: '',
                    partner_ali: '',
                    partner_wx: '',
                    partner_manager: '',
                    invite_type: '',
                    audit_state: ''
                },
                priceList: [],
                projectList: [],
                isProject: false,
                isPrice: false,
                provinceOpts: { 'change-on-select': true },
             }
        },
        created(){
        
        },
        mounted() {
            this.detailData.act_user_id=this.userInfo.user_id
            this.isProject=this.funcMenu.includes('CUSTOMER_V2_PRJECT')
            this.isPrice=this.funcMenu.includes('CUSTOMER_V2_PRICE')
        },
        components: {
            reciveList,
            sendList,
        },
        mixins: [tableMixin,slideModalMixin],
        computed: {
            ...mapState(['userInfo','funcMenu'])
        },
        watch: {
            value (){
                this.slideModal = this.value;
            },
            list_id (){
                this.$refs.detailData.resetFields();
                this.curid=this.list_id;
                if(this.list_id==''){
                    this.operateType='add'
                    this.detailData.invite_type=''
                    this.isBinded=false
                }
                else{
                    this.operateType='detail'
                    this.loadDetail();
                    this.loadPricelist()
                    this.loadPorjectlist()
                }
            },
            slideModal (n,o){
                this.$emit('input',this.slideModal)
            }
        },
        methods :{
            //载入详情数据和配载运单列表
            loadDetail(){
                let _vm = this;
                getPartner({pcid:_vm.list_id,act_user_id:_vm.userInfo.user_id}).then(json=>{
                    _vm.detailData.partner_name = json.resultObj.partner_name
                    _vm.detailData.partner_type = json.resultObj.partner_type || "0"
                    _vm.detailData.partner_link_name = json.resultObj.partner_link_name
                    _vm.detailData.partner_link_mobile = json.resultObj.partner_link_mobile
                    _vm.detailData.partner_ad = json.resultObj.partner_area_code+"$"+json.resultObj.partner_area
                    _vm.detailData.partner_address = json.resultObj.partner_address
                    _vm.detailData.partner_remark = json.resultObj.partner_remark
                    _vm.detailData.partner_bank_no = json.resultObj.partner_bank_no
                    _vm.detailData.partner_bank_name = json.resultObj.partner_bank_name
                    _vm.detailData.partner_invoice = json.resultObj.partner_invoice
                    _vm.detailData.partner_bank_holder = json.resultObj.partner_bank_holder
                    _vm.detailData.partner_taxpayer_credit = json.resultObj.partner_taxpayer_credit
                    _vm.detailData.partner_ali = json.resultObj.partner_ali
                    _vm.detailData.partner_wx = json.resultObj.partner_wx
                    _vm.detailData.partner_manager = json.resultObj.partner_manager
                    
                    _vm.detailData.invite_type = json.resultObj.invite_type
                    _vm.detailData.audit_state = json.resultObj.audit_state
                    if(json.resultObj.invite_mobile){
                        _vm.detailData.invite_mobile = json.resultObj.invite_mobile
                        _vm.isBinded=true;
                    }
                    else{
                        _vm.isBinded=false;
                    }
                    
                })
            },
            addPartnernew(){
                let _vm = this;
                var Addr = this.detailData.partner_ad.split("$");
                this.detailData.partner_area = Addr[1];
                this.detailData.partner_area_code = Addr[0];
                _vm.$refs.detailData.validate((valid) => {
                    if (valid) {
                        addPartner(this.detailData).then((json)=>{
                            _vm.$Message.success("新增成功")
                            _vm.curid=json.resultObj
                            _vm.slideModal=false
                            bus.$emit('customer-list-reload')
                        })
                    }
                })
            },
            editPartner(){
                let _vm = this;
                var Addr = this.detailData.partner_ad.split("$");
                this.detailData.partner_area = Addr[1];
                this.detailData.partner_area_code = Addr[0];
                _vm.$refs.detailData.validate((valid) => {
                    if (valid) {
                        editPartner({pcid:_vm.list_id,...this.detailData}).then((json)=>{
                            _vm.$Message.success("修改成功")
                            bus.$emit('customer-list-reload')
                        })
                    }
                })
            },
            bindCount (){
                this.bindMdal=true
            },
            cancelCount(){
                this.isBinded=false
                this.detailData.invite_mobile = '';
            },
            modelok (){
                let rep = /^1[34578]\d{9}$/
                if(rep.test(this.invite_mobile)){
                    this.isBinded = true
                    this.detailData.invite_mobile = this.invite_mobile
                }
                else{
                    this.$Message.error('号码格式错误，请重新绑定');
                }  
            },
            loadPricelist(){
                let _vm = this;
                _vm.search.act_user_id = _vm.userInfo.user_id;
                _vm.search.partner_id = _vm.list_id;
                let params = this.assignQuery(_vm.search);
                getPriceList(params).then((data)=>{
                    _vm.priceList = data.resultObj.list
                })
            },
            loadPorjectlist(){
                let _vm = this;
                _vm.search.act_user_id = _vm.userInfo.user_id;
                _vm.search.partner_id = _vm.list_id;
                let params = this.assignQuery(_vm.search);
                getProjectList(params).then((data)=>{
                    _vm.projectList = data.resultObj.list
                })
            },
            //路由切换至价格
            jumpToPrice(id){
                if(id){
                    let params = {path: '/price/v2/detail'}
                    params.query = {id: id}
                    this.$router.push(params)
                }
                else{
                    let params = {path: '/price/v2/'}
                    this.$router.push(params)
                }
            },
            //路由切换至项目
            jumpToObject(id){
                if(id){
                    let params = {path: '/project/v2/detail'}
                    params.query = {id: id}
                    this.$router.push(params)
                }
                else{
                    let params = {path: '/project/v2/'}
                    this.$router.push(params)
                }
            },
        }
    }
        
</script>
<style lang="scss">
.partner-type .ivu-select-dropdown{
    position:absolute !important;
}
</style>
