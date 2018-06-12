<template>
    <div>
        <i-button key="add" size='small' type="primary" @click="add"><Icon type="plus"></Icon>新增</i-button>
        <i-table class="mt10" :data="tableParams.list" :columns="columns">
        </i-table>
        <div class="page-wrapper">
            <Page :total="tableParams.total" show-sizer show-elevator 
                @on-change="onPageChange" 
                @on-page-size-change="onPageSizeChange">
            </Page>
        </div>

        <Modal :title="editModal.title" v-model="editModal.modal" @on-ok="submitEdit" ref="editModalRef">
            <i-form ref="editModalForm" :model="editModalData" :rules="editModalValidate" :label-width="120">
            <!--
                <Form-item label="公司名称" prop="link_company">
                    <i-input v-model="editModalData.link_company"></i-input>
                </Form-item>
            -->
                <Form-item label="联系人" prop="link_name">
                    <i-input v-model="editModalData.link_name"></i-input>
                </Form-item>
                <Form-item label="联系人电话" prop="link_mobile">
                    <i-input v-model="editModalData.link_mobile"></i-input>
                </Form-item>
                <Form-item label="所在城市" prop="province">
                    <province-cascader :opts="provinceOpts" v-model="editModalData.province"></province-cascader>
                </Form-item>
                <Form-item label="详细地址" prop="link_address">
                    <i-input v-model="editModalData.link_address"></i-input>
                </Form-item>
            </i-form>
        </Modal>
    </div>
</template>
<script>
    import tableMixin from '@/mixins/tableMixin'
    import config from '@/config/index'
    import bus from '@/utils/bus'
    import * as shipApi from '@/api/src/customerSend'
    import { copySameNamePropety } from '@/utils/util'
    import rule from '@/utils/validate-rule'
    import { mapState } from 'vuex'
   

    const EDIT_MODAL_VALIDATE = {
        link_company: [
            rule.required({ message: '公司名称不能为空'}),
            rule.max({ message: '公司名称不能超过50字符',max: 50}),
        ],
        link_mobile: [
            rule.required({ message: '联系人电话不能为空'}),
            { validator: rule.phone, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        link_name: [
            rule.required({ message: '联系人不能为空'}),
            rule.max({ message: '联系人不能超过20字符',max: 20}),
        ],
        province: [
            rule.required({ message: '所在城市不能为空'}),
        ],
        link_address: [
            rule.required({ message: '详细地址不能为空'}),
            rule.max({ message: '详细地址不能超过100字符',max: 100}),
        ]
    }


    const INIT_EDIT_MODAL_DATA = {
        link_company: '',
        link_name: '',
        link_mobile: '',
        link_address: '',
        province: '',
    }

    export default {
        name: 'shipSend',
        props: {cs_id: '', cs_link_id:''},
        data () {
            const COLUMNS = [
                { title: '联系人', width: 150, key: 'link_name'},
                { title: '联系电话', width: 150, key: 'link_mobile' },
                { title: '地址', render: (h,params)=>{
                    return h('span',{
                        
                    }, params.row.link_area+"  "+params.row.link_address)
                    },
                },
                { title: '操作', align: 'center', width: 150, render: (h,params)=>{
                    
                    return h('div', [
                        h('a', {
                            style: {
                                marginRight: '15px'
                            },
                            on: {
                                click: () => {
                                    this.editLink(params.row)
                                }
                            }
                        }, '查看'),
                        h('a', {
                            on: {
                                click: () => {
                                    this.delLink(params.row)
                                }
                            }
                        }, '删除')
                    ]);
                }
                }]
            return {
                columns: COLUMNS,
                search: {
                    pcid: '',
                },
                editModal: {
                    title: '增加',
                    modal: false,
                    isAdd: false
                },
                
                editModalData: Object.assign({},INIT_EDIT_MODAL_DATA),
                editModalValidate: Object.freeze(EDIT_MODAL_VALIDATE),
                provinceOpts: { 'change-on-select': true },
            }
        },

        mixins: [tableMixin],
        computed: {
            ...mapState(['userInfo'])
        },
        methods: {
            loadList() {
                this.search.pcid=this.cs_id
                let params = this.assignQuery(this.search)
                shipApi.getSendList(params).then((data)=>{
                    this.tableParams.list = data.resultObj.list
                    this.tableParams.total = data.resultObj.total
                })
            },
            editLink(row) {
                this.editModal.modal = true
                this.editModal.isAdd = false
                this.editModalData = Object.assign({},row)
                // 初始化地址问题
                this.editModalData.province = row.link_area_code ? row.link_area_code + '$' + row.link_area : row.link_area_code
            },
            delLink(row) {
                let params={
                    company_id: this.userInfo.company_id,
                    pcid: this.cs_id,
                    ids: row.cs_link_id
                }
                this.$Modal.confirm({
                    title: '系统提示',
                    content: '您确认删除该发货人',
                    onOk: () => {
                        shipApi.delSend(params).then((data)=>{this.loadList()})
                    }
                });
                
            },
            add (){
                this.editModal.modal = true
                this.editModal.isAdd = true 
                this.editModalData = Object.assign({},INIT_EDIT_MODAL_DATA)
            },
            submitEdit (){
                this.$refs.editModalForm.validate((valid)=>{
                    if (valid) {
                        let params = {
                            link_company: '',
                            link_name: '',
                            link_mobile: '',
                            link_address: '',
                            link_area_code: '',
                            link_area: '',
                        }

                        params = Object.assign(copySameNamePropety(params,this.editModalData),{pcid:this.cs_id})
                        params.link_area_code = this.editModalData.province.split('$')[0]
                        params.link_area = this.editModalData.province.split('$')[1]
                        if (this.editModal.isAdd) {
                            shipApi.addSend(params).then((data)=>{this.loadList()})
                        }else{
                            params.cs_link_id = this.editModalData.cs_link_id
                            shipApi.editSend(params).then((data)=>{this.loadList()})
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
            },
            cs_id: function (n,o) { 
                if (n) {
                    this.loadList()
                }
                this.editModal.title = n ? '添加' : '修改'
            },
        },
        created (){
        },
        mounted() {
            bus.$on('add-ship-receipt',(val)=>{
                this.addReceiptLink();
            });
        }
    }
</script>

