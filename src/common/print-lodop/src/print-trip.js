import LodopPrinter from './LodopPrinter'
import {getPrintSetting} from '@/api/src/companyApi'
import {filterSlice} from '@/utils'
const MESSAGE_NO_DETAIL = '车次详情不能为空'
const MESSAGE_DATA_TYPE_ERROR = '车次详情数据类型有误，请检查'
const MESSAGE_NO_ORDER_LIST = '运单列表不能为空'

const BACK_TYPES = {
  '0': '回执',
  '1': '原单',
  '2': '收条',
  '3': '电子回单',
  '4': '其它',
  'no': '无'
};

const PAY_METHODS = {
  "0": "现付",
  "1": "到付",
  "2": "回单付",
  "3": "月结",
  "4": "多笔付"
};

const PAY_TYPES = {
  pay_cash: "现付现金",
  pay_oil: "现付油卡",
  pay_arrive: "到付",
  pay_back: "回单付",
  pay_month: "月结"
};


let printer = new LodopPrinter({
  pageName: '装车清单',
  printPageSize: [0, 2100, 2970,'装车清单']
})

// 创建页面
printer.createPage = function ({
  detail,
  orderList 
}){
  this.createPageHeader(detail)
  this.createPagefooter({detail,orderList})
  this.createPageTable(orderList)
}

// 顶部固定格式
printer.createPageHeader = function (detail){
  let LODOP = printer.LODOP
  LODOP.ADD_PRINT_TEXT(33,2,250,28,"运吧智慧物流平台");
  LODOP.SET_PRINT_STYLEA(0,"FontSize",17);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_RECT(21,480,130,60,0,1);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_LINE(52,480,51,610,0,1);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(28,480,130,20,"车次号");
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(59,480,130,20,detail.trip_no);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_RECT(21,616,130,60,0,1);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_LINE(52,616,51,746,0,1);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(28,616,130,20,"发车时间");
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(59,616,130,20,detail.send_time);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(96,3,240,20,`${detail.send_area} => ${detail.arrive_area}`);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(96,248,240,20,`司机：${detail.driver_name} ${detail.driver_mobile}`);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(96,493,240,20,`车辆：${detail.truck_plate}/ ${detail.truck_length}米/ ${detail.truck_type}`);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
}
// 底部固定格式
printer.createPagefooter = function ({detail,orderList}){
  let orderAmounts, orderWeights, orderVolumes, orderDshks, orderDfs, strPayDetail = '';
  let LODOP = printer.LODOP
  orderAmounts = getPropetyNums(orderList,'cargo_total_amounts',1)
  orderWeights = getPropetyNums(orderList,'cargo_total_weights',1000)
  orderVolumes = getPropetyNums(orderList,'cargo_total_volumes',100)
  orderDshks = getPropetyNums(orderList,'fee_dshk',100)
  orderDfs = getPropetyNums(orderList,'pay_df',100)
  strPayDetail = PAY_METHODS[`${detail.pay_method}`]
  if(detail.pay_detail){
    for (let k in detail.pay_detail) {
      strPayDetail += `${PAY_TYPES[k]} ${detail.pay_detail[k] || 0} 元  `
    }
  }
  
  
  LODOP.ADD_PRINT_RECT(943,0,'RightMargin: 0',130,0,1);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_LINE(969,0,968,'RightMargin: 0',0,1);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_LINE(991,0,990,'RightMargin: 0',0,1);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(948,2,140,20,`总件数：${orderAmounts}`);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(948,154,140,20,`总重量：${orderWeights} 吨`);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(948,305,140,20,`总体积：${orderVolumes} 方`);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(948,454,140,20,`代收货款：${orderDshks} 元`);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(948,602,140,20,`到付合计：${orderDfs} 元`);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(970,2,290,20,`司机运费：${detail.fee} 元`);
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
  LODOP.ADD_PRINT_TEXT(970,305,411,20,strPayDetail);
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
  LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
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

// 表格及样式
printer.createPageTable = function (orderList){
  let style = getTableStyle()
  let tempTableHeader = getTableHeaderTemp()
  let tempTableTrs = getTableTrTemp(orderList)
  // let tempTableTrs = (new Array(30).fill(getTableTrTemp(orderList))).join('') 
  let tempTableFooter = getTableFooterTemp()
  let fullHtml = `<head>${style}</head><body>${tempTableHeader}${tempTableTrs}${tempTableFooter}</body>`
  let LODOP = printer.LODOP
  LODOP.ADD_PRINT_HTM('32mm','0','RightMargin: 0','BottomMargin: 40.77mm',fullHtml);
}

function getTableHeaderTemp() {
  let tempHead = `
    <table style="border: 1px solid #000; border-collapse:collapse; text-align: left;">
      <thead>
        <tr>
          <th class="w80">运单号</th>
          <th>目的地</th>
          <th class="w80">收货人</th>
          <th>件数</th>
          <th class="w80">货物</th>
          <th>重量</th>
          <th>体积</th>
          <th>代收货款</th>
          <th>到付</th>
          <th>回单</th>
          <th>交接方式</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
  `
  return tempHead

}

function getTableTrTemp(orderList) {
  let trTempArray = orderList.map(({
    order_no,
    end_area,
    end_link_man,
    end_link_mobile,
    cargo_total_amounts,
    cargo_names,
    cargo_total_weights,
    cargo_total_volumes,
    fee_dshk,
    pay_df,
    back_type,
    back_nums,
    is_delivery,
    shipper_remark,
  }) => {

    let strBackNum;
    if (back_type && back_type != 'no') {
      strBackNum = BACK_TYPES[`${back_type}`] + `${back_nums || 0} 份`
    }else{
      strBackNum = '无'
    }

    let temp =  `
      <tr>
        <td><div>${order_no}</div></td>
        <td><div>${filterSlice(end_area)}</div></td>
        <td><div>${end_link_man} ${end_link_mobile}</div></td>
        <td><div>${cargo_total_amounts}</div></td>
        <td><div>${cargo_names}</div></td>
        <td><div>${cargo_total_weights}</div></td>
        <td><div>${cargo_total_volumes}</div></td>
        <td><div>${fee_dshk}</div></td>
        <td><div>${pay_df}</div></td>
        <td><div>${strBackNum}</div></td>
        <td><div>${is_delivery == 'Y' ? '送货' : '自提'}</div></td>
        <td><div class="slice-span">${shipper_remark}</div></td>
      </tr>
    `
    return temp
  })

  return trTempArray.join('')
}

function getTableFooterTemp() {
  let temp = `</tbody></table>`
  return temp
}

// 样式
function getTableStyle() {
  let style = `
    <style>
      .w60{
        width: 60px;
      }
      .w80{
        width: 80px;
      }
      table{
        width: 100%;
      }
      table th,table td{
        border: 1px solid #000;
        font-size: 13px
      }
      .slice-span{
        width: 80px;
        height: 1.5em;
        line-height: 1.5em;
        overflow: hidden;
      }
    </style>
  `
  return style
}



// utils tool
function getPropetyNums(list,key,times) {
  let nums = list.map(item => {
    if (Number(item[`${key}`])) {
      return Number(item[`${key}`])
    }
  }).filter(num => num)
  return getTotalNum(nums,times)
}

function getTotalNum (nums,times = 100) {
  let timesTotal = 0
  nums.forEach(n => {
      let t = n * times
      timesTotal += t
  });

  return timesTotal / times
}



async function printTrip ({data,orderList}) {
  let printerName;
  let setting = printer.printerSetting = await getPrintSetting()
  printerName = setting && setting.print_mac_setting ? setting.print_mac_setting.order_list_print_mac : ''
  printer.initPrinter()
  if (!printer.setPrinter(printerName)) { return }
  printer.createPage({
    detail: data, 
    orderList: orderList
  })
  
  printer.print()
}
export default printTrip