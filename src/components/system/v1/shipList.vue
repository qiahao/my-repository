<template>
    <div>
        <div class="contain-head">
            <i-button key="add" type="primary" @click="addShip"><Icon type="plus"></Icon>新增</i-button>
        </div>

        <div class="contain-main">
            <i-table :data="tableParams.list" :columns="columns">
            </i-table>
            <div class="page-wrapper">
                <Page :total="tableParams.total" show-sizer show-elevator
                    :current="currentPage" 
                    @on-change="onPageChange" 
                    @on-page-size-change="onPageSizeChange">
                </Page>
            </div>
        </div>

        <Modal :title="editModal.title" v-model="editModal.modal" class-name="vertical-center-modal" @on-ok="saveShip">
            <Form ref="editModalForm" :model="editModalData" :rules="editModalValidate" :label-width="100">
                <Form-item label="公司名称" prop="cs_company">
                    <i-input v-model="editModalData.cs_company"></i-input>
                </Form-item>
            </Form>
            <div slot="footer">
                <Button   @click="close">取消</Button>
                <Button type="primary"   @click="saveShip">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import tableMixin from '@/mixins/tableMixin'
    import config from '@/config/index'
    import * as shipApi from '@/api/src/shipApi'
    export default {
        name: 'ship',
        data () {
            const columns = [
                { title: '单位', width: 500, key: 'cs_company', render: (h,params)=>{
                    return h('a',{
                        on: {
                            click: () =>{this.$router.push('ship/child/' + params.row.cs_id)}
                        }
                    }, params.row.cs_company)
                } },
                { title: '最近发货时间', key: 'send_last_time' },
                { title: '操作', align: 'center', width: 150, render: (h,params)=>{
                    return h('a', {
                        on:{
                            click:() => {this.editShip(params.row)}
                        }
                    }, '编辑')
                } }]
            return {
                columns: columns,
                search: {
                    cs_company: ''
                },
                editModal: {
                    modal: false,
                    isAdd: false,
                    title: '修改客户'
                },
                editModalData: {
                    cs_company: ''
                },
                editId: '',
                editModalValidate: {
                    cs_company: [
                        { required: true, message: '公司名称不能为空', trigger: 'blur change' },
                        { type: 'string', max: 50, message: '公司名称不能超过50字符', trigger: 'blur' }]
                }
            }
        },
        
        mixins: [tableMixin],
        watch: {
            'editModal.isAdd': function (n,o) {
                this.editModal.title = n ? '添加客户' : '修改客户'
            }
        },
        methods: {
            loadList() {
                let params = this.assignQuery(this.search)
                shipApi.shipList(params).then((data)=>{
                    this.tableParams.list = data.resultObj.list
                    this.tableParams.total = data.resultObj.total
                    this.tableParams.selectList = []
                })
            },
            addShip() {
                this.editModal.modal = true
                this.editModal.isAdd = true
                this.$refs.editModalForm.resetFields()
            },

            editShip(o) {
                this.editModal.modal = true
                this.editModal.isAdd = false
                this.editId = o.cs_id
                this.editModalData.cs_company = o.cs_company
            },
            saveShip() {
                this.$refs.editModalForm.validate((valid) => {
					if (valid) {
                        this.editModal.modal=false;
                        if (this.editModal.isAdd) {
                            let params = Object.assign({},this.editModalData)
                            shipApi.shipAdd(params).then( data =>{this.loadList()})
                        } else {
                            let params = Object.assign({},this.editModalData,{cs_id: this.editId})
                            shipApi.shipUpdate(params).then( data =>{this.loadList()})
                        }
                    }
                })
                
            },
            close(){
                this.editModal.modal=false;
            }
        },
        created() {
            this.loadList()
        }
    }
</script>
<style scoped>
    
</style>

