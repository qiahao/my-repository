import * as constants from './constant.js'

export default {
    data() {
    	let vm = this
        return {
            util: {},
            orderRule: {
                back_nums: { validator: constants.validateBackNums(vm), trigger: 'change' }
            }
        }
    },
    computed: {},
    watch: {
        'order.back_type': function(n, o) {
            if (n != 4) this.order.back_type_other = ''
        },
        'order.back_nums': function(n, o) {
            if (n === undefined) this.order.back_nums = 0
        },
    },
    methods: {},
    activated() {},
    created() {},
    mounted() {},
}