<template>
	<div>
        <Dropdown trigger="custom" :visible="treeDeptShow" width="100%" height="50">
            <a href="javascript:void(0)" @click="treeDeptShow = !treeDeptShow">
                {{modelData.dept_name}}
                <Icon type="arrow-down-b"></Icon>
            </a>
            <Dropdown-menu slot="list" style="margin-left: 10px;">
                <Tree ref="treeDeptObj" :data="treeDeptList" class="wm-ivu-tree"></Tree>
                <div style="text-align: right;margin:10px;">
                    <Button type="primary" size="small" @click="treeDeptOk">确定</Button>
                </div>
            </Dropdown-menu>
        </Dropdown>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    import * as API from '@/api/src/sysDeptApi'
    import { utilCookie } from '@/utils/util'
    import { COOKIES } from '@/utils/constant'
    import rule from '@/utils/validate-rule'
    import {copySameNamePropety} from '@/utils/util'
    

    
	export default {
		name: 'deptDropDownTree',
		data (){
			return {
                treeDeptShow: false,    // 显示/隐藏下拉框
                treeDeptList: [],       // 部门树数据
                modelData: {            // 数据模型
                    dept_id:'',
                    dept_name: '选择部门'
                }
			}
		},
        computed: {
            ...mapState(['userInfo'])
        },
		methods: {
            // 加载数据
            loadDeptList(userId) {

                API.getAllDeptByUserId({act_user_id:this.userInfo.user_id, user_id: userId}).then(json=>{
                    this.treeDeptList = this.buildTreeDept(json.resultObj);
                    if (this.treeDeptList == null) {
                        this.treeDeptList = [];
                    }
                })
            },
            // 构建下拉部门树
            buildTreeDept(list) {
                if (list != null && list.length>0) {
                    let len = list.length;
                    let newDeptList = [];
                    let deptNames = [];
                    let deptIds = [];
                    for (var i = 0; i < len; i++) {
                        let dept = list[i];
                        let deptId = dept.id;
                        let deptName = dept.dept_name;
                        let totalUsers = dept.total_users;
                        let children = dept.children;
                        let isSelected = dept.is_selected;

                        let deptObj = {"id": deptId, "title": deptName, expand: true};
                        if (isSelected && isSelected == '1') {
                            deptObj.checked = true;
                            deptObj.selected = true;
                            deptNames.push(deptName);
                            deptIds.push(deptId);
                        }
                        let childList = this.buildTreeDept(children);
                        if (childList != null && childList.length>0) {
                            deptObj.children = childList;
                        }
                        newDeptList[i] = deptObj;

                    }
                    if (deptNames && deptNames.length>0) {
                        this.modelData.dept_name = deptNames.join(',');
                        this.modelData.dept_id = deptIds.join(',');
                    }else{
                        this.modelData.dept_id = '';
                        this.modelData.dept_name = '选择部门';
                    }
                    return newDeptList;
                }else{
                    return null;
                }
            },
            // 获取选中节点
            getSelected(){
                return this.modelData;
            },
            // 设置选中的节点
            setSelected(ids, names){
                if (ids) {
                    this.modelData.dept_id = ids;
                    this.modelData.dept_name = names;
                }else{
                    this.modelData.dept_id = '';
                    this.modelData.dept_name = '选择部门';
                }
            },
            // 确认选择
            treeDeptOk() {
                this.treeDeptShow = false;
                let nodes = this.$refs.treeDeptObj.getSelectedNodes();
                if (nodes && nodes.length>0) {
                    let deptNames = [];
                    let deptIds = [];
                    nodes.forEach(function(item) {
                        deptNames.push(item.title);
                        deptIds.push(item.id);
                    })
                    this.modelData.dept_name = deptNames.join(',');
                    this.modelData.dept_id = deptIds.join(',');
                }
                // 触发事件
                this.$emit('onDeptSelect', this.modelData)
            }
        },
        created (){
            this.loadDeptList();
        }
	}
</script>
<style lang="scss">
    .wm-ivu-tree{
        height: auto;
        max-height: 200px;
        overflow: auto;
    }
</style>