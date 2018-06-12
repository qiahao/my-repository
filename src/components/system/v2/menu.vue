<template>
	<div>
        <div class="contain-head">
            <i-button  type="primary" @click='addMenu'>新增菜单</i-button>
            <i-button  type="primary" @click='editMenu'>编辑菜单</i-button>
            <i-button  type="primary" @click='delMenu'>删除菜单</i-button>
        </div>
        <div class="contain-main menu-manage">
            <Tree ref="menuList" :data="menuList" style="display: block;"></Tree>
        </div>
     
        <!-- 新增弹框 -->
        <Modal v-model="addModal.modal" width="700" ref="addMenuModel" :title="addModal.title" @on-ok="saveMenu">
            <Form ref="addMenuForm" :rules="ruleValidate" :model="addModal.modalData" :label-width="100">
                <Form-item label="父级菜单：">
                    <Dropdown trigger="custom" :visible="showTreeMenu" width="100%">
                        <a href="javascript:void(0)" @click="treeMenuOpen">
                            {{addModal.modalData.parent_menu_name}}
                            <Icon type="arrow-down-b"></Icon>
                        </a>
                        <Dropdown-menu slot="list" style="margin-left: 10px;">
                            <Tree ref="treeMenu" :data="treeMenu" class="wm-ivu-tree"></Tree>
                            <div style="text-align: right;margin:10px;">
                                <Button type="primary" size="small" @click="treeMenuClose">确定</Button>
                            </div>
                        </Dropdown-menu>
                    </Dropdown>
                </Form-item>
                <Form-item label="菜单名称：" prop="menu_name">
                    <Input v-model="addModal.modalData.menu_name" placeholder="输入菜单名称"></Input>
                </Form-item>
                <Form-item label="菜单URL：" prop="menu_url">
                    <Input v-model="addModal.modalData.menu_url" placeholder="输入菜单URL"></Input>
                </Form-item>
                <Form-item label="菜单KEY：" prop="menu_key">
                    <Input v-model="addModal.modalData.menu_key" placeholder="输入菜单名称关键字"></Input>
                </Form-item>
                <Row>
                    <Col span="12">
                        <Form-item label="菜单类型：" prop="is_private">
                            <Radio-group v-model="addModal.modalData.is_private">
                                <Radio label="0">页面菜单</Radio>
                                <Radio label="1">功能菜单</Radio>
                            </Radio-group>
                        </Form-item>
                    </Col>
                    <Col span="12">
                        <Form-item label="菜单隐藏：" prop="is_hide">
                            <Radio-group v-model="addModal.modalData.is_hide">
                                <Radio label="Y">隐藏</Radio>
                                <Radio label="N">显示</Radio>
                            </Radio-group>
                        </Form-item>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <Form-item label="菜单顺序：">
                            <Input-number :max="999" :min="1" v-model="addModal.modalData.seq" placeholder="输入菜单顺序"></Input-number>
                        </Form-item>
                    </Col>
                    <Col span="12">
                        <Form-item label="菜单图标：" prop="icon">
                            <Input v-model="addModal.modalData.icon" placeholder="输入菜单图标"></Input>
                        </Form-item>
                    </Col>
                </Row>
                <Form-item label="备注：" prop="remark">
                    <Input v-model="addModal.modalData.remark" width="100%" type="textarea" placeholder="输入备注"></Input>
                </Form-item>
            </Form>
        </Modal>
        
        <!-- 删除确认对话框 -->
        <Modal
            v-model="showDelMenu"
            title="系统提示"
            @on-ok="delModelOK">
            <p>您是否确认删除该菜单</p>
        </Modal>
        
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    import tableMixin from '@/mixins/tableMixin'
    import * as API from '@/api/src/sysMenuApi'
    import { utilCookie } from '@/utils/util'
    import { COOKIES } from '@/utils/constant'
    import rule from '@/utils/validate-rule'
    import {copySameNamePropety} from '@/utils/util'
    

    const RULE_VALIDATE = {
        menu_name: [
            rule.required({message: '菜单名称不能为空'}),
            rule.max({max: 20, message: '菜单名称长度不能超过20字符'})
        ],
        menu_url:[
            rule.max({max: 100, message: '菜单名称长度不能超过100字符'})
        ],
        menu_key: [
            rule.required({message: '菜单关键字不能为空'}),
            rule.max({max: 100, message: '菜单关键字长度不能超过100字符'})
        ],
        menu_id: [
            rule.max({max: 50, message: '菜单ID长度不能超过50字符'})
        ],
        icon: [
            rule.max({max: 100, message: '菜单图标长度不能超过100字符'})
        ],
        seq: [
            rule.required({message: '菜单顺序不能为空'}),
            rule.max({max: 3, message: '菜单顺序长度不能超过3字符'}),
        ],
        remark: [
            rule.max({max: 500, message: '备注长度不能超过500字符'})
        ]
    }
    const DEFAULT_PARENT_MENU_ID = '0';
    const DEFAULT_PARENT_MENU_NAME = '父级菜单';
	export default {
		name: 'menuList',
		data (){
			return {
                ruleValidate: RULE_VALIDATE,
                showTreeMenu: false, // 显示下拉父级菜单
                showDelMenu: false,  // 关闭下拉父级菜单
                addModal: {
                    modal: false,
                    title: '新增',
                    type: 0, // 0 新增 1 修改
                    modalData: {
                        menu_name:'',
                        menu_url:'',
                        menu_key: '',
                        menu_id: '',
                        parent_menu_id: DEFAULT_PARENT_MENU_ID,
                        parent_menu_name: DEFAULT_PARENT_MENU_NAME,
                        icon: '',
                        is_private: '0',
                        is_hide: 'N',
                        seq: 1,
                        remark:''
                    }

                },
                menuList: [], // 菜单列表数据
                treeMenu: [], // 下拉菜单数据
			}
		},
        computed: {
            ...mapState(['userInfo'])
        },
		methods: {
            // 打开父级下拉菜单
            treeMenuOpen() {
                this.showTreeMenu = true;
            },
            // 关闭父级下拉菜单
            treeMenuClose() {
                this.showTreeMenu = false;
                let treeMenuObj = this.$refs.treeMenu ;
                let selectedNodes = treeMenuObj.getSelectedNodes();
                if (selectedNodes.length>0) {
                    this.addModal.modalData.parent_menu_id = selectedNodes[0].id;
                    this.addModal.modalData.parent_menu_name = selectedNodes[0].title;
                }
            },
            // 加载菜单列表
            loadList (){
                let _vm = this;
                API.getMenuListApi({act_user_id:_vm.userInfo.user_id, parent_menu_id: DEFAULT_PARENT_MENU_ID}).then(json=>{
                    let list = json.resultObj;
                    // 创建菜单列表
                    _vm.menuList = _vm.buildMenuList(list);
                    // 创建父级下拉菜单
                    _vm.treeMenu = [{id:DEFAULT_PARENT_MENU_ID, title: DEFAULT_PARENT_MENU_NAME, children: _vm.buildTreeMenu(list), expand: true}];
                })
            },
            // 构建菜单列表树
            buildMenuList(list) {
                if (list != null && list.length>0) {
                    let len = list.length;
                    let newMenuList = []
                    for (var i = 0; i < len; i++) {
                        let menu = list[i];
                        let menuId = menu.menu_id;
                        let menuName = menu.menu_name;
                        let menuUrl = menu.menu_url;
                        let menuKey = menu.menu_key?menu.menu_key:'';
                        let menuIcon = menu.icon;
                        let menuType = menu.is_private=='1'?'功能菜单':'页面菜单';
                        let menuHide = menu.is_hide=='Y'?'隐藏':'显示';
                        let menuSeq = menu.seq?menu.seq:1;
                        let children = menu.children;
                        let title = '<ul class="wm-menu-ul">'
                            + '<li class="wm-menu-icon wm-icon wm-icon-' + menuIcon + '"></li>'
                            + '<li class="wm-menu-name"><span>'+menuName+'</span></li>'
                            //+ '<li class="menu-name">'+menuName+'</li>'
                            + '<li class="wm-menu-key">'+menuKey+'</li>'
                            + '<li class="wm-menu-type">'+menuType+'</li>'
                            + '<li class="wm-menu-hide">'+menuHide+'</li>'
                            + '<li class="wm-menu-seq">'+menuSeq+'</li>'
                            + '<li class="wm-menu-url">'+menuUrl+'</li>'
                            //+ '<li class="menu-handler"><a @click="editMenu()" href="void(0)">编辑</a><a @click="addSubMenu()">添加子菜单</a></li>'
                            + '</ul>';
                        let newMenuObj = {id:menuId, name:menuName, "title": title, children: this.buildMenuList(children)}
                        
                        newMenuList[i] = newMenuObj;
                    }
                    return newMenuList;
                }else{
                    return null;
                }
            },
            // 构建下拉菜单树
            buildTreeMenu(list) {
                if (list != null && list.length>0) {
                    let len = list.length;
                    let newMenuList = []
                    for (var i = 0; i < len; i++) {
                        let menu = list[i];
                        let menuId = menu.menu_id;
                        let menuName = menu.menu_name;
                        let menuUrl = menu.menu_url;
                        let menuKey = menu.menu_key?menu.menu_key:'';
                        let menuIcon = menu.icon;
                        let menuType = menu.is_private?menu.is_private:'';
                        let menuHide = menu.is_hide;
                        let menuSeq = menu.seq?menu.seq:1;
                        let children = menu.children;

                        if (menuType=='0') {
                            let menuObj = {"id":menuId, "title": menuName};
                            let childList = this.buildTreeMenu(children);
                            if (childList != null && childList.length>0) {
                                menuObj.children = childList;
                            }
                            newMenuList[i] = menuObj;
                        }

                    }
                    return newMenuList;
                }else{
                    return null;
                }
            },
            // 打开新增菜单对话框
            addMenu (){
                this.addModal.modal = true;
                this.addModal.title = "新增";
                this.addModal.type = 0;
                this.resetForm();
                let menuListObj = this.$refs.menuList ;
                let selectedNodes = menuListObj.getSelectedNodes();
                if (selectedNodes.length>0) {
                    this.addModal.modalData.parent_menu_id = selectedNodes[0].id;
                    this.addModal.modalData.parent_menu_name = selectedNodes[0].name;
                }else{
                    this.addModal.modalData.parent_menu_id = DEFAULT_PARENT_MENU_ID;
                    this.addModal.modalData.parent_menu_name = DEFAULT_PARENT_MENU_NAME;
                }
            },
            // 保存
            saveMenu (){
                this.$refs.addMenuForm.validate((valid) => {
                    this.addModal.modal = true
                    this.$refs.addMenuModel.visible = true
                    if (valid) {
                        let params = {...this.addModal.modalData, act_user_id: this.userInfo.user_id,};
                        if (this.addModal.type == 0) {
                            API.menuAddApi(params).then((data)=>{
                                this.addModal.modal = false
                                this.$refs.addMenuModel.visible = false
                                this.resetForm();
                                this.loadList();
                                this.$Message.success('保存成功')
                            })
                        }else{
                            API.menuUpdateApi(params).then((data)=>{
                                this.addModal.modal = false
                                this.$refs.addMenuModel.visible = false
                                this.loadList()
                                this.$Message.success('保存成功')
                            })
                        }

                    }
                });
            },
            // 打开编辑对话框
            editMenu(){
                let menuListObj = this.$refs.menuList ;
                let selectedNodes = menuListObj.getSelectedNodes();
                if (selectedNodes.length>0) {
                    this.addModal.modal = true;
                    this.addModal.title = '编辑';
                    this.addModal.type = 1;
                    let id = selectedNodes[0].id;
                    let params = {menu_id:id, act_user_id: this.userInfo.user_id,};
                    API.getMenuDetialApi(params).then((data)=>{
                        this.addModal.modalData = data.resultObj;
                        let parentMenuName = data.resultObj.parent_menu_name;
                        
                        if (parentMenuName == null || parentMenuName=='') {
                            this.addModal.modalData.parent_menu_id = DEFAULT_PARENT_MENU_ID;
                            this.addModal.modalData.parent_menu_name = DEFAULT_PARENT_MENU_NAME;
                        }
                    })
                }else{
                    this.$Message.warning('请选择一条菜单记录');
                }
            },
            // 删除菜单对话框
            delMenu(){
                let menuListObj = this.$refs.menuList ;
                let selectedNodes = menuListObj.getSelectedNodes();
                if (selectedNodes.length>0) {
                    this.showDelMenu = true;
                }else{
                    this.$Message.warning('请选择一条菜单记录');
                }
            },
            // 删除菜单
            delModelOK(){
                let menuListObj = this.$refs.menuList ;
                let selectedNodes = menuListObj.getSelectedNodes();
                if (selectedNodes.length>0) {
                    let id = selectedNodes[0].id;
                    let params = {menu_ids:id, act_user_id: this.userInfo.user_id,};
                    API.menuDelApi(params).then((data)=>{
                        this.$Message.success('删除成功');
                        this.loadList();
                    })
                }
            },
            // 清空表单
            resetForm(){
                this.$refs.addMenuForm.resetFields();
                this.addModal.modalData.parent_menu_name = DEFAULT_PARENT_MENU_NAME;
                this.addModal.modalData.prrent_menu_id = DEFAULT_PARENT_MENU_ID;
            }
        },
        created (){
            this.loadList()
        }
	}
</script>
<style lang="scss">
    li.wm-icon{
        vertical-align:top;
        width: 60px;
    }
    .wm-menu-ul{
        width: 100%;
        list-style: none;
    }
    ul.wm-menu-ul li {
        width: 150px;
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        height:32px;
        line-height:34px;
        margin:0 auto;
    
    }
    .wm-menu-ul li.wm-menu-icon {
        width: 20px;
        position: relative;
        padding-top: 4px;
    }
    .wm-menu-ul li.wm-menu-key {
        width: 250px;
    }
    .wm-menu-ul li.wm-menu-name {
        
    }
    .wm-menu-ul li.wm-menu-name span {
        padding-left: 5px;
    }
    .wm-menu-ul li.wm-menu-type {
        width: 100px;
    }
    .wm-menu-ul li.wm-menu-hide {
        width: 100px;
    }
    .wm-menu-ul li.wm-menu-seq {
        width: 100px;
    }
    .wm-menu-ul li.wm-menu-url {
        width: 500px;
    }
    .menu-manage{
        .ivu-tree-arrow{
            line-height: 38px;
        }
        .ivu-tree-arrow-hidden{
            padding-left: 9px;
        }
    }
    .wm-ivu-tree{
        height: auto;
        max-height: 200px;
        overflow: auto;
    }
</style>