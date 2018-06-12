<template lang="html">
<div>
    <div class='contain-head' >
        <div>
            <div slot="head" class="clearfix">
                <h3 class="fl">
                    <i-button size="small" class="mr10"  @click="routeBack"><返回</i-button>
                    {{operateType=='add'?'新增价格':'价格详情'}}
                </h3>
                <span class="fr">
                    <i-button size="small" type="primary" @click="addMain"  v-if="mainData.pm_pub!='2' && isEditAble">保存</i-button>
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
    <div class="contain-main">
        <!-- 信息 -->
        <div >
            <div slot="default">
                <!--<Form  ref="" :model="" :rules="" :label-width="90">-->
                <i-form  ref="mainData" :model="mainData" :rules="ruleObj"  >
                    <div class="row-box mb10" v-show="loadResultTab" style="background:#e9eaec">
                        <Row>
                            <i-col span="24">
                                <span class="fl mt5 ml10"><Icon size='22' color="#19be6b" type="ios-checkmark-outline"></Icon></span>
                                <span class="fl mt5 ml10">价格表导入成功！共导入{{loadResultCount}}条数据！</span>
                                <span class="fr mt5 mr10" @click="closeLoadResult"><Icon type="close"></Icon></span>
                            </i-col>
                        </Row>
                    </div>
                    <div class="row-box mb10">
                        <Row>
                            <i-col span="12">
                                <Form-item label="报价名称：" prop="pm_name"  :label-width="90">
                                    <i-input  :disabled="!isEditAble"  v-model='mainData.pm_name' class="fl" placeholder="请输入报价名称" style="width: 300px"></i-input>
                                    <span :class="[{ stategreen: mainData.pm_pub == '1' },{ statered: mainData.pm_pub == '2' }]" class="state-status" v-show="operateType=='detail'">{{["草稿","已发布","已作废"][mainData.pm_pub]}}</span>
                                </Form-item>
                            </i-col>
                            <i-col span="12">
                                <Form-item label="有效期(起止)：" prop="dateRange"  :label-width="110">
                                    <DatePicker   :disabled="!isEditAble" v-model="mainData.dateRange"  class="fl" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="选择日期"  style="width: 300px"></DatePicker>
                                    <span :class="[{ stategreen: mainData.pm_state == '1' } ]" class="state-status stategray" v-if="mainData.pm_pub == '1'">{{priceStatus}}</span>
                                </Form-item>
                            </i-col>
                        </Row>
                    </div>
                    <div class="row-box mb10">
                        <Row>
                            <i-col span="6">
                                <Form-item label="报价类型：" :label-width="90">
                                    <i-select   v-model="mainData.pm_for" :disabled="operateType=='detail'">
                                        <i-option value="0">成员价</i-option>
                                        <i-option value="1">公布价</i-option>
                                    </i-select>
                                </Form-item>
                            </i-col>
                            <i-col span="6">
                                <Form-item label="报价成员：" prop="liner_id" :label-width="90">
                                    <i-select   v-model="mainData.liner_id" :disabled="operateType=='detail'">
                                        <i-option v-for="item in linerList"  :key="item" :value="item.lcid">{{item.liner_name}}</i-option>
                                    </i-select>
                                </Form-item>
                            </i-col>
                            <i-col span="6" v-if="operateType=='detail'">
                                <Form-item label="创建人员：" :label-width="80">
                                    <Input v-model='creater' placeholder="请输入创建人员" :readonly="operateType=='detail'"></Input>
                                </Form-item>
                            </i-col>
                            <i-col span="6" v-if="operateType=='detail'">
                                <Form-item label="最近更新："  :label-width="80">
                                    <Input  v-model='lastUpdater' placeholder="请输入最近更新" :readonly="operateType=='detail'"></Input>
                                </Form-item>
                            </i-col>
                        </Row>
                    </div>
                </i-form>
                <div class="mt20" v-if="operateType=='detail'">
                    <router-list :pm_pub="mainData.pm_pub"></router-list>
                </div>
            </div>
            
        </div>
    </div>
</div>
</template>
<script>
    import { getLinerList} from '@/api/src/linerApi'
    import { addPrice,getPrice,editPrice} from '@/api/src/price'
    import routerList from '@/components/price/v2/routerList.vue'
    import { mapState } from 'vuex'
    import tableMixin from '@/mixins/tableMixin'
    import rule from '@/utils/validate-rule'
    import {getDateFormat,getCurDate} from '@/utils/util'
    export default{
        name:'priceDetail',
        data:function(){
             return {
                user:'',
                operateType:'add',
                ruleObj: {
                    pm_name: [
                        { required: true, message: '这是必填项' }
                    ],
                    dateRange: [
                        { required: true, message: '这是必填项' }
                    ],
                    liner_id: [
                        { required: true, message: '这是必填项' ,trigger:'change'}
                    ],
                    partner_name: [
                        { required: true, message: '这是必填项' ,trigger:'change'}
                    ],
                },
                search:{
                    act_user_id:'',
                    page_size:99,
                    is_del:'N',
                    is_account:'Y',
                    account_status: 'Y',
                },
                submitData:{
                    pm_pub: '',
                    is_del: '',
                },
                mainData:{
                    act_user_id: '',
                    liner_id: '',
                    effect_time_begin: '',
                    effect_time_end: '',
                    pm_for: '0',
                    dateRange: '',
                },
                isGreen: true,
                list_id: '',
                linerList: '',
                creater:'',
                lastUpdater:'',
                loadResultTab: false,
                loadResultCount: 0,
                isEditAble:false,
             }
        },
        created(){
        },
        activated(){
            this.watchRouteIdHandler(this.$route.query.id)
         },
        components: {
            routerList
        },
        mounted() {
            this.list_id=this.$route.query.id
            this.watchRouteIdHandler(this.list_id)
            this.loadLinerlist()
            this.mainData.act_user_id=this.userInfo.user_id
            bus.$on('route-upload-load', (e)=>{
                this.showLoadResult(e)
            })
            bus.$on('route-finish-load', (e)=>{
                this.loadResultCount = e
            })
        },
        mixins: [tableMixin],
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
                this.$refs.mainData.resetFields()
                
                this.list_id = id
                if (id) {
                    this.operateType = 'detail'
                    this.loadDetail(id)
                    this.isEditAble = false
                }else{
                    this.operateType = 'add'
                    this.isEditAble = true
                }
            },
            //载入详情数据和配载运单列表
            loadDetail(id){
                let _vm = this;
                getPrice({pm_id:id,act_user_id:_vm.userInfo.user_id}).then(json=>{
                    _vm.mainData.pm_name = json.resultObj.pm_name
                    _vm.mainData.liner_id = json.resultObj.liner_id
                    _vm.mainData.pm_for = json.resultObj.pm_for
                    _vm.mainData.pm_pub = json.resultObj.pm_pub
                    _vm.mainData.pm_state = json.resultObj.pm_state
                    _vm.mainData.dateRange = [json.resultObj.effect_time_begin,json.resultObj.effect_time_end]
                    _vm.creater = json.resultObj.create_user_name +" "+json.resultObj.create_time
                    _vm.lastUpdater = (json.resultObj.modify_user_name?json.resultObj.modify_user_name:'') +" "+(json.resultObj.modify_time?json.resultObj.modify_time:'')

                })
            },
            loadLinerlist(){
                let _vm = this;
                _vm.search.act_user_id=_vm.userInfo.user_id;
                let params = this.assignQuery(_vm.search);
                getLinerList(params).then((data)=>{
                    _vm.linerList = data.resultObj.list
                })
            },
            addMain(){
                let _vm = this;
                _vm.$refs.mainData.validate((valid) => {
                    if (valid) {
                        let params = Object.assign({},_vm.mainData,_vm.submitData)
                        
                        let dateArr = this.dateRangeFormate(params.dateRange)
                        params.effect_time_begin = dateArr[0]
                        params.effect_time_end = dateArr[1]
                        if(_vm.operateType=='add'){
                            addPrice(params).then((json)=>{
                                _vm.$Message.success("新增成功")
                                _vm.routeBack()
                            })
                        }
                        else{
                            if (valid) {
                                delete params.dateRange
                                delete params.pm_for
                                delete params.liner_id
                                delete params.pm_state
                                if(params.pm_pub!='1'){
                                    params.pm_state = ''
                                }
                                //如果是删除，需要有效时间清空，后端不会误判
                                if(params.is_del=='Y'){
                                    params.effect_time_begin = ''
                                    params.effect_time_end = ''
                                }
                                editPrice({pm_id:_vm.list_id,...params}).then((json)=>{
                                    _vm.isEditAble = false
                                    if(params.is_del=='Y'){
                                        _vm.$Message.success("删除成功")
                                        return _vm.routeBack()
                                    }
                                    _vm.$Message.success("修改成功")
                                    _vm.loadDetail(_vm.list_id)
                                    //_vm.routeBack()
                                })
                            }
                        }

                    }
                })
            },
            public(){
                let _vm = this
                if(_vm.loadResultCount == 0){
                    return _vm.$Message.error("请先导入价格后再发布")
                }
                this.$Modal.confirm({
                    title: '确认提示',
                    content: '是否确认发布？',
                    onOk (){
                        _vm.submitData.pm_pub = "1"
                        _vm.addMain()
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
                        _vm.loadDetail(_vm.list_id)
                    }
                })
            },
            del(){
                let _vm = this
                this.$Modal.confirm({
                    title: '确认提示',
                    content: '是否确认删除？',
                    onOk (){
                        _vm.submitData.is_del = "Y"
                        _vm.addMain()
                    }
                })
                
            },
            cancel(){
                let _vm = this
                this.$Modal.confirm({
                    title: '确认提示',
                    content: '是否确认作废？',
                    onOk (){
                        _vm.submitData.pm_pub = "2"
                        _vm.addMain()
                    }
                })
                
            },
            recovery(){
                let _vm = this
                this.$Modal.confirm({
                    title: '确认提示',
                    content: '是否确认恢复？',
                    onOk (){
                        _vm.submitData.pm_pub = "1"
                        _vm.addMain()
                    }
                })
                
            },
            routeBack(){
                this.$router.go(-1)
            },
            showLoadResult(e){
                if(!e){
                    this.loadResultTab = false
                    this.loadResultCount = e  
                    return  
                }
                this.loadResultTab = true
                this.loadResultCount = e
            },
            closeLoadResult(){
                this.loadResultTab = false
                this.loadResultCount = 0
            },
            dateRangeFormate(e){
                if(typeof(e[0]) == 'string'){
                    return e
                }else if(typeof(e[0]) == 'object'){
                    let a1 = getDateFormat(e[0]).substring(0,10)
                    let a2 = getDateFormat(e[1]).substring(0,10)
                    return [a1,a2]
                }
            }

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
