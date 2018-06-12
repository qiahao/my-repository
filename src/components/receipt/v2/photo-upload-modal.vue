<template>
    <div>
        <!-- 查看回单照片 -->
        <Modal ref="uploadModal" id="uploadPicModal" title="回单照片上传" v-model="modal" width="720" @on-ok="uploadPhoto">
            <div>
                <div class="demo-upload-list" v-for="item in uploadList">
                    <template v-if="item.status === 'finished'">
                        <img :src="item.url">
                        <div class="demo-upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                        </div>
                    </template>
                    <template v-else>
                        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template>
                </div>
                <Upload ref="upload" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="5120" multiple type="drag" :action="action" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" style="display: inline-block;width:58px;">
                    <div style="width: 58px;height:58px;line-height: 58px;">
                        <Icon type="camera" size="20"></Icon>
                    </div>
                </Upload>
            </div>
            <h5>提示：</h5>
            <ol>
                <li>1.本地上传图片大小不能超过2M</li>
                <li>2.回单最多您可以传5张图片</li>
            </ol>
        </Modal>
        <Modal title="查看图片" v-model="viewVisible">
            <img :src="viewImg" v-if="viewVisible" style="width: 100%">
        </Modal>
    </div>
</template>
<script>
import config from '@/config'
import { orderBackUploadApi } from '@/api/src/receiptApi'
import bus from '@/utils/bus'
const IMG_PREFIX = config.imgHost
export default {
    name: 'photoUploadModal',
    data() {
        return {
            modal: false,
            defaultList: [],
            uploadList: [],
            action: config.imgUploadUrl,
            order: {},
            viewImg: '',
            viewVisible: false,
        }
    },
    methods: {
        handleView(url) {
            this.viewImg = url;
            this.viewVisible = true;
        },
        handleRemove(file) {
            // 从 upload 实例删除数据
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        handleSuccess(res, file) {
            file.url = IMG_PREFIX + res.resultObj
            this.uploadList = this.$refs.upload.fileList
        },
        handleMaxSize(file) {
            this.$Notice.warning({
                title: '超出文件大小限制',
                desc: '文件 ' + file.name + ' 太大，不能超过 5M。'
            });
        },
        handleBeforeUpload() {
            const check = this.uploadList.length < 5;
            if (!check) {
                this.$Notice.warning({ title: '最多只能上传 5 张图片。' });
            }
            return check;
        },
        uploadPhoto() {
            if (!this.uploadList.length) {
                this.modal = true
                this.$refs.uploadModal.visible = true
                this.$Message.warning('请添加图片！')
                return
            }

            let vm = this
            let params = {
                order_id: this.order.order_id,
                op_content: '',
                op_pics: this.uploadList.map((it) => { return it.url }).join(',')
            }
            orderBackUploadApi(params).then((data) => {
                vm.$Message.success(data.resultObj)
                bus.$emit('receipt-list-reload');
            }).catch(() => {
                this.modal = true
                this.$refs.uploadModal.visible = true
            })
        }
    },
    watch: {
        modal(n, o) {
            let vm = this;
            if (n) {
                this.defaultList = this.order.op_pics ? this.order.op_pics.split(',').map((item) => {
                    return {
                        url: item,
                        status: 'finished',
                        showProgress: false,
                        name: item
                    }
                }) : [];
                this.$nextTick(() => { vm.uploadList = vm.$refs.upload.fileList })
            }
        }
    },
    created() { },
    mounted() {
        let vm = this
        bus.$on('open-upload-modal', (list) => {
            vm.order = list[0]
            vm.modal = true
        })
    }
}
</script>
<style scoped lang="scss">
.demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
}

.demo-upload-list img {
    width: 100%;
    height: 100%;
}

.demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
}

.demo-upload-list:hover .demo-upload-list-cover {
    display: block;
}

.demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}
</style>
