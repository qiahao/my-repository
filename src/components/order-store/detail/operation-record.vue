<template lang="html">
    <div>
        <div class="row-box row-box-auto mb10" v-for="item in operations">
            <Row>
                <i-col span="10">
                    <span class="mr10">{{item.op_time}}</span>
                    <span class="mr10">{{item.op_method}}</span>
                    <span>{{item.op_user_name}}</span>
                </i-col>
                <i-col span="14">{{item.op_desc}}</i-col>
            </Row>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import { getOrderLogs } from '@/api/src/order'
import detailChildMixin from '@/mixins/detail-child-mixin.js'


export default {
    name: 'orderStoreDetailOperationRecord',

    data: function() {
        return {
            operations: [],
        }
    },
    mixins: [detailChildMixin],
    computed: {
        ...mapState(['userInfo']),
    },

    methods: {
        init (){
            this.loadLogs()
        },
        // 获取操作记录
        loadLogs() {
            let params = { order_id: this.id, act_company_id: this.userInfo.company_id }
            getOrderLogs(params).then((data) => { this.operations = data.resultObj })
        },
    },
    mounted() {
        // 来自 index 路由跟新
        bus.$on('operation-reload', () => { this.init() })
    },
}
</script>