<template>
    <div>
        <i-table :data="tableParams.list" :columns="columns">
        </i-table>
        <div class="page-wrapper">
            <Page :total="tableParams.total" show-sizer show-elevator 
                @on-change="onPageChange" 
                @on-page-size-change="onPageSizeChange">
            </Page>
        </div>

        <Modal :title="editModal.title" v-model="editModal.modal" @on-ok="submitEdit" ref="editModalRef">
            <Form ref="editModalForm" :model="editModalData" :rules="editModalValidate" :label-width="120">
            <!--
                <Form-item label="公司名称" prop="receipt_company">
                    <i-input v-model="editModalData.receipt_company"></i-input>
                </Form-item>
            -->
                <Form-item label="联系人" prop="receipt_username">
                    <i-input v-model="editModalData.receipt_username"></i-input>
                </Form-item>
                <Form-item label="联系人电话" prop="receipt_mobile">
                    <i-input v-model="editModalData.receipt_mobile"></i-input>
                </Form-item>
                <Form-item label="所在城市" prop="province">
                    <province-cascader v-model="editModalData.province"></province-cascader>
                </Form-item>
                <Form-item label="详细地址" prop="receipt_address">
                    <i-input v-model="editModalData.receipt_address"></i-input>
                </Form-item>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import tableMixin from '@/mixins/tableMixin'
    import config from '@/config/index'
    import bus from '@/utils/bus'
    import * as shipApi from '@/api/src/shipApi'
    import { copySameNamePropety } from '@/utils/util'
    import rule from '@/utils/validate-rule'
   

    const EDIT_MODAL_VALIDATE = {
        receipt_company: [
            rule.required({ message: '公司名称不能为空'}),
            rule.max({ message: '公司名称不能超过50字符',max: 50}),
        ],
        receipt_mobile: [
            rule.required({ message: '联系人电话不能为空'}),
            rule.max({ message: '联系人电话不能超过20字符',max: 20}),
            { validator: rule.phone, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        receipt_username: [
            rule.required({ message: '联系人不能为空'}),
            rule.max({ message: '联系人不能超过20字符',max: 20}),
        ],
        province: [
            rule.required({ message: '所在城市不能为空'}),
        ],
        receipt_address: [
            rule.required({ message: '详细地址不能为空'}),
            rule.max({ message: '详细地址不能超过100字符',max: 100}),
        ]
    }


    const INIT_EDIT_MODAL_DATA = {
        receipt_company: '',
        receipt_username: '',
        receipt_mobile: '',
        receipt_address: '',
        province: '',
    }

    export default {
        name: 'shipReceipt',
        props: {cs_id: '', cs_receipt_id:''},
        data () {
            const COLUMNS = [
                { title: '联系人', width: 150, key: 'receipt_username'},
                { title: '联系电话', width: 150, key: 'receipt_mobile' },
                { title: '地址', render: (h,params)=>{
                    return h('span',{
                        
                    }, params.row.receipt_area+"  "+params.row.receipt_address)
                    },
                },
                { title: '操作', align: 'center', width: 150, render: (h,params)=>{
                    return h('a',{
                        on: {
                            click: () =>{this.editLink(params.row)}
                        }
                    }, '编辑')
                }
                }]
            return {
                columns: COLUMNS,
                search: {cs_id: ''},
                editModal: {
                    title: '修改',
                    modal: false,
                    isAdd: false
                },
                
                editModalData: Object.assign({},INIT_EDIT_MODAL_DATA),
                editModalValidate: Object.freeze(EDIT_MODAL_VALIDATE),
            }
        },

        mixins: [tableMixin],
        methods: {
            loadList() {
                let params = this.assignQuery(this.search)
                shipApi.shipReceiptList(params).then((data)=>{
                    this.tableParams.list = data.resultObj.list
                    this.tableParams.total = data.resultObj.total
                })
            },
            editLink(row) {
                this.editModal.modal = true
                this.editModal.isAdd = false
                this.editModalData = Object.assign({},row)
                // 初始化地址问题
                this.editModalData.province = row.receipt_area_code ? row.receipt_area_code + '$' + row.receipt_area : row.receipt_area_code
            },
            addReceiptLink (){
                this.editModal.modal = true
                this.editModal.isAdd = true 
                this.editModalData = Object.assign({},INIT_EDIT_MODAL_DATA)
            },
            submitEdit (){
                this.$refs.editModalForm.validate((valid)=>{
                    if (valid) {
                        let params = {
                            receipt_company: '',
                            receipt_username: '',
                            receipt_mobile: '',
                            receipt_address: '',
                            receipt_area_code: '',
                            receipt_area: '',
                        }

                        params = Object.assign(copySameNamePropety(params,this.editModalData),{cs_id: this.$route.params.id})
                        params.receipt_area_code = this.editModalData.province.split('$')[0]
                        params.receipt_area = this.editModalData.province.split('$')[1]
                        if (this.editModal.isAdd) {
                            shipApi.shipReceiptAdd(params).then((data)=>{this.loadList()})
                        }else{
                            params.cs_receipt_id = this.editModalData.cs_receipt_id
                            shipApi.shipReceiptEdit(params).then((data)=>{this.loadList()})
                        }
                    }else{
                        this.editModal.modal = true
                        this.$refs.editModalRef.visible = true
                    }
                })

                
            },
        },
        watch: {
            'editModal.isAdd': function (n,o) { 
                if (n) {
                    this.editModalData = Object.assign({},INIT_EDIT_MODAL_DATA)
                }
                this.editModal.title = n ? '添加' : '修改'
            },
            'editModal.modal': function (n,o) { 
                if (!n) {
                    if (this.$refs.editModalForm && typeof this.$refs.editModalForm.resetFields == 'function') {
                        this.$refs.editModalForm.resetFields()
                    }
                }
            },
            'editModalData.province': function (n,o){
                if (n && this.editModal.isAdd) {
                    this.$refs.editModalForm.validateField('province')

                }
            }
        },
        created (){
            this.search.cs_id = this.$route.params.id
            this.loadList()
        },
        mounted() {
            bus.$on('add-ship-receipt',(val)=>{
                this.addReceiptLink();
            });
        }
    }
</script>

