<template>
	<div>
        <div class="contain-head">
            <i-button  type="primary" @click='addStaff'>新增员工</i-button>
        </div>
        <div class="contain-main">
            <i-table :data="tableParams.list" :columns="columns"
                @on-selection-change="onSelectionChange"
                >
            </i-table>
            <div class="page-wrapper">
                <Page :total="tableParams.total" show-sizer show-elevator 
                    :current="currentPage" 
                    @on-change="onPageChange" 
                    @on-page-size-change="onPageSizeChange">
                </Page>
            </div>
        </div>
     
        <!-- 新增弹框 -->
        <Modal v-model="addModal.modal" ref="addStaffModel" title="新增" @on-ok="saveAddStaff">
            <Form ref="addStaffForm" :rules="ruleValidate" :model="addModal.modalData" :label-width="100">
                <Form-item label="姓名：" prop="user_name">
                    <i-input v-model="addModal.modalData.user_name" placeholder="输入员工姓名"></i-input>
                </Form-item>
                <Form-item label="部门：" prop="dept_id">
                    <dept-drop-down-tree ref="deptDropDownTree" v-model="addModal.modalData.dept_id" @onDeptSelect="onDeptSelect"></dept-drop-down-tree>
                </Form-item>
                <Form-item label="角色：" prop="role_id">
                    <role-drop-down-tree ref="roleDropDownTree" v-model="addModal.modalData.role_id" @onRoleSelect="onRoleSelect"></role-drop-down-tree>
                </Form-item>
                <Form-item label="手机号：" prop="user_mobile">
                    <i-input v-model="addModal.modalData.user_mobile" placeholder="输入员工手机号"></i-input>
                </Form-item>
                <Form-item label="密码：" prop="user_pwd">
                    <i-input type="password" v-model="addModal.modalData.user_pwd" placeholder="输入员工密码"></i-input>
                </Form-item>
            </Form>
        </Modal>

        <!-- 编辑弹框 -->
        <Modal  v-model="editModal.modal" ref="editStaffModel" title="修改" @on-ok="saveEditStaff">
            <Form ref="editStaffForm"  :rules="ruleValidate" :model="editModal.modalData" :label-width="100">
                <Form-item label="姓名：" prop="user_name">
                    <i-input v-model="editModal.modalData.user_name" placeholder="输入员工姓名"></i-input>
                </Form-item>
                <Form-item label="部门：" prop="dept_id">
                    <dept-drop-down-tree ref="editDeptDropDownTree" v-model="editModal.modalData.dept_id" @onDeptSelect="onDeptSelect"></dept-drop-down-tree>
                </Form-item>
                <Form-item label="角色：" prop="role_id">
                    <role-drop-down-tree ref="editRoleDropDownTree" v-model="editModal.modalData.role_id" @onRoleSelect="onRoleSelect"></role-drop-down-tree>
                </Form-item>
            </Form>
        </Modal>

        <!-- 重置密码弹框 -->
        <Modal v-model="resetModal.modal" ref="resetPwdModel" title="重置密码" @on-ok="saveResetPwd">
            <Form ref="resetForm" :rules="ruleValidate" :model="resetModal.modalData" :label-width="100">
                <Form-item label="新密码：" prop="pwd">
                    <i-input type="password" v-model="resetModal.modalData.pwd" placeholder="输入新密码"></i-input>
                    <span style="color: gray;">长度6-20位，只能包含字母、数字及标点符号</span>
                </Form-item>
                <Form-item label="重复密码：" prop="user_pwd">
                    <i-input type="password" v-model="resetModal.modalData.user_pwd" placeholder="再次输入新密码"></i-input>
                </Form-item>
            </Form>
            <div slot="footer">
                <Button   @click="hideModel('resetModal','modal')">取消</Button>
                <Button type="primary"  @click="saveResetPwd">确定</Button>
            </div>
        </Modal>
        
        <!-- 删除确认对话框 -->
        <Modal v-model="delModal.modal" title="系统提示" @on-ok="delStaffOk">
            <p>您是否确认删除该用户</p>
        </Modal>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    import tableMixin from '@/mixins/tableMixin'
    import * as API from '@/api/src/staffApi'
    import { utilCookie } from '@/utils/util'
    import { COOKIES } from '@/utils/constant'
    import rule from '@/utils/validate-rule'
    import {copySameNamePropety} from '@/utils/util'
    import deptDropDownTree from '@/components/system/v2/deptDropDownTree'
    import roleDropDownTree from '@/components/system/v2/roleDropDownTree'
    
    const validatePwd = (rule, value, callback) => {
        let points = /^[\x21-\x5e\x60-\x7e][\x21-\x7e]{5,19}$/g;
        if (value != '' && !points.test(value)) {
            callback(new Error('请输入正确的密码格式'));
        }else {
            callback();
        }
    };

    const RULE_VALIDATE = {
        user_name: [
            rule.required({message: '姓名不能为空'}),
            rule.max({max: 20, message: '姓名不能为空'}),
        ],
        user_mobile:  [
            rule.required({message: '手机号不能为空'}),
            { validator: rule.phone, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        user_pwd: [
            rule.required({message: '密码不能为空'}),
            rule.max({max: 20, message: '密码不能超过20字符'}),
            rule.min({min: 6, message: '密码不能少于6字符'}),
            { validator: validatePwd, message: '请输入正确的密码', trigger: 'blur' }
        ],
        pwd: [
            rule.required({message: '密码不能为空'}),
            rule.max({max: 20, message: '密码不能超过20字符'}),
            rule.min({min: 6, message: '密码不能少于6字符'}),
            { validator: validatePwd, message: '请输入正确的密码', trigger: 'blur' }
        ],
        dept_id: [
            rule.required({message: '部门不能为空'}),
        ],
        role_id: [
            rule.required({message: '角色不能为空'}),
        ],
    }
	export default {
		name: 'staffList',
		data (){
			return {
                ruleValidate: RULE_VALIDATE,
                columns: [
                    {title: '登录帐号',key: 'user_mobile', width : 250}, 
                    {title: '姓名',key: 'user_name', width : 200}, 
                    {title: '手机号',key: 'user_mobile', width : 250}, 
                    {title: '用户状态',key: 'user_status', render: (h, params) => {
                            let st = {Y:"启用", N:"禁用"}
                            return h('span',st[params.row.user_status])
                        }
                    },
                    { title: '操作', key: 'user_status', width : 300, render: (h,params)=>{
                        return h('div',[
                                h('a', {
                                    on:{
                                        click:() => this.editStaff(params.row)
                                    }
                                }, '编辑'),
                                h('a', {
                                    on:{
                                        click:() => this.resetPwd(params.row)
                                    },
                                    style: {marginLeft:"15px"},
                                }, '重置密码'),
                                h('a', {
                                    on:{
                                        click:() => this.toggleStatus(params.row)
                                    },
                                    style: {marginLeft:"15px"},
                                }, params.row.user_status == "Y" ? "禁用" : "启用"),
                                h('a', {
                                    on:{
                                        click:() => this.delStaff(params.row)
                                    },
                                    style: {marginLeft:"15px"},
                                }, '删除'),
                            ])
                        } 
                    }
                ],
                addModal: {
                    modal: false,
                    modalData: {
                        user_name:'',
                        user_mobile:'',
                        user_pwd: '',
                        role_id:'',
                        dept_id: '',
                    }

                },
                editModal: {
                    modal: false,
                    modalData: {
                        user_name:'',
                        role_id: '',
                        user_id: '',
                        dept_id: '',
                    }
                },
                resetModal: {
                    modal: false,
                    modalData: {
                        user_name:'',
                        pwd: '',
                        user_pwd: '',
                        role_id: '',
                        user_id: '',
                    }
                },
                delModal: {
                    modal: false,
                    modalData: {
                        user_id: null,
                    }
                },
			}
		},
        mixins: [tableMixin],
        computed: {
            ...mapState(['userInfo'])
        },
        components: {
            deptDropDownTree,
            roleDropDownTree
        },
		methods: {
            loadList (){
                let params = this.assignQuery({act_user_id: this.userInfo.user_id});
                API.getStaffListApi(params).then((data)=>{
                    this.tableParams.list = data.resultObj.list
                    this.tableParams.total = data.resultObj.count
                })
            },
            //新增员工
            addStaff (){
                this.$refs.addStaffForm.resetFields();
                this.addModal.modal = true;
                this.$refs.deptDropDownTree.loadDeptList('');
                this.$refs.roleDropDownTree.loadRoleList('');
            },
            saveAddStaff (){
                this.$refs.addStaffForm.validate((valid) => {
                    if (!valid) {
                        this.addModal.modal = true
                        this.$refs.addStaffModel.visible = true
                        return 
                    }else{
                        let params = {...this.addModal.modalData,...{act_user_id: this.userInfo.user_id }}
                        API.staffAddApi(params).then((data)=>{
                            this.$Message.success(data.resultObj)
                            this.loadList()
                        })
                    }
                });
            },
            editStaff (staff){
                this.editModal.modal = true;
                this.$refs.editStaffForm.resetFields();
                copySameNamePropety(this.editModal.modalData,staff);
                this.$refs.editDeptDropDownTree.setSelected(staff.dept_id, staff.dept_name);
                this.$refs.editRoleDropDownTree.setSelected(staff.role_id, staff.role_name);
            },
            saveEditStaff (){
                this.$refs.editStaffForm.validate((valid) => {
                    if (!valid) {
                        this.editModal.modal = true
                        this.$refs.editStaffModel.visible = true
                    }else{
                        let params = {...this.editModal.modalData,act_user_id: this.userInfo.user_id,}
                        API.staffUpdateApi(params).then((data)=>{
                            this.$Message.success(data.resultObj)
                            this.loadList()
                        })
                    }
                });
            },
            delStaff(staff) {
                this.delModal.modal = true;
                this.delModal.modalData.user_id = staff.user_id;
            },
            delStaffOk() {
                let params = {act_user_id: this.userInfo.user_id, company_id: this.userInfo.company_id, user_id: this.delModal.modalData.user_id}
                API.staffDelApi(params).then((data)=>{
                    this.$Message.success('删除成功')
                    this.loadList()
                })
            },
            resetPwd (staff){
                this.resetModal.modal = true;
                this.$refs.resetForm.resetFields();
                copySameNamePropety(this.resetModal.modalData,staff);
            },
            saveResetPwd (){
                
                this.$refs.resetForm.validate((valid) => {
                    if (!valid) {
                        this.resetModal.modal = true
                        this.$refs.resetPwdModel.visible = true
                        return 
                    }else{
                        if(this.resetModal.modalData.pwd!=this.resetModal.modalData.user_pwd){
                            return this.$Message.error('两次密码输入不一致！');
                        }
                        let params = {...this.resetModal.modalData,act_user_id: this.userInfo.user_id,}
                        API.staffResetApi(params).then((data)=>{
                            this.$Message.success(data.resultObj)
                            this.hideModel('resetModal','modal')
                            this.loadList()
                        })
                    }
                });
            },
            hideModel(e,e2){
                this[e][e2]=false;
            },
            toggleStatus (staff){
                let vm = this
                let stc = {
                    Y: '是否确定禁用该用户？',
                    N: '是否确定启用该用户？'
                }
                
                let params = {
                    user_id: staff.user_id,
                    act_user_id: this.userInfo.user_id,
                    user_status: staff.user_status == 'Y' ? 'N' : 'Y'
                }
                this.$Modal.confirm({
                    content: stc[staff.user_status] || '确定该操作',
                    onOk (){
                         
                        if(staff.user_id==vm.userInfo.user_id){
                            return this.$Message.error('无法禁用当前账户！');
                        }
                        API.setStaffStateApi(params).then((data)=>{
                            vm.loadList()
                            this.$Message.success(data.resultInfo)
                        })
                    }

                })
            },
            onDeptSelect(dept){
                if (dept) {
                    this.addModal.modalData.dept_id = dept.dept_id;
                    this.editModal.modalData.dept_id = dept.dept_id;
                }
            },
            onRoleSelect(role){
                if (role) {
                    this.addModal.modalData.role_id = role.role_id + '';
                    this.editModal.modalData.role_id = role.role_id + '';
                }
            }
        },
        created (){
            this.loadList()
        }
	}
</script>