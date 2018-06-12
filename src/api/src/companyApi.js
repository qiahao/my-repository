import axios from 'axios';

const GET = '/api/company/get'
const EDIT = '/api/company/edit'


// 获取公司详情
export function getCompanyInfo (params) {
    return axios({
    	url: GET,
    	params: params
    });
}

// 保存公司详情
export function saveCompanyInfo (params) {
    return axios({
    	url: EDIT,
    	params: params
    });
}


// let printSetting = {
//     data: null,
//     setData: function (data) {
//         this.data = data ? data : null
//     },
//     getData: function () {
//         return this.data
//     }
// }




// 公司信息设置 - 打印设置
/**
* company_id	String	是	企业ID
* user_id	String	是	用户ID
* print_logo_pic	String	否	logo图片路径（没有值表示货签不打印个性化logo）
* is_print_receive_linkmobile	String	是	是否打印收货人电话（Y：是；N：否）
* custom_order_hotline	String	否	自定义查单热线（没有值表示货签使用默认的运吧查单热线电话）
* is_print_receive_linkman	String	是	是否打印收货人姓名（Y：是；N：否）
* is_hide_receive_linkman	String	是	是否隐藏收货人
* is_hide_send_linkman	String	是	是否隐藏发货人
* is_print_QR_code	String	是	是否打印二维码
* is_print_bar_code	String	是	是否打印条形码
* is_print_order_no	String	是	是否打印运单号
* print_area_level	String	是	打印地址的层级
* order_all_print_mac	String	是	全打打印机名称
* order_print_mac	String	是	套打打印机名称
* sign_print_mac	String	是	货签打印机名称
* order_list_print_mac	String	是	装车清单打印机名称
*/
export function updatePrintSetting(updateData){
    let params = Object.assign(
        {},
        updateData.print_sign_setting || {},
        updateData.print_order_setting || {},
        updateData.print_mac_setting || {},
    )

    return axios({
        url: '/api/company/print/setting',
        params: params
    }).then(data => {
        return data.resultObj
    })
}


// 公司信息设置 - 获取打印设置信息

export function getPrintSetting(){
    
    // if(printSetting.data){
    //     let data = JSON.parse(JSON.stringify(printSetting.data))
    //     return Promise.resolve(Object.assign({},data))
    // }else{
    //     return axios({ 
    //         url: '/api/company/print/setting/get' 
    //     }).then(data => {
    //         printSetting.setData(data.resultObj)
    //         return data.resultObj
    //     })
    // }
    return axios({ 
        url: '/api/company/print/setting/get' 
    }).then(data => {
        // printSetting.setData(data.resultObj)
        return data.resultObj
    })
}


