<template lang="html">
    <div>
        <detail-modal v-model="detailShow" @on-detail-close="closeDetail">
            <div slot="head">订单详情</div>
            <div slot="default">
                <div class="">
                    <Form  :label-width="77"  ref="buildData" >
                        <!-- 运单信息 -->
                        <div class="form-table cf-all">
                            <div class="form-item"> 
                                <Form-item label="托运单号：" >
                                    <i-input  placeholder="运单号" readonly  v-model="order.order_no"></i-input>
                                </Form-item>
                            </div>
                            <div class="form-item"> 
                                <Form-item label="委托单号：" >
                                    <span class="ml10">{{order.shipper_order_no?order.shipper_order_no:'无'}}</span>
                                </Form-item>
                            </div>
                            <div class="form-item"> 
                                <Form-item label="运输方式：">
                                    <span v-if="order.bulk_type == 0">零担</span>
                                    <span v-if="order.bulk_type == 1">整车</span>
                                    <!-- <Radio-group class="ml5" v-model="order.bulk_type">
                                        <Radio label="0" >
                                            <span>零担</span>
                                        </Radio>
                                        <Radio label="1">
                                            <span>整车</span>
                                        </Radio>
                                    </Radio-group> -->
                                </Form-item>
                            </div>
                            <div class="form-item"> 
                                <Form-item label="开单时间：" prop="order_create_time">
                                    <i-input  placeholder="开单时间" readonly  v-model="order.order_create_time"></i-input>
                                </Form-item>
                            </div>
                            
                            <div class="form-item"> 
                                <Form-item label="起始地：" prop="begin_ad">
                                    <i-input  placeholder="起始地" readonly  v-model="order.begin_area"></i-input>
                                </Form-item>
                            </div>
                            <div class="form-item"> 
                                <Form-item label="目的地：" prop="end_ad">
                                    <i-input  placeholder="目的地" readonly  v-model="order.end_area"></i-input>
                                </Form-item>
                            </div>
                            <div class="form-item"> 
                                <Form-item label="服务时效：">
                                    {{order.expect_arrive_days?order.expect_arrive_days+'天':'无'}}
                                </Form-item>
                            </div>
                            <div class="form-item"> 
                                <Form-item label="客户名称：" prop="send_company">
                                    <i-input  placeholder="客户名称 " readonly  v-model="order.send_company"></i-input>
                                </Form-item>
                            </div>
                        </div>
                        <!-- 收发货人信息 -->
                        <div class="form-table cf-all">
                            <div class="form-table-row">
                                <div class="form-item"> 
                                    <Form-item label="托运人："  prop="begin_link_man">
                                        <i-input  placeholder="托运人 " readonly  v-model="order.begin_link_man"></i-input>
                                    </Form-item>
                                </div>
                                <div class="form-item"> 
                                    <Form-item label="联系电话："  prop="begin_link_mobile">
                                        <i-input  placeholder="联系电话 " readonly  v-model="order.begin_link_mobile"></i-input>
                                    </Form-item>
                                </div>
                                <div class="form-item w500"> 
                                    <Form-item label="详细地址："   prop="begin_address">
                                        <i-input  placeholder="详细地址" readonly v-model="order.begin_address"></i-input>
                                    </Form-item>
                                </div>
                                <div class="form-item w106">
                                    <Checkbox  class="checkbox" :disabled=true :value="order.is_delivery == 'Y'">送货</Checkbox> 
                                </div>
                            </div>
                            <div  class="form-table-row">
                                <div class="form-item"> 
                                    <Form-item label="收货人："   prop="end_link_man">
                                        <i-input  placeholder="收货人" readonly v-model="order.end_link_man"></i-input>
                                    </Form-item>
                                </div>
                                <div class="form-item"> 
                                    <Form-item label="联系电话："   prop="end_link_mobile">
                                        <i-input  placeholder="联系电话 " readonly  v-model="order.end_link_mobile"></i-input>
                                    </Form-item>
                                </div>
                                <div class="form-item w500" > 
                                    <Form-item label="详细地址：" prop="end_address">
                                        <i-input  placeholder="详细地址" readonly v-model="order.end_address"></i-input>
                                    </Form-item>
                                </div>
                                <div class="form-item w106">
                                    <Checkbox class="checkbox" :disabled=true :value="order.is_pickup == 'Y'">提货</Checkbox>  
                                </div>
                            </div>
                        </div>
                        <!-- 货物信息 -->
                        <div class="form-table cargos-table cf-all">
                            <div class="form-table-row cf-all ">
                                <div class="form-item">品号/货物名称</div>
                                <div class="form-item">包装</div>
                                <div class="form-item">件数</div>
                                <div class="form-item">重量（吨）</div>
                                <div class="form-item">体积（m³）</div>
                                <div class="form-item">单价</div>
                            </div>
                            <div class="form-table-row  cf-all text-center" v-for="cargo in order.cargos">
                                <div class="form-item">{{cargo.c_name}}</div>
                                <div class="form-item">{{cargo.c_pack}}</div>
                                <div class="form-item">{{cargo.c_amount}}</div>
                                <div class="form-item">{{cargo.c_weight}}</div>
                                <div class="form-item">{{cargo.c_volume}}</div>
                                <div class="form-item">{{cargo.c_price + " " + cargo.c_price_unit}}</div>
                            </div>
                           <!--
                            <div  style="width:100%">         
                                <Row>
                                    <Col span="3">货物补充说明：</Col>
                                    <Col span="21" style='text-align:left'>{{order.cargos_remark}}</Col>
                                </Row> 
                            </div> 
                            --> 
                        </div>
                        <!-- 费用信息 -->
                        <div class="form-table cf-all">
                            <div class="form-item">
                                <Form-item label="运费：">
                                    <i-input placeholder="运费" readonly v-model="order.fee_transport"></i-input>
                                </Form-item>
                            </div> 
                            <div class="form-item  " >
                                <Form-item label="提货费"   v-show="order.fee_details.liner_fee_th">
                                    <i-input v-model="order.fee_details.liner_fee_th"  readonly placeholder="提货费"></i-input>
                                </Form-item>
                            </div> 
                            <div class="form-item" >
                                <Form-item label="送货费"    v-show="order.fee_details.liner_fee_sh">
                                    <i-input v-model="order.fee_details.liner_fee_sh"  readonly placeholder="送货费"></i-input>
                                </Form-item>
                            </div> 
                            <div class="form-item  "   v-show="order.fee_details.liner_fee_qt">
                                <Form-item label="其它费"  prop="fee_detail">
                                    <i-input v-model="order.fee_details.liner_fee_qt"  readonly placeholder="其它费"></i-input>
                                </Form-item>
                            </div>
                            <div class="form-item  "  v-show="order.fee_details.liner_fee_smjz">
                                <Form-item label="声明价值"  prop="fee_detail">
                                    <i-input v-model="order.fee_details.liner_fee_smjz"  readonly placeholder="声明价值"></i-input>
                                </Form-item>
                            </div>
                            <div class="form-item  "  v-show="order.fee_details.liner_fee_bj">
                                <Form-item label="保价费"  prop="fee_detail">
                                    <i-input v-model="order.fee_details.liner_fee_bj"  readonly placeholder="保价费"></i-input>
                                </Form-item>
                            </div> 
                            <div class="form-item  " v-show="order.fee_details.liner_fee_bx">
                                <Form-item label="保险费"  prop="fee_detail">
                                    <i-input v-model="order.fee_details.liner_fee_bx"  readonly placeholder="保险费"></i-input>
                                </Form-item>
                            </div>
                            <div class="form-item  " v-show="order.fee_details.liner_fee_zx">
                                <Form-item label="装卸费"  prop="fee_detail">
                                    <i-input v-model="order.fee_details.liner_fee_zx"  readonly placeholder="装卸费"></i-input>
                                </Form-item>
                            </div>
                            <div class="form-item  " v-show="order.fee_details.liner_fee_sl">
                                <Form-item label="上楼费"  prop="fee_detail">
                                    <i-input v-model="order.fee_details.liner_fee_sl"  readonly placeholder="上楼费"></i-input>
                                </Form-item>
                            </div>
                            <div class="form-item" v-show="order.fee_details.liner_fee_bz">
                                <Form-item label="包装费"  prop="fee_detail">
                                    <i-input v-model="order.fee_details.liner_fee_bz"  readonly placeholder="包装费"></i-input>
                                </Form-item>
                            </div>
                            <div class="form-item" v-show="order.fee_details.liner_fee_az">
                                <Form-item label="安装费"  prop="fee_detail">
                                    <i-input v-model="order.fee_details.liner_fee_az"  readonly placeholder="安装费"></i-input>
                                </Form-item>
                            </div>
                            <div class="form-item  " v-show="order.fee_details.liner_fee_bg">
                                <Form-item label="保管费"  prop="fee_detail">
                                    <i-input v-model="order.fee_details.liner_fee_bg"  readonly placeholder="保管费"></i-input>
                                </Form-item>
                            </div>
                            <div class="form-item" v-show="order.fee_details.liner_fee_jc">
                                <Form-item label="进仓费"  prop="fee_detail">
                                    <i-input v-model="order.fee_details.liner_fee_jc"  readonly placeholder="进仓费"></i-input>
                                </Form-item>
                            </div> 
                            <div class="form-item" v-show="order.fee_details.liner_fee_dshk">
                                <Form-item label="代收货款"  prop="fee_detail">
                                    <i-input v-model="order.fee_details.liner_fee_dshk"  readonly placeholder="代收货款"></i-input>
                                </Form-item>
                            </div> 
                            <div class="form-item" v-show="order.fee_details.liner_fee_dssx">
                                <Form-item label="代收手续费"  prop="fee_detail">
                                    <i-input v-model="order.fee_details.liner_fee_dssx"  readonly placeholder="代收手续费"></i-input>
                                </Form-item>
                            </div>          
                        </div> 
                        <!-- 付款方式 -->
                        <div class="form-table cf-all">
                            <div class="form-item  ">
                                <Form-item label="合计费用：" :label-width='90'>
                                    <i-input   readonly  v-model='order.liner_fee'></i-input>
                                </Form-item>
                            </div> 
                            <div class="form-item  ">
                                <Form-item label="付款方式：">
                                    <span>{{order.liner_pay_type | payType}}</span>
                                </Form-item>
                            </div>
                            <div class="form-item  " v-show="order.liner_pay_type=='liner_pay_dbf'">
                                <Form-item label="现付"  prop="pay_detail">
                                    <i-input v-model="order.pay_details.liner_pay_cash"  placeholder="现付"></i-input>
                                </Form-item>
                            </div> 
                            <div class="form-item  " v-show="order.liner_pay_type=='liner_pay_dbf'">
                                <Form-item label="到付"  prop="pay_detail">
                                    <i-input v-model="order.pay_details.liner_pay_arrive"  placeholder="到付"></i-input>
                                </Form-item>
                            </div> 
                            <div class="form-item  " v-show="order.liner_pay_type=='liner_pay_dbf'">
                                <Form-item label="欠付"  prop="pay_detail">
                                    <i-input v-model="order.pay_details.liner_pay_qfu"  placeholder="欠付"></i-input>
                                </Form-item>
                            </div> 
                            <div class="form-item  " v-show="order.liner_pay_type=='liner_pay_dbf'">
                                <Form-item label="月结"  prop="pay_detail">
                                    <i-input v-model="order.pay_details.liner_pay_month"  placeholder="月结"></i-input>
                                </Form-item>
                            </div>
                            <div class="form-item  " v-show="order.liner_pay_type=='liner_pay_dbf'">
                                <Form-item label="回单付"  prop="pay_detail">
                                    <i-input v-model="order.pay_details.liner_pay_back"  placeholder="回单付"></i-input>
                                </Form-item>
                            </div> 
                            <div class="form-item  " v-show="order.liner_pay_type=='liner_pay_dbf'">
                                <Form-item label="货款扣"  prop="pay_detail">
                                    <i-input v-model="order.pay_details.liner_pay_hkk"  placeholder="货款扣"></i-input>
                                </Form-item>
                            </div>
                            <div class="form-item  " v-show="order.liner_pay_type=='liner_pay_dbf'">
                                <Form-item label="现返"  prop="pay_detail">
                                    <i-input v-model="order.pay_details.liner_pay_xfan"  placeholder="现返"></i-input>
                                </Form-item>
                            </div>
                            <div class="form-item  " v-show="order.liner_pay_type=='liner_pay_dbf'">
                                <Form-item label="欠返"  prop="pay_detail">
                                    <i-input v-model="order.pay_details.liner_pay_qfan"  placeholder="欠返"></i-input>
                                </Form-item>
                            </div>
                            <div class="form-item  " v-show="order.liner_pay_type=='liner_pay_dbf'">
                                <Form-item label="货到打款"  prop="pay_detail">
                                    <i-input v-model="order.pay_details.liner_pay_hdfk"  placeholder="货到打款"></i-input>
                                </Form-item>
                            </div> 
                        </div>
                        <!-- 回执信息 -->
                        <div class="form-table cf-all">
                            <div class="form-table-row">
                                <div class="form-item" style="width:100%">
                                    <Form-item label="回单：">
                                        <span>{{order.back_type | backType}}</span>
                                        <span v-if='order.back_type==4'>-{{order.back_type_other}}</span>
                                        <span class="ml10" v-if="order.back_type != 'no' ">共 {{order.back_nums}} 份</span>
                                    </Form-item>
                                </div> 
                            </div>
                            <div class="form-table-row ">
                                <div class='form-item w900'>
                                    <Form-item label="备注：">
                                        <i-input  placeholder="" readonly v-model="order.shipper_remark"></i-input>
                                    </Form-item>
                                </div> 
                                <div class='form-item'>
                                    <Form-item label="制单员：">
                                        <span>{{order.confirm_user_name}}</span>
                                    </Form-item>
                                </div> 
                            </div>
                            
                        </div>   
                    </form>
                </div>
            </div>
        </detail-modal>
    </div>
</template>

<script>   
    import detailModal from '@/common/detail-modal'
    import detailMixin from '@/mixins/detail-mixin'
    import emitter from '@/mixins/emitter'

    //订单列表个格设置
    export default{
        data:function(){
             return {
                order: {
                    fee_details: {},
                    pay_details: {},
                },
            }
        },
        mixins: [detailMixin],
        components: {detailModal},
        methods :{
            init(){
                this.loadDetail()
            },
            //选择更多费用
            loadDetail (){
                let params = {forward_id: this.id};
                this.$api.preorderApi.getPreorderDetail(params).then((data)=>{
                    this.order = data.resultObj
                    this.order.fee_details = JSON.parse(data.resultObj.liner_fee_detail || '{}')
                    this.order.pay_details = JSON.parse(data.resultObj.liner_pay_detail || '{}')
                    this.order.cargos = JSON.parse(data.resultObj.cargos || '[]')
                })
            },
            closeDetail(){
                this.$router.push({name: 'preorderV1List'})
            }
        },
        filters: {
            backType (t){
                const TYPES = {
                    'no': '无',
                    '0': '回执',
                    '1': '原单',
                    '2': '收条',
                    '3': '电子回单',
                    '4': '其他',
                }
                return TYPES[t]
            },
            payType (t){
                const TYPES = {
                    'liner_pay_cash': '现付',
                    'liner_pay_arrive': '到付',
                    'liner_pay_month': '月结',
                    'liner_pay_back': '回单付',
                    'liner_pay_hkk': '货款扣',
                    'liner_pay_dbf': '多笔付',
                }
                return TYPES[t]  
            }
        },
    }

</script>
<style lang="scss">
    .form-table.cargos-table{
        text-align: center;
        line-height: 36px;
    }
</style>