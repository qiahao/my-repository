<template lang="html">
<div  class="print-area"  style="width:900px; position: fixed; height: 450px;left:0px">
    <div class="print-content">
        <span id="j_barcode-img" class="j_barcode-img"></span>
        <span id="qrcode" class="j_barcode-s-img">
            <img id="qrcodeImg" :src="printObj.qrcode_src">
        </span>
        <span id="js_print_date">{{printObj.create_time}}</span>
        <span id="js_print_begin_area" class="w80">{{printObj.begin_area}}</span>
        <span id="js_print_end_area" class="w80">{{printObj.end_area}}</span>
        <span id="js_print_begin_link_man">{{printObj.begin_link_man}}</span>
        <span id="js_print_begin_link_mobile">{{printObj.begin_link_mobile}}</span>
        <span id="js_print_send_company">{{printObj.send_company}}</span>
        <span id="js_print_begin_address" class="w200">{{printObj.begin_address}}</span>
        <span id="js_print_end_link_man">{{printObj.end_link_man}}</span>
        <span id="js_print_end_link_mobile">{{printObj.end_link_mobile}}</span>
        <span id="js_print_receive_company">{{printObj.receive_company}}</span>
        <span id="js_print_end_address"  class="w200">{{printObj.end_address}}</span>
        <span id="js_print_c_name1" class="w120">{{printObj.cargo1.c_name}}</span>
        <span id="js_print_c_pack1">{{printObj.cargo1.c_pack}}</span>
        <span id="js_print_c_amount1"  class="w50">{{printObj.cargo1.c_amount}}</span>
        <span id="js_print_c_weight1"  class="w50">{{printObj.cargo1.c_weight}}</span>
        <span id="js_print_c_volume1" class="w50">{{printObj.cargo1.c_volume}}</span>
        <span id="js_print_c_name2" class="w120" >{{printObj.cargo2.c_name}}</span>
        <span id="js_print_c_pack2">{{printObj.cargo2.c_pack}}</span>
        <span id="js_print_c_amount2"  class="w50">{{printObj.cargo2.c_amount}}</span>
        <span id="js_print_c_weight2"  class="w50">{{printObj.cargo2.c_weight}}</span>
        <span id="js_print_c_volume2"  class="w50">{{printObj.cargo2.c_volume}}</span>
        <span id="js_print_c_name3" class="w120">{{printObj.cargo3.c_name}}</span>
        <span id="js_print_c_pack3">{{printObj.cargo3.c_pack}}</span>
        <span id="js_print_c_amount3"  class="w50">{{printObj.cargo3.c_amount}}</span>
        <span id="js_print_c_weight3"  class="w50">{{printObj.cargo3.c_weight}}</span>
        <span id="js_print_c_volume3"  class="w50">{{printObj.cargo3.c_volume}}</span>
        <span id="js_print_fee_transport"  class="w50">{{printObj.fee_transport}}</span>
        <span id="js_print_fee_sh"  class="w50">{{printObj.fee_sh}}</span>
        <span id="js_print_fee_th"  class="w50">{{printObj.fee_th}}</span>
        <span id="js_print_fee_smjz"  class="w50">{{printObj.fee_smjz}}</span>
        <span id="js_print_insurance_coverage"  class="w50">{{printObj.fee_bj}}</span>
        <span id="js_print_insurance_premium"  class="w50">{{printObj.fee_bx}}</span>
        <span id="js_print_fee_dshk"  class="w80">{{printObj.fee_dshk}}</span>
        <span id="js_print_fee_dssx" class="w80">{{printObj.fee_dssx}}</span>
        <span id="js_print_fee_qt"  class="w80">{{printObj.fee_qt}}</span>
        <span id="js_print_pay_total" >{{printObj.pay_total}}</span>
        <span id="js_print_is_pickup"  class="w80">{{printObj.is_pickup}}</span>
        <span id="js_print_pay_type"  class="w80">{{printObj.pay_type}}</span>
    </div>
</div>
</template>

<script> 
	import { utilCookie } from '@/utils/util'
    import * as getDict from '@/api/src/dictApi'  
    //订单列表个格设置
    export default{
        props: {
			printDatas:{},
            order_id:""
		},
        data:function(){
             return {
                user:'',
                model:false,
                printObj: {
                    qrcode_src: '',
                    create_time: '',
                    begin_area: '',
                    end_area: '',
                    begin_link_man: '',
                    begin_link_mobile: '',
                    send_company: '',
                    begin_address: '',
                    end_link_man: '',
                    end_link_mobile: '',
                    receive_company: '',
                    end_address: '',
                    cargo1:{},
                    cargo2:{},
                    cargo3:{},
                    fee_transport: '',
                    fee_sh: '',
                    fee_th: '',
                    fee_smjz: '',
                    fee_bj: '',
                    fee_bx: '',
                    fee_dshk: '',
                    fee_dssx: '',
                    fee_qt: '',
                    pay_total: '',
                    is_pickup: '',
                    pay_type: '',

                },
            }
        },
        created () { 
            this.initPrint()
        },
        methods :{
            //--分配服务商
            initPrint (){
                let _vm = this;
                getDict.dictgetPrintApi().then(json=>{
                    if(json.result==1){
                        let obj=JSON.parse(json.resultObj.dict_value);
                        obj.forEach(function(i){
                            $("#"+i.id).attr("style",i.style)
                        })
                    }else{
                        //_vm.$Message.error(json.resultInfo)
                    }
                })
            },
            fillPrint (e){
                let data = e
                let _vm = this;
                _vm.printObj=Object.assign(_vm.printObj,e)
                var orderNo=e.order_no;
                var elText = "http://wx.yunba.com/tms/order/qrcode/img?order_no="+orderNo;
                _vm.printObj.qrcode_src = elText;
                var cargos=JSON.parse(data.cargos)  
                _vm.printObj.cargo1=cargos[0]||{}
                _vm.printObj.cargo2=cargos[1]||{}
                _vm.printObj.cargo3=cargos[2]||{}
                var qt=isNaN(parseFloat(data.fee_zx))?0:parseFloat(data.fee_zx);
                qt+=isNaN(parseFloat(data.fee_sl))?0:parseFloat(data.fee_sl);
                qt+=isNaN(parseFloat(data.fee_bz))?0:parseFloat(data.fee_bz);
                qt+=isNaN(parseFloat(data.fee_az))?0:parseFloat(data.fee_az);
                qt+=isNaN(parseFloat(data.fee_bg))?0:parseFloat(data.fee_bg);
                qt+=isNaN(parseFloat(data.fee_jc))?0:parseFloat(data.fee_jc);
                qt+=isNaN(parseFloat(data.fee_qt))?0:parseFloat(data.fee_qt);
                _vm.printObj.fee_qt = qt===0?"":qt;
                let str="";
                if(data.is_pickup=="Y"&&data.is_delivery=="Y"){
                    str="提货/送货"
                }
                else if(data.is_pickup=="N"&&data.is_delivery=="Y"){
                    str="送货"
                }
                else if(data.is_pickup=="Y"&&data.is_delivery=="N"){
                    str="提货"
                }
                _vm.printObj.is_pickup = str;
                var payTypeData={
                    pay_xfu:"现付",
                    pay_df:"到付",
                    pay_yj:"月结",
                    pay_hdf:"回单付",
                    pay_hkk:"贷款扣",
                    pay_dbf:"多笔付",
                    "多笔付":"多笔付"
                };
                _vm.printObj.pay_type = payTypeData[data.pay_type]
            },
            
        },
        watch:{
            printDatas: {
                handler: function(curVal,oldVal){
                    
                    this.fillPrint(this.printDatas)
    　　　　　　　},
                deep:true
            },
            order_id(value) {
                if(value!=""){
                //this.loadList();
                }
				
			},
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss">
  
</style>