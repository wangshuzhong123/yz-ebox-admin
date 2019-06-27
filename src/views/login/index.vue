<!--登录页面-->
<template>
  <div class="login-body">
    <div class="login-form">
      <h3 class="login-form-title">驿站云平台</h3>
      <div class="login-input-wrap">
        <span class="login-userName"></span>
        <input v-model="userName" type="text" placeholder="请输入用户名" @keyup.enter="submitForm" maxlength="20"/>
      </div>
      <div class="login-input-wrap">
        <span class="login-password"></span>
        <input v-model="password" type="password" placeholder="请输入密码" @keyup.enter="submitForm" maxlength="16"/>
      </div>
      <div class="login-error-tip">
        <p v-text="loginTip"></p>
      </div>
      <div class="login-sure">
        <el-button type="primary" :loading="loginLoading" @click.native.prevent="submitForm">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  // import md5 from 'md5'
  import { loginApi, getMenuInfo } from '@/api/requestConfig'

  export default {
    name: 'login',
    data() {
      return {
        userName: '',
        password: '',
        loginLoading: false,
        loginTip: ''
      }
    },
    methods: {
      submitForm() {
        if (this.userName === '') {
          this.loginTip = '请输入用户名'
          return
        }
        if (this.password === '') {
          this.loginTip = '请输入密码'
          return
        }
        if (this.password.length < 3) {
          this.loginTip = '密码长度不得小于三位'
          return
        }
        this.loginTip = ''
        var needData = {
          MemberName: this.userName,
          Passwords: this.password
        }
        this.loginLoading = true
        loginApi(needData).then(res => {
          window.sessionStorage.setItem('Admin-Token', this.userName)
          window.sessionStorage.setItem('userInfo', JSON.stringify(res.data))
          getMenuInfo().then(menuRes => {
            if (menuRes.data) {
              window.sessionStorage.setItem('roleMenu', JSON.stringify(menuRes.data)) // 存储菜单数据
              window.sessionStorage.setItem('menuFlag', 'none')
              this.$router.push({ path: '/' })
            }
            this.loginLoading = false
          }).catch(error => {
            this.loginLoading = false
            this.$message.error(error)
          })
        }).catch(() => {
          this.loginLoading = false
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/mixin.scss";
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;
  html,body{
    width: 100%;
    height: 100%;
  }
  #app{
    width: 100%;
    height: 100%;
  }
  .login-body{
    width: 100%;
    height: 100%;
    position: relative;
    background: $bg;
    font-size: 14px;
    .login-form{
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 400px;
      height: 400px;
      padding: 30px;
    }
    .login-form-title{
      width: 100%;
      font-size: 26px;
      color: #fff;
      text-align: center;
      height: 30px;
      line-height: 30px;
    }
    .login-input-wrap{
      width: 340px;
      margin-bottom: 15px;
      border: 1px solid $light_gray;
      border-radius: 5px;
      height: 46px;
      background: #fff;
      overflow: hidden;
    }
    .login-input-wrap span{
      float: left;
      width: 40px;
      height: 46px;
    }
    .login-input-wrap input{
      float: left;
      background: transparent;
      width: 296px;
      height: 46px;
      border: 0 none;
      outline: none;
      color: #323232;
    }
    .login-userName{
      background: url('../../assets/img/username.png') no-repeat center center;
    }
    .login-password{
      background: url('../../assets/img/password.png') no-repeat center center;
    }
    .login-error-tip{
      width: 100%;
      height: 30px;
      line-height: 30px;
      color: #f56c6c;
      font-size: 12px;
      margin-bottom: 15px;
    }
    .login-sure{
      width: 100%;
      height: 46px;
    }
    .login-sure button{
      width: 100%;
      height: 46px;
    }
  }
</style>
