<!--侧边栏顶部用户信息-->
<template>
  <scroll-bar>
    <div class="login-header" v-if="sidebar.opened">
      <div class="login-header-img">
        <div class="img-wrap">
          <img :src="headerUrl" alt="">
        </div>
      </div>
      <p class="welcome-text" :title="headerTitle">{{headerTitle}}</p>
    </div>
    <div class="login-header-small" v-else></div>
    <el-menu mode="vertical" unique-opened :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#fff" active-text-color="#409EFF">
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
import header from '@/assets/img/zc.png'

export default {
  data() {
    return {
      headerUrl: header,
      headerTitle: ''
    }
  },
  created() {
    this.headerTitle = '您好！' + JSON.parse(window.sessionStorage.getItem('userInfo')).MemberName + '，欢迎登录'
  },
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .login-header{
    width: 100%;
    height: 120px;
    .login-header-img{
      width: 100%;
      height: 80px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      .img-wrap{
        background: #fff;
        width: 60px;
        height: 60px;
        overflow: hidden;
        border-radius: 50%;
        position: relative;
        margin-top: 18px;
        img{
          width: 62px;
          height: 62px;
          border: 0 none;
          position: absolute;
          top: -1px;
          left: -1px;
        }
      }
    }
    p{
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 14px;
      margin: 0;
      padding: 0;
    }
  }
  .login-header-small{
    width: 100%;
    height: 60px;
  }
  .welcome-text{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #ffffff;
  }
</style>
