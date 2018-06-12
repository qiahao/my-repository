// 2017-11-24 后详情侧拉组件使用该mixin
// 解决侧拉公共部分: 打开详情，开、关详情，初始化数据
// (缺省： 添加了detailChildMixin)
// 注意事项: 
// 1. detail-modal v-model 使用detailShow；
// 2. 因为默认使用了detailChildMixin ，需定义methods init 函数 用于初始化页面数据；

import detailChildMixin from './detail-child-mixin.js'

export default {
	data (){
        return {
            detailShow: false,
        }
    },
    mixins: [detailChildMixin],
    methods: {},
    mounted() {
        setTimeout(() => {this.detailShow = true }, 500)
    },
    activated(){
        this.detailShow = true
    },
    deactivated(){
        this.detailShow = false
    },
    beforeRouteUpdate(to, from, next) {
        let vm =  this
        this.detailShow = false
        setTimeout(() => {
            this.detailShow = true
            next()
        }, 300)
    }
}

