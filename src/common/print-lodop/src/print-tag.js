import LodopPrinter from './LodopPrinter'
import {getPrintSetting} from '@/api/src/companyApi'
const default_LOGO_URL = "/static/images/print-tag/logo@2x.png"
const QRCODE_URL = "/static/images/print-tag/qrcode@2x.png"

let printer = new LodopPrinter({
  pageName: '货签打印',
  printPageSize: [0, 800, 600,'货签打印']
})

// createPage
printer.createPage = function ({data,total,index}){
  let LODOP = this.LODOP
  if (!data) { return }
  LODOP.NEWPAGE()
  let order, 
    linkMan,
    linkMobile,
    logoUrl = default_LOGO_URL,
    serverMobile = '400-885-6943';
  order = Object.assign({}, data)
  linkMan = order.end_link_man
  linkMobile = order.end_link_mobile
  
  if(this.printerSetting && this.printerSetting.print_sign_setting){
    let option = this.printerSetting.print_sign_setting
    if (!!option.print_logo_pic) {
      logoUrl = option.print_logo_pic
    }

    if (option.is_print_receive_linkman == 'N') {
      linkMan = '' 
    }
    
    if (option.is_print_receive_linkmobile == 'N') {
      linkMobile = '' 
    }
    
    if (!!option.custom_order_hotline) {
      serverMobile =  option.custom_order_hotline
    }
    
  }
  
  // 画线
  LODOP.ADD_PRINT_LINE("17.75mm","0mm",66,"79.9mm",0,1);
  LODOP.ADD_PRINT_LINE("35.77mm","0mm",134,"79.9mm",0,1);
  LODOP.ADD_PRINT_LINE("41.57mm","0mm",156,"79.9mm",0,1);
  LODOP.ADD_PRINT_LINE("59.5mm","56.59mm","41.51mm",215,0,1);
  LODOP.ADD_PRINT_LINE("11.85mm","55.01mm",44,"79.9mm",0,1);
  LODOP.ADD_PRINT_LINE("6.06mm","55.01mm",22,"79.9mm",0,1);
  LODOP.ADD_PRINT_LINE("0mm","55.01mm","17.49mm",209,0,1);
  LODOP.ADD_PRINT_LINE("0mm","49mm","17.49mm",186,0,1);
  LODOP.ADD_PRINT_IMAGE("1.48mm","2.99mm","37.99mm","10.8mm",`<img border="0" height="38" src="${logoUrl}"/>`);
  

  LODOP.ADD_PRINT_TEXT(48,13,160,18,`客服电话：${serverMobile}`);
  LODOP.ADD_PRINT_TEXT("3.18mm","49.21mm","5.82mm","13.76mm","收\r\n货\r\n人");
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT(4,211,86,18,linkMan);
  LODOP.ADD_PRINT_TEXT(26,"55.75mm",86,18,linkMobile);
  LODOP.ADD_PRINT_TEXT(48,211,86,18,order.is_delivery == 'Y' ? '送货' : '自提');
  LODOP.ADD_PRINT_TEXT(75,12,280,24,`出发  ${order.begin_area}`);
  LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
  LODOP.ADD_PRINT_TEXT(103,12,280,24,`到达  ${order.end_area}`);
  LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
  LODOP.ADD_PRINT_TEXT(138,12,150,18,`运单号 ${order.order_no}`);
  LODOP.ADD_PRINT_TEXT(138,162,140,18,`共${order.order_count}件 第${index}份 共${total}份`);
  LODOP.ADD_PRINT_BARCODE(168,22,202,50,"93Extended",order.order_no);

  
  LODOP.ADD_PRINT_IMAGE(166,"61.65mm","12.65mm","12.65mm",`<img border="0" height="48" src="${QRCODE_URL}"/>`);  
}

async function printTag ({data,total}) {
  let printerName;
  let setting = printer.printerSetting = await getPrintSetting()
  printerName = setting && setting.print_mac_setting ? setting.print_mac_setting.sign_print_mac : ''
  printer.initPrinter()
  if (!printer.setPrinter(printerName)) { return }
  if (total < 1) { total = 1 }
  for (let i = 1; i <= total; i++) {
    printer.createPage({
      data: data, 
      total: total, 
      index: i, 
    })
  }
  
  printer.print()
}
export default printTag