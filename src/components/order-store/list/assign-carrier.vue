<template>
    <div>
        <Modal v-model="modal" width="1000">
            <div slot="header">
                <span>分配承运商</span>
            </div>
            <i-form :label-width="100" ref="carrierForm">
                <!-- 内容 -->
                <i-table :data="carriers" :columns="columns"></i-table>
                <div class="row-box mtb10">
                    <Row>
                        <Form-item :label-width="10">
                            <Checkbox v-model="carrier.is_hide_upstream">隐藏上游客户信息</Checkbox>
                        </Form-item>
                    </Row>
                </div>
                <!-- 内容 end -->
            </i-form>

            <div slot="footer">
                <i-button type="primary" size="large" @click="doOk">确定</i-button>
                <i-button type="error" size="large" @click="doCancel">取消</i-button>
            </div>
        </Modal>
    
   </div>

</template>
<script>
    import { assignOrderAutoToLiner } from '@/api/src/order'
    import { getNumber,getInteger } from '@/utils/util'

    const LINER_TYPE = ['专线','车队']

    const COLUMNS = [
        {title: '类型', render: function (h,params) {
            return h('span', LINER_TYPE[params.row.liner_type])
        }},
        {title: '承运商', key: 'liner_name'},
        {title: '路线', render: function (h,params) {
            return h('span', `${params.row.from_city} 到 ${params.row.to_city}`)
        }},
        {title: '本月承运数', key: 'orders_in_month', render: function (h,params) {
            return h('span', `${params.row.orders_in_month || 0 }`)
        }},
        {title: '评级', key: 'complex_score'},
        {title: '联系人', key: 'liner_link_name'},
        {title: '联系电话', key: 'liner_link_mobile'},
    ]
    const CARRIER = {
        order_id: '',
        is_hide_upstream: false,
    }

    const intRge = /^\d+$/
    const numRge = /^\d*(\.\d+)?$/
    export default{
        name: 'orderStoreListAssignCarrier',
        data:function(){
            return {
                modal: false,
                columns: Object.freeze(COLUMNS),
                carriers: [], // 只有一条
                carrier: {...CARRIER},
                
            }
        },
        components: {},
        computed: {},
        watch: {
            modal: function (n,o){
                if (!n) {
                    this.carriers = []
                    this.carrier = Object.assign({},CARRIER)
                }
            },
        },
        methods: {
            // 发布
            doOk (){
                let params = {...this.carrier}
                params.is_hide_upstream = params.is_hide_upstream ? 'Y' : 'N'
                assignOrderAutoToLiner(params).then((data) => {
                    this.$Message.success(data.resultInfo)
                    this.modal = false
                    bus.$emit('order-list-reload')
                    bus.$emit('order-detail-close')
                })
            },
            doCancel (){
                this.modal = false
            },
        },
        created(){},
        mounted (){
            let vm = this
            bus.$on('assign-carrier', (orderId,carrier) => {
                // orders 限制一条
                vm.carrier.order_id = orderId
                vm.carriers = [carrier]
                vm.modal = true
            })
        }
    }
        
</script>