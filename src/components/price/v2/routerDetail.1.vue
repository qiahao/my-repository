<template lang="html">
    <div>
        <!-- 运单信息 -->
        <slide-modal v-model="slideModal" style="width: 960px;">
            <div slot="head">车次详情
                <span>
                    <Button type="primary" @click="addMain">保存</Button>
                </span>
            </div>
            <div slot="default" style="width:920px">   
                <Form  ref="mainData" :model="mainData" :rules="ruleObj"  :label-width="115">
                    <Row v-if="trace_type=='0'">
                        <Col span="24">
                            <Form-item label="是否分段："  :label-width="85">
                                <Radio-group class="ml5"  v-model="sectionInfo.is_section">
                                    <Radio label="0" >
                                        <span>否</span>
                                    </Radio>
                                    <Radio label="1">
                                        <span>是</span>
                                    </Radio>
                                </Radio-group>
                            </Form-item>
                        </Col>
                        <Col span="24" v-if="sectionInfo.is_section=='1'">
                            <div class="router-section">
                                <Row>
                                    <Col span="6">
                                        <Form-item label="分段类型："  :label-width="85">
                                            <Radio-group class="ml5"  v-model="sectionInfo.section_type">
                                                <Radio label="吨" >
                                                    <span>吨</span>
                                                </Radio>
                                                <Radio label="方">
                                                    <span>方</span>
                                                </Radio>
                                            </Radio-group>
                                        </Form-item>
                                    </Col>
                                    <Col span="4">
                                        <Form-item label="分段名称："  :label-width="85">
                                            <Input  size="small" v-model="sectionInfo.section_name"  placeholder="分段" style="width:120px"></Input>
                                        </Form-item> 
                                    </Col>
                                    <Col span="8">
                                        <Form-item  :label-width="0">
                                            <Button type="primary" size="small" @click="addSection">添加分段</Button>
                                        </Form-item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="24">
                                        <Form-item label="分段列表："  :label-width="85">
                                            <span v-show="columns.length==0">无</span>
                                            <ul  v-show="columns.length>0" class="clearfix section-list">
                                                <li v-for="item in columns"><span>{{item}}</span><span  @click="removeSection(item)"><Icon class="ml5" type="close-circled"></Icon></span></li>
                                            </ul>
                                        </Form-item>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    
                    
                    <div class="form-table cf-all mt10">
                        <div class="form-table-row cragos-list  cf-all text-center">
                            <Form-item v-for="item in newColumns"  class="form-item" style='text-align:center' >
                                {{item}}
                            </Form-item>
                        </div>
                        <div class="form-table-row cragos-list  cf-all text-center">
                            <Form-item  :label-width="0" class="form-item">
                                <Input  placeholder="始发地"></Input>
                            </Form-item>
                            <Form-item class="form-item"  > 
                                <Input  placeholder="提货费"></Input>
                            </Form-item>
                            <Form-item class="form-item"  >
                                <Input  placeholder="目的地"></Input>
                            </Form-item>
                            <Form-item  class="form-item" > 
                                <Input  placeholder="送货费"></Input>
                            </Form-item>
                            <Form-item  class="form-item" > 
                                <Input  placeholder="最低收费"></Input>
                            </Form-item>
                            <Form-item  class="form-item" > 
                                <Input  placeholder="小时"></Input>
                            </Form-item>
                        </div>
                    </div>
                </Form>
            </div>
            
        </slide-modal>
    </div>
</template>
<script>
    import { addPrice,getPrice,editPrice} from '@/api/src/price'
    import { mapState } from 'vuex'
    import tableMixin from '@/mixins/tableMixin'
    import slideModalMixin from '@/mixins/slideModalMixin'
    import rule from '@/utils/validate-rule'
    import {getDateFormat,getCurDate} from '@/utils/util'
    export default{
        name: 'tripDetailModal',
        props: {
            list_id: '', 
            value: {require:true},
            trace_type: ''
        },
        data:function(){
             return {
                user:'aaaaaa',
                operateType:'add',
                sectionInfo:{
                    is_section:'0',
                    section_type:'吨',
                    section_name:'',
                },
                ruleObj: {
                    pm_name: [
                        { required: true, message: '这是必填项' }
                    ],
                    effect_time_begin: [
                        { required: true, message: '这是必填项' }
                    ],
                },
                columns:[
                    
                ],
                search:{
                    act_user_id:'',
                    page_size:99,
                },
                mainData:{
                    act_user_id: '',
                    pm_name: '',
                    pm_type: '0',
                    partner_name: '',
                    partner_id: '',
                    list_id: '',
                    liner_name: '',
                    effect_time_begin: '',
                    effect_time_end: '',
                    pm_bulk: '0',
                    pm_price_unit: [],
                    pm_state: '2',
                    pm_pay_type: ''
                },
             }
        },
        components: {
        },
        mounted() {
            this.mainData.act_user_id=this.userInfo.user_id
        },
        mixins: [tableMixin,slideModalMixin],
        computed: {
            ...mapState(['userInfo']),
            newColumns(){
                let array=[]
                if(this.trace_type=='0' && this.sectionInfo.is_section=='0'){
                    array=[
                        '价格/吨',
                    ]
                }
                else if(this.trace_type=='0' && this.sectionInfo.is_section=='1'){
                    array=this.columns
                }
                else{

                }
                return [
                    '始发地',
                    '目的地',
                    '提货费',
                    '送货费',
                    '最低收费',
                    ...array,
                    '运输时间',
                ]
                
            }
        },
        watch: {
            value (){
                this.slideModal = this.value;
            },
            list_id (){
                this.$refs.mainData.resetFields();
                if(this.list_id==''){
                    this.operateType='add'
                    this.isBinded=false
                }
                else{
                    this.operateType='detail'
                    this.loadDetail()
                }
            },
            slideModal (n,o){
                this.$emit('input',this.slideModal)
            },
        },
        methods :{
            //载入详情数据和配载运单列表
            loadDetail (){
                let _vm = this;
                getPrice({pm_id:_vm.list_id,act_user_id:_vm.userInfo.user_id}).then(json=>{
                    delete json.resultObj.modify_user_name;
                    delete json.resultObj.pm_state_str;
                    delete json.resultObj.modify_user_id;
                    json.resultObj.pm_price_unit=json.resultObj.pm_price_unit?json.resultObj.pm_price_unit.split(','):[]
                    _vm.mainData = Object.assign(_vm.mainData,json.resultObj)
                })
            },
            addMain (){
                let _vm = this;
                _vm.$refs.mainData.validate((valid) => {
                    if (valid) {
                        
                        params.pm_price_unit=params.pm_price_unit.join(",")
                        if(_vm.operateType=='add'){
                            addPrice(params).then((json)=>{
                                _vm.$Message.success("新增成功")
                                bus.$emit('list-reload')
                            })
                        }
                        else{
            
                            if (valid) {
                                editPrice({lcid:_vm.list_id,...params}).then((json)=>{
                                    _vm.$Message.success("修改成功")
                                    bus.$emit('list-reload')
                                })
                            }
                        }

                    }
                })
                
                
            },
            addSection (){
                this.columns.push(this.sectionInfo.section_name + this.sectionInfo.section_type)
            },
            removeSection (e){
                
            }
        }
    }
        
</script>
<style>
.router-section{
    border:1px solid #efefef;
    padding:10px
}
.router-section .ivu-form-item{
    margin-bottom:0
}
.router-section  .section-list li{
    border:1px solid #eee;
    padding:0 5px;
    border-radius:5px;
    display:inline-block;
    margin-right:10px;
    height:28px;
    line-height:24px;

}
</style>
