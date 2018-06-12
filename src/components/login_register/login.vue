<template>
    <div class="login">
        <img class="login-logo" src="../../assets/front/logo-1.png" height="60" width="380">
        <div class="login-form">
            <i-form ref="loginForm" :model="user" :rules="formRule" label-position="top">
                <div><span class="fc3">手机号</span> / PhoneNumber </div>
                <Form-item prop="user_mobile">
                    <i-input type="text" placeholder="请输入用户名" v-model="user.user_mobile" @on-enter="doLogin">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </i-input>
                </Form-item>
                <div><span class="fc3">密码</span> / Password</div>
                <Form-item prop="user_pwd">
                    <i-input type="password" placeholder="请输入密码" v-model="user.user_pwd" @on-enter="doLogin">
                        <Icon type="ios-locked-outline" slot="prepend"></Icon>
                    </i-input>
                </Form-item>
                <div class="mb20">
                    <Checkbox-group v-model="staticLogin">
                        <Checkbox label="1">自动登录</Checkbox>
                    </Checkbox-group>
                </div>
                <i-button type="primary" size="large" long @click="doLogin">登录</i-button>
            </i-form>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import validateRule from '@/utils/validate-rule'
const _isDev = process.env.NODE_ENV === 'development';

export default {
    data() {
        return {
            user: {
                user_mobile: _isDev ? '13000000001' : '',
                user_pwd: _isDev ? '123456' : '',
            },
            staticLogin: [],
            btnReady: true,
            formRule: {
                user_mobile: [
                    { required: true, message: '这是必填项', trigger: 'blur' },
                    { pattern:/^1[34578]\d{9}$/, message: '正确输入号码格式', trigger: 'blur' }
                ],
                user_pwd: [
                    { required: true, message: '请填登录密码', trigger: 'blur' },
                    { min: 6, message: '不能少于6位', trigger: 'blur' }
                ],
            }
        }
    },
    methods: {
        ...mapActions(['login']),
        doLogin() {
            const defaultRedirect = '/layout';
            if (!this.btnReady) return;
            this.btnReady = !this.btnReady

            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    
                    this.login(this.user).then(() => {
                        this.$Message.success('登录成功!')
                        setTimeout(() => { this.$router.push(this.$route.params.redirect || defaultRedirect) }, 1000)
                    }).catch((err) => {console.warn(err)});
                }
            })
        }
    },
    watch: {
        // 登陆操作优化
        btnReady(n, o) {
            if (!n) setTimeout(() => { this.btnReady = true }, 1000)
        }
    },
    created() {},
    mounted() {},
}
</script>
<style lang="scss" src="./style.scss"></style>