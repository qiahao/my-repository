import axios from 'axios';
const _MODUEL = '/api/tms/finance'

/**
 * 费用核销 - 核销项列表
 * params
 *   page	int	是	分页页数/第几页
 *   page_size	int	是	分页大小/每页记录数
 *   company_id	String	是	公司ID
 *   act_user_id	String	是	操作人id
 *   catalog	String	是	核销项类别：0运单收入核销表，1运单支出核销表，2车费支出核销表）
 *   create_time_begin	String	否	开单时间-起（格式：yyyy-mm-dd）
 *   create_time_end	String	否	开单时间-止（格式：yyyy-mm-dd）
 *   keyword	String	否	关键字查询，包括（运单编号、收款人/付款人、客户名称）
 */
export function getFeeList(params) {
  return axios({
    url: `${_MODUEL}/item/list`,
    params
  })
}




/**
 * 费用核销 - 生成对账单
 * params
 *   company_id	String	是	公司ID
 *   act_user_id	String	是	操作人id
 *   item_ids	String	是	核销项id，多个核销项用逗号分隔
 *   finance_name	String	是	对账单名称
 *   finance_obj	String	否	对账对象
 */
export function addBill(params) {
  return axios({
    url: `${_MODUEL}/create`,
    params
  })
}




/**
 * 费用核销 - 对账单列表
 * params
 *   page	int	是	分页页数/第几页
 *   page_size	int	是	分页大小/每页记录数
 *   company_id	String	是	公司ID
 *   act_user_id	String	是	操作人id
 *   finance_status	String	是	核销状态,N未核销 D部分核销 Y已核销
 *   create_time_begin	String	否	开单时间-起（格式：yyyy-mm-dd）
 *   create_time_end	String	否	开单时间-止（格式：yyyy-mm-dd）
 *   keyword	String	否	关键字查询，包括（对账单名称、对账对象）
 */
export function getBillList(params) {
  return axios({
    url: `${_MODUEL}/list`,
    params
  })
}



/**
 * 费用核销 - 核销
 * params
 *   company_id	String	是	公司ID
 *   act_user_id	String	是	操作人id
 *   content	String	是	核销内容，json格式，[{finance_id: '1', last_pay_money: 10, last_income_money: 10}]，finanece_id对账单ID，last_pay_money剩余应付核销金额，last_income_money剩余应收核销金额；last_pay_money和last_income_money同时为0时，表示核销；否则为部分核销；
 *   finance_remark 备注

 */
export function updateVerification(params) {
  return axios({
    url: `${_MODUEL}/verification`,
    params
  })
}





/**
 * 费用核销 - 对账单详情
 * params
 *  company_id	String	是	公司ID
 *  act_user_id	String	是	操作人id
 *  finance_id	String	是	对账单ID
 */
export function getBillDetail(params) {
  return axios({
    url: `${_MODUEL}/detail`,
    params
  })
}




/**
 * 费用核销 - 对账单编辑
 * params
 *   company_id	String	是	公司ID
 *   act_user_id	String	是	操作人id
 *   finance_id	String	是	对账单ID
 *   item_ids	String	是	核销项id，多个核销项用逗号分隔
 *   finance_name	String	是	对账单名称
 *   finance_obj	String	否	对账对象

 */
export function updateBill(params) {
  return axios({
    url: `${_MODUEL}/edit`,
    params
  })
}




/**
 * 费用核销 - 对账单作废
 * params
 *   company_id	String	是	公司ID
 *   act_user_id	String	是	操作人id
 *   finance_ids	String	是	对账单IDS，多个对账单用逗号分隔
 */

export function cancelBill(params) {
  return axios({
    url: `${_MODUEL}/del`,
    params
  })
}




/**
 * 费用核销 - 核销记录
 * params
 *  company_id	String	是	公司ID
 *  act_user_id	String	是	操作人id
 *  finance_id	String	是	对账单ID
 *  page	int	是	分页页数/第几页
 *  page_size	int	是	分页大小/每页记录数
 */
export function getVerificationRecord(params) {
  return axios({
    url: `${_MODUEL}/history/list`,
    params
  })
}



/**
 * 费用核销 - 反向核销
 * params
 *   company_id	String	是	公司ID
 *   act_user_id	String	是	操作人id
 *   record_id	String	是	核销记录id
 */
export function updateVerificationBack(params) {
  return axios({
    url: `${_MODUEL}/history/back`,
    params
  })
}


