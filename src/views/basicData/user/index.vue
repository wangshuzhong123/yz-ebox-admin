<!--菜单管理-->
<template>
  <div class="app-container">
    <div class="tabs-wrap">
      <el-tabs v-model="commonTabInfo.tabsName">
        <el-tab-pane label="用户列表" name="first" :disabled="commonTabInfo.tabsName !== 'first'">
         <UserTable />
        </el-tab-pane>
        <template v-if="commonTabInfo.text === '新增用户' || commonTabInfo.text === '编辑用户'">
          <el-tab-pane :label="commonTabInfo.text" name="second">
            <UserInfo />
            <div class="cont-cancel">
              <el-button type="primary" icon="el-icon-close" circle @click.native="eventTab('', 'first', '')"></el-button>
            </div>
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import UserInfo from './component/userInfo'
  import UserTable from './component/userTable'
  export default {
    name: 'User',
    data() {
      return {}
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    components: {
      UserInfo,
      UserTable
    },
    methods: {
      // tabs操作
      eventTab(text, tabsName, custom) {
        this.$store.dispatch('handleTabInfo', {
          text: text,
          tabsName: tabsName,
          custom: custom
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
 
</style>