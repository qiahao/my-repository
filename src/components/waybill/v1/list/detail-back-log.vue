<template lang="html">
    <div class="mt10">
        <div>
            <div class="mt20" v-show="detailInfo.handles.length==0" style="text-align:center">暂无回单</div>
            <div class="row-box detail-form mb20"  v-for="(item,index) in detailInfo.handles" :key="index">
                <i-Form inline>
                        <Row>
                            <Col span="8" class="1">
                                <Form-item>
                                    <span class="vm">{{item.receipt_time}}</span>
                                    <Tag class="vm ml20" color="blue">{{item.tag}}</Tag>
                                </Form-item>
                            </Col>
                            <Col :span="rowColWidth(item)" class="2">
                                <Form-item :label='item.receipt_status==2||item.receipt_status==4?"回收人：":"发放人："'>
                                    <span>{{item.receipt_user}}</span>
                                </Form-item>
                            </Col>
                            <Col :span="rowColWidth(item)" class="3" v-if="item.receipt_status!=2&&item.receipt_status!=4">
                                <Form-item label="发放方式：">
                                    <span>{{item.receipt_type|receiptType}}</span>
                                </Form-item>
                            </Col>
                            <Col span="6" v-if="item.receipt_type!='0'&&item.receipt_type!=''&&(item.receipt_status==3||item.receipt_status==1)" class="4">
                                <Form-item>
                                    <span>{{item.receipt_type=='2'?item.express_no:item.driver_mobile}}</span>
                                </Form-item>
                            </Col>
                            <Col span="8" v-if="item.receipt_status==2||item.receipt_status==4">
                                <Form-item label="备注:">
                                    <span>{{item.receipt_remark||'无'}}</span>
                                </Form-item>
                            </Col>
                        </Row>
                        <Row v-if="item.receipt_status!=2&&item.receipt_status!=4">
                            <Col>
                                <Form-item label="备注:">
                                    <span>{{item.receipt_remark||'无'}}</span>
                                </Form-item>
                            </Col>
                        </Row>
                </i-Form>
            </div>
            <template v-if="detailInfo.backs.length">
                <h2 class="mt30 mb20">电子回单</h2>
                <div class="row-box detail-form mb15" v-for="(item,index) in detailInfo.backs" :key="index">
                    <Form inline>
                        <Row>
                            <Col span="8">
                                <Form-item>
                                    <span class="vm">{{item.op_time}}</span>
                                </Form-item>
                            </Col>
                            <Col span="8">
                                <Form-item :label="item.company+'：'">
                                    <span class="vm" v-if="item.pic_num">回单照片<i class="fc-blue plr5">{{item.pic_num}}</i>张</span>
                                </Form-item>
                            </Col>
                            <Col span="8" v-if="item.pic_num">
                                <Form-item>
                                    <a href="javascript:;" @click="openPhotoModal(item.op_pics)">查看</a>
                                    <!-- <a href="javascript:;">保存</a> -->
                                </Form-item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </template>
        </div>
        <photo-detail-modal></photo-detail-modal> 
    </div>
</template>
<script>
import { mapState } from 'vuex'
import { orderBackDetailApi, orderBackReceiveApi, orderBackSendApi, } from '@/api/src/receiptApi'
import moment from 'moment'
import validateRule from '@/utils/validate-rule'
import photoDetailModal from './photo-detail-modal.vue'
export default {
    props: {order_id: ''},
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
        photoDetailModal,
    },
    computed: {
        ...mapState(['userInfo'])
    },
    watch: {
        order_id(value) {
            if(value!=""){
                this.loadInfo()
            }
        }
    },
    methods: {
        _init() {
            let vm = this
            this.loadInfo()
        },
        loadInfo() {
            let vm = this
            let params = {
                user_id: vm.userInfo.user_id,
                company_id: vm.userInfo.company_id,
                order_id: vm.order_id
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
                order_id: vm.order_id
            }])
        },

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
</style>
