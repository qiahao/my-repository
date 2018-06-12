<template>
    <div>
        <div class="contain-head">
            <div class="dib" v-show="!hasSelect">
                <i-input v-model="search.driver_name" placeholder="请输入司机姓名" class="w180"></i-input>
                <i-input v-model="search.driver_mobile" placeholder="请输入司机联系号码" class="w180"></i-input>
                <i-input v-model="search.truck_plate" placeholder="请输入车牌号" class="w180"></i-input>
                <i-button type="primary" @click="onSearch">查询</i-button>
                <i-button type="warning" @click="onReset">重置</i-button>
            </div>
            <i-button type="primary" @click="addVehicle">新增</i-button>
            <div class="dib" v-show="hasSelect">
                <i-button type="warning" @click="deleteVehicle">删除</i-button>
            </div>
        </div>
        <div class="contain-main">
            <!-- table -->
            <i-table :data="tableParams.list" :columns="columns" stripe @on-selection-change="onSelectionChange"> </i-table>
            <!-- page -->
            <div class="page-wrapper">
                <Page :total="tableParams.total" show-sizer show-elevator
                    :current="currentPage" 
                    @on-change="onPageChange" 
                    @on-page-size-change="onPageSizeChange">
                </Page>
            </div>
        </div>

        <!-- 详情 -->
        <keep-alive>
            <router-view></router-view>
        </keep-alive>

    </div>

</template>
<script>

import { mapState } from 'vuex'
import tableMixin from '@/mixins/tableMixin'
import * as constants from './constants.js'

export default {
    name: 'vehicle',
    data() {
        return {
            columns: constants.getColums.call(this),
            search: {...constants.searchParams},
        }
    },
    mixins: [tableMixin],
    methods: {
        loadList() {
            let params = this.assignQuery(this.search)
            this.$api.vehicleApi.apiListVehicle(params).then((data) => {
                this.tableParams.list = data.resultObj.list
                this.tableParams.total = data.resultObj.total
                this.tableParams.selectList = []
            })
        },
        derecteToDetai(id){
            this.$router.push({name: 'vehicleDetail',params:{id: id}})
        },
        // 删除车辆
        deleteVehicle() {
            let params,
                l = this.tableSelectLength,
                ll = this.tableParams.list.length;
            if (!l) {
                return this.$Message.warning('请选择要操作的数据！')
            }

            params = {
                driver_ids: this.tableParams.selectList.map( x => x.driver_id ).join(',')
            }

            this.$Modal.confirm({
                content: '<h4>确认要删除选中的车辆？</h4>',
                onOk: () => {
                    this.$api.vehicleApi.apiDelVehicle(params).then((data) => {
                        this.$Message.success('删除成功')
                        if(ll <= l && this.tableParams.page > 1) {
                            -- this.tableParams.page;
                        }
                        this.loadList()
                    })
                }
            })
        },
        addVehicle (){
            this.$router.push({name: 'vehicleAdd'})
        },
        onReset(){
            this.search = {...constants.searchParams}
            this.onSearch()
        }

    },
    computed: {
        ...mapState(['userInfo'])
    },
    created() {
        this.loadList()
    },
    mounted() {
        this.$on('vehicle-list-reload', () => {
            this.loadList()
        })
    }
}
</script>
