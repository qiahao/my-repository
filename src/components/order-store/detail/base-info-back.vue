<template lang="html">
    <div class="mt10">
        <!-- 已签收状态显示 : 已签收 并存在order.sign-->
        <div class="order-sign mb10" v-if="orderState == 3 && order.sign">
            <span>运单已签收</span>
            <span>签收人：{{order.sign.sign_name}}</span>
            <span>证件号：{{order.sign.sign_id_card}}</span>
            <span>签收时间：{{order.sign.sign_date}}</span>
        </div>
        <div class="tc mt20" v-show="detailInfo.handles.length==0">暂无回单</div>
        <!-- 回单列表 -->
        <div class="row-box detail-form mb20" v-for="(item,index) in detailInfo.handles" :key="index">
            <Row>
                <i-col span="8" class="1">
                    <span class="vm">{{item.receipt_time}}</span>
                    <Tag class="vm ml20" color="blue">{{item.tag}}</Tag>
                </i-col>
                <i-col :span="rowColWidth(item)" class="2">
                    <span>{{item.receipt_status==2||item.receipt_status==4?"回收人：":"发放人："}}</span>
                    <span>{{item.receipt_user}}</span>
                </i-col>
                <i-col :span="rowColWidth(item)" class="3" v-if="item.receipt_status!=2&&item.receipt_status!=4">
                    <span>发放方式：</span>
                    <span>{{item.receipt_type|receiptType}}</span>
                </i-col>
                <i-col span="6" v-if="item.receipt_type!='0'&&item.receipt_type!=''&&(item.receipt_status==3||item.receipt_status==1)" class="4">
                    <span>{{item.receipt_type=='2'?item.express_no:item.driver_mobile}}</span>
                </i-col>
                <i-col span="8" v-if="item.receipt_status==2||item.receipt_status==4">
                    <span>备注:</span>
                    <span>{{item.receipt_remark||'无'}}</span>
                </i-col>
            </Row>
            <Row v-if="item.receipt_status!=2&&item.receipt_status!=4">
                <i-col>
                    <span>备注:</span>
                    <span>{{item.receipt_remark||'无'}}</span>
                </i-col>
            </Row>
        </div>
        <!-- 电子回单 -->
        <template v-if="detailInfo.backs.length">
            <h2 class="mt30 mb20">电子回单</h2>
            <div class="row-box detail-form mb15" v-for="(item,index) in detailInfo.backs" :key="index">
                <Row>
                    <i-col span="8">
                        <span class="vm">{{item.op_time}}</span>
                    </i-col>
                    <i-col span="8">
                        <span class="vm" v-if="item.pic_num">回单照片
                            <i class="fc-blue plr5">{{item.pic_num}}</i>张</span>
                    </i-col>
                    <i-col span="8" v-if="item.pic_num">
                        <a href="javascript:;" @click="openPhotoModal(item.op_pics)">查看</a>
                    </i-col>
                </Row>
            </div>
        </template>
        <!-- 图片详情 -->
        <photo-detail-modal></photo-detail-modal>
    </div>
</template>
<script>
import photoDetailModal from './photo-detail-modal.vue'
import emitter from '@/mixins/emitter'
import detailChildMixin from '@/mixins/detail-child-mixin.js'

export default {
    name: 'orderDetailBaseInfoBack',
    props: {
        order: {
            default: () => {return{sign:{}}}
        }
    },
    data() {
        return {
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
        // 显示签收信息
        orderState (){
            return this.order.order_state
        }
    },
    mounted() {},
    mixins: [emitter, detailChildMixin],
    methods: {
        init() {
            this.loadInfo()
        },
        loadInfo() {
            let params = { order_id: this.id }
            this.$api.receiptApi.orderBackDetailApi(params).then(data => {
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
                this.detailInfo = data.resultObj
            })
        },
        openPhotoModal(o) {
            bus.$emit('open-photo-modal', { op_pics: o });
        },
        rowColWidth(item) {
            let width, statu = item.receipt_status,
                type = item.receipt_type;
            if ((statu == '3' || statu == '1') && type != 0 && type != "") {
                width = 5
            } else {
                width = 8
            }
            return width
        },
        openUploadModal() {
            bus.$emit('open-upload-modal', [{
                order_id: this.id
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