<template>
	<div>
        <div class="contain-main">
            <Row>
                <Col span="4" class="dept-tree">
                    <Row class="dept-name">
                        <span>
                            <Icon type="home" ></Icon>
                            机构部门
                        </span>
                    </Row>
                    <Row>
                        <div class="dialog-bd plr-20 choosemanager clearfix">
                            <ul class="ztree" id="treeDept"></ul>
                        </div>
                    </Row>
                </Col>
                <Col span="20">
                    <Row class="dept-name">
                        <span>
                            <Icon type="home" ></Icon>
                            {{deptParentNode.title}}
                        </span>
                        <i-button  type="primary" size="small" @click='editDept'><icon type="edit"></icon></i-button>
                    </Row>
                    <Row class="row">
                        <Row>
                            <span class="subtitle">
                                <Icon type="merge" class="subtitle-icon"></Icon>
                                下级部门
                            </span>
                            <i-button  type="primary" size="small" @click='addSubDept'>添加子部门</i-button>
                        </Row>
                        <Row class="row-table">
                            <i-table highlight-row :data="this.deptChildNodes" :columns="subdeptColumns" ></i-table>
                        </Row>
                    </Row>
                    <Row  class="row">
                        <staff-list ref="userTable"></staff-list>
                    </Row>
                </Col>
            </Row>
        </div>

        <Modal ref="deptModel" v-model="deptModal.show" :title="deptModal.title" @on-ok="saveDept">
            <Form ref="deptForm" :rules="deptRuleValidate" :model="deptFormData" :label-width="130">
                <Form-item label="组织机构名称：" prop="dept_name">
                    <i-input v-model="deptFormData.dept_name" placeholder="输入组织机构名称"></i-input>
                </Form-item>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    import * as DEPT_API from '@/api/src/sysDeptApi'
    import * as USER_API from '@/api/src/userApi'
    import { utilCookie } from '@/utils/util'
    import { COOKIES } from '@/utils/constant'
    import rule from '@/utils/validate-rule'
    import {copySameNamePropety} from '@/utils/util'
    import staffList from '@/components/system/v2/staffList'
    import zTree from '@/lib/ztree/jquery.ztree.all.min.js'
    import '@/lib/ztree/zTreeStyle.css'
    

    
	export default {
		name: 'deptList',
		data (){
			return {
                treeDeptObj: null,      // 部门树对象
                deptList: [],           // 部门列表
                subdeptColumns: [       // 子部门表格列
                    { title: '部门名称',
                        render: (h,params)=>{
                            let row = params.row;
                            return h('span',row.dept_name + '(' + row.user_count + ')')
                        }
                    },

                ],
                deptModal: {            // 显示新增/编辑
                    title: '新增',
                    show: false,
                    type: 0, // 0新增 1编辑 2子部门
                },
                deptFormData: {         // 表单模型
                    id: null,
                    parent_id: '0',
                    dept_name: null,
                },
                deptParentNode: {},     // 当前选中的部门节点
                deptChildNodes: [],     // 当前选中的孩子节点
                deptRuleValidate: {     // 表单验证
                    dept_name: [
                        rule.required({message: '部门机构名称不能为空'}),
                        rule.max({max: 100, message: '部门机构名称长度不能超过100字符'}),
                    ],
                },
			}
		},
        computed: {
            ...mapState(['userInfo'])
        },
        components: {
            staffList
        },
		methods: {
            // 加载部门树
            loadDeptList() {
                // 生成树
                DEPT_API.getAllDeptByUserId({act_user_id:this.userInfo.user_id}).then(json=>{
                    this.deptList = this.buildTreeDept(json.resultObj);
                    this.treeDeptObj = this.buildTree("treeDept", this.deptList)
                    if (this.deptList && this.deptList.length>0) {
                        let id = this.deptList[0].id;
                        var node = this.treeDeptObj.getNodeByParam('id', id);//获取id为1的点  
                        this.treeDeptObj.selectNode(node);//选择点
                        this.treeDeptObj.setting.callback.onClick(null, this.treeDeptObj.setting.treeId, node);
                        this.treeDeptObj.expandNode(node, true, false, false);
                    }
                })
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
                            enable: false,
                            chkboxType : {"Y": "ps", "N": "s"}
                        },
                        callback:{
                            onClick (event,treeId,treeNode,clickFlag){
                                that.changeDept(treeNode)
                            }
                        }
                }
                return $.fn.zTree.init($("#" + treeId + ".ztree"), setting, list)
            },
            // 构建部门树JSON数据
            buildTreeDept(list) {
                if (list != null && list.length>0) {
                    let len = list.length;
                    let newDeptList = []
                    for (var i = 0; i < len; i++) {
                        let dept     = list[i];
                        let deptId   = dept.id;
                        let parentId = dept.parent_id;
                        let userCount = dept.user_count;
                        let deptName = dept.dept_name ;
                        let children = dept.children;

                        let deptObj = {"id": deptId, "title": deptName, "parent_id": parentId, dept_name: deptName, user_count: userCount};
                        let childList = this.buildTreeDept(children);
                        if (childList != null && childList.length>0) {
                            deptObj.children = childList;
                        }
                        newDeptList[i] = deptObj;

                    }
                    return newDeptList;
                }else{
                    return null;
                }
            },
            // 清空表单
            clearDeptForm(){
                this.$refs.deptForm.resetFields();
            },
            // 显示编辑对话框
            editDept() {
                this.deptModal.show  = true;
                this.deptModal.title = '编辑';
                this.deptModal.type  = 1;

                this.clearDeptForm();
                copySameNamePropety(this.deptFormData, this.deptParentNode);
                this.deptFormData.id        = this.deptParentNode.id;
                this.deptFormData.parent_id = this.deptParentNode.parent_id || "0";
                this.deptFormData.dept_name = this.deptParentNode.title;
            },
            // 显示新增子级对话框
            addSubDept() {
                this.deptModal.show  = true;
                this.deptModal.title = '添加子部门';
                this.deptModal.type  = 0;

                this.clearDeptForm();
                // 设置父ID
                this.deptFormData.parent_id = this.deptParentNode.id;
            },
            // 保存部门信息
            saveDept(){
                this.deptModal.show = true
                this.$refs.deptModel.visible = true
                this.$refs.deptForm.validate((valid) => {
                    if (valid) {
                        // 新增
                        if (this.deptModal.type == 0) {
                            if (!this.deptFormData.parent_id) {
                                this.deptFormData.parent_id = "0";
                            }
                            let params = {...this.deptFormData, act_user_id: this.userInfo.user_id }
                            DEPT_API.deptAddApi(params).then(json=>{
                                let node = {
                                    id : json.resultObj,
                                    title: this.deptFormData.dept_name,
                                    parent_id: this.deptFormData.parent_id,
                                    dept_name: this.deptFormData.dept_name,
                                    user_count: 0
                                }
                                this.deptChildNodes.push(node);
                                this.treeDeptObj.addNodes(this.deptParentNode, node)
                                this.deptModal.show = false
                                this.$refs.deptModel.visible = false
                                this.$Message.success('保存成功')
                            })
                        // 编辑
                        }else{
                            let params = {...this.deptFormData, act_user_id: this.userInfo.user_id }
                            DEPT_API.deptUpdateApi(params).then(json=>{
                                let nodes = this.treeDeptObj.getSelectedNodes();
                                if (nodes && nodes.length > 0) {
                                    nodes[0].title = this.deptFormData.dept_name;
                                    this.treeDeptObj.updateNode(nodes[0]);
                                }
                                this.deptModal.show = false
                                this.$refs.deptModel.visible = false
                                this.$Message.success('保存成功')
                            })
                        }
                    }
                })
            },
            // 部门树选中状态变化时触发事件
            changeDept(node) {
                this.deptParentNode = node;
                console.log('node',node)
                console.log('node.children',node.children)
                this.deptChildNodes  = node.children?node.children:[];
                this.$refs.userTable.reloadList(node.id, node.title);
            }
        },
        created (){
            this.loadDeptList();
        }
	}
</script>
<style lang="scss">
    .dept-name { color: #464c5b; font-size: 25px; font-weight: bold; }
    .row {padding-top: 20px; padding-bottom: 3px;}
    .row-table { padding-top: 5px;}
    .subtitle {font-size: 18px; font-weight: bold; padding-right: 10px;}
    .subtitle-icon {padding-right: 5px;}
    .split-line {border-left: solid 1px; color: #464c5b;}
</style>