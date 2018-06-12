import * as constants from './constant.js'
import {
    validatePack, 
    validateAmount, 
    validateWeight, 
    validateVolume, 
    validatePrice
} from './constant.js'

import { dictCargoPackApi } from '@/api/src/dictApi'
import { getCargosList } from '@/api/src/common'

export default {
    data() {

        let vm = this
        return {

            util: {
                historyCargos: [], // 历史货物名称记录
                historyPacks: [], // 历史包装记录
            },
            orderRule: {
                cargos: {
                    c_pack: validatePack(this),
                    c_amount: validateAmount(this),
                    c_weight: validateWeight(this),
                    c_volume: validateVolume(this),
                    c_price: validatePrice(this),
                }
            },
        }
    },
    computed: {},
    watch: {},
    methods: {
    	createdHandler (){
    	    getCargosList({page: 1,page_size: 10}).then((data) => {this.util.historyCargos = data.resultObj })
    	    dictCargoPackApi().then((data) => {this.util.historyPacks = data.resultObj })
    	},
    	// 当体积输入为 l*w*h 时计算总和
    	volumeCacl (cargo){
    	    let volume = cargo.c_volume || '' 
    	    let valArr = volume.split('*') 
    	    if (valArr.length == 3 && !valArr.some((item) => isNaN(Number(item)) )) {
    	        cargo.c_volume = Math.round(valArr.reduce((fn,an) => fn * an ) * 100) / 100 + ''
    	    }
    	}
    },
    activated() {},
    created() {
    	this.createdHandler()
    },
    mounted() {},
}