<template>
  <div class="mg20">
    <h2>运单套打设计</h2>
    <h4>设计运单套打使用，调整时使用设计代码替换createPage方法体，将相应代码拷贝至开发页面对应的createPage方法，做相应修改</h4>
    <hr>

    <div class="mtb20">
      <i-button @click="handlerDesign">打印设计</i-button>
      <i-button @click="handlerGetDesignCode">获取设计码</i-button>
      <i-button @click="handlerPreview">打印预览</i-button>

    </div>

    <div class="mtb20">
      <i-input type="textarea" :value="printCode" :rows="8"></i-input>
    </div>
 
  </div>
</template>

<script>
import { getLodop } from "@/lib/lodop";
import { orderDetail } from "./order-cover.js";
let LODOP;

// 设计背景图 需根据使用地址修改
const BGImageUrl = "E:\\gitwww\\tms-web\\static\\images\\print-order\\print-order-bg.jpg" 
const QRCODE_PROXY = "http://wx.yunba.com/tms/order/qrcode/img?order_no="

// 初始化打印LODOP
function initLodop(){
  LODOP = getLodop();
  LODOP.PRINT_INITA(0,0,"230mm","127mm","运单套打");
}

// 设置背景
function initDesignBGImage(){
  if(!LODOP){
    initLodop()
  }
  LODOP.ADD_PRINT_SETUP_BKIMG(BGImageUrl);
  LODOP.SET_SHOW_MODE("BKIMG_LEFT",0);
  LODOP.SET_SHOW_MODE("BKIMG_TOP",0);
  LODOP.SET_SHOW_MODE("BKIMG_WIDTH","230mm");
  LODOP.SET_SHOW_MODE("BKIMG_HEIGHT","127mm");
}


function design() {
  // 初始化打印
  initLodop()
  
  // 设置背景
  initDesignBGImage()

  // 创建页面： 设计更新时拷贝相应代码到 createPage方法
  createPage()
  
  LODOP.SET_SHOW_MODE("DESIGN_IN_BROWSE", 1);
  LODOP.SET_SHOW_MODE("SETUP_ENABLESS", "11111111000000"); //隐藏关闭(叉)按钮
  LODOP.SET_SHOW_MODE("HIDE_GROUND_LOCK", true); //隐藏纸钉按钮
  LODOP.PRINT_DESIGN();
}

// 设计完代码拷贝到createPage，以便下次调整
function createPage (oOrder = orderDetail){
  console.log('cargos',oOrder.cargos)
  // o.cargos = JSON.parse(o.cargos || "[]")
  let order, utilCargos = [];
  order = Object.assign({}, oOrder)
  utilCargos = (new Array(3)).fill(1).map(() => {return {}})
  utilCargos = JSON.parse(order.cargos || "[]")
  order.cargos = (new Array(3)).fill(1).map((o,i) => {
    if (utilCargos[i]) {
      return utilCargos[i]
    }
    return {}
  })
  // LODOP.PRINT_INITA("0mm","0mm","230mm","127mm","运单套打");
  // LODOP.ADD_PRINT_SETUP_BKIMG("E:\\gitwww\\tms-web\\static\\images\\print-order\\print-order-bg.jpg");
  // LODOP.SET_SHOW_MODE("BKIMG_LEFT",0);
  // LODOP.SET_SHOW_MODE("BKIMG_TOP",0);
  // LODOP.SET_SHOW_MODE("BKIMG_WIDTH","229.92mm");
  // LODOP.SET_SHOW_MODE("BKIMG_HEIGHT","127mm");
  // 设置所有字体
  LODOP.SET_PRINT_STYLE("FontSize",11);

  LODOP.ADD_PRINT_BARCODE(37,308,240,70,"Code39","123456789012");
  LODOP.ADD_PRINT_IMAGE(28,546,80,80,`<img width='70' border='0' src='${QRCODE_PROXY}${order.order_no}'/>`);
  LODOP.ADD_PRINT_TEXT("10.05mm","171.45mm","37.57mm","5.29mm", order.create_time);
  LODOP.ADD_PRINT_TEXT("25.93mm","166.16mm","21.17mm","5.29mm", order.begin_area);
  LODOP.ADD_PRINT_TEXT("25.93mm","188.12mm","21.17mm","5.29mm", order.end_area);
  LODOP.ADD_PRINT_TEXT("43.66mm","34.93mm","23.81mm","5.29mm", order.begin_link_man);
  LODOP.ADD_PRINT_TEXT("43.66mm","69.85mm","26.46mm","5.29mm", order.begin_link_mobile);
  LODOP.ADD_PRINT_TEXT("51.33mm","38.36mm","56.89mm","5.29mm", order.send_company);
  LODOP.ADD_PRINT_TEXT("59.27mm","37.04mm","14.55mm","5.29mm", order.begin_province);
  LODOP.ADD_PRINT_TEXT("59.27mm","53.71mm","15.88mm","5.29mm", order.begin_city);
  LODOP.ADD_PRINT_TEXT("59.27mm","73.03mm","15.88mm","5.29mm", order.begin_county);
  LODOP.ADD_PRINT_TEXT("66.94mm","24.61mm","71.44mm","5.29mm", order.begin_address);
  LODOP.ADD_PRINT_TEXT("85.99mm","34.66mm","23.81mm","5.29mm", order.end_link_man);
  LODOP.ADD_PRINT_TEXT("85.99mm","69.59mm","26.46mm","5.29mm", order.end_link_mobile);
  LODOP.ADD_PRINT_TEXT("93.13mm","38.36mm","56.89mm","5.29mm", order.receive_company);
  LODOP.ADD_PRINT_TEXT("101.6mm","37.04mm","14.55mm","5.29mm", order.end_province);
  LODOP.ADD_PRINT_TEXT("101.6mm","53.98mm","15.88mm","5.29mm", order.end_city);
  LODOP.ADD_PRINT_TEXT("101.6mm","72.5mm","15.88mm","5.29mm", order.end_county);
  LODOP.ADD_PRINT_TEXT("109.54mm","24.61mm","71.44mm","5.29mm", order.end_address);

  LODOP.ADD_PRINT_TEXT("51.33mm","104.51mm","22.49mm","5.29mm", order.cargos[0].c_name);
  LODOP.ADD_PRINT_TEXT("51.33mm","127mm","10.58mm","5.29mm", order.cargos[0].c_amount);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("51.33mm","138.11mm","13.23mm","5.29mm", order.cargos[0].c_pack);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("51.33mm","151.34mm","10.58mm","5.29mm", order.cargos[0].c_weight);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("51.33mm","161.93mm","10.58mm","5.29mm", order.cargos[0].c_volume);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("59.27mm","104.51mm","22.49mm","5.29mm", order.cargos[1].c_name);
  LODOP.ADD_PRINT_TEXT("59.27mm","127mm","10.58mm","5.29mm", order.cargos[1].c_amount);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("59.27mm","138.11mm","13.23mm","5.29mm", order.cargos[1].c_pack);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("59.27mm","151.34mm","10.58mm","5.29mm", order.cargos[1].c_weight);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("59.27mm","161.93mm","10.58mm","5.29mm", order.cargos[1].c_volume);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("66.94mm","104.51mm","22.49mm","5.29mm", order.cargos[2].c_name);
  LODOP.ADD_PRINT_TEXT("66.94mm","127mm","10.58mm","5.29mm", order.cargos[2].c_amount);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("66.94mm","138.11mm","13.23mm","5.29mm", order.cargos[2].c_pack);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("66.94mm","151.34mm","10.58mm","5.29mm", order.cargos[2].c_weight);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("66.94mm","161.93mm","10.58mm","5.29mm", order.cargos[2].c_volume);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("83.61mm","110.6mm","13.23mm","5.29mm", order.fee_transport);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("83.61mm","135.73mm","13.23mm","5.29mm", order.fee_details.partner_fee_sh);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("83.34mm","159.01mm","10.58mm","5.29mm", order.fee_details.partner_fee_th); // "提货"
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("89.69mm","114.04mm","10.58mm","5.29mm", order.fee_details.partner_fee_smjz); // "声明"
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("89.69mm","135.73mm","13.23mm","5.29mm", order.fee_details.partner_fee_bj); // "报价费"
  LODOP.ADD_PRINT_TEXT("89.69mm","159.01mm","10.58mm","5.29mm", order.fee_details.partner_fee_bx); // "保险"
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("96.31mm","114.04mm","21.17mm","5.29mm", order.fee_details.partner_fee_dshk); // "代收"
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("96.31mm","151.08mm","18.52mm","5.29mm", order.fee_details.partner_fee_dssx); // "货款手续"
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("102.92mm","114.04mm","21.17mm","5.29mm", order.fee_details.partner_fee_qt); // "其他"
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("101.86mm","148.43mm","21.17mm","7.14mm",`${order.pay_total}\r\n大写`); //"124\r\n大写"
  LODOP.SET_PRINT_STYLEA(0,"FontSize",9);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("109.54mm","111.13mm","4.23mm","5.29mm", order.is_delivery == "N" ? 'v' : '');
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("109.54mm","126.74mm","4.23mm","5.29mm", order.is_delivery == "Y" ? 'v' : '');
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("109.54mm","148.43mm","26.46mm","5.29mm","付款方式");
  LODOP.ADD_PRINT_TEXT("83.08mm","179.39mm","29.1mm","18.52mm", order.shipper_remark);
  LODOP.ADD_PRINT_TEXT("109.54mm","178.06mm","31.75mm","5.29mm","回单");

  

}

// 获取设计的code
function getCode(context) {
  LODOP = getLodop();
  
  if (LODOP.CVERSION){
    LODOP.On_Return = function(TaskID, Value) {
      context.printCode = Value
    }
  }
  context.printCode = LODOP.GET_VALUE("ProgramCodes", 0);
}

export default {
  data() {
    return {
      printCode: ""
    };
  },
  methods: {
    handlerPrint() {
      this.initPrint();
    },
    handlerDesign() {
      design();
    },
    handlerGetDesignCode() {
      getCode(this)
    },
    handlerPreview() {}
  },
  created() {},
  mounted() {
  }
};

</script>

<style>
</style>
