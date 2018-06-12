<template>
    <div id="layoutHeader" class="layout-header">
        <img class="logo" src="../../assets/common/logo.png" alt="运吧，好运！">
        <img class="logo-slogan" src="../../assets/common/logo-slogan.png" alt="运吧，专注您的物流效率！">
     
        <div class="fr-info">
            <!-- <i-input v-model="keyword" class="tms-search" icon="search" placeholder="根据单号、姓名、手机号搜索" ></i-input> -->
            <top-search></top-search>

            <!-- <wm-icon type="download" v-if="isWindow" @click.native="setPackageUrl"></wm-icon> -->
            <div class="user-info" @click="toggleUserInfo" v-clickoutside="closeUserInfo">
                <img :src="userInfo.pic_path || defaultAvatar" alt="" >
                <div class="user-panel" v-show="showUserInfo" @click.stop="">
                    <Row class="row1">
                        <Col span="6"><img :src="userInfo.pic_path || defaultAvatar" alt=""></Col>
                        <Col span="18">
                            <p>{{userInfo.company_name}}</p>
                            <p>{{userInfo.user_name}}</p>
                            <p>{{userInfo.role_name}}</p>
                        </Col>
                    </Row>
                    <div class="row2 cf">
                        <i-button size="small" v-if="isWindow" type="text" @click="setPackageUrl">保存到桌面</i-button>
                        <!-- v-if="isWindow" -->
                        <i-button size="small" type="text" class="fr" @click="logout">退出</i-button>
                    </div>
                   
                </div>
            </div>

            <a href="/static/files/helper.pdf" class="vm help-icon" target="_blank" title="帮助文档">
                <Icon type="help-circled" class="fs30"></Icon>
            </a>
            
        </div>
        
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import clickoutside from '@/directives/clickoutside'
    import defaultAvatar from '@/assets/icons/avatar.png'
    import topSearch from './top-search'



    export default {
        name: 'layoutHeader',
        data (){
            return {
                keyword: '',
                packageUrl: '',
                isWindow: true,
                showUserInfo: false,
                defaultAvatar: defaultAvatar,
            } 
        },
        directives: {clickoutside},
        components: {
            topSearch
        },
        computed: {
            ...mapState(['userInfo']),
        },
        methods: {
            logout (){
                this.$emit('logout');
            },
            toggleUserInfo (){
                this.showUserInfo = !this.showUserInfo
            },
            closeUserInfo (){
                if (this.showUserInfo) {
                    this.showUserInfo = false
                }
            },
            setPackageUrl(){
                let agent=navigator.userAgent.toLowerCase();
                if(agent.indexOf("win64")>=0||agent.indexOf("wow64")>=0){
                    this.packageUrl="http://static01.yunba.com/download/运吧专线版64bit安装包.zip";
                }
                else{
                    this.packageUrl="http://static01.yunba.com/download/运吧专线版32bit安装包.zip";             
                }
                window.location.href=this.packageUrl
            },
        },
        created (){
            this.isWindow = navigator.platform.toLowerCase().indexOf('macintel') == -1;
        },
        mounted (){},
    }
</script>
<style scoped lang="scss">
    @import "../../scss/helper/_variable.scss";
    .layout-header{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: $layout-header-height;
        padding: 0 24px 0 15px;
        background: $info-color;
        z-index: 1000;
        color: #fff;
        .logo{
            width: 167px;
            margin-top: 11px;
            margin-right: 54px;
            vertical-align: top;
        }
        .logo-slogan{
            width: 202px;
            margin-top: 16px;
        }
        h2{
            display: inline-block;
            line-height: $layout-header-height;
            font-weight: normal;
        }

        .fr-info{
            float: right;
            margin-top: 10px;
        }
        @at-root .user-info{
            position: relative;
            display: inline-block;
            width: 30px;
            height: 30px;
            color: #333;
            img{
                display: inline-block;
                border-radius: 50%;
                vertical-align: middle;
            }
            &>img{
                width: 30px;
                height: 30px;
                border: 1px solid #fff;
            }
            .user-panel{
                position: absolute;
                z-index: 1001;
                top: 48px;
                right: 0;
                width: 300px;
                border-radius: 8px;
                box-shadow: 1px 5px 8px #999;
                background-color: #FFF;
                font-size: 12px;
                &::after{
                    position: absolute;
                    content: '';
                    display: inline-block;
                    top: -20px;
                    right: 10px;
                    border: 10px solid transparent;
                    border-bottom-color: #fff;
                }
                .row1{
                    height: 74px;
                    padding: 10px;
                    img{
                        width: 48px;
                        height: 48px;
                    }
                }
                .row2{
                    padding: 10px 8px;
                    border-top: 1px solid #e9eaec;

                    button{
                        font-size: 12px;
                        &:hover{
                            color: #495060;
                            border-color: #dddee1;
                            background: #f7f7f7;
                        }
                    }
                }
            }
            
        }
        .help-icon{
            cursor: pointer;
            color: #fff;
            .ivu-icon{
                vertical-align: middle;
            }
        }
    }


    
</style>
<style lang="scss">
    .tms-search{
        width: 346px;
        input{
            height: 36px;
            border-color: #0e62a5;
            background-color: #0e62a5;
            color: #fff;
            font-size: 14px;
            &::-webkit-input-placeholder{
                color: #fff;
            }
        }
        .ivu-icon{
            margin-top: 2px;
            color: #fff;
            font-size: 18px;
        }
    }
</style>