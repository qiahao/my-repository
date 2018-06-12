/**
 * 开单基本信息：项目、客户、托运人、收货人选择；
 */
import * as constants from './constants.js'

export default {
    data() {
        return {
            util: {
                
            },
            orderRule: {
                back_nums: {
                    validator: constants.proxy(constants.validateBackNums,this)
                }    
            }
        }
    },
    watch: {
        'order.back_type': function (n,o) {
            if (n != 4) {this.order.back_type_other = ''}
        }
    }

}