// oms 开单数据结构
export const v2OrderDetail = {
	shipper_order_no: '',
	shipper_remark: '', 
	create_user_id: '', 
	bulk_type: '0', 
	is_pickup: 'N' ,
	is_delivery: 'N' ,
	order_volumes: '', 
	order_weights: '', 
	cargos: [
		{c_name: '', c_pack: '', c_amount: '', c_weight: '', c_volume: '', c_price: '', c_price_unit: '元/吨'},
		{c_name: '', c_pack: '', c_amount: '', c_weight: '', c_volume: '', c_price: '', c_price_unit: '元/吨'},
		{c_name: '', c_pack: '', c_amount: '', c_weight: '', c_volume: '', c_price: '', c_price_unit: '元/吨'},
	],
	cargos_remark: '', 
	begin_code: '', 
	begin_area: '', 
	begin_lng: '0',
	begin_lat: '0',
	begin_address: '', 
	begin_link_man: '', 
	begin_link_mobile: '', 
	end_code: '', 
	end_area: '', 
    end_lng: '0',
	end_lat: '0',
	end_address: '', 
	end_link_man: '', 
	end_link_mobile: '', 
	fee_transport: '0', 
	fee_details: {
		fee_th: '0', fee_sh: '0', fee_smjz: '0', fee_bj: '0', fee_bx: '0', fee_zx: '0', fee_sl: '0', fee_bz: '0', fee_az: '0', fee_bg: '0', fee_jc: '0', fee_dshk: '0', fee_dssx: '0', fee_qt: '0'
	},
	pay_total: '0',
	pay_type: 'pay_xfu',
	pay_details: {
		pay_xfu: '0', pay_df: '0', pay_hdf: '0', pay_hkk: '0', pay_yj: '0'
	},
	back_type: 'no',
	back_type_other: '', 	
	back_nums: '0', 	
	is_kzj: 'Y', 
	send_company: '', 	
	receive_company: '', 	
	expect_arrive_days: '', 
	prj_id: '', 	
	is_speed: 'N', 
	special_req: '', 	
	req_truck_type: '', 	
	req_truck_length: '', 	
	send_msg_phone_no: '', 
};
// oms 开单已选择客户 退出再开单是托运人收货人列表丢失问题
export const v2OrderStateCustomer = {
	link_list: [],
	receipt_list: []
}