<template lang="html">
    <div>
        <!-- 信息 -->
        <slide-modal v-model="slideModal" style="width: 860px;">
            <div slot="head" class="clearfix">
                <h3 class="fl">
                    {{operateType=='add'?'新增承运商':'承运商详情'}}
                </h3>
                <span class="fr">
                    <i-button size="small" v-show="operateType=='add'" type="primary" @click="addLinernew">保存</i-button>
                    <i-button :disabled="linerData.audit_state=='CN'" size="small" v-show="operateType=='detail'" type="primary" @click="editLiner">保存</i-button>
                </span>
            </div>
            <div slot="default" style="width:720px">
                <!--<Form  ref="" :model="" :rules="" :label-width="90">-->
                <i-form  ref="linerData" :model="linerData" :rules="ruleObj"  :label-width="105">
                    <!--
                    <div class="row-box mb10">
                        <Row >
                            <i-col span="24" style="padding:10px 15px"  v-show="!isBinded"> 
                                <a href="javascript:void(0)" @click='bindCount'>绑定/邀请账号</a>
                            </i-col>
                            <i-col span="24"  v-show="isBinded"> 
                                <Form-item label="账号：" prop="invite_mobile" >
                                    <span>{{linerData.invite_mobile}}</span>
                                    <a v-show="(linerData.invite_type!=='1'  && linerData.audit_state!='Y')||operateType=='add'" class='ml10' href="javascript:void(0)" @click='bindCount' >更换绑定</a>
                                </Form-item>
                            </i-col>
                        </Row>
                    </div>
                    -->
                    <div class="row-box mb10">
                        <Row>
                            <i-col span="12">
                                <Form-item label="公司名称：" prop="liner_name">
                                    <i-input v-model='linerData.liner_name' placeholder="请输入公司名称" style="width: 220px"></i-input>
                                </Form-item>
                            </i-col>
                            <i-col span="12">
                                <Form-item label="承运商类别：" prop="">
                                    <Radio-group class="ml5"  v-model="linerData.liner_type">
                                        <Radio label="0" >
                                            <span>专线</span>
                                        </Radio>
                                        <Radio label="1">
                                            <span>车队</span>
                                        </Radio>
                                    </Radio-group>
                                </Form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="12">
                                <Form-item label="负责人：" prop="liner_link_name">
                                    <i-input v-model='linerData.liner_link_name' placeholder="请输入负责人" style="width: 220px"></i-input>
                                </Form-item>
                            </i-col>
                            <i-col span="12">
                                <Form-item label="联系方式：" prop="liner_link_mobile">
                                    <i-input v-model='linerData.liner_link_mobile'  placeholder="请输入联系电话" style="width: 220px"></i-input>
                                </Form-item>
                            </i-col>
                        </Row>
                    </div>
                    <div class="row-box mb10">
                        <Row>
                            <i-col span="12">
                                <Form-item label="所在地：" prop="liner_ad">
                                    <province-cascader   placeholder="请选择地址" :opts="provinceOpts"  v-model="linerData.liner_ad"></province-cascader>
                                </Form-item>
                            </i-col>
                            <i-col span="12">
                                <Form-item label="地址：" prop="liner_address">
                                    <i-input v-model='linerData.liner_address'  placeholder="请输入地址" style="width: 220px"></i-input>
                                </Form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="12">
                                <Form-item label="所在物流园：" prop="liner_park">
                                    <i-input v-model='linerData.liner_park' placeholder="请输入所在物流园" style="width: 220px"></i-input>
                                </Form-item>
                            </i-col>
                            <i-col span="12">
                                <Form-item label="档口名称：" prop="liner_stall">
                                    <i-input v-model='linerData.liner_stall'  placeholder="请输入档口名称" style="width: 220px"></i-input>
                                </Form-item>
                            </i-col>
                        </Row>
                    </div>
                    <div class="row-box mb10" v-show="operateType=='detail'">
                        <Row>
                            <i-col span="12">
                                <Form-item label="承运商评分：" prop="">
                                    <Rate show-text :disabled="linerData.audit_state=='CN'" allow-half v-model="scoreObj.complex_score" @on-change="rate">
                                    </Rate>
                                </Form-item>
                            </i-col>
                        </Row>
                    </div>
                    
                    <div class="row-box mb10" v-if="isPrice" v-show="operateType=='detail'">
                        <Row>
                            <i-col span="24" style="height:auto">
                                <Form-item label="承运线路：" prop="">
                                    <div class="ml30" v-show="priceList.length==0">暂无价格项目，去<a href="javascript:;" @click="jumpToPrice('')">添加</a></div>
                                    <div class="ml30" v-show="priceList.length>0">
                                        <p class="mb10" v-for='item in priceList'><a href="javascript:;" @click="jumpToPrice(item.pm_id)">{{item.pm_name}}</a></p>
                                    </div>
                                </Form-item>
                            </i-col>
                        </Row>
                    </div>
                    <div class="row-box mb10">
                        <Row>
                            <i-col span="24">
                                <Form-item label="备注：" prop="liner_remark">
                                    <i-input v-model='linerData.liner_remark'  placeholder="请输入备注"  style="width: 100%"></i-input>
                                </Form-item>
                            </i-col>
                        </Row>
                    </div>
                </i-form>
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
                承运商账号：<i-input class="ml10" v-model='invite_mobile'  placeholder="请输入承运商账号"  style="width: 200px"></i-input>
            </p>
        </Modal>
    </div>
</template>
<script>
    import { addLiner,getLiner,editLiner,setLinerScore } from '@/api/src/linerApi'
    import { mapState } from 'vuex'
    import tableMixin from '@/mixins/tableMixin'
    import slideModalMixin from '@/mixins/slideModalMixin'
    import rule from '@/utils/validate-rule'
    import {getCurDate} from '@/utils/util'
    import { getPriceList} from '@/api/src/price'
    export default{
        name: 'tripDetailModal',
        props: {liner_id: '', value: {require:true}},
        data:function(){
             return {
                user:'',
                operateType:'add',
                isBinded :false,
                invite_mobile: '',
                bindMdal: false,
                provinceOpts: { 'change-on-select': true },
                search:{
                    page_size: 99,
                    act_user_id:''
                },
                scoreObj: {
                    lcid: '',
                    complex_score: 0,
                    complex_score_man: '',
                    complex_score_time: ''
                },
                ruleObj: {
                    invite_mobile: [
                        { required: true, message: '这是必填项' }
                    ],
                    liner_name: [
                        { required: true, message: '这是必填项' }
                    ],
                    liner_link_name: [
                        { required: true, message: '这是必填项' }
                    ],
                    liner_link_mobile: [
                        rule.required({ message: '联系人电话不能为空'}),
                        { validator: rule.phone, message: '请输入正确的手机号', trigger: 'blur' }    
                    ],
                    liner_ad: [
                        { required: true, message: '这是必填项' }
                    ],
                    liner_address: [
                        { required: true, message: '这是必填项' }
                    ],
                    invite_mobile:[
                        { pattern:/^1[34578]\d{9}$/, message: '正确输入手机号码格式' }
                    ],
                },
                linerData:{
                    act_user_id: '',
                    liner_name: '',
                    liner_type: 0,
                    liner_link_name: '',
                    liner_link_mobile: '',
                    liner_ad: '',
                    liner_area: '',
                    liner_area_code: '',
                    liner_address: '',
                    liner_park: '',
                    liner_stall: '',
                    liner_remark: '',
                    invite_mobile: '',
                    audit_state: '',
                    invite_type: ''
                },
                priceList: [],
                isPrice: false
             }
        },
        created(){
        
        },
        mounted() {
            this.linerData.act_user_id=this.userInfo.user_id
            this.isPrice=this.funcMenu.includes('LINER_V2_PRICE')
            
        },
        mixins: [tableMixin,slideModalMixin],
        computed: {
            ...mapState(['userInfo','funcMenu'])
        },
        watch: {
            value (){
                this.slideModal = this.value;
            },
            liner_id (){
                this.$refs.linerData.resetFields();
                if(this.liner_id==''){
                    this.operateType='add'
                    this.isBinded=false
                    this.linerData.invite_type=''
                }
                else{
                    this.operateType='detail'
                    this.loadDetail()
                    this.loadPricelist()
                }
            },
            slideModal (n,o){
                this.$emit('input',this.slideModal)
                if(n){
                    setTimeout(()=>{
                        if(this.operateType=='detail'){
                            this.$refs.linerData.resetFields();
                            this.loadDetail()
                            this.loadPricelist()
                        }
                        },100)
                }
            }
        },
        methods :{
            //载入详情数据和配载运单列表
            loadDetail(){
                let _vm = this;
                getLiner({lcid:_vm.liner_id,act_user_id:_vm.userInfo.user_id}).then(json=>{
                    _vm.linerData.liner_name = json.resultObj.liner_name
                    _vm.linerData.liner_type = json.resultObj.liner_type
                    _vm.linerData.liner_link_name = json.resultObj.liner_link_name
                    _vm.linerData.liner_link_mobile = json.resultObj.liner_link_mobile
                    _vm.linerData.liner_ad = json.resultObj.liner_area_code+"$"+json.resultObj.liner_area
                    _vm.linerData.liner_address = json.resultObj.liner_address
                    _vm.linerData.liner_park = json.resultObj.liner_park
                    _vm.linerData.liner_stall = json.resultObj.liner_stall
                    _vm.linerData.liner_remark = json.resultObj.liner_remark
                    _vm.linerData.audit_state = json.resultObj.audit_state
                    _vm.linerData.invite_type = json.resultObj.invite_type

                    _vm.scoreObj.complex_score=json.resultObj.complex_score
                    
                    if(json.resultObj.invite_mobile){
                        _vm.linerData.invite_mobile = json.resultObj.invite_mobile
                        _vm.isBinded=true;
                    }
                    else{
                        _vm.isBinded=false;
                    }
                    
                })
            },
            addLinernew(){
                let _vm = this;
                var Addr = this.linerData.liner_ad.split("$");
                this.linerData.liner_area = Addr[1];
                this.linerData.liner_area_code = Addr[0];
                _vm.$refs.linerData.validate((valid) => {
                    if (valid) {
                        addLiner(this.linerData).then((json)=>{
                            _vm.$Message.success("新增成功")
                            bus.$emit('liner-list-reload')
                            _vm.slideModal=false
                            _vm.$refs.linerData.resetFields();
                        })
                    }
                })
            },
            editLiner(){
                let _vm = this;
                var Addr = this.linerData.liner_ad.split("$");
                this.linerData.liner_area = Addr[1];
                this.linerData.liner_area_code = Addr[0];
                _vm.$refs.linerData.validate((valid) => {
                    if (valid) {
                        editLiner({lcid:_vm.liner_id,...this.linerData}).then((json)=>{
                            _vm.$Message.success("修改成功")
                            bus.$emit('liner-list-reload')
                        })
                    }
                })
            },
            bindCount (){
                this.bindMdal=true
            },
            cancelCount(){
                this.isBinded=false
                this.linerData.invite_mobile = '';
            },
            rate(){
                this.scoreObj.lcid = this.liner_id;
                this.scoreObj.complex_score_man = this.userInfo.user_name;
                this.scoreObj.complex_score_time = getCurDate()
                setLinerScore(this.scoreObj).then(json=>{
                    this.$Message.success("评分成功")
                })    
            },
            modelok (){
                let rep = /^1[34578]\d{9}$/
                if(rep.test(this.invite_mobile)){
                    this.isBinded = true
                    this.linerData.invite_mobile = this.invite_mobile
                }
                else{
                    this.$Message.error('号码格式错误，请重新绑定');
                }  
            },
            loadPricelist(){
                let _vm = this;
                _vm.search.act_user_id = _vm.userInfo.user_id;
                _vm.search.liner_id = _vm.liner_id;
                let params = this.assignQuery(_vm.search);
                getPriceList(params).then((data)=>{
                    _vm.priceList = data.resultObj.list
                })
            },
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
        }
    }
        
</script>
