import LodopPrinter from './LodopPrinter'
import {getPrintSetting} from '@/api/src/companyApi'
import {numberToWords,filterSlice} from '@/utils'
import {getUserInfo} from '@/utils/local-storage-mng'

let printer = new LodopPrinter({
  pageName: '运单套打',
  printPageSize: [0, 2300,1270,'运单套打']
})

const MESSAGE_DATA_TYPE_ERROR = '运单数据类型有误，请联系技术人员！'
const MESSAGE_NO_DATA = '请选择要打印的运单！'
const MESSAGE_NO_MATCH_PRINTER = '未正确设置货签打印机，请先设置货签打印机！'

const xhsCompanyId = ''
const QRCODE_PROXY = "http://wx.yunba.com/tms/order/qrcode/img?order_no="

const PAY_TYPES = {
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
const BACK_TYPES = ['0','1','2','3','4']
const BACK_TYPES_MAP = {
  '0': '回执',
  '1': '原单',
  '2': '收条',
  '3': '电子回单',
  '4': '其它',
  'NO': '没有回单'
}


// 创建页面
printer.createPage = function ({order,isXHS}){
  if (!order) { return }
  let LODOP = this.LODOP
  console.log('order',order)
  console.log('isXHS',isXHS)
  LODOP.NEWPAGE()
  let strPayTotal = '', 
      strPaytype = '', 
      strBack = '', 
      utilCargos = [], 
      isDbf;
  let printerSetting = this.printerSetting 
  order = Object.assign({}, order)
  // ---------------
  // 运单数据初始化
  
  isDbf = order.pay_type == 'partner_pay_dbf'
  
  utilCargos = JSON.parse(order.cargos || "[]")
  order.cargos = (new Array(3)).fill(1).map((o,i) => {
    if (utilCargos[i]) {
      return utilCargos[i]
    }
    return {}
  })
  
  // 文字处理
  let fixedPayTotal = order.pay_total || 0
  let upText = numberToWords(fixedPayTotal)
  strPayTotal = `${fixedPayTotal}\r\n${upText}`

  // 鑫合顺 多笔付且 有到付时只显示到付费用
  strPaytype = PAY_TYPES[order.pay_type]
  if (isXHS && isDbf && order.pay_details.partner_pay_arrive) {
    strPaytype += `到付:${order.pay_details.partner_pay_arrive}元`
  }
  
  if (BACK_TYPES.includes(order.back_type)) {
    strBack = BACK_TYPES_MAP[`${order.back_type}`] +  ` ${order.back_nums || 0}份`
  }else{
    strBack = BACK_TYPES_MAP.NO
  }
  
  // ---------------
  
  
  let showReceiveLinkMan = true, //: 'N',//	String		是否隐藏收货人
  showSendLinkMan = true, //: 'N',//	String		是否隐藏发货人
  showQRCode = true,
  showBarCode = true,
  showOrderNo = true,
  showAreaLevel = 1,
  strBeginArea = order.begin_area,
  strEndArea = order.end_area,
  qrCodeUrl;
  
  if(printerSetting && printerSetting.print_order_setting){
    let option = printerSetting.print_order_setting
    showReceiveLinkMan = option.is_hide_receive_linkman != 'Y'
    showSendLinkMan = option.is_hide_send_linkman != 'Y'
    showQRCode = option.is_print_QR_code != 'N'
    showBarCode = option.is_print_bar_code != 'N'
    showOrderNo = option.is_print_order_no != 'N'
    showAreaLevel = option.print_area_level
  }
  
  // ---------------
  qrCodeUrl = `${QRCODE_PROXY}${order.order_no}`

  if(showAreaLevel == 2){
    strBeginArea = filterSlice(strBeginArea)
    strEndArea = filterSlice(strEndArea)
  }

  
  
  
  let beginAreas = getAreaArray(order.begin_area)
  let endAreas = getAreaArray(order.end_area)
  // 以下为设计生产代码，修改时注意if 语句
  LODOP.SET_PRINT_STYLE("FontSize",11);
  // 鑫合顺不打印条形码 二维码
  if (showBarCode) {
    LODOP.ADD_PRINT_BARCODE(37,308,240,70,"Code39", `${order.order_no}`);
  }
  if (showQRCode) {
    LODOP.ADD_PRINT_IMAGE(28,546,80,80,`<img width='70' border='0' src='${qrCodeUrl}'/>`);
  }
  LODOP.ADD_PRINT_TEXT("10.05mm","171.45mm","37.57mm","5.29mm", order.create_time);
  LODOP.ADD_PRINT_TEXT("25.93mm","166.16mm","21.17mm","5.29mm", strBeginArea); //order.begin_area
  LODOP.ADD_PRINT_TEXT("25.93mm","188.12mm","21.17mm","5.29mm", strEndArea); //order.end_area
  // 是否显示发货人信息
  if (showSendLinkMan) {
    LODOP.ADD_PRINT_TEXT("43.66mm","34.93mm","23.81mm","5.29mm", order.begin_link_man);
    LODOP.ADD_PRINT_TEXT("43.66mm","69.85mm","26.46mm","5.29mm", order.begin_link_mobile);
    LODOP.ADD_PRINT_TEXT("51.33mm","38.36mm","56.89mm","5.29mm", order.send_company);
    LODOP.ADD_PRINT_TEXT("59.27mm","37.04mm","14.55mm","5.29mm", beginAreas[0]);
    LODOP.ADD_PRINT_TEXT("59.27mm","53.71mm","15.88mm","5.29mm", beginAreas[1]);
    LODOP.ADD_PRINT_TEXT("59.27mm","73.03mm","15.88mm","5.29mm", beginAreas[2]);
    LODOP.ADD_PRINT_TEXT("66.94mm","24.61mm","71.44mm","5.29mm", order.begin_address);
  }
  // 是否显示收货人信息
  if (showReceiveLinkMan) {
    LODOP.ADD_PRINT_TEXT("85.99mm","34.66mm","23.81mm","5.29mm", order.end_link_man);
    LODOP.ADD_PRINT_TEXT("85.99mm","69.59mm","26.46mm","5.29mm", order.end_link_mobile);
    LODOP.ADD_PRINT_TEXT("93.13mm","38.36mm","56.89mm","5.29mm", order.receive_company);
    LODOP.ADD_PRINT_TEXT("101.6mm","37.04mm","14.55mm","5.29mm", endAreas[0]);
    LODOP.ADD_PRINT_TEXT("101.6mm","53.98mm","15.88mm","5.29mm", endAreas[1]);
    LODOP.ADD_PRINT_TEXT("101.6mm","72.5mm","15.88mm","5.29mm", endAreas[2]);
    LODOP.ADD_PRINT_TEXT("109.54mm","24.61mm","71.44mm","5.29mm", order.end_address);
  }
  LODOP.ADD_PRINT_TEXT("51.33mm","104.51mm","22.49mm","5.29mm", order.cargos[0].c_name);
  LODOP.ADD_PRINT_TEXT("51.33mm","127mm","11mm","5.29mm", order.cargos[0].c_amount);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("51.33mm","138.11mm","13.23mm","5.29mm", order.cargos[0].c_pack);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("51.33mm","151.34mm","11mm","5.29mm", order.cargos[0].c_weight);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("51.33mm","161.93mm","11mm","5.29mm", order.cargos[0].c_volume);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("59.27mm","104.51mm","22.49mm","5.29mm", order.cargos[1].c_name);
  LODOP.ADD_PRINT_TEXT("59.27mm","127mm","11mm","5.29mm", order.cargos[1].c_amount);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("59.27mm","138.11mm","13.23mm","5.29mm", order.cargos[1].c_pack);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("59.27mm","151.34mm","11mm","5.29mm", order.cargos[1].c_weight);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("59.27mm","161.93mm","11mm","5.29mm", order.cargos[1].c_volume);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("66.94mm","104.51mm","22.49mm","5.29mm", order.cargos[2].c_name);
  LODOP.ADD_PRINT_TEXT("66.94mm","127mm","11mm","5.29mm", order.cargos[2].c_amount);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("66.94mm","138.11mm","13.23mm","5.29mm", order.cargos[2].c_pack);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("66.94mm","151.34mm","11mm","5.29mm", order.cargos[2].c_weight);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("66.94mm","161.93mm","11mm","5.29mm", order.cargos[2].c_volume);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("83.61mm","110.6mm","13.23mm","5.29mm", order.fee_transport);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

  // 鑫合顺 并且是多笔付时不打印到付以外的费用
  if (!isXHS || !isDbf) {
    LODOP.ADD_PRINT_TEXT("83.61mm","135.73mm","13.23mm","5.29mm", order.fee_details.partner_fee_sh); //送货
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
    LODOP.ADD_PRINT_TEXT("101.86mm","148.43mm","21.17mm","7.14mm", strPayTotal); //"124\r\n大写"
    LODOP.SET_PRINT_STYLEA(0,"FontSize",9);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  }

  LODOP.ADD_PRINT_TEXT("109.54mm","111.13mm","4.23mm","5.29mm", order.is_delivery == "N" ? 'v' : '');
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("109.54mm","126.74mm","4.23mm","5.29mm", order.is_delivery == "Y" ? 'v' : '');
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT("109.54mm","148.43mm","26.46mm","5.29mm",strPaytype);
  LODOP.ADD_PRINT_TEXT("83.08mm","179.39mm","29.1mm","18.52mm", order.shipper_remark);
  LODOP.ADD_PRINT_TEXT("109.54mm","178.06mm","31.75mm","5.29mm",strBack);

  
}



function getAreaArray (areaString) {
  let a1,a2;
  a1 = areaString.split('-')
  a2 = areaString.split(' ')

  if(a1.length > a2.length){
    return a1  
  }else{
    return a2
  }
}


// 打印入口方法
async function printOrder ({
  data
} = {}) {
  let printerName;
  let setting = printer.printerSetting = await getPrintSetting()
  printerName = setting && setting.print_mac_setting ? setting.print_mac_setting.order_print_mac : ''
  printer.initPrinter()
  if (!printer.setPrinter(printerName)) { return }

  
  let userInfo = getUserInfo()
  let isXHS = userInfo.company_id == xhsCompanyId

  data.forEach(order => {
    printer.createPage({order, isXHS})
  })
  
  printer.print()
  
}

export default printOrder