const orderState = [ "库存运单", "转交中", "已转交", "已签收", "已拒绝", "已装车", "已发车", "派单中", "未到站" ];
const backState = ["待回单", "回单中", "已回收", "已发放", "已结束"];
function splitTime(time) {
    return time ? time.split(" ")[0] : "";
}
const columns = [
    { title: "运单号", key: "order_no", width: 170 },
    { title: "项目名称", key: "project_name", width: 170 },
    { title: "客户名称", key: "partner_name", width: 170 },
    { title: "承运人", key: "common_carrier", width: 150 },
    { title: "落货网点", key: "next_company", width: 150 },
    { title: "收入合计", key: "total_fee", width: 150 },
    { title: "支出合计", key: "total_pay", width: 150 },
    { title: "毛利", key: "total_profit", width: 150 },
  
    {
      title: "状态",
      key: "order_state",
      width: 100,
      render: (h, params) => {
        return h("span", orderState[params.row.order_state] || "");
      }
    },
    { title: "发货人", key: "begin_link_man", width: 100 },
    { title: "联系方式", key: "begin_link_mobile", width: 150 },
    { title: "始发地", key: "begin_area", width: 150 },
    { title: "目的地", key: "end_area", width: 150 },
    {
      title: "是否提货",
      width: 150,
      render: (h, params) => {
        return (<span>{params.row.is_pickup == "Y" ? "是" : "否"}</span>);
      }
    },
    {
      title: "是否送货",
      width: 150,
      render: (h, params) => {
        return (<span>{params.row.is_delivery == "Y" ? "是" : "否"}</span>);
      }
    },
    { title: "收货人", key: "end_link_man", width: 100 },
    { title: "联系方式", key: "end_link_mobile", width: 150 },
    { title: "货物名称", key: "cargos_name", width: 200 },
    { title: "件数", key: "cargos_amount", width: 100 },
    { title: "重量", key: "cargos_weight", width: 100 },
    { title: "体积", key: "cargos_volume", width: 100 },
    { title: "包装", key: "cargos_pack", width: 100 },
    { title: "干线运费(收入)", key: "fee_transport", width: 88 },
    { title: "提货费(收入)", key: "fee_th", width: 74 },
    { title: "送货费(收入)", key: "fee_sh", width: 74 },
    { title: "保价费(收入)", key: "fee_bj", width: 74 },
    { title: "保险费(收入)", key: "fee_bx", width: 74 },
    { title: "装卸费(收入)", key: "fee_zx", width: 74 },
    { title: "上楼费(收入)", key: "fee_sl", width: 74 },
    { title: "包装费(收入)", key: "fee_bz", width: 74 },
    { title: "安装费(收入)", key: "fee_az", width: 74 },
    { title: "保管费(收入)", key: "fee_bg", width: 74 },
    { title: "进仓费(收入)", key: "fee_jc", width: 74 },
    { title: "代收货款(收入)", key: "fee_dshk", width: 88 },
    { title: "代收手续费(收入)", key: "fee_dssx", width: 88 },
    { title: "其他费用(收入)", key: "fee_qt", width: 88 },
    { title: "现付(收入)", key: "pay_xfu", width: 70 },
    { title: "到付(收入)", key: "pay_df", width: 70 },
    { title: "回单付(收入)", key: "pay_hdf", width: 74 },
    { title: "月结(收入)", key: "pay_yj", width: 70 },
    { title: "货款扣(收入)", key: "pay_hkk", width: 74 },
    { title: "货到付款(收入)", key: "pay_hdfk", width: 88 },
    { title: "现返(收入)", key: "pay_xfan", width: 70 },
    { title: "欠返(收入)", key: "pay_qfan", width: 70 },
    { title: "欠付(收入)", key: "pay_qfu", width: 70 },
    {
      title: "干线运费(支出)",
      width: 88,
      render: (h, params) => {
        return (<span>{params.row.payout_fee.fee_transport}</span>);
      }
    },
    {
      title: "油卡(支出)",
      width: 88,
      render: (h, params) => {
        return (<span>{params.row.payout_pay.pay_oil}</span>);
      }
    },
    {
      title: "提货费(支出)",
      key: "fee_th",
      width: 74,
      render: (h, params) => {
        return (<span>{params.row.payout_fee.fee_th}</span>);
      }
    },
    {
      title: "送货费(支出)",
      key: "fee_sh",
      width: 74,
      render: (h, params) => {
        return (<span>{params.row.payout_fee.fee_sh}</span>);
      }
    },
    {
      title: "保价费（支出",
      key: "fee_bj",
      width: 74,
      render: (h, params) => {
        return (<span>{params.row.payout_fee.fee_bj}</span>);
      }
    },
    {
      title: "保险费(支出)",
      key: "fee_bx",
      width: 74,
      render: (h, params) => {
        return (<span>{params.row.payout_fee.fee_bx}</span>);
      }
    },
    {
      title: "装卸费(支出)",
      key: "fee_zx",
      width: 74,
      render: (h, params) => {
        return (<span>{params.row.payout_fee.fee_zx}</span>);
      }
    },
    {
      title: "上楼费(支出)",
      key: "fee_sl",
      width: 74,
      render: (h, params) => {
        return (<span>{params.row.payout_fee.fee_sl}</span>);
      }
    },
    {
      title: "包装费(支出)",
      key: "fee_bz",
      width: 74,
      render: (h, params) => {
        return (<span>{params.row.payout_fee.fee_bz}</span>);
      }
    },
    {
      title: "安装费(支出)",
      key: "fee_az",
      width: 74,
      render: (h, params) => {
        return (<span>{params.row.payout_fee.fee_az}</span>);
      }
    },
    {
      title: "保管费(支出)",
      key: "fee_bg",
      width: 74,
      render: (h, params) => {
        return (<span>{params.row.payout_fee.fee_bg}</span>);
      }
    },
    {
      title: "进仓费(支出)",
      key: "fee_jc",
      width: 74,
      render: (h, params) => {
        return (<span>{params.row.payout_fee.fee_jc}</span>);
      }
    },
    {
      title: "代收货款(支出)",
      key: "fee_dshk",
      width: 88,
      render: (h, params) => {
        return (<span>{params.row.payout_fee.fee_dshk}</span>);
      }
    },
    {
      title: "代收手续费(支出)",
      key: "fee_dssx",
      width: 96,
      render: (h, params) => {
        return (<span>{params.row.payout_fee.fee_dssx}</span>);
      }
    },
    {
      title: "其他费用(支出)",
      key: "fee_qt",
      width: 88,
      render: (h, params) => {
        return (<span>{params.row.payout_fee.fee_qt}</span>);
      }
    },
    {
      title: "现付(支出)",
      key: "pay_xfu",
      width: 70,
      render: (h, params) => {
        return (<span>{params.row.payout_pay.pay_xfu}</span>);
      }
    },
    {
      title: "到付(支出)",
      key: "pay_df",
      width: 70,
      render: (h, params) => {
        return (<span>{params.row.payout_pay.pay_df}</span>);
      }
    },
    {
      title: "回单付(支出)",
      key: "pay_hdf",
      width: 74,
      render: (h, params) => {
        return (<span>{params.row.payout_pay.pay_hdf}</span>);
      }
    },
    {
      title: "月结(支出)",
      key: "pay_yj",
      width: 70,
      render: (h, params) => {
        return (<span>{params.row.payout_pay.pay_yj}</span>);
      }
    },
    {
      title: "货款扣(支出)",
      key: "pay_hkk",
      width: 74,
      render: (h, params) => {
        return (<span>{params.row.payout_pay.pay_hkk}</span>);
      }
    },
    {
      title: "货到付款(支出)",
      key: "pay_hdfk",
      width: 88,
      render: (h, params) => {
        return (<span>{params.row.payout_pay.pay_hdfk}</span>);
      }
    },
    {
      title: "现返(支出)",
      key: "pay_xfan",
      width: 70,
      render: (h, params) => {
        return (<span>{params.row.payout_pay.pay_xfan}</span>);
      }
    },
    {
      title: "欠返(支出)",
      key: "pay_qfan",
      width: 70,
      render: (h, params) => {
        return (<span>{params.row.payout_pay.pay_qfan}</span>);
      }
    },
    {
      title: "欠付(支出)",
      key: "pay_qfu",
      width: 70,
      render: (h, params) => {
        return (<span>{params.row.payout_pay.pay_qfu}</span>);
      }
    },
    {
      title: "创建时间",
      key: "create_time",
      width: 150,
      render: (h, params) => {
        return h("span", splitTime(params.row.create_time));
      }
    },
    {
      title: "完成时间",
      key: "finish_time",
      width: 150,
      render: (h, params) => {
        return h("span", splitTime(params.row.finish_time));
      }
    },
    {
      title: "回单状态",
      key: "back_state",
      width: 100,
      render: (h, params) => {
        return h("span", backState[params.row.back_state] || "");
      }
    },
    { title: "备注", key: "shipper_remark", width: 200 }
  ];
  const query = {
    q_create_time_begin: '',
    q_create_time_end: '',
    q_pay_type: '',
    q_is_sign: '',
    q_back_state: '',
    q_begin_link_man: '',
    q_begin_link_mobile: '',
    q_end_link_man: '',
    q_end_link_mobile: '',
    q_next_company: '',
    q_driver_name: '',
    q_common_carrier: '',
    q_project_name: '',
    q_send_company: '',
    q_finish_time_begin: '',
    q_finish_time_end: '',
    q_order_no: '',
    // q_create_time_begin: "",
    // q_create_time_end: "",
    // q_pay_type: "",
    // q_is_sign: "",
    // q_back_state: "",
    // q_begin_link_man: "",
    // q_begin_link_mobile: "",
    // q_end_link_man: "",
    // q_end_link_mobile: "",
    // q_next_company: "",
    // q_driver_name: "",
    // q_common_carrier: ""
};

export {
    orderState,
    backState,
    columns,
    query
}