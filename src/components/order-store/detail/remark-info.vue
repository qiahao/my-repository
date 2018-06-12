<template lang="html">
    <div>
        <div class="row-box row-box-auto mb10" v-for="item in remarks">
            <Row>
                <i-col span="10">
                    <span class="mr10">{{item.note_time}}</span>
                    <span>{{item.note_user}}</span>
                </i-col>
                <i-col span="14">{{item.note_content}}</i-col>
            </Row>
        </div>
        <i-input type="textarea" placeholder="输入备注信息" v-model.trim="remark.note_content" v-if="isEditable"></i-input>
        <div class="cf mtb10">
            <div class="fr">
                <i-button type="primary" @click="doOk" v-if="isEditable">添加备注</i-button>
            </div>
        </div>
    </div>
</template>
<script>
import { addOrderNote, getOrderNoteList } from '@/api/src/order'
import detailChildMixin from '@/mixins/detail-child-mixin.js'


const remark = { note_content: '' }
export default {
    name: 'orderStoreDetailIndex',
    props: {
        isEditable: {
            default: false
        }
    },
    data: function() {
        return {
            remarks: [],
            remark: { ...remark }
        }
    },
    mixins: [detailChildMixin],
    methods: {
        init() {
            this.loadNoteList()
        },
        // 确定新增备注
        doOk() {
            if (!this.remark.note_content) { return this.$Message.info('请输入备注内容') }
            let params = Object.assign({ order_id: this.id, note_type: 1 }, this.remark)
            addOrderNote(params).then((data) => {
                this.$Message.info({ content: data.resultInfo, duration: 1 })
                this.remark = { ...remark }
                this.loadNoteList()
                bus.$emit('order-list-reload')
            })
        },
        // 获取备注列表
        loadNoteList() {
            getOrderNoteList({ order_id: this.id }).then((data) => { this.remarks = data.resultObj })
        },
    }
}
</script>