/**
 * 开单基本信息：项目、客户、托运人、收货人选择；
 */
import { mapActions } from 'vuex'
import { getPartnerAll, getLinkListAll, getReceiptListAll } from '@/api/src/customer'
import { getProjectList } from '@/api/src/projectApi'
import * as constants from './constants.js'
import {fmt} from '@/utils'
import { columnsSeletionType } from '../../../finance/bill/constant';

export default {
    data() {
        return {
            util: {
                customerListParams: {...constants.customerListParams},
                customerList: [],
                curCustomer: null,
                linkListParams: {...constants.linkListParams},
                receiptListParams: {...constants.receiptListParams},
                // 区分收发货人的 名字列表和电话列表 ：因为查询关键字不同
                linkNameList: [],
                linkPhoneList: [],
                receiptNameList: [],
                receipPhonetList: [],
                truckTypeList: [],
                truckLengthList: [],
                timeOption: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                provinceOption: { 'change-on-select': true },
            },
            orderRule: {
                ...constants.customerRule,
                req_truck_type: {validator: constants.proxy(constants.truckTypeRule('车型不能为空'),this)},
                req_truck_length: {validator: constants.proxy(constants.truckTypeRule('车长不能为空'),this)},
            },
        }
    },
    computed: {
        // formatedCreateTime: {
        //     // // console.log('11',fmt.date(this.order.order_create_time))
        //     // return fmt.date(this.order.order_create_time)
        //     get (){
        //         console.log('11',fmt.date(this.order.order_create_time))
        //         return this.order.order_create_time
        //     },
        //     set (val){
        //         console.log('22',fmt.date(this.order.order_create_time))
                
        //     }
        // }
    },
    watch: {
        'util.curProject': function (n,o){
            if (n) {
                this.order.send_company = n.partner_name
                this.util.customerListParams.keyword = this.order.send_company
                this.util.customerListParams.pcid = n.partner_id
                this.getCustomerList()
            }else{
                this.util.customerListParams.pcid = ''
                this.util.customerListParams.keyword = this.order.send_company
                this.getCustomerList()
            }
        },
        
        'util.curCustomer': function (n,o){
            if (n) {
                this.util.linkNameList = n.link_list || []
                this.util.linkPhoneList = n.link_list || []
                this.util.receiptNameList = n.receipt_list || []
                this.util.receiptPhoneList = n.receipt_list || []
            }else{
                this.linkNameChangeHandler(this.order.begin_link_man)
                this.linkPhoneChangeHandler(this.order.begin_link_mobile)
                this.receiptClickHandler(this.order.end_link_man)
                this.receiptNameChangeHandler(this.order.end_link_mobile)
            }
        },
        // :todo todo todo
        'util.customerList': {
            handler: function (n,o){
                this.$nextTick(()=>{
                    this.$refs.customerRef.checkSelect()
                })
            },
            deep: true

        },

        // 车长车型重置
        'order.bulk_type': function (n,o){
            if (n != '1') {
                this.order.req_truck_type = ''
                this.order.req_truck_length = ''
            }
        },

        // 解决需求： 改变日期时不改变时间
        'order.order_create_time': function (n,o) {
            let nStringArray, nDate, nTime, oStringArray, oDate, oTime = '00:00:00';
            if (!n) { return }
            nStringArray = fmt.date(n).split(' ')
            nDate = nStringArray[0]
            nTime = nStringArray[1]
            if (o) {
                oStringArray = fmt.date(o).split(' ')
                oDate = oStringArray[0]
                oTime = oStringArray[1]
            }
            if (nDate != oDate) {
                this.order.order_create_time = [nDate, oTime].join(' ')
            }
            
        }

    },
    methods: {
        ...mapActions(['getTruckTypes' ,'getTruckLengths']),
        /*客户信息*/
        getCustomerList (obj={}){
            let params = Object.assign({},this.util.customerListParams,obj)
            getPartnerAll(params).then(data => {
                
                // 限制10条
                this.util.customerList = data.resultObj && data.resultObj.length > 10 ? data.resultObj.slice(0,10) : data.resultObj
                if (!!params.pcid) {
                    this.util.curCustomer = data.resultObj ? data.resultObj[0] : null
                }else{
                    this.util.curCustomer = null
                }
            })
        },
        // 客户名称改变
        customerChangeHandler (keyword){
            this.getCustomerList({keyword: keyword})
        },
        // 选择客户
        customerSelectHandler(val,item){
            this.util.curCustomer = item
            if (item && item.link_list && item.link_list.length) { 
                this.order.begin_code = item.link_list[0].link_area_code
                this.order.begin_area = item.link_list[0].link_area
            }
            if (item && item.receipt_list && item.receipt_list.length) { 
                this.order.end_code = item.receipt_list[0].receipt_area_code
                this.order.end_area = item.receipt_list[0].receipt_area
            }

        },
        /*收发货人*/
        getLinkList(keyword,fun){
            let params = {keyword: keyword}
            getLinkListAll(params).then(data=>{
                if (typeof fun === 'function') {fun.call(this,data.resultObj) }
            })
        },
        linkClickHandler (item){
            this.order.begin_link_man = item.link_name
            this.order.begin_link_mobile = item.link_mobile
            this.order.begin_address = item.link_address
        },
        linkNameChangeHandler (keyword){
            if (this.util.curCustomer) return
                // 限制10条
            this.getLinkList(keyword, (list) => {this.util.linkNameList = list && list.length > 10 ? list.slice(0,10) : list || []})
        },
        linkPhoneChangeHandler (keyword){
            if (this.util.curCustomer) return
                // 限制10条
            this.getLinkList(keyword, (list) => {this.util.linkPhoneList = list && list.length > 10 ? list.slice(0,10) : list || []})
        },
        getReceiptList(keyword,fun){
            let params = {keyword: keyword}
            getReceiptListAll(params).then(data=>{
                if (typeof fun === 'function') {fun.call(this,data.resultObj) }
            })
        },
        receiptClickHandler (item){
            if (!item) { return }
            this.order.end_link_man = item.receipt_username
            this.order.end_link_mobile = item.receipt_mobile
            this.order.end_address = item.receipt_address
        },
        receiptNameChangeHandler (keyword){
            if (this.util.curCustomer) return
                // 限制10条
            this.getReceiptList(keyword, (list) => {this.util.receiptNameList = list && list.length > 10 ? list.slice(0,10) : list || []})
        },
        receiptPhoneChangeHandler (keyword){
            if (this.util.curCustomer) return
                // 限制10条
            this.getReceiptList(keyword, (list) => {this.util.receiptPhoneList = list && list.length > 10 ? list.slice(0,10) : list || []})
        },


        /*地址控件*/
        /*始发地*/
        beginAreaChangeHandler (val) {
            this.order.begin_code = val.split('$')[0]
            this.order.begin_area = val.split('$')[1] || this.order.begin_area
        },
        // 目的地
        endAreaChangeHandler (val) {
            this.order.end_code = val.split('$')[0]
            this.order.end_area = val.split('$')[1] || this.order.end_area
        },

        // handlerChangeCreateTime(formatTime,dateObj){

        //     console.log('time',this.order.order_create_time)
        //     console.log('formatTime',formatTime)
        //     console.log('dateObj',dateObj)
        // }
    },
    activated() {
        this.getCustomerList()
        this.getLinkList()
        this.getReceiptList()
        this.getTruckTypes().then(list => { this.util.truckTypeList = list})
        this.getTruckLengths().then(list => { this.util.truckLengthList = list})
    },
    mounted(){
        // this.customerRef
    }

}