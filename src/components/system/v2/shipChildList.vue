<template>
    <div>
        <div class="contain-head">
            <i-button key="add" type="primary" @click="addNew"><Icon type="plus"></Icon> 新增</i-button>
            <i-button key="add" type="primary" @click="backClick"><Icon type="chevron-left"></Icon> 返回</i-button>
        </div>

        <div class="contain-main">
            <Tabs v-model="shipType">
                <Tab-pane label="发货人" name="shipLink" style="padding-bottom:120px">
                    <ship-link-list></ship-link-list>
                </Tab-pane>
                <Tab-pane label="收货人" name="shipReceipt" style="padding-bottom:120px">
                    <ship-receipt-list></ship-receipt-list>
                </Tab-pane>
            </Tabs>
        </div>
    </div>
</template>
<script>
    import shipLinkList from '@/components/system/shipLinkList.vue'
    import shipReceiptList from '@/components/system/shipReceiptList.vue'
    import bus from '@/utils/bus'

    const EVENT_NAMES = {
        'shipLink': 'add-ship-link',
        'shipReceipt': 'add-ship-receipt',
    }

    export default {
        name: 'shipChild',
        data () {
            return {
                shipType: 'shipLink'
            }
        },
        components: {
            shipLinkList,
            shipReceiptList,
        },
        
        methods: {
            addNew() {
                bus.$emit(EVENT_NAMES[this.shipType])
            },
            backClick() {
                this.$router.back()
            }
        },
    }
</script>