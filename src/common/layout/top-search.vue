<template>
    <editable-drop class="top-search" v-model="q_order_no" placeholder="请输入运单号" @on-enter="doSearch" ref="searchDrop">
        <editable-drop-option v-for="(item,i) in historyOrderNumbers" :value="item" :key="i" @click.native="orderNumberClick(item)">{{item}}</editable-drop-option>
    </editable-drop>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
import * as types from '@/store/mutation-types.js'
import bus from '@/utils/bus'
import { SearchCache } from './search-model.js'
const directeToPath = '/order-store'

let orderSearch = new SearchCache()

export default {
    name: 'topSearch',
    data() {
        return {
            q_order_no: '',
            historyOrderNumbers: orderSearch.orderNumbers
        }
    },
    computed: {
        // ...mapState(['queryOrderNumber'])
    },
    methods: {
        ...mapMutations({setQueryOrderNumber:types.setQueryOrderNumber}),
        redirecte2orderList() {
            
            let componentMounted = this.$route.matched.some(route => route.path == directeToPath)
            this.q_order_no = this.q_order_no.replace(/(^\s*)|(\s*$)/g,'')
            this.setQueryOrderNumber(this.q_order_no)
            if (componentMounted) {bus.$emit('order-store-top-search', this.q_order_no) }

            this.$router.push({path: '/order-store'})

            if (this.q_order_no) {
                // 更新历史记录
                orderSearch.updateNumbers(this.q_order_no,() => {
                    this.$nextTick(()=>{
                        this.$refs.searchDrop.checkSelect()
                    })
                })
            }
        },
        doSearch() {
            this.$refs.searchDrop.visible = false
            this.redirecte2orderList()
        },
        orderNumberClick() {
            this.redirecte2orderList()
        }
    },
    created() {

        // this.$api.order.getOrderList()
    },
    mounted() {},
}
</script>
<style lang="scss">
.top-search {
    display: inline-block;
    width: 200px;
}
</style>