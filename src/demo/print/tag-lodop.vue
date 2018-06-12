<template>
  <div class="mg20">
    <h2>货签打印设计</h2>
    <h4>货签打印使用，调整时使用设计代码替换createPage方法体，将相应代码拷贝至开发页面对应的createPage方法，做相应修改</h4>
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
// const BGImageUrl = "E:\\gitwww\\tms-web\\static\\images\\print-order\\print-order-bg.jpg" 
const QRCODE_PROXY = "http://wx.yunba.com/tms/order/qrcode/img?order_no="
const LOGO_URL_1 = "/static/images/print-tag/logo@2x.png"
const LOGO_URL_2 = "/static/images/print-tag/logo@2x.png"
const QRCODE_URL = "/static/images/print-tag/qrcode@2x.png"
let DEFAULT_PAGE_SIZE = [0, 800, 600,'货签打印']
const DEFAULT_PAGEN_AME = "货签打印"
// 初始化打印LODOP
function initLodop(){
  LODOP = getLodop();
  LODOP.PRINT_INIT(DEFAULT_PAGEN_AME);
  LODOP.SET_PRINT_PAGESIZE(...DEFAULT_PAGE_SIZE)
}


function design() {
  // 初始化打印
  initLodop()
  
  // 设置背景
  // initDesignBGImage()

  // 创建页面： 设计更新时拷贝相应代码到 createPage方法
  createPage()
  
  LODOP.SET_SHOW_MODE("DESIGN_IN_BROWSE", 1);
  LODOP.SET_SHOW_MODE("SETUP_ENABLESS", "11111111000000"); //隐藏关闭(叉)按钮
  LODOP.SET_SHOW_MODE("HIDE_GROUND_LOCK", true); //隐藏纸钉按钮
  LODOP.PRINT_DESIGN();
}

// 设计完代码拷贝到createPage，以便下次调整
function createPage (oOrder){

  LODOP.PRINT_INITA(0,0,"79.98mm","59.98mm","货签打印");
  LODOP.ADD_PRINT_LINE("17.75mm","0mm",66,"79.9mm",0,1);
  LODOP.ADD_PRINT_LINE("35.77mm","0mm",134,"79.9mm",0,1);
  LODOP.ADD_PRINT_LINE("41.57mm","0mm",156,"79.9mm",0,1);
  LODOP.ADD_PRINT_LINE("59.5mm","56.59mm","41.51mm",215,0,1);
  LODOP.ADD_PRINT_LINE("11.85mm","55.01mm",44,"79.9mm",0,1);
  LODOP.ADD_PRINT_LINE("6.06mm","55.01mm",22,"79.9mm",0,1);
  LODOP.ADD_PRINT_LINE("0mm","55.01mm","17.49mm",209,0,1);
  LODOP.ADD_PRINT_LINE("0mm","49mm","17.49mm",186,0,1);
  LODOP.ADD_PRINT_IMAGE("1.48mm","2.99mm","37.99mm","10.8mm",`<img border="0" height="38" src="${LOGO_URL_1}"/>`);
  
  
  LODOP.ADD_PRINT_TEXT(48,13,160,18,"客户电话：13000000000");
  LODOP.ADD_PRINT_TEXT("3.18mm","49.21mm","5.82mm","13.76mm","发\r\n货\r\n人");
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.SET_PRINT_STYLEA(0,"Horient",2);
  LODOP.ADD_PRINT_TEXT(4,211,86,18,"张三");
  LODOP.ADD_PRINT_TEXT(26,"55.75mm",86,18,"13000000001");
  LODOP.ADD_PRINT_TEXT(48,211,86,18,"自提");
  LODOP.ADD_PRINT_TEXT(75,12,280,24,"出发  123");
  LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
  LODOP.ADD_PRINT_TEXT(103,12,280,24,"到达  123");
  LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
  LODOP.ADD_PRINT_TEXT(138,12,150,18,"运单号 ZJ1111805100008");
  LODOP.ADD_PRINT_TEXT(138,162,140,18,"共1000件 第2份 共2份");
  LODOP.ADD_PRINT_BARCODE(168,22,202,50,"93Extended","zj3456789012");

  LODOP.ADD_PRINT_IMAGE(166,"61.65mm","12.65mm","12.65mm",`<img border="0" height="48" src="${QRCODE_URL}"/>`);


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
    handlerPreview() {
      // 初始化打印
      initLodop()
      
      // 设置背景
      // initDesignBGImage()

      // 创建页面： 设计更新时拷贝相应代码到 createPage方法
      createPage()
      LODOP.PREVIEW()
    }
  },
  created() {},
  mounted() {
    function CreatePage() {}
  }
};

</script>

<style>
</style>
