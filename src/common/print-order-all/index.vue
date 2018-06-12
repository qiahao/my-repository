<template>
    <div class="print-order-all print-layer">
    <!-- print-layer -->
        <div class="inner-wrap">
            <!-- row1 -->
            <div class="p-row row1">
                <div class="p-col-14">
                    <h3 class="ell">{{userInfo.company_name}}</h3>
                    <div>日期 {{dateToday}}</div>
                </div>
                <div class="p-col-10">
                    <div class="info-box">
                        <div>{{order.order_no}}</div>
                        <span class="label">{{order.begin_area}}</span> 至 <span class="label">{{order.end_area}}</span>
                    </div>
                    <div class="qrcode-box">
                        <div class="qrcode">
                            <img :src="qrcodeSrc" alt="">
                        </div>
                        <p>扫码查单</p>
                    </div>
                </div>
            </div>
            <!-- row2 -->
            <div class="p-row row2 mb5">
                <div class="p-col-12">
                    <dl class="dl-table">
                        <dt> <div><div>托运人</div></div> </dt>
                        <dd><span class="label">托运人</span>{{order.begin_link_man}}</dd>
                        <dd><span class="label">联系方式</span>{{order.begin_link_mobile}}</dd>
                        <dd><span class="label">托运地址</span>{{order.begin_address}}</dd>
                    </dl>
                </div>
                <div class="p-col-12">
                    <dl class="dl-table">
                        <dt> <div><div>收货人</div></div> </dt>
                        <dd><span class="label">收货人</span>{{order.end_link_man}}</dd>
                        <dd><span class="label">联系方式</span>{{order.end_link_mobile}}</dd>
                        <dd><span class="label">收货地址</span>{{order.end_address}}</dd>
                    </dl>
                </div>
            </div>
    
            <!-- row3 -->
            <div class="p-row row3 mb5">
                <div class="wp65 pr5 fl">
                    <dl class="dl-table table1">
                        <dt>
                                <div>
                                    <div>货物</div>
                                </div>
                            </dt>
                        <dd>
                            <div class="wp20">货物名称</div>
                            <div class="wp20">件数</div>
                            <div class="wp20">包装</div>
                            <div class="wp20">重量</div>
                            <div class="wp20">体积</div>
                        </dd>
                        <dd v-for="(item ,i) in order.cargos" :key="i">
                            <div class="wp20">{{item.c_name}}</div>
                            <div class="wp20">{{item.c_amount}}</div>
                            <div class="wp20">{{item.c_pack}}</div>
                            <div class="wp20">{{item.c_weight}}</div>
                            <div class="wp20">{{item.c_volume}}</div>
                        </dd>
                    </dl>
                    <div class="p-row bottom-box">
                        <div class="p-col-8"><span class="label">声明价值</span>{{smjzInfo}}</div>
                        <div class="p-col-8"><span class="label">回单要求</span>{{backInfo}}</div>
                        <div class="p-col-8"><span class="label">送货要求</span>{{deliveryInfo}}</div>
                    </div>
                </div>
                <div class="wp35 fl">
                    <dl class="dl-table table2">
                        <dt>
                                <div>
                                    <div>费用</div>
                                </div>
                            </dt>
                        <dd>
                            <div class="p-col-8">运费 {{order.fee_transport}}</div>
                            <div class="p-col-8">提货费 {{order.fee_details.partner_fee_th}}</div>
                            <div class="p-col-8">送货费 {{order.fee_details.partner_fee_sh}}</div>
                        </dd>
                        <dd>
                            <div class="p-col-12">保价费 {{order.fee_details.partner_fee_bj}}</div>
                            <div class="p-col-12">保险费 {{order.fee_details.partner_fee_bx}}</div>
                        </dd>
                        <dd>
                            <div class="p-col-12">代收货款 {{order.fee_details.partner_fee_dshk}}</div>
                            <div class="p-col-12">代收手续费 {{order.fee_details.partner_fee_dssx}}</div>
                        </dd>
                        <dd>
                            <div class="p-col-12">其他 {{order.fee_details.partner_fee_qt}}</div>
                            <div class="p-col-12">合计 {{order.pay_total}}</div>
                        </dd>
                    </dl>
                    <div class="bottom-box">
                        <div>
                            <span class="label">付款方式</span>{{payTypeInfo}}
                        </div>
                    </div>
                </div>
            </div>
            <!-- row4 -->
            <div class="row4 cf">
                <p>货物托运条款：一、托运货物必须如实地声明货物价值，托运人必须向承运人申请保险运输，如不参加保险，出现货损、丢失，承运方最高赔偿金额不超过货损运费的三倍。二、不准假报货名、不准托运危险品和国家禁运物品，货物中如夹带以上物品造成的损失和后果由托运人承担，并承担连带责任。三、如货物到达目的地外包装完好，承运方对货物内数量，质量损坏均不负责。四、如遇不可抗拒的自然灾害、军属战争等原因造成的货损，承运人不负责赔偿责任。五、自提货物收货人必须在接到通知后三日内提货，如延时提取货物按照运费5%/天收取仓储费，二个月后无人提取货物按照无货主处理。六、此协议一式四份，双方签字生效。</p>
                <div class="p-row">
                    <div class="p-col-8">托运方：</div>
                    <div class="p-col-8">承运方</div>
                    <div class="p-col-8">收货方</div>
                </div>
            </div>
            <link rel="stylesheet" media="print" href="/static/css/css-print/print-order-all.css">
        </div>
    </div>
</template>

<script>
    import { mapState } from "vuex";
    import moment from "moment";
    
    const emptyCargo = {
        c_price_unit: '',
        c_name: '',
        c_pack: '',
        c_amount: '',
        c_volume: '',
        c_weight: '',
        c_price: ''
    }
    const qrcodeImageUrlProxy = 'http://wx.yunba.com/tms/order/qrcode/img?order_no='
    
    export default {
        data() {
            return {
                order: {
                    cargos: [],
                    fee_details: {}
                },
                dateToday: moment(new Date()).format('YYYY年MM月DD日'),

            };
        },
        components: {},
        computed: {
            ...mapState(['userInfo']),
            smjzInfo(){
                return this.order.fee_details ? this.order.fee_details.partner_fee_smjz : '无'
            },
            backInfo(){
                let txt = {'0': '回执', '1': '原单', '2': '收条', '3': '电子回单'}
                if (this.order.back_nums === undefined || !this.order.back_type || this.order.back_type == 'no' || this.order.back_nums == 0) {
                    return '无' 
                    }
                return txt[this.order.back_type] + ' ' + this.order.back_nums + '份'
            },
            deliveryInfo (){
                let txt = {'Y': '送货','N':'自提'}
                return txt[this.order.is_delivery]
            },
            payTypeInfo(){
                let txt = {
                    partner_pay_arrive: '到付',
                    partner_pay_back: '回单付',
                    partner_pay_cash: '现付现金',
                    partner_pay_hkk: '货款扣',
                    partner_pay_month: '月结',
                    partner_pay_dbf: '多笔付',
                    partner_pay_qfan: '欠返',
                    partner_pay_qfu: '欠付',
                    partner_pay_xfan: '现返',
                    partner_pay_hdfk: '货到打款'
                }
                return txt[this.order.pay_type]
            },
            qrcodeSrc (){
                return this.order.order_no ? qrcodeImageUrlProxy + this.order.order_no : ''
            }
        },
        methods: {
            doPrintOrderAll() {
                $(this.$el).jqprint();
            }
        },
        mounted() {
            this.$on("do-print-order-all", order => {
                this.order = Object.assign({}, order)
                if (typeof order.fee_details == 'string') {
                    this.order.fee_details = JSON.parse(order.fee_details || "")
                }

                if (typeof order.cargos == 'string') {
                    this.order.cargos = JSON.parse(this.order.cargos || "[]")
                }
                
                if (!this.order.cargos || !(this.order.cargos instanceof Array)) {
                    this.order.cargos = []
                }
                let ll = 3, l = this.order.cargos.length, j = ll - l
                
                if (j > 0 ) {
                    for (let i = 0; i < j; i++) {
                        this.order.cargos.push({...emptyCargo})
                    }
                }
                
                this.dateToday =  moment(new Date()).format('YYYY年MM月DD日')

                this.$nextTick(() => {
                    this.doPrintOrderAll();
                });
            });
        }
    };
</script>

 <style type="text/css" src="../../../static/css/css-print/print-order-all.css"></style> 
 <!---->