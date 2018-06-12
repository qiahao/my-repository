/**
 *  前端字典
 */
 

// 费用
// 设置初始化值为0
const getFeeInit = (obj, exclude = [], initVal = 0) => {
	let _rst = {}
	obj.forEach((item) => {if (!exclude.includes(item.type)) _rst[item.type] = initVal })
	return _rst
}

// 费用信息 付款信息 包含 用于前端遍历输出的字典表
// 附录 - 费用 - 客户
export const partnerFeesTypes = [
	{type: 'partner_fee_az',	text: '安装费'},
	{type: 'partner_fee_bg',	text: '保管费'},
	{type: 'partner_fee_bj',	text: '保价费'},
	{type: 'partner_fee_bx',	text: '保险费'},
	{type: 'partner_fee_bz',	text: '包装费'},
	{type: 'partner_fee_dshk',	text: '代收货款'},
	{type: 'partner_fee_dssx',	text: '代收手续费'},
	{type: 'partner_fee_jc',	text: '进仓费'},
	{type: 'partner_fee_qt',	text: '其他费'},
	{type: 'partner_fee_sh',	text: '送货费'},
	{type: 'partner_fee_sl',	text: '上楼费'},
	{type: 'partner_fee_smjz',	text: '声明价值'},
	{type: 'partner_fee_th',	text: '提货费'},
	{type: 'partner_fee_y',		text: '运费'},
	{type: 'partner_fee_zx',	text: '装卸费'},
];
export const partnerFees = getFeeInit(partnerFeesTypes);


// 附录 - 费用 - 承运商
export const linerFeesTypes = [
	{type: 'liner_fee_az',		text: '安装费'},
	{type: 'liner_fee_bg',		text: '保管费'},
	{type: 'liner_fee_bj',		text: '保价费'},
	{type: 'liner_fee_bx',		text: '保险费'},
	{type: 'liner_fee_bz',		text: '包装费'},
	{type: 'liner_fee_dshk',	text: '代收货款'},
	{type: 'liner_fee_dssx',	text: '代收手续费'},
	{type: 'liner_fee_jc',		text: '进仓费'},
	{type: 'liner_fee_qt',		text: '其他费'},
	{type: 'liner_fee_sh',		text: '送货费'},
	{type: 'liner_fee_sl',		text: '上楼费'},
	{type: 'liner_fee_smjz',	text: '声明价值'},
	{type: 'liner_fee_th',		text: '提货费'},
	{type: 'liner_fee_y',		text: '运费'},
	{type: 'liner_fee_zx',		text: '装卸费'},
];
export const linerFees = getFeeInit(linerFeesTypes);


// 附录 - 费用 - 司机
export const driverFeesTypes = [
	{type: 'driver_fee_qt',	text:'其它'},
	{type: 'driver_fee_y',	text:'运费'}
];
export const driverFees = getFeeInit(driverFeesTypes);


// 附录 - 费用 - 短驳（提）
export const cdsTakeFeesTypes = [
	{type:'cds_take_fee_qt',text:'其它'},
	{type:'cds_take_fee_y',	text:'运费'}
];
export const cdsTakeFees = getFeeInit(cdsTakeFeesTypes);


// 附录 - 费用 - 短驳（送）
export const cdsSendFeesTypes = [
	{type: 'cds_send_fee_qt',	text: '其它'},
	{type: 'cds_send_fee_y',	text: '运费'}
];
export const cdsSendFees = getFeeInit(cdsSendFeesTypes);


// 附录 - 支付 - 客户
export const partnerPaysTypes = [
	{type: 'partner_pay_arrive',text: '到付'},
	{type: 'partner_pay_back',	text: '回单付'},
	{type: 'partner_pay_cash',	text: '现付现金'},
	{type: 'partner_pay_hkk',	text: '货款扣'},
	{type: 'partner_pay_month',	text: '月结'},
	{type: 'partner_pay_dbf',	text: '多笔付'},
	{type: 'partner_pay_qfan',	text: '欠返'},
	{type: 'partner_pay_qfu',	text: '欠付'},
	{type: 'partner_pay_xfan',	text: '现返'},
	{type: 'partner_pay_hdfk',	text: '货到打款'}
];
export const partnerPays = getFeeInit(partnerPaysTypes, ['partner_pay_dbf']);


// 附录 - 支付 - 承运商
export const linerPaysTypes = [
	{type: 'liner_pay_arrive',	text: '到付'},
	{type: 'liner_pay_back',	text: '回单付'},
	{type: 'liner_pay_cash',	text: '现付现金'},
	{type: 'liner_pay_hkk',		text: '货款扣'},
	{type: 'liner_pay_month',	text: '月结'},
	{type: 'liner_pay_dbf',		text: '多笔付'},
	{type: 'liner_pay_qfan',	text: '欠返'},
	{type: 'liner_pay_qfu',		text: '欠付'},
	{type: 'liner_pay_xfan',	text: '现返'},
	{type: 'liner_pay_hdfk',	text: '货到打款'}
];
export const linerPays = getFeeInit(linerPaysTypes, ['liner_pay_dbf']);


// 附录 - 支付 - 司机
export const driverPaysTypes = [
	{type: 'driver_pay_arrive',	text: '到付'},
	{type: 'driver_pay_back',	text: '回单付'},
	{type: 'driver_pay_cash',	text: '现付现金'},
	{type: 'driver_pay_hkk',	text: '货款扣'},
	{type: 'driver_pay_month',	text: '月结'},
	{type: 'driver_pay_oil',	text: '现付油卡'},
	{type: 'driver_pay_dbf',	text: '多笔付'}
]
export const driverPays = getFeeInit(driverPaysTypes, ['driver_pay_dbf'], '');
// 费用 end 




