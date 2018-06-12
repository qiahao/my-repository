<script>
import { Menu, MenuItem, Submenu, Icon } from 'iview'
import { array2tree } from '@/utils/util'

export default {
    name: 'sidebar',
    data() {
        return {
            leaf: Object.freeze(null),
            leafs: Object.freeze([])
            
        }
    },
    // 树形菜单及数组型菜单（后续可以在sidebar组件内生成树形菜单，这样参数只需传递一个）
    props: {
        menusTree: {
          required: true,
          type: Array
        },
        menus: {
          required: true,
          type: Array
        },
        theme: {
          type: String,
          default: 'dark'
        }
    },
    watch: {
        // 路由变化重新渲染菜单
        '$route': function(n) {
            this.initLeaf(n)
	        // 手动更新openItems
            this.$nextTick(() => {
                if (this.$refs.sidebarMenu) {
                    this.$refs.sidebarMenu.updateOpened()
                }
            })
        },
        // 检测menus，确保可以获取到leaf
        menus(n) {
            if (n.length) {
                this.$nextTick(()=>{
                    this.initLeaf(this.$route)
                    this.$nextTick(() => {
                        if (this.$refs.sidebarMenu) {
                            this.$refs.sidebarMenu.updateOpened()
                        }
                    })
                })
            }
        }
    },
    computed: {},
    created () {
    	// 初始化组件时 初始化选中叶节点
   		if (this.menus.length) {
            this.initLeaf(this.$route)
        }
    },
    methods: {
        // 获取选中叶子节点 
        // 获取选中叶子父节点
        initLeaf(route) {
            // 选中的叶节点对象
            let matchLeaf = null
            // 查看菜单中是否有匹配项
            for (let menu of this.menus) {
                route.matched.forEach((r)=>{
                    if (menu.path === r.path) {
                        return matchLeaf = menu
                    }
                })
            }

            let _leafs = []
            let _leaf = matchLeaf
            while (_leaf) {
                let _filterRst
                _leafs.push(_leaf)
                _filterRst = this.menus.filter((obj,i)=>{
                    return _leaf.pid == obj.id
                });
                _leaf = _filterRst[0]
            }
            // 数据整理及回传（layout接收）
            this.$emit('menu-click', { leafs: _leafs, leaf: matchLeaf })
            this.leaf = Object.freeze(matchLeaf)
            this.leafs = Object.freeze(_leafs)
        },
        // 菜单点击事件
        leafClick(menu) {
          this.$router.push(menu.path)
        },
        // 生成菜单JSX语法树
        generator(menusTree) {
            return menusTree.map(menu => {
	            if (menu.children && menu.children.length) {
	                return (<Submenu name = {menu.id} >
		                        <template slot = "title">
			                        <wm-icon type = {menu.icon} ></wm-icon>
		                        	{menu.title}
		                        </template>
		                        { this.generator(menu.children) }
		                    </Submenu>)
                }
                // 节点属性及事件定义
                const data = {
                    nativeOn: {
                        click: this.leafClick.bind(this, menu)
                    },
                    props: {
                        name: menu.id
                    }
                }
                if (menu.pid == 0) {
                    return ( <Menu-item {...data }> <wm-icon type={menu.icon}></wm-icon> { menu.title } </Menu-item>)
                }
                return ( <Menu-item {...data }> { menu.title } </Menu-item>)
	        })
	    },
	    // 第一次点击sidebar菜单会触发三次render，待查
	},
    render(h) {
        let menusJSX = this.generator(this.menusTree)
        // 取出当前选中菜单，并展开其父节点
        let activeName = this.leaf ? this.leaf.id : ''
        let openNames = this.leafs.slice(1).map(r => r.id)
        let data = {
            props: {
                activeName,
                openNames,
                theme: this.theme,
                width: 'auto'
            },
            ref: 'sidebarMenu'
        }
        return ( < Menu {...data } > { menusJSX } < /Menu>)
    }
}

</script>
