<template>
    <div>
        <!-- 操作头部 -->
        <div class="contain-head">
            <div v-show="!hasSelect">
                <search-filter :list='conditionList' v-model="search.q_back_state" @on-change="onSearch">
                </search-filter>
                <search-filter class="ml10" :list='conditionList2' v-model="search.q_order_belong" @on-change="onSearch">
                </search-filter>
            </div>
            <div v-show="hasSelect">
                <i-button type="primary" :disabled="orderUploadDisable" @click="openUploadModal">
                    <i class="wm-icon wm-icon-add"></i>回单上传</i-button>
                <i-button type="primary" :disabled="orderReceiptDisable" @click="orderReceipt">
                    <i class="wm-icon wm-icon-add"></i>收到回单</i-button>
                <i-button type="primary" :disabled="orderSendDisable" @click="orderSend">
                    <i class="wm-icon wm-icon-add"></i>发出回单</i-button>
            </div>
        </div>
        <!-- 列表内容 -->
        <div class="contain-main">
            <i-table :data="tableParams.list" :columns="columns" @on-selection-change="onSelectionChange">
            </i-table>
            <div class="page-wrapper">
                <Page :total="tableParams.total" show-sizer show-elevator :current="currentPage" @on-change="onPageChange" @on-page-size-change="onPageSizeChange">
                </Page>
            </div>
        </div>

        <!-- 查看回单照片 -->
        <photo-detail-modal></photo-detail-modal>

        <!-- 上传回单照片 -->
        <photo-upload-modal></photo-upload-modal>

    </div>
</template>
<script>
import tableMixin from '@/mixins/tableMixin'
import { orderBackListApi, orderBackUploadApi, orderBackReceiveApi, orderBackSendApi } from '@/api/src/receiptApi'

import config from '@/config'
import photoDetailModal from './photo-detail-modal.vue'
import photoUploadModal from './photo-upload-modal.vue'

const COLOR = ['#febf06', '#5ed25c', '#0071c0', '#fe850a', '#9b9b9b']

export default {
    name: 'receiptList',
    data() {
        return {
            conditionList: [
                {
                    text: '全部',
                    key: ''
                },
                {
                    text: '待回单',
                    key: '0'
                },
                {
                    text: '回单中',
                    key: '1'
                },
                {
                    text: '已回收',
                    key: '2'
                },
                {
                    text: '已发放',
                    key: '3'
                },
                {
                    text: '已结束',
                    key: '4'
                },
            ],
            conditionList2: [
                {
                    text: '全部',
                    key: ''
                },
                {
                    text: '到站运单',
                    key: '0'
                },
                {
                    text: '发出运单',
                    key: '1'
                },
            ],
            columns: [
                { type: 'selection', width: 60, align: 'center' },
                { width: 170, title: '运单号', key: 'order_no' },
                { width: 170, title: '上游单号', key: 'pre_order_no' },
                {
                    width: 90, title: '回单状态', key: 'back_state_desc', render: (h, params) => {
                        return h('span', {
                            style: {
                                color: COLOR[params.row.back_state]
                            }
                        }, params.row.back_state_desc)
                    }
                },
                { width: 90, title: '发货人', key: 'begin_link_man' },
                { width: 120, title: '联系方式', key: 'begin_link_mobile' },
                { width: 150, title: '始发地', key: 'begin_area' },
                { width: 150, title: '目的地', key: 'end_area' },
                { width: 100, title: '收货人', key: 'end_link_man' },
                { width: 120, title: '联系方式', key: 'end_link_mobile' },
                { width: 100, title: '物品名称', key: 'c_names' },
                { width: 80, title: '件数', key: 'c_amounts' },
                { width: 80, title: '重量', key: 'c_weights' },
                { width: 80, title: '体积', key: 'c_volumes' },
                { width: 80, title: '包装', key: 'c_packs' },
                { width: 180, title: '完成时间', key: 'finish_time' },
                {
                    width: 80, title: '回单照片', fixed: 'right', align: 'center', render: (h, params) => {
                        if (params.row.has_pics) {
                            return h('span', {
                                class: 'text-primary',
                                on: {
                                    click: () => { this.openPhotoModal(params.row) }
                                }
                            }, '查看');
                        } else {
                            return h('span', '无');
                        }
                    }
                },
            ],
            search: {
                q_back_state: '',
                q_order_type: '',
                q_order_no: '',
                q_shipper_order_no: '',
                q_send_company: '',
                q_begin_link_mobile: '',
                q_receive_company: '',
                q_end_link_mobile: '',
                q_begin_area: '',
                q_end_area: '',
                q_cargo_name: '',
                q_cargo_pack: '',
                q_finish_time_begin: '',
                q_finish_time_end: '',
                q_order_belong: '',
            },

        }
    },
    mixins: [tableMixin],
    components: {
        photoDetailModal,
        photoUploadModal,
    },
    methods: {
        loadList() {
            let _vm = this;
            let params = this.assignQuery(this.search)
            orderBackListApi(params).then((data) => {
                _vm.tableParams.list = data.resultObj.list
                _vm.tableParams.total = data.resultObj.total
                _vm.tableParams.selectList = []
            })
        },
        openUploadModal() {
            bus.$emit('open-upload-modal', this.tableParams.selectList)
        },
        orderReceipt() {
            let params = {
                order_ids: this.tableParams.selectList.map((item) => { return item.order_id }).join(',')
            }
            this.$Modal.confirm({
                content: '确定收到回单？',
                onOk: () => {
                    orderBackReceiveApi(params).then((data) => {
                        this.loadList()
                        this.$Message.success(data.resultInfo)
                    })
                },
            });

        },
        orderSend() {
            let params = {
                order_ids: this.tableParams.selectList.map((item) => { return item.order_id }).join(',')
            }
            this.$Modal.confirm({
                content: '确定发出回单？',
                onOk: () => {
                    orderBackSendApi(params).then((data) => {
                        this.loadList()
                        this.$Message.success(data.resultInfo)
                    })
                },
            });
        },
        openPhotoModal(o) {
            bus.$emit('open-photo-modal', o);
        },
    },

    computed: {
        orderUploadDisable() {
            return this.tableParams.selectList.length != 1
        },
        orderReceiptDisable() {
            return !this.tableParams.selectList.length || this.tableParams.selectList.some((item) => { return item.back_state > 1 })
        },
        orderSendDisable() {
            return !this.tableParams.selectList.length || this.tableParams.selectList.some((item) => { return item.back_state > 2 })
        },
    },
    created() {
        this.loadList()
    },
    mounted() {
        let vm = this
        bus.$on('receipt-list-reload', () => { vm.loadList() })
    }
}
</script>
