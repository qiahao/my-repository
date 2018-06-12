<template>
    <div class="pd20">
        <h2>axios</h2>
        
        


    </div>
</template>
<script>
import uploadImage from '@/common/upload-image'
import axios from 'axios'


const order = {
    name: 'name',
    orderNum: undefined,
    createdTime: '2018-06',
    cargos: [
        {name: null, pack: '包' , price: 12},
        {name: null, pack: '包' , price: 12},
        {name: null, pack: '包' , price: null},
    ]
}

export default {
    data() {
        return {
        }
    },
    methods: {
    },

    mounted() {},
    created () {
        
        axios({
            url: '/api/order/v2/create/own',
            data: order,
            method: 'POST',
            removeEmpty: true,
            // contentType: 'application/form'
        })
    }
}
</script>
<style scoped>
h2 {
    margin-bottom: 10px;
}
</style>