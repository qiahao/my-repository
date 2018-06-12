// 2017-11-24 后该mixin 使用 detail-mixin.js 替换
// 保留该文件，做向前兼容。

const slideModal = {
	data (){
        return {
            slideModal: false
        }
    },
    methods: {
        loadDetail (){
            this.$Message.info('请重写loadDetail方法,加载详情')
        },
        openSlideModal (){
            this.loadDetail()
            this.slideModal = true
        },
        changeSlideModal (){
            let vm = this;
            this.slideModal = false
            setTimeout(()=>{vm.$nextTick(()=>{vm.openSlideModal()}) },300)

        },
        closeSlideModal (){
            this.slideModal = false
        },
    }
}

export default slideModal