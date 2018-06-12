<template lang="html">
    <div>
        <!-- background: url('/static/images/print-order/dd.jpg') no-repeat; background-size: 100% auto -->
        <div class="print-area" style="width:23cm; position: fixed; height: 12.7cm;left:0px; ">
         <!-- v-show="!isXHS" -->
            <div class="print-content">
                <!-- 第一行信息 -->
                <span id="j_barcode-img" class="j_barcode-img" v-show="!isXHS"></span>
                <div id="qrcode" class="j_barcode-s-img" v-show="!isXHS">
                    <img id="qrcodeImg" :src="printObj.qrcode_src">
                    <div style="position: relative;top: -10px;color:#000">扫码查单</div>
                </div>
                <span id="js_print_order_no"> {{"运单号：" + printObj.order_no}}</span>

                <span id="js_print_date">{{printObj.create_time}}</span>
                <span id="js_print_begin_area">{{printObj.begin_area | areaFilter}}</span>
                <span id="js_print_end_area">{{printObj.end_area | areaFilter}}</span>

                <!-- 1托运人信息 -->
                <span id="js_print_begin_link_man">{{printObj.begin_link_man}}</span>
                <span id="js_print_begin_link_mobile">{{printObj.begin_link_mobile}}</span>
                <span id="js_print_send_company">{{printObj.send_company}}</span>
                <span id="js_print_begin_province">{{printObj.begin_province}}</span>
                <span id="js_print_begin_city">{{printObj.begin_city}}</span>
                <span id="js_print_begin_county">{{printObj.begin_county}}</span>
                <span id="js_print_begin_address">{{printObj.begin_address}}</span>
                
                
                
                

                
                <!-- 2收货人信息 -->
                <span id="js_print_end_link_man">{{printObj.end_link_man}}</span>
                <span id="js_print_end_link_mobile">{{printObj.end_link_mobile}}</span>
                <span id="js_print_receive_company">{{printObj.receive_company}}</span>
                <span id="js_print_end_province">{{printObj.end_province}}</span>
                <span id="js_print_end_county">{{printObj.end_county}}</span>
                <span id="js_print_end_address">{{printObj.end_address}}</span>
                <span id="js_print_end_city">{{printObj.end_city}}</span>

                <!-- 3货物信息 -->
                <span id="js_print_c_name1">{{printObj.cargo1.c_name}}</span>
                <span id="js_print_c_amount1">{{printObj.cargo1.c_amount}}</span>
                <span id="js_print_c_pack1">{{printObj.cargo1.c_pack}}</span>
                <span id="js_print_c_weight1">{{printObj.cargo1.c_weight}}</span>
                <span id="js_print_c_volume1">{{printObj.cargo1.c_volume}}</span>
                
                <span id="js_print_c_name2">{{printObj.cargo2.c_name}}</span>
                <span id="js_print_c_amount2">{{printObj.cargo2.c_amount}}</span>
                <span id="js_print_c_pack2">{{printObj.cargo2.c_pack}}</span>
                <span id="js_print_c_weight2">{{printObj.cargo2.c_weight}}</span>
                <span id="js_print_c_volume2">{{printObj.cargo2.c_volume}}</span>

                <span id="js_print_c_name3">{{printObj.cargo3.c_name}}</span>
                <span id="js_print_c_amount3">{{printObj.cargo3.c_amount}}</span>
                <span id="js_print_c_pack3">{{printObj.cargo3.c_pack}}</span>
                <span id="js_print_c_weight3">{{printObj.cargo3.c_weight}}</span>
                <span id="js_print_c_volume3">{{printObj.cargo3.c_volume}}</span>

                <!-- 4服务方式及费用 -->
                <span id="js_print_fee_transport">
                    <div v-if="!isXHSFeeHide">{{printObj.fee_transport}}</div>
                </span>
                <span id="js_print_fee_sh">
                    <div v-if="!isXHSFeeHide">{{printObj.fee_details.partner_fee_sh}}</div>
                </span>
                <span id="js_print_fee_th">
                    <div v-if="!isXHSFeeHide">{{printObj.fee_details.partner_fee_th}}</div>
                </span>
                <span id="js_print_fee_smjz">
                    <div v-if="!isXHSFeeHide">{{printObj.fee_details.partner_fee_smjz}}</div>
                </span>
                <span id="js_print_insurance_coverage">
                    <div v-if="!isXHSFeeHide">{{printObj.fee_details.partner_fee_bj}}</div>
                </span>
                <span id="js_print_insurance_premium">
                    <div v-if="!isXHSFeeHide">{{printObj.fee_details.partner_fee_bx}}</div>
                </span>
                <span id="js_print_fee_dshk">
                    <div v-if="!isXHSFeeHide">{{printObj.fee_details.partner_fee_dshk}}</div>
                </span>
                <span id="js_print_fee_dssx">
                    <div v-if="!isXHSFeeHide">{{printObj.fee_details.partner_fee_dssx}}</div>
                </span>
                <span id="js_print_fee_qt">
                    <div v-if="!isXHSFeeHide">{{printObj.fee_qt}}</div>
                </span>
                <span id="js_print_pay_total">
                    <div v-if="!isXHSFeeHide">{{printObj.pay_total}}<br/>{{payTotalCapital}}</div>
                </span>
                <span id="js_print_is_pickup">{{printObj.is_delivery == "N" ? 'v' : ''}}</span>
                <span id="js_print_is_delivery">{{printObj.is_delivery == "Y" ? 'v' : ''}}</span>
                <span id="js_print_pay_type">
                    {{printObj.pay_type | filterPayType}}
                    <b v-if="isXHSFeeHide && printObj.pay_details.partner_pay_arrive">到付:{{printObj.pay_details.partner_pay_arrive}} 元</b>
                </span>

                <!-- 5签署 -->
                <span id="js_print_shipper_remark">{{printObj.shipper_remark}}</span>
                <span id="js_print_back_type">{{backInfo}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import {print, numberToWords} from '@/utils/util'
const qrcodeProxy = "http://wx.yunba.com/tms/order/qrcode/img?order_no="

const emptyCargo = {
    c_price_unit: '',
    c_name: '',
    c_pack: '',
    c_amount: '',
    c_volume: '',
    c_weight: '',
    c_price: ''
}
const xhsCompanyId = 'cd9bbbb2-80d5-42f0-9696-dcddf49588d3'


const payTypes = {
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

//订单列表个格设置
export default {
    data: function() {
        return {
            printObj: {
                order_no: '',
                qrcode_src: '',
                create_time: '',
                begin_area: '',
                end_area: '',
                begin_link_man: '',
                begin_link_mobile: '',
                send_company: '',
                begin_address: '',
                begin_province: '',
                begin_city: '',
                begin_county: '',
                end_link_man: '',
                end_link_mobile: '',
                receive_company: '',
                end_address: '',
                end_province: '',
                end_city: '',
                end_county: '',
                cargo1: {},
                cargo2: {},
                cargo3: {},
                fee_transport: '',
                fee_details: {},
                cargos: [],
                fee_qt: '',
                pay_total: '',
                is_pickup: 'N',
                is_delivery: 'N',
                pay_type: '',

            },
            styleData: [
                                
                // <!-- 第一行信息 -->
                { "id": "j_barcode-img", "class": "j_barcode-img" },
                { "id": "j_barcode-s-img", "class": "j_barcode-s-img" },
                { "id": "js_print_order_no", "style": "left: 260px; top: 100px;font-size:20px !important;"},

                { "id": "js_print_date", "style": "left: 652px; top: 42px;" },
                { "id": "js_print_begin_area", "style": "left: 630px; top: 98px;" },
                { "id": "js_print_end_area", "style": "left: 715px; top: 98px;" },
                
                // <!-- 1发货人信息 -->
                { "id": "js_print_begin_link_man", "style": "left: 140px; top: 165px;" },
                { "id": "js_print_begin_link_mobile", "style": "left: 270px; top: 165px;" },
                { "id": "js_print_send_company", "style": "left: 145px; top: 195px; width: 200px;" },
                { "id": "js_print_begin_province", "style": "left: 142px; top: 225px; width: 50px; text-align: center;" },
                { "id": "js_print_begin_city", "style": "left: 202px; top: 225px; width: 60px; text-align: center" },
                { "id": "js_print_begin_county", "style": "left: 275px; top: 225px;width: 60px; text-align: center" },
                { "id": "js_print_begin_address", "style": "left: 102px; top: 254px;line-height:16px width: 250px" },

                // <!-- 2收货人信息 -->
                { "id": "js_print_end_link_man", "style": "left: 133px; top: 325px;" },
                { "id": "js_print_end_link_mobile", "style": "left: 269px; top: 325px;" },
                { "id": "js_print_receive_company", "style": "left: 145px; top: 350px; width: 200px" },
                { "id": "js_print_end_province", "class": "w50", "style": "left: 142px; top: 386px; width: 50px; text-align: center;" },
                { "id": "js_print_end_city", "style": "left: 202px; top: 386px;width: 60px; text-align: center;" },
                { "id": "js_print_end_county", "style": "left: 272px; top: 386px; width: 60px; text-align: center;" },
                { "id": "js_print_end_address", "style": "left: 102px; top: 412px;line-height:16px" },
                // <!-- 3货物信息 -->
                { "id": "js_print_c_name1", "style": "left: 400px; top: 195px;" },
                { "id": "js_print_c_amount1", "style": "left: 490px; top: 195px; " },
                { "id": "js_print_c_pack1", "style": "left: 530px; top: 195px; " },
                { "id": "js_print_c_weight1", "style": "left: 575px; top: 195px;" },
                { "id": "js_print_c_volume1", "style": "left: 625px; top: 195px;" },

                { "id": "js_print_c_name2", "style": "left: 400px; top: 224px;" },
                { "id": "js_print_c_amount2", "style": "left: 490px; top: 224px; " },
                { "id": "js_print_c_pack2", "style": "left: 530px; top: 224px; " },
                { "id": "js_print_c_weight2", "style": "left: 575px; top: 224px;" },
                { "id": "js_print_c_volume2", "style": "left: 625px; top: 224px;" },

                { "id": "js_print_c_name3", "style": "left: 400px; top: 255px;" },
                { "id": "js_print_c_amount3", "style": "left: 490px; top: 255px; " },
                { "id": "js_print_c_pack3", "style": "left: 530px; top: 255px; " },
                { "id": "js_print_c_weight3", "style": "left: 575px; top: 255px;" },
                { "id": "js_print_c_volume3", "style": "left: 625px; top: 255px;" },
                
                // <!-- 4服务方式及费用 -->
                { "id": "js_print_fee_sh", "style": "left: 520px; top: 315px;" },//
                { "id": "js_print_fee_th", "style": "left: 610px; top: 315px;" },//
                { "id": "js_print_fee_smjz", "style": "left: 440px; top: 340px;" },//
                { "id": "js_print_fee_dshk", "style": "left: 570px; top: 365px;" },//
                { "id": "js_print_fee_dssx", "style": "left: 440px; top: 365px;" },//
                { "id": "js_print_fee_transport", "style": "left: 430px; top: 315px;" },//
                { "id": "js_print_fee_qt",  "style": "left: 440px; top: 390px;" }, //
                { "id": "js_print_pay_total", "style": "left: 570px; top: 384px; line-height: 1.1" },//
                { "id": "js_print_pay_type",  "style": "left: 570px; top: 415px;" },//
                { "id": "js_print_insurance_premium", "style": "left: 610px; top: 340px;text-align:center" },
                { "id": "js_print_insurance_coverage", "style": "left: 520px; top: 340px;text-align:center" },
                { "id": "js_print_is_pickup", "style": "left: 423px; top: 416px;" },//
                { "id": "js_print_is_delivery", "style": "left: 483px; top: 416px;" },//
                
                // <!-- 5签署 -->
                { "id": "js_print_shipper_remark", "class": "w100", "style": "left: 685px; top: 317px; width: 100px" },
                { "id": "js_print_back_type", "style": "left: 700px; top: 392px; width: 90px" }
            ]
        }
    },
    filters: {
        areaFilter (areaString) {
            // 兼容 微信小程序开单出现的的  '福建 福州 台江'
            if (!areaString) return ''
            let a1 = areaString.split('-'), a2 = areaString.split(' '),l1 = a1.length,l2 = a2.length
            
            if (l1 == l2 == 1) {
                return a1[0]
            }else if(l1 == 1){
                return a2[l2 - 1]
            }else if(l2 == 1){
                return a1[l1 - 1]
            }

            return areaString
        },
        filterPayType (input) {
            let text = payTypes[input]
            return text
        }
    },
    computed: {
        ...mapState(['userInfo']),
        payTotalCapital(){
            let value = this.printObj.pay_total || 0
            return numberToWords(value)
        },
        backInfo(){
            let text = '' 
            let type = ['0','1','2','3','4']
            let types = {
                '0': '回执',
                '1': '原单',
                '2': '收条',
                '3': '电子回单',
                '4': '其它',
                'NO': '没有回单'
            }
            // 防止没有回单 接口返回 空值，使用if 判断
            if (type.includes(this.printObj.back_type)) {
                text = types[`${this.printObj.back_type}`] +  ` ${this.printObj.back_nums || 0}份`
            }else{
                text = types.NO
            }
            return text
        },
        isXHS () {
            return this.userInfo.company_id == xhsCompanyId
        },
        isXHSFeeHide (){
            return this.isXHS && this.printObj.pay_type == 'partner_pay_dbf'
        }
    },
    methods: {
        //--分配服务商
        initPrint() {
            let _this = this;
            let xhsHideIds = [
                'js_print_order_no',
                'js_print_begin_link_man',
                'js_print_begin_link_mobile',
                'js_print_send_company',
                'js_print_begin_province',
                'js_print_begin_city',
                'js_print_begin_county',
                'js_print_begin_address'
            ]
            this.$nextTick(() => {
            this.$nextTick(() => {

                this.styleData.forEach(function(i) {
                        if (_this.isXHS && xhsHideIds.includes(i.id)) {
                            $("#" + i.id).attr("style",'display: none')
                    }else{
                        $("#" + i.id).attr("style",i.style)
                    }
                })
            })
            })
        },
        fillPrint(order) {
            let data = order
            let _vm = this;


            // formatOrderDetail
            function formatOrderDetail(orderDetail) {
                let obj = Object.assign({}, orderDetail)
    
                if (typeof obj.fee_details == 'string') {
                    obj.fee_details = JSON.parse(orderDetail.fee_details || "{}")
                    obj.pay_details = JSON.parse(orderDetail.pay_details || "{}")
                }


                if (typeof obj.cargos == 'string') {
                    obj.cargos = JSON.parse(orderDetail.cargos || "[]")
                }


                if (!obj.cargos || !(obj.cargos instanceof Array)) {
                    obj.cargos = []
                }
                let ll = 3,
                    l = obj.cargos.length,
                    j = ll - l

                if (j > 0) {
                    for (let i = 0; i < j; i++) {
                        obj.cargos.push({ ...emptyCargo })
                    }
                }

                obj.qrcode_src = qrcodeProxy + obj.order_no
            console.log('this.printObj.pay_type',obj.pay_type)
                return obj
            }
            this.printObj = formatOrderDetail(order)


            this.printObj.cargo1 = this.printObj.cargos[0] || {}
            this.printObj.cargo2 = this.printObj.cargos[1] || {}
            this.printObj.cargo3 = this.printObj.cargos[2] || {}

            let beginCity = this.printObj.begin_area.split('-')
            let endCity = _vm.printObj.end_area.split('-')
            this.printObj.begin_province = beginCity[0]
            this.printObj.begin_city = beginCity[1]
            this.printObj.begin_county = beginCity[2]

            this.printObj.end_province = endCity[0]
            this.printObj.end_city = endCity[1]
            this.printObj.end_county = endCity[2]

            // 其他：除单独显示的费用外的所有费用之和

            let feeQt = 0
            feeQt += this.printObj.fee_details.partner_fee_az ? parseFloat(this.printObj.fee_details.partner_fee_az) : 0
            feeQt += this.printObj.fee_details.partner_fee_bg ? parseFloat(this.printObj.fee_details.partner_fee_bg) : 0
            feeQt += this.printObj.fee_details.partner_fee_bz ? parseFloat(this.printObj.fee_details.partner_fee_bz) : 0
            feeQt += this.printObj.fee_details.partner_fee_jc ? parseFloat(this.printObj.fee_details.partner_fee_jc) : 0
            feeQt += this.printObj.fee_details.partner_fee_qt ? parseFloat(this.printObj.fee_details.partner_fee_qt) : 0
            feeQt += this.printObj.fee_details.partner_fee_sl ? parseFloat(this.printObj.fee_details.partner_fee_sl) : 0
            feeQt += this.printObj.fee_details.partner_fee_zx ? parseFloat(this.printObj.fee_details.partner_fee_zx) : 0

            this.printObj.fee_qt = feeQt

        },

    },

    watch: {
        printDatas: {
            handler: function(curVal, oldVal) {
                this.fillPrint(this.printDatas)　　　　　　　
            },
            deep: true
        }

    },
    mounted() {
        this.initPrint()
        this.$on('do-print-order', order => {
            this.fillPrint(order)
            setTimeout(() => {
                print(this.$el)
            }, 300)
        })
    }
}
</script>
<style lang="scss" rel="stylesheet/scss"></style>