<template>
    <div>
        <div class="contain-head">
        </div>
        <div class="contain-main">
            <Row>
                <Col span="6">
                    <Row>
                        <i-button type="primary" size="small" @click='showAddModal'>新增</i-button>
                        <i-button type="primary" size="small" @click='showEditModal'>修改</i-button>
                        <i-button type="primary" size="small" @click='showDelModal=!showDelModal' :disabled="disableDelMenuBtn">删除</i-button>
                        <i-button type="primary" size="small" @click='changeRoleState' :disabled="disableDelMenuBtn">禁用/启用</i-button>
                    </Row>
                    <Row>
                        <Menu width="auto" ref="menu" :active-name="activeName" @on-select="onSelectRoleItem">
                            <Menu-item v-for="item in roleList" :key="item" :name="item.role_id + ',' + item.is_admin">
                                <Icon type="ios-circle-filled" :style="item.is_enabled=='Y'?'color: #0071c0;':'color: red;'"></Icon>
                                {{item.role_name}}
                            </Menu-item>
                        </Menu>
                    </Row>
                </Col>
                <Col span="7">
                    <Row>
                        <i-button type="primary" size="small" @click='assignMenu' :disabled="disableAssignMenuBtn">分配菜单</i-button>
                    </Row>
                    <Row>
                        <div class="dialog-bd plr-20 choosemanager clearfix">
                            <ul class="ztree" id="treeMenu"></ul>
                        </div>
                    </Row>
                </Col>
                <Col span="11">
                    <Row>
                        <!-- <i-button type="primary" size="small" @click='assignUser'>分配用户</i-button> -->
                    </Row>
                    <Row>
                        <!-- <div class="dialog-bd plr-20 choosemanager clearfix">
                            <ul class="ztree" id="treeUser"></ul>
                        </div> -->
                        <i-table :columns="staffColumns" :data="userList"></i-table>
                    </Row>
                </Col>
            </Row>
        </div>

        <!-- 确认对话框 -->
        <Modal ref="roleModal" v-model="roleModal.show" :title="roleModal.title" @on-ok="saveRole">
            <Form ref="roleForm" :rules="ruleValidate" :model="roleData" :label-width="100">
                <Form-item label="角色名称：" prop="role_name">
                    <i-input v-model="roleData.role_name" placeholder="输入角色名称"></i-input>
                </Form-item>
            </Form>
        </Modal>

        <!-- 删除确认对话框 -->
        <Modal v-model="showDelModal" title="系统提示" @on-ok="delRole">
            <p>您是否确认删除该角色</p>
        </Modal>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import * as API from '@/api/src/sysRoleApi'
import { utilCookie } from '@/utils/util'
import { COOKIES } from '@/utils/constant'
import rule from '@/utils/validate-rule'
import { copySameNamePropety } from '@/utils/util'
import zTree from '@/lib/ztree/jquery.ztree.all.min.js'
import '@/lib/ztree/zTreeStyle.css'


const staffColumns = [
    {title: '姓名',key: 'user_name', width : 150}, 
    {title: '账号',key: 'user_mobile', width : 150}, 
    {title: '部门',key: 'dept_names', }, 
]

export default {
    name: 'menuList',
    data() {
        return {
            disableAssignMenuBtn: false,    // 显示分配菜单按钮
            disableDelMenuBtn: false,       // 显示删除按钮
            showDelModal: false,        // 显示删除对话框
            roleList: [],               // 角色列表数据
            roleModal: {                // 显示新增/编辑对话框
                show: false,
                title: '新增',
                type: 0, // 0 新增 1 编辑
            },
            roleData: {                 // 角色数据模型
                role_id: null,
                company_id: null,
                role_name: null,
            },
            ruleValidate: {             // 表单验证
                role_name: [
                    rule.required({ message: '角色名称不能为空' }),
                    rule.max({ max: 20, message: '角色名称长度不能超过20字符' })
                ],
            },
            activeName: null,           // 显示角色选中状态
            treeMenuObj: null,          // 菜单树对象
            treeUserObj: null,          // 用户树对象

            staffColumns: staffColumns,
            userList: [],
        }
    },
    computed: {
        ...mapState(['userInfo'])
    },
    methods: {
        // 加载角色列表
        loadRoleList() {
            let _vm = this;
            API.getRoleListApi({ act_user_id: this.userInfo.user_id }).then(json => {
                this.roleList = json.resultObj;
                this.$nextTick(function () {
                    if (_vm.roleList && _vm.roleList.length > 0) {
                        let role = _vm.roleList[0]
                        let id = role.role_id;
                        let isAdmin = role.is_admin;
                        _vm.roleData.role_id = id;
                        _vm.activeName = id+','+ isAdmin;  // 选中角色
                        _vm.disableDelMenuBtn = isAdmin=='Y'? true : false;
                        //_vm.disableAssignMenuBtn = isAdmin=='Y'? true : false;
                        _vm.loadMenuList(id); // 加载菜单
                        _vm.loadUserList(id); // 加载用户
                    }
                })
            })
        },
        // 加载菜单数据
        loadMenuList(role_id) {
            API.menuListApi({ act_user_id: this.userInfo.user_id, role_id: role_id }).then(json => {
                // 创建菜单树
                this.treeMenuObj = this.buildTree('treeMenu', this.buildTreeMenuData(json.resultObj));
            })
        },
        // 加载用户数据
        loadUserList(role_id) {
            /*API.userListApi({ act_user_id: this.userInfo.user_id, role_id: role_id }).then(json => {
                // 创建用户树
                this.treeUserObj = this.buildTree('treeUser', this.buildTreeUserData(json.resultObj))
            })*/
            API.selectedUserListApi({ act_user_id: this.userInfo.user_id, role_id: role_id }).then(json => {
                
                this.userList = json.resultObj;
            })
        },
        // 角色点击选中事件
        onSelectRoleItem(item) {
            if (item) {
                let arr = item.split(',');
                let role_id = '';
                if (arr.length>0) {
                    role_id = arr[0];
                    this.roleData.role_id = arr[0];
                }
                // 加载菜单和加载用户
                if (role_id) {
                    this.loadMenuList(role_id);
                    this.loadUserList(role_id);
                }
                // 显示隐藏 分配菜单按钮和删除按钮
                if (arr.length>1) {
                    if (arr[1] && arr[1]=='Y') {
                        //this.disableAssignMenuBtn = false;
                        this.disableDelMenuBtn = true;
                    }else{
                        //this.disableAssignMenuBtn = false;
                        this.disableDelMenuBtn = false;
                    }
                }
            }
        },
        // 显示新增对话框
        showAddModal() {
            this.roleModal.show = true;
            this.roleModal.title = '新增';
            this.roleModal.type = 0;
            this.roleData.role_id = null;
            this.clearRoleForm();
        },
        // 显示编辑对话框
        showEditModal() {
            if (this.roleData.role_id) {
                this.roleModal.show = true;
                this.roleModal.title = '编辑';
                this.roleModal.type = 1;
                this.clearRoleForm();

                if (this.roleList) {
                    let len = this.roleList.length;
                    for (let i = 0; i < len; i++) {
                        if (this.roleList[i].role_id == this.roleData.role_id) {
                            this.roleData.role_name = this.roleList[i].role_name;
                            break;
                        }
                    }
                }
            } else {
                this.$Message.warning('请选择一条角色')
            }
        },
        // 清空角色表单
        clearRoleForm() {
            this.$refs.roleForm.resetFields();
        },
        // 保存角色信息
        saveRole() {
            this.roleModal.show = true
            this.$refs.roleModal.visible = true
            this.$refs.roleForm.validate((valid => {
                if (valid) {
                    let params = { ...this.roleData, act_user_id: this.userInfo.user_id, };
                    if (this.roleModal.type == 0) {
                        API.roleAddApi(params).then((data) => {
                            this.roleModal.show = false
                            this.$refs.roleModal.visible = false
                            this.loadRoleList();
                            this.$Message.success('保存成功')
                        })
                    } else {
                        API.roleUpdateApi(params).then((data) => {
                            this.roleModal.show = false
                            this.$refs.roleModal.visible = false
                            this.loadRoleList()
                            this.$Message.success('保存成功')
                        })
                    }
                }
            }))
        },
        // 删除角色
        delRole() {
            let roleId = this.roleData.role_id;
            if (roleId) {
                let params = { role_ids: this.roleData.role_id, act_user_id: this.userInfo.user_id, };
                API.roleDelApi(params).then((data) => {
                    this.roleData.role_id = null;
                    this.loadRoleList()
                    this.loadMenuList(roleId);
                    this.loadUserList(roleId);
                    this.$Message.success('删除成功')
                })
            } else {
                this.$Message.warning('请选择一条角色')
            }
        },
        // 分配菜单
        assignMenu() {
            let roleId = this.roleData.role_id;
            let menuIdArr = [];
            if (roleId) {
                let nodes = this.treeMenuObj.getCheckedNodes();
                if (nodes) {
                    let len = nodes.length;
                    for (let i = 0; i < len; i++) {
                        menuIdArr.push(nodes[i].id);
                    }
                }

                let params = { role_id: roleId, menu_ids: menuIdArr.join(','), act_user_id: this.userInfo.user_id, };
                API.assignMenuApi(params).then((data) => {
                    this.$Message.success('分配菜单成功')
                })
            } else {
                this.$Message.warning('请选择一条角色')
            }

        },
        // 分配用户
        assignUser() {
            let roleId = this.roleData.role_id;
            let userIdArr = [];
            if (roleId) {
                let nodes = this.treeUserObj.getCheckedNodes();
                if (nodes) {
                    let len = nodes.length;
                    for (let i = 0; i < len; i++) {
                        userIdArr.push(nodes[i].id);
                    }
                }

                let params = { role_id: roleId, user_ids: userIdArr.join(','), act_user_id: this.userInfo.user_id, };
                API.assignUserApi(params).then((data) => {
                    this.$Message.success('分配用户成功')
                })
            } else {
                this.$Message.warning('请选择一条角色')
            }
        },
        // 修改角色状态
        changeRoleState() {

            if (this.roleData.role_id) {
                let params = { role_id: this.roleData.role_id, act_user_id: this.userInfo.user_id, };
                API.roleStateApi(params).then((data) => {
                    this.loadRoleList()
                    this.$Message.success('状态修改成功')
                })
            } else {
                this.$Message.warning('请选择一条角色')
            }
        },
        // 设置ztree配置
        buildTree(treeId, list){
            const that = this
            const setting = {
                isSimpleData : true,              
                data:{
                    key:{
                        name:"title",
                    },
                    simpleData: {
                            enable: true,
                            idKey:"id",
                            pIdKey:"parent_id",
                            rootPId:null
                        }
                    },
                    view:{
                        autoCancelSelected:false
                    },
                    check:{
                        enable:true,
                        chkboxType : {"Y": "ps", "N": "s"}
                    },
                    callback:{
                        onClick (event,treeId,treeNode,clickFlag){

                        }
                    }
            }
            return $.fn.zTree.init($("#" + treeId + ".ztree"), setting, list)
        },
        // 构建菜单树数据
        buildTreeMenuData(list) {
            if (list != null && list.length > 0) {
                let len = list.length;
                let newMenuList = []
                for (var i = 0; i < len; i++) {
                    let menu = list[i];
                    let menuId = menu.menu_id;
                    let menuParentId = menu.parent_menu_id;
                    let menuName = menu.menu_name;
                    let menuUrl = menu.menu_url;
                    let menuKey = menu.menu_key ? menu.menu_key : '';
                    let menuIcon = menu.icon;
                    let menuType = menu.is_private ? menu.is_private : '';
                    let menuHide = menu.is_hide;
                    let menuSeq = menu.seq ? menu.seq : 1;
                    let isSelected = menu.is_selected;
                    let children = menu.children;

                    let menuObj = { "id": menuId, "title": menuName, "parent_id": menuParentId };
                    if (isSelected == '1') {
                        menuObj.checked = true;
                    }
                    let childList = this.buildTreeMenuData(children);
                    if (childList != null && childList.length > 0) {
                        menuObj.children = childList;
                    }
                    newMenuList[i] = menuObj;

                }
                return newMenuList;
            } else {
                return null;
            }
        },
        // 构建用户树数据
        buildTreeUserData(list) {
            if (list != null && list.length > 0) {
                let len = list.length;
                let newUserList = []
                for (var i = 0; i < len; i++) {
                    let user = list[i];
                    let userId = user.user_id;
                    let userName = user.user_name;
                    let userMobile = user.user_mobile;
                    let isSelected = user.is_selected;
                    let children = user.children;

                    let userObj = { "id": userId, "title": userName };
                    if (isSelected == '1') {
                        userObj.checked = true;
                    }
                    let childList = this.buildTreeUserData(children);
                    if (childList != null && childList.length > 0) {
                        menuObj.children = childList;
                    }
                    newUserList[i] = userObj;

                }
                return newUserList;
            } else {
                return null;
            }
        },
    },
    created() {
        this.loadRoleList();
    }
}
</script>
<style lang="scss">

</style>