<template lang="html">
    <div>
        <slide-modal v-model="modal.show" @slide-modal-close="modalClose" style="width: 1000px">
            <div slot="head" class="cf">
                <h3 class="fl">回单详情</h3>
                <div class="fr">
                    <Button type="primary" @click="showModal('Back')" :disabled="backState!='0'&&backState!='1'">回单回收</Button>
                    <Button type="primary" @click="showModal('Send')" :disabled="backState=='3'||backState=='4'">回单发放</Button>
                    <Button type="primary" @click="openUploadModal">上传回单</Button>
                </div>
            </div>
            
            <div class="row-box row-box-text detail-form mb20"  v-for="(item,index) in detailInfo.handles">
                <i-Form inline>
                        <Row>
                            <Col span="8" class="1">
                                <span class="vm">{{item.receipt_time}}</span>
                                <Tag class="vm ml20" color="blue">{{item.tag}}</Tag>
                            </Col>
                            <Col :span="rowColWidth(item)" class="2">
                                <div >
                                    {{(item.receipt_status==2||item.receipt_status==4 || (item.receipt_status==1 && !item.receipt_type))?"回收人：":"发放人："}}
                                    
                                    <span>{{item.receipt_user}}</span>
                                </div>
                            </Col>
                            <Col :span="rowColWidth(item)" class="3" v-if="item.receipt_status!=2&&item.receipt_status!=4 && !(item.receipt_status==1 && !item.receipt_type)">
                                <div>
                                    发放方式：
                                    <span>{{item.receipt_type|receiptType}}</span>
                                </div>
                            </Col>
                            <Col span="6" v-if="item.receipt_type!='0'&&item.receipt_type!=''&&(item.receipt_status==3||item.receipt_status==1)" class="4">
                                <div>
                                    <span>{{item.receipt_type=='2'?'快递号：'+item.express_no:'车号：'+item.driver_mobile}}</span>
                                </div>
                            </Col>
                            <Col span="8" v-if="item.receipt_status==2||item.receipt_status==4">
                                <div>
                                    备注:
                                    <span>{{item.receipt_remark||'无'}}</span>
                                </div>
                            </Col>
                        </Row>
                        <Row v-if="item.receipt_status!=2&&item.receipt_status!=4">
                            <Col>
                                <div>
                                    备注:
                                    <span>{{item.receipt_remark||'无'}}</span>
                                </div>
                            </Col>
                        </Row>
                </i-Form>
            </div>
            <template v-if="detailInfo.backs.length">
                <h2 class="mt30 mb20">电子回单</h2>
                <div class="row-box detail-form mb15" v-for="(item,index) in detailInfo.backs">
                    <Form inline>
                        <Row>
                            <Col span="8">
                                <div>
                                    <span class="vm">{{item.op_time}}</span>
                                </div>
                            </Col>
                            <Col span="10">
                                <div>
                                    <span class="ellipsis-label" :title="item.company">{{item.company+'：'}}</span>    
                                    <span class="vm" v-if="item.pic_num">回单照片<i class="fc-blue plr5">{{item.pic_num}}</i>张</span>
                                </div>
                            </Col>
                            <Col span="6" v-if="item.pic_num">
                                <div>
                                    <a href="javascript:;" @click="openPhotoModal(item.op_pics)">查看</a>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </template>
        </slide-modal>
        
        <!-- 回单回收 -->
        <back-modal v-model='showBackModal' @call-back="callBack"></back-modal>
        <!-- 回单发放 -->
        <send-modal v-model='showSendModal' @call-back="callBack"></send-modal>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import { orderBackDetailApi, orderBackReceiveApi, orderBackSendApi, } from '@/api/src/receiptApi'
import moment from 'moment'
import validateRule from '@/utils/validate-rule'
import backModal from './back'
import sendModal from './send'
export default {
    data() {
        return {
            id: '',
            modal: {
                show: false,
                title: '',
            },
            orderId: '',
            backState: '',
            loading: true,
            showBackModal: false,
            showSendModal: false,
            order: {},
            curTab: 'baseInfo',
            childCompleted: [],
            detailInfo: {
                backs: [],
                handles: [],
                order: ''
            },
        }

    },
    components: {
        backModal,
        sendModal
    },
    computed: {
        ...mapState(['userInfo'])
    },
    created() {
        this.init()
        setTimeout(() => { this.modal.show = true }, 300)
    },
    watch: {
        // 监听路由变化
        '$route': function(n, o) {
            this.loadInfo()
            setTimeout(() => { this.modal.show = true }, 300)
        },
    },
    methods: {
        init() {
            let vm = this
            this.loadInfo()
        },
        callBack(input) {
            this.loadInfo()
            bus.$emit('receipt-list-reload')
        },
        showModal(type) {
            this['show' + type + 'Modal'] = true
        },
        loadInfo() {
            let vm = this
            let params = {
                user_id: vm.userInfo.user_id,
                company_id: vm.userInfo.company_id,
                order_id: vm.$route.query.id
            }
            orderBackDetailApi(params).then(data => {
                data.resultObj.handles.map((v, i) => {
                    switch (v.receipt_status) {
                        case '0':
                            v.tag = '待回单'
                            break
                        case '1':
                            v.tag = '回单中'
                            break
                        case '2':
                            v.tag = '已回收'
                            break
                        case '3':
                            v.tag = '已发放'
                            break
                        case '4':
                            v.tag = '已结束'
                            break
                        default:
                            v.tag = '待回单'
                            break
                    }
                })
                data.resultObj.backs.map((item, index) => {
                    if (!!item.op_pics) {
                        item.pic_num = item.op_pics.split(',').length
                    }
                })
                vm.detailInfo = data.resultObj
                vm.backState = vm.detailInfo.order.back_state
            })
        },
        openPhotoModal(o) {
            let params = {
                op_pics: o
            }
            bus.$emit('open-photo-modal', params);
        },
        rowColWidth(item) {
            let width
            let statu = item.receipt_status,
                type = item.receipt_type
            if ((statu == '3' || statu == '1') && type != 0 && type != "") {
                width = 5
            } else {
                width = 8
            }
            return width
        },
        openUploadModal() {
            let vm = this
            bus.$emit('open-upload-modal', [{
                order_id: vm.$route.query.id
            }])
            bus.$on('receipt-list-reload', () => { vm.loadInfo() })
        },
        modalClose() {
            this.modal.show = false
            setTimeout(() => {
                this.$router.push({
                    name: 'receiptV2List'
                })
            }, 300)
        }

    }
}
</script>
<style lang="scss">
.detail-form.row-box {
    .ivu-col {
        padding: 0 10px;
        line-height: 40px;
    }
}

.ellipsis-label {
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
