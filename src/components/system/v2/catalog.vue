<template>
    <div>
        <div class="contain-head">
            <!-- <i-button type="primary" @click='showAddModal'>新增</i-button> -->
            <i-button type="primary" @click='showEditModal'>修改</i-button>
            <!-- <i-button type="primary" @click='showDelModal=!showDelModal'>删除</i-button> -->
            <i-button type="primary" @click='assignMenu'>保存菜单</i-button>
        </div>
        <div class="contain-main">
            <Row>
                <Col span="4">
                <Menu width="auto" ref="menu" :active-name="activeName" @on-select="onSelectMenuItem">
                    <Menu-item v-for="(catalog, index) in catalogList" :name="catalog.catalog_id" :key="catalog">{{catalog.cata_name}}</Menu-item>
                </Menu>
                </Col>
                <Col span="20">
                    <div class="dialog-bd plr-20 choosemanager clearfix">
                        <ul class="ztree" id="permissionztree"></ul>
                    </div>
                </Col>
            </Row>
        </div>

        <!-- 确认对话框 -->
        <Modal ref="catalogModal" v-model="catalogModal.show" :title="catalogModal.title" @on-ok="saveCatatlog">
            <Form ref="catalogForm" :rules="ruleValidate" :model="catalogData" :label-width="100">
                <Form-item label="类别名称：" prop="cata_name">
                    <i-input v-model="catalogData.cata_name" placeholder="输入企业类型名称"></i-input>
                </Form-item>
            </Form>
        </Modal>

        <!-- 删除确认对话框 -->
        <Modal v-model="showDelModal" title="系统提示" @on-ok="delCatalog">
            <p>您是否确认删除该企业类型</p>
        </Modal>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import * as API from '@/api/src/sysCatalogApi'
import { utilCookie } from '@/utils/util'
import { COOKIES } from '@/utils/constant'
import rule from '@/utils/validate-rule'
import { copySameNamePropety } from '@/utils/util'
import zTree from '@/lib/ztree/jquery.ztree.all.min.js'
import '@/lib/ztree/zTreeStyle.css'



export default {
    name: 'menuList',
    data() {
        return {
            activeName: null,       // 菜单激活名称
            objtree: null,          // ztree对象
            showDelModal: false,    // 显示删除对话框
            //catalog_id: '',         // 企业菜单ID
            catalogList: [],        // 企业菜单列表数据
            catalogModal: {         // 显示新增/编辑对话框
                show: false,
                title: '新增',
                type: 0,            // 0 新增 1 编辑
            },
            catalogData: {          // 企业菜单数据模型
                catalog_id: null,
                cata_name: null,
            },
            ruleValidate: {
                cata_name: [
                    rule.required({ message: '类别名称不能为空' }),
                    rule.max({ max: 20, message: '类别名称长度不能超过20字符' })
                ],
            }
        }
    },
    computed: {
        ...mapState(['userInfo'])
    },
    methods: {
        // 加载企业菜单
        loadCatalogList() {
            let _vm = this;
            API.getCatalogListApi({ act_user_id: this.userInfo.user_id }).then(json => {
                this.catalogList = json.resultObj;

                this.$nextTick(function () {
                    if (_vm.catalogList && _vm.catalogList.length > 0) {
                        let id = _vm.catalogList[0].catalog_id;
                        _vm.catalogData.catalog_id = id;
                        _vm.activeName = id;
                        //_vm.$refs.menu.updateActiveName();
                        _vm.loadTreeList(id);
                    }
                })
            })
        },
        // 加载菜单
        loadTreeList(catalog_id) {
            API.queryAllMenuApi({ act_user_id: this.userInfo.user_id, parent_menu_id: '0', catalog_id: catalog_id }).then(json => {
                this.buildTree(json.resultObj);
            })
        },
        // 设置ztree属性
        buildTree(list){
            const that = this
            const setting = {
                isSimpleData : true,              
                data:{
                    key:{
                        name:"menu_name",
                    },
                    simpleData: {
                            enable: true,
                            idKey:"menu_id",
                            pIdKey:"parent_menu_id",
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
            this.objtree = $.fn.zTree.init($("#permissionztree.ztree"),setting, this.buildTreeData(list))
        },
        // 构建菜单树数据
        buildTreeData(list) {
            if (list != null && list.length > 0) {
                let len = list.length;
                let newMenuList = []
                for (var i = 0; i < len; i++) {
                    let menu = list[i];
                    let menuParentId = menu.parent_menu_id;
                    let menuId = menu.menu_id;
                    let menuName = menu.menu_name;
                    let menuUrl = menu.menu_url;
                    let menuKey = menu.menu_key ? menu.menu_key : '';
                    let menuIcon = menu.icon;
                    let menuType = menu.is_private ? menu.is_private : '';
                    let menuHide = menu.is_hide;
                    let menuSeq = menu.seq ? menu.seq : 1;
                    let isSelected = menu.is_selected;
                    let children = menu.children;

                    let menuObj = { "menu_id": menuId, "parent_menu_id": menuParentId, "menu_name": menuName/*, "iconSkin": 'wm-icon '+menuIcon*/ };

                    if (isSelected == '1') {
                        menuObj.checked = true;
                    }
                    let childList = this.buildTreeData(children);
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
        // 企业菜单选中事件
        onSelectMenuItem(name) {
            this.loadTreeList(name);
            this.catalogData.catalog_id = name;
        },
        // 分配菜单
        assignMenu() {

            let menu_ids = [];
            let catalog_id = this.catalogData.catalog_id;
            if (catalog_id == null || catalog_id == '') {
                this.$Message.warning('请选择企业类型');
                return;
            }

            let checkedTreeNodes = this.objtree.getCheckedNodes();
            if (checkedTreeNodes && checkedTreeNodes.length > 0) {
                let len = checkedTreeNodes.length;
                for (let i = 0; i < len; i++) {
                    let node = checkedTreeNodes[i];
                    menu_ids.push(node.menu_id);
                }
            }
            API.assignMenu({ act_user_id: this.userInfo.user_id, menu_ids: menu_ids.join(","), catalog_id: catalog_id }).then(json => {
                this.$Message.success('保存成功');

            })
        },
        // 显示新增对话框
        showAddModal() {
            this.catalogModal.show = true;
            this.catalogModal.title = '新增';
            this.catalogModal.type = 0;
            this.catalogModal.catalog_id = null;
            this.$refs.catalogForm.resetFields();
        },
        // 显示编辑对话框
        showEditModal() {
            let catalog_id = this.catalogData.catalog_id;
            if (catalog_id && this.catalogList) {
                this.catalogModal.show = true;
                this.catalogModal.title = '编辑';
                this.catalogModal.type = 1;
                let len = this.catalogList.length;
                for (let i = 0; i < len; i++) {
                    if (this.catalogList[i].catalog_id == this.catalogData.catalog_id) {
                        this.catalogData.cata_name = this.catalogList[i].cata_name;
                        break;
                    }
                }
            } else {
                this.$Message.warning('请选择企业类型');
            }
        },
        // 保存企业菜单
        saveCatatlog() {
            this.$refs.catalogForm.validate((valid) => {
                this.catalogModal.show = true
                this.$refs.catalogModal.visible = true
                if (valid) {
                    let params = { ...this.catalogData, act_user_id: this.userInfo.user_id, };
                    if (this.catalogModal.type == 0) {
                        API.catalogAddApi(params).then((data) => {
                            this.catalogModal.show = false
                            this.$refs.catalogModal.visible = false
                            this.loadCatalogList();
                            this.$Message.success('保存成功')
                        })
                    } else {
                        API.catalogUpdateApi(params).then((data) => {
                            this.catalogModal.show = false
                            this.$refs.catalogModal.visible = false
                            this.loadCatalogList()
                            this.$Message.success('保存成功')
                        })
                    }

                }
            });
        },
        // 删除企业菜单
        delCatalog() {
            let catalog_id = this.catalogData.catalog_id;
            if (catalog_id && this.catalogList) {
                let params = { catalog_ids: catalog_id, act_user_id: this.userInfo.user_id, };
                API.catalogDelApi(params).then((data) => {
                    this.loadCatalogList();
                    this.$Message.success('删除成功')
                })
            } else {
                this.$Message.warning('请选择企业类型');
            }
        }
    },
    created() {
        this.loadCatalogList();
    }
}
</script>
<style lang="scss">
    .ztree li span.button.ico_docu {
        vertical-align: middle !important;
    }
    .ztree li span.button.ico_open {
        vertical-align: middle !important;
    }
    .ztree li span.button.ico_close {
        vertical-align: middle !important;
    }
</style>