<template>
  <div class="mg20">
    <h2>装车清单设计1</h2>
    <h4>装车清单使用，调整时使用设计代码替换createPage方法体，将相应代码拷贝至开发页面对应的createPage方法，做相应修改</h4>
    <hr>

    <div class="mtb20">
      <i-button @click="handlerDesign">打印设计</i-button>
      <i-button @click="handlerGetDesignCode">获取设计码</i-button>
      <i-button @click="handlerPreview">打印预览</i-button>

    </div>
    <div id="table">
    <table style="border: 1px solid #000; border-collapse:collapse; text-align: left;">
      <thead>
        <tr>
          <th width="110">运单号</th>
          <th width="110">目的地</th>
          <th width="110">收货人</th>
          <th width="110">件数(件)</th>
          <th width="110">货物</th>
          <th width="110">重量</th>
          <th width="110">体积</th>
          <th width="110">代收货款</th>
          <th width="110">到付</th>
          <th width="110">回单</th>
          <th width="110">交接方式</th>
          <th width="110">备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for=" i in 3">
          <td>运单号</td>
          <td>目的地</td>
          <td>收货人 13000000001</td>
          <td>件数(件)</td>
          <td>货物</td>
          <td>重量</td>
          <td>体积</td>
          <td>代收货款</td>
          <td>到付</td>
          <td>回单</td>
          <td>交接方式</td>
          <td><div class="slice-span">备注备注备注备注备注备注备注</div></td>
        </tr>
      </tbody>
    </table>
    </div>
    
    
    
    

    <div class="mtb20">
      <i-input type="textarea" :value="printCode" :rows="18"></i-input>
    </div>
 
  </div>
</template>

<script>
import { getLodop } from "@/lib/lodop";
let LODOP;

const DEFAULT_PAGEN_NAME = "装车清单"
// 初始化打印LODOP
function initLodop(){
  LODOP = getLodop();
  LODOP.PRINT_INITA(0,0,"210mm","297mm","装车清单");
}


function design() {
  // 初始化打印
  initLodop()

  createPage()
  
  LODOP.SET_SHOW_MODE("DESIGN_IN_BROWSE", 1);
  LODOP.SET_SHOW_MODE("SETUP_ENABLESS", "11111111000000"); //隐藏关闭(叉)按钮
  LODOP.SET_SHOW_MODE("HIDE_GROUND_LOCK", true); //隐藏纸钉按钮
  LODOP.PRINT_DESIGN();
}

// 设计完代码拷贝到createPage，以便下次调整
function createPage (oOrder){
  createHeader()
  createFooter()
  createTable()
}
function createHeader(){
  
  LODOP.ADD_PRINT_TEXT(33,2,250,28,"title");
  LODOP.SET_PRINT_STYLEA(0,"FontSize",17);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_RECT(21,480,130,60,0,1);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_LINE(52,480,51,610,0,1);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(28,480,130,20,"车次号");
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(59,480,130,20,"TC-ZJ111180416002");
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_RECT(21,616,130,60,0,1);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_LINE(52,616,51,746,0,1);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(28,616,130,20,"发车时间");
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(59,616,130,20,"2018-05-05 10：10:10");
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(96,3,240,20,"福建福州 =>浙江嘉兴");
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(96,248,240,20,"司机：张三 13000000000");
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(96,493,240,20,"车辆：闽A11111/ 9.6米/ 集装箱");
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);

}
function createFooter(){

  LODOP.ADD_PRINT_RECT(943,0,'RightMargin: 0',130,0,1);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_LINE(969,0,968,'RightMargin: 0',0,1);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_LINE(991,0,990,'RightMargin: 0',0,1);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(948,2,140,20,"总件数：100\r\n");
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(948,154,140,20,"总重量：100 吨");
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(948,305,140,20,"总体积：100 方");
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(948,454,140,20,"代收货款：100 元");
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(948,602,140,20,"到付合计：100 元");
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(970,2,290,20,"司机运费：100 元");
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(970,305,411,20,"到付：到付200元");
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_LINE(1073,24,990,25,0,1);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_LINE(1073,187,990,188,0,1);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_LINE(1073,213,990,214,0,1);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_LINE(1073,374,990,375,0,1);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_LINE(1073,400,990,401,0,1);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_LINE(1073,561,990,562,0,1);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_LINE(1073,587,990,588,0,1);
  LODOP.ADD_PRINT_TEXT(998,0,26,70,"司\r\n机\r\n签\r\n字");
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(998,188,26,70,"发\r\n站\r\n签\r\n字");
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(999,374,26,70,"到\r\n站\r\n签\r\n字");
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(1000,562,26,70,"备\r\n注");
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
}
function createTable (){
  let style = `
    <style>
      table th,table td{
        border: 1px solid #000;
      }
      .slice-span{
        width: 80px;
        height: 1.5em;
        line-height: 1.5em;
        overflow: hidden;
      }
    </style>
  `
  let html = document.getElementById("table").innerHTML
  let fullHtml = `<head>${style}</head><body>${html}</body>`
  
  
  LODOP.ADD_PRINT_HTM('32mm','0','RightMargin: 0','BottomMargin: 40.77mm',fullHtml);
  // LODOP.ADD_PRINT_TABLE('32mm','0','RightMargin: 0','BottomMargin: 40.77mm',document.getElementById("table").innerHTML);
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
      
      createPage()
      
      LODOP.PREVIEW()
    }
  },
  created() {},
  mounted() {
  }
};

</script>

<style>
  .slice-span{
    width: 80px;
    height: 1.5em;
    line-height: 1.5em;
    overflow: hidden;
  }
</style>
