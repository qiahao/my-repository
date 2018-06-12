<template>
    <div class="layout" id="layout">
        <!-- layoutheader -->
        <layoutheader @logout="logout"></layoutheader>
        <!-- layout-menu -->
        <div class="layout-menu">
            <layoutmenu :menus="menus" :menus-tree="menusTree"></layoutmenu>
        </div>
        <!-- layout-content -->
        <div class="layout-content">
            <keep-alive include="v2BuildOrder">
                <router-view class="contain"></router-view>
            </keep-alive>
        </div>
    </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { setUserInfo, setPageMenu, setFuncMenu } from '@/store/mutation-types.js';
import * as localStorageMng from '@/utils/local-storage-mng'
import { array2tree } from '@/utils/util'
import layoutheader from './header';
import layoutmenu from './menu';
import devMenus from './menus'

const dev = process.env.NODE_ENV == 'development'
const isTest = process.env.DEV_TEST
export default {
    name: 'layout',
    data: function() {
        return {
            menus: [],
        }
    },
    components: {
        layoutheader,
        layoutmenu
    },
    methods: {
        ...mapMutations({ setUserInfo: setUserInfo, setPageMenu: setPageMenu, setFuncMenu: setFuncMenu }),
        // header methods
        logout() {
            // 清除浏览器存储的用户数据
            localStorageMng.clearUserInfo()
            // 清除store 用户信息
            this.setUserInfo({})
            // 清除页面菜单
            this.setPageMenu([])
            // 清除功能菜单
            this.setFuncMenu([])
            // 重定到登陆
            this.$router.replace({ path: '/login' })
        },
        // 加载菜单
        loadUserMenu() {
            if (dev) {
                this.menus = Object.freeze(devMenus)
                return
            }
            this.$api.userApi.getUserMenuList().then((data) => {
                if (data.resultObj) {
                    let pageMenu = data.resultObj.page_menu || []
                    let funcMenu = data.resultObj.func_menu || []
                    this.menus = pageMenu
                    // 保存页面菜单
                    this.setPageMenu(pageMenu)
                    // 保存功能菜单
                    this.setFuncMenu(funcMenu)
                }
            })
        }
    },
    computed: {
        // 菜单树形列表
        menusTree() {
            return this.menus.length ? array2tree(this.menus) : [];
        },
        ...mapState(['userInfo', 'pageMenu', 'funcMenu'])
    },
    created() {
        this.loadUserMenu();
    }
}
</script>
<style scoped lang="scss">
@import "../../scss/helper/_variable.scss";
.layout {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    min-width: $min-screen-width;
    min-height: $min-screen-height;
    padding-top: $layout-header-height;
    padding-left: $layout-menu-width;
    background: #f5f7f9;
    overflow: hidden;
    .layout-content {
        height: 100%;
        width: 100%;
        background-color: #fff;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .layout-menu {
        float: left;
        position: absolute;
        top: $layout-header-height;
        left: 0;
        bottom: 0;
        width: $layout-menu-width;
        background-color: $title-color;
        line-height: 24px;
        overflow-x: hidden;
    }
}
</style>
<style lang="scss">
.layout-menu {
    .wm-icon {}
}
</style>