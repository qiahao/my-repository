/**
 * 开单基本信息：项目、客户、托运人、收货人选择；
 */
import { mapActions } from 'vuex'
import { getCargosList } from '@/api/src/common'
import * as constants from './constants.js'
import {
    validatePack, 
    validateAmount, 
    validateWeight, 
    validateVolume, 
    validatePrice
} from './constants.js'

export default {
    data () {
        let vm = this
        return {
            util: {
                historyCargoListParams: { ...constants.historyCargoListParams },
                historyCargoList: [],
                historyCargoPacks: [],
            },
            orderRule: {
                cargos: {
                    c_pack: validatePack(this),
                    c_amount: validateAmount(this),
                    c_weight: validateWeight(this),
                    c_volume: validateVolume(this),
                    c_price: validatePrice(this),
                }
            }
        }
    },
    computed: {
        /**
         * 计算总运费用
         * 同时计算总重量、总体积
         */

        totalFeeTransport () {
            let _totalPrice = 0, _totalWeight = 0, _totalVolumes = 0;
            this.order.cargos.forEach((cargo) => {
                // 存在货物名称才计价
                if (cargo.c_name) {
                    _totalWeight += constants.getNumber(cargo.c_weight)
                    _totalVolumes += constants.getNumber(cargo.c_volume)
                }
                switch (cargo.c_price_unit) {
                    case '元/吨':
                        _totalPrice += constants.getNumber(cargo.c_weight) * constants.getNumber(cargo.c_price)
                        break;
                    case '元/件':
                        _totalPrice += constants.getNumber(cargo.c_amount) * constants.getNumber(cargo.c_price)
                        break;
                    case '元/方':
                        _totalPrice += constants.getNumber(cargo.c_volume) * constants.getNumber(cargo.c_price)
                        break;
                }
            })
            this.order.order_weights = Math.round(_totalWeight * 1000) / 1000
            this.order.order_volumes = Math.round(_totalVolumes * 100) / 100
            return constants.getNumber(_totalPrice)
        }
    },
    watch: {
        'util.curCustomer': function (n, o) {
            if (n) {
                this.util.historyCargoListParams.ship_id = n.pcid
            } else {
                this.util.historyCargoListParams.ship_id = ''
            }
            this.getCargosList()
        }
    },
    methods: {
        ...mapActions(['getCargoPacks']),
        getCargosList () {
            getCargosList(this.util.historyCargoListParams).then((data) => {
                this.util.historyCargoList = data.resultObj
            })
        },

        // 选中货物
        selectCargoHandler (cargo, item) {
            cargo.c_amount = item.c_amount
            cargo.c_name = item.c_name
            cargo.c_pack = item.c_pack
            cargo.c_price = item.c_price
            cargo.c_price_unit = item.c_price_unit
            cargo.c_volume = item.c_volume
            cargo.c_weight = item.c_weight
        },
        // 当体积输入为 l*w*h 时计算总和
        volumeCacl (cargo) {
            let volume = cargo.c_volume || ''
            let valArr = volume.split('*')
            if (valArr.length == 3 && !valArr.some((item) => isNaN(Number(item)))) {
                let _v = Math.round(valArr.reduce((fn, an) => fn * an) * 100) / 100 + ''
                cargo.c_volume = _v.replace(/\.00$/, '')
            }
        }
    },
    activated () {
        this.getCargosList()
        let vm = this
        let cc = vm.getCargoPacks()
        cc.then(list => {
            vm.util.historyCargoPacks = list
        })
        /*
        setTimeout(function () {
            let dd = vm.getCargoPacks()
            dd.then(list => {
                
            })
        }, 1000)
        */

    }

}