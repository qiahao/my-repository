<template>
	<div>
        <Dropdown trigger="custom" :visible="treeRoleShow" width="100%">
            <a href="javascript:void(0)" @click="treeRoleShow = !treeRoleShow">
                {{modelData.role_name}}
                <Icon type="arrow-down-b"></Icon>
            </a>
            <Dropdown-menu slot="list" style="margin-left: 10px;">
                <Tree ref="treeRoleObj" :data="treeRoleList" class="wm-ivu-tree"></Tree>
                <div style="text-align: right;margin:10px;">
                    <Button type="primary" size="small" @click="treeRoleOk">确定</Button>
                </div>
            </Dropdown-menu>
        </Dropdown>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    import * as API from '@/api/src/sysRoleApi'
    import { utilCookie } from '@/utils/util'
    import { COOKIES } from '@/utils/constant'
    import rule from '@/utils/validate-rule'
    import {copySameNamePropety} from '@/utils/util'
    

    
	export default {
		name: 'roleDropDownTree',
		data (){
			return {
                treeRoleShow: false,        // 显示/隐藏下拉框
                treeRoleList: [],           // 角色数据
                modelData: {                // 数据模型
                    role_id:'',
                    role_name: '选择角色'
                }
			}
		},
        computed: {
            ...mapState(['userInfo'])
        },
		methods: {
            // 加载数据
            loadRoleList(userId) {
                API.getAllRoleListApi({act_user_id:this.userInfo.user_id, user_id: userId}).then(json=>{
                    this.treeRoleList = this.buildTreeRole(json.resultObj);
                    if (this.treeRoleList == null) {
                        this.treeRoleList = [];
                    }
                })
            },
            // 构建下拉角色树
            buildTreeRole(list) {
                if (list != null && list.length>0) {
                    let len = list.length;
                    let newRoleList = []
                    let roleNames = [];
                    for (var i = 0; i < len; i++) {
                        let role = list[i];
                        let roleId = role.role_id;
                        let roleName = role.role_name;
                        let children = role.children;
                        let isSelected = role.is_selected;

                        let roleObj = {"id": roleId, "title": roleName};
                        if (isSelected && isSelected == '1') {
                            roleObj.checked = true;
                            roleObj.selected = true;
                            roleNames.push(roleName);
                        }
                        let childList = this.buildTreeRole(children);
                        if (childList != null && childList.length>0) {
                            roleObj.children = childList;
                        }
                        newRoleList[i] = roleObj;

                    }
                    if(roleNames && roleNames.length>0) {
                        this.modelData.role_name = roleNames.join(',');
                    }else{
                        this.modelData.role_name = '选择角色';
                        this.modelData.role_id = '';
                    }
                    return newRoleList;
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
                    this.modelData.role_id = ids;
                    this.modelData.role_name = names;
                }else{
                    this.modelData.role_name = '选择角色';
                    this.modelData.role_id = '';
                }
            },
            // 确认选择
            treeRoleOk() {
                this.treeRoleShow = false;
                let nodes = this.$refs.treeRoleObj.getSelectedNodes();
                if (nodes && nodes.length>0) {
                    let roleNames = [];
                    let roleIds = [];
                    nodes.forEach(function(item) {
                        roleNames.push(item.title);
                        roleIds.push(item.id);
                    })
                    this.modelData.role_name = roleNames.join(',');
                    this.modelData.role_id = roleIds.join(',');
                }
                this.$emit('onRoleSelect', this.modelData)
            }
        },
        watch:{
            
        },
        created (){
            this.loadRoleList();
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