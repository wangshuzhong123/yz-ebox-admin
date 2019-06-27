<!--页面顶部面包屑，菜单伸缩控制，退出登录等-->
<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img class="user-avatar" :src="headerUrl">
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            主页面
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span @click="changePassword">修改密码</span>
        </el-dropdown-item>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog title="修改密码" :visible.sync="changePasswordFlg" @close="closeCallBack" width="400px" top="30vh" :close-on-click-modal="dialogInfo.default" :close-on-press-escape="dialogInfo.default">
      <div>
        <div class="input-wrap">
          <span class="input-title">原密码：</span>
          <div class="el-input-out">
            <el-input v-model="password" type="password" placeholder="请输入密码" :maxlength="16" ref="passWord" clearable></el-input>
          </div>
        </div>
        <div class="input-wrap">
          <span class="input-title">新密码：</span>
          <div class="el-input-out">
            <el-input v-model="newPassword" type="password"  placeholder="请输入新密码" :maxlength="16" ref="newPassWord" clearable></el-input>
          </div>
        </div>
        <div class="input-wrap">
          <span class="input-title">确认密码：</span>
          <div class="el-input-out">
            <el-input v-model="surePassword" type="password" placeholder="请再次输入新密码" :maxlength="16" ref="surePassWord" clearable></el-input>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changePassword">取 消</el-button>
        <el-button type="primary" @click="toChangePassword">确 定</el-button>
      </div>
    </el-dialog>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import md5 from 'md5'
import { updatePassword, loginOut } from '@/api/requestConfig'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import loginOutImg from '@/assets/img/zc.png'
import { setTimeout } from 'timers'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  data() {
    return {
      headerUrl: loginOutImg,
      password: '',
      newPassword: '',
      surePassword: '',
      dialogInfo: {
        default: false // 禁止点击遮罩层关闭
      },
      changePasswordFlg: false
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    // 退出登录
    logout() {
      loginOut().then(res => {
        if (res.status === 'success') {
          this.$message.success('退出登录成功！')
          window.sessionStorage.clear()
          setTimeout(function() {
            window.location.reload()
          }, 2000)
        }
      })
    },
    // 修改密码弹窗显示与隐藏
    changePassword() {
      this.changePasswordFlg = !this.changePasswordFlg
    },
    // 关闭回调
    closeCallBack() {
      this.password = ''
      this.newPassword = ''
      this.surePassword = ''
    },
    // 修改密码
    toChangePassword() {
      if (!this.password) {
        this.$message.warning('密码不能为空，请输入密码')
        this.$refs.passWord.focus()
        return
      }
      if (!this.newPassword) {
        this.$message.warning('新密码不能为空，请输入新密码')
        this.$refs.newPassWord.focus()
        return
      }
      if (!this.surePassword) {
        this.$message.warning('确认密码不能为空，请输入确认密码')
        this.$refs.surePassWord.focus()
        return
      }
      if (this.newPassword !== this.surePassword) {
        this.$message.warning('新密码与确认密码不一致，请重新输入')
        this.newPassword = ''
        this.surePassword = ''
        this.$refs.newPassWord.focus()
        return
      }
      if (this.password === this.newPassword) {
        this.$message.warning('新密码不能与原密码一致')
        return
      }
      var userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
      var needData = {}
      needData.oldPass = md5(this.password)
      needData.newPass = md5(this.newPassword)
      needData.id = userInfo.userId
      updatePassword(needData).then(res => {
        if (res.status === 200) {
          this.$message.success(res.message + '，请重新登录')
          this.changePassword()
          var selfThis = this
          setTimeout(function() {
            selfThis.$store.dispatch('FedLogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            })
          }, 2000)
        } else {
          this.$message.error(res.message)
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
.input-wrap{
  width: 100%;
  padding: 5px 0;
  .input-title{
    display: inline-block;
    width: 80px;
    height: 40px;
    line-height: 40px;
    text-align: right;
  }
  .el-input-out{
    display: inline-block;
    width: 220px;
    height: 40px;
  }
}
</style>

