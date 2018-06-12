<template>
    <div class="upload">
        <div class="upload-list" v-for="(item, i) in uploadList">
            <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="image-cover">
                    <Icon type="ios-eye-outline" @click.native="viewHandler(item, i)"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        
        <Upload ref="upload" 
        	v-show="showUpload" 
        	:show-upload-list="option.showUploadList" 
        	:format="option.format" 
        	:max-size="option.maxSize" 
        	:multiple="option.multiple" 
        	:type="option.type" 
        	:action="option.action" 
        	:on-format-error="formatErrorHandler" 
        	:on-exceeded-size="exceededSizeHandler" 
        	:before-upload="beforeUploadHandler" 
        	:on-success="successHandler" 
        	class="upload-comp">
            <div class="comp-inner">
                <Icon type="camera" size="20"></Icon>
            </div>
        </Upload>
        <Modal title="查看图片" v-model="viewModal">
            <img :src="viewImg && viewImg.url" class="view-img" width="100%">
            <div slot="footer">
                <i-button type="warning" size="small" @click="removeHandler">删除</i-button>
            </div>
        </Modal>
    </div>
</template>
<script>
import config from '@/config/index'
let { round } = Math
let imgPrefix = config.imgHost

let defaultOPtion = {
    defaultFileList: [],
    showUploadList: false,
    format: ['jpg', 'jpeg', 'png'],
    maxSize: 5120,
    multiple: false,
    type: "drag",
    action: config.imgUploadUrl,

}

/**
 * @ uploadOption Object
 * @ urlList Array
 * @ uploadId String
 * @ hideIfExist Boolean
 */

 /**
  * demo
  * <upload-image :upload-option="option" :url-list="list" :hide-if-exist="false" @on-success="successHandler" @on-remove="removeHandler"></upload-image>
  */

export default {
    props: {
        uploadOption: {
            // type: Object,
            default () {
                return {}
            }
        },
        urlList: {
            type: Array,
            default () {
                return []
            }
        },
        uploadId: {
            default: undefined
        },
        hideIfExist : false
    },
    data() {
        return {
            viewImg: null,
            viewIndex: -1,
            viewModal: false,
        }
    },
    computed: {
        option: function() {
            return Object.assign({}, defaultOPtion, this.uploadOption)
        },
        uploadList: function() {
            if (!this.urlList || !this.urlList.length) { return [] }
            if (!(this.urlList instanceof Array)) { return [] }
            let list = []

            function getItem(url) {
                let name = url
                if (url.indexOf(imgPrefix) < 0) { url = imgPrefix + url }
                return {
                    name: name,
                    url: url,
                    status: 'finished'
                }
            }
            if (!this.option.multiple) {
                list.push(getItem(this.urlList[0]))
            } else {
                list = this.urlList.map(getItem)
            }
            return list
        },
        showUpload: function () {
        	return !(this.hideIfExist && this.uploadList.some(file => file.status == 'finished'))
        }
    },
    methods: {
        // 格式错误
        formatErrorHandler(res, file) {
            this.$Message.warning('文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。');
        },
        // 超出大小
        exceededSizeHandler(res, file) {
            this.$Message.warning('文件 ' + file.name + ' 太大，不能超过 ' + (this.option.maxSize / 1024).toFixed(2) + 'M。');
        },
        // 上传前
        beforeUploadHandler(res, file) {
            let flag = true
            if (this.option.maxNum && this.option.maxNum <= this.uploadList.length) { flag = false }
            return flag;
        },
        // 成功
        successHandler(res, file) {
            if (res && res.result == 1) {
                file.name = res.resultObj
                file.url = imgPrefix + res.resultObj
                this.$emit('on-success', file, this.uploadId)
            } else {
                this.$Message.warning('图片上传失败。' + res.resultInfo);
            }
        },

        viewHandler(file, i) {
            this.viewModal = true;
            this.viewIndex = i
            this.viewImg = file
        },
        removeHandler() {
            let vm = this
            this.$Modal.confirm({
                content: '删除该图片？',
                onOk() {
                    vm.$emit('on-remove', vm.viewImg, vm.viewIndex, vm.uploadId)
                    vm.viewModal = false;
                    vm.viewIndex = -1
                    vm.viewImg = null
                }
            })
        }
    },
    mounted() {}
}
</script>
<style lang="scss" src="./style.scss"></style>