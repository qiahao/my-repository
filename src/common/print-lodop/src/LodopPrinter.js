import { getLodop } from "@/lib/lodop";
import {Message} from 'iview'

const MESSAGE_NO_PRINTER = '未找到合适打印机'
const MESSAGE_PRINTER_INVALID = '打印机有误，请重新设置'


function LodopPrinter (option={}) {
  let defaultOption = {}
  this.option = Object.assign({}, defaultOption, option)

}

LodopPrinter.prototype.initPrinter = function (){
  this.LODOP = getLodop();
  this.LODOP.PRINT_INIT(this.option.pageName);
  this.LODOP.SET_PRINT_PAGESIZE(...this.option.printPageSize)
  return this.LODOP
}

LodopPrinter.prototype.setPrinter = function (printerName){
  let printers
  if(!this.LODOP || !this.LODOP.Printers || !this.LODOP.Printers.list){
    Message.info(MESSAGE_NO_PRINTER)
    return false
  }
  printers = this.LODOP.Printers.list.map(item => item.name)
  if(!printers.includes(printerName)){
    Message.info(MESSAGE_PRINTER_INVALID)
    return false
  }
  
  this.LODOP.SET_PRINTER_INDEX(printerName)
  return true
}


LodopPrinter.prototype.print = function (){
  this.LODOP.PRINT()
  // this.LODOP.PREVIEW()
}



export default LodopPrinter