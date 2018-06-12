<template>
    <div class="help mtb30">
        <div class="help-container">
            <h2>Download</h2>
            <p class="text-primary">
                <a :href="config.printDriver">货签打印机驱动下载</a>
            </p>
        </div>
    </div>
</template>
<script>
let pageConfig = {
    printDriver: 'http://static01.yunba.com/download/HPRT_N41.rar'
}


//订单列表个格设置
export default {
    data: function() {
        return {
            config: { ...pageConfig }
        }
    },
    methods: {},
    created() {},

}
</script>
<style lang="scss" src="./style.scss"></style>