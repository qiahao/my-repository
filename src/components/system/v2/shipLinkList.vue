<template>
    <div>
        <i-table highlight-row :data="tableParams.list" :columns="columns" >
        </i-table>
        <div class="page-wrapper">
            <Page :total="tableParams.total" show-sizer show-elevator
                @on-change="onPageChange" 
                @on-page-size-change="onPageSizeChange">
            </Page>
        </div>

        <Modal :title="editModal.title" v-model="editModal.modal" @on-ok="submitEdit" ref="editModalRef" id="shipLinkListModal">
            <Form label-position="right" ref="editModalForm" :model="editModalData" :rules="editModalValidate" :label-width="120">
                <Form-item label="联系人" prop="link_name">
                    <i-input v-model="editModalData.link_name"></i-input>
                </Form-item>
                <Form-item label="联系人电话" prop="link_mobile">
                    <i-input v-model="editModalData.link_mobile"></i-input>
                </Form-item>
                <Form-item label="所在城市" prop="province">
                    <province-cascader v-model="editModalData.province"></province-cascader>
                </Form-item>
                <Form-item label="详细地址" prop="link_address">
                    <i-input v-model="editModalData.link_address"></i-input>
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
    
    const PROVINCE_VALIDATOR = (rule, value, callback)=>{
        if (!value) {
            callback(new Error('请输入正确的手机号'));
        }else {
            callback();
        }
    }

    const EDIT_MODAL_VALIDATE = {
        link_name: [
            rule.required({message:'联系人不能为空'}),
            rule.max({message:'联系人不能超过50字符',max: 50}),
        ],
        link_mobile: [
            rule.required({message:'联系电话不能为空'}),
            rule.max({message:'联系电话不能超过20字符',max: 20}),
            { validator: rule.phone, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        province: [
            { required: true, message: '所在城市不能为空'},
        ],
        link_address: [
            rule.required({message:'详细地址不能为空'}),
            rule.max({message:'详细地址不能超过100字符',max: 100}),
        ]
    }

    const INIT_EDIT_MODAL_DATA = {
        link_name: '',
        link_mobile: '',
        link_address: '',
        province: ''
    }

    export default {
        name: 'shipLink',
        data () {
            const columns = [
                { title: '联系人', width:150, key: 'link_name'},
                { title: '联系电话', width:200, key: 'link_mobile' },

                { title: '地址', render: (h,params)=>{
                    return h('span',{
                        
                    }, params.row.link_area+"  "+params.row.link_address)
                    },
                },
                { title: '操作', align: 'center', width:150, render: (h,params)=>{
                    return h('a',{
                        on: {
                            click: () =>{this.editLink(params.row); }
                        }
                    }, '编辑')
                }
                }]
            return {
                columns: columns,
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
                shipApi.shipLinkList(params).then((data)=>{
                    this.tableParams.list = data.resultObj.list
                    this.tableParams.total = data.resultObj.total
                    this.tableParams.selectList = []
                })
            },
            editLink(row) {
                this.editModal.modal = true
                this.editModal.isAdd = false
                this.editModalData = Object.assign({},row)
                // 初始化地址问题

                this.editModalData.province = row.link_area_code ? row.link_area_code + '$' + row.link_area : row.link_area_code
            },
            addShipLink (){
                this.editModal.modal = true
                this.editModal.isAdd = true 
                this.editModalData = Object.assign({},INIT_EDIT_MODAL_DATA)
            },
            submitEdit(){
                this.$refs.editModalForm.validate((valid) => {
                    if (valid) {
                        let params = {
                            link_name: '',
                            link_mobile: '',
                            link_address: '',
                        }
                        params = Object.assign(copySameNamePropety(params,this.editModalData),{cs_id: this.$route.params.id})
                        params.link_area_code = this.editModalData.province.split('$')[0]
                        params.link_area = this.editModalData.province.split('$')[1]
                        if (this.editModal.isAdd) {
                            shipApi.shipLinkAdd(params).then((data)=>{this.loadList()})
                        }else{
                            params.cs_link_id = this.editModalData.cs_link_id
                            shipApi.shipLinkEdit(params).then((data)=>{this.loadList()})
                        }
                    }else{
                        this.editModal.modal = true
                        this.$refs.editModalRef.visible = true

                    }
                })


                
            }
        },
        watch: {
            'editModal.isAdd': function (n,o) { 
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
            bus.$on('add-ship-link',()=>{
                this.addShipLink()
            });
        },
    }
</script>
<style lang="scss">
#shipLinkListModal{
    .ivu-form-item{
        margin-bottom: 20px;    
    }
}
    
</style>

