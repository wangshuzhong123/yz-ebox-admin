<!--菜单管理-->
<template>
  <div class="app-container">
    <div class="tabs-wrap">
      <el-tabs v-model="commonTabInfo.tabsName">
        <el-tab-pane label="角色列表" name="first" :disabled="commonTabInfo.tabsName !== 'first'">
         <RoleTable />
        </el-tab-pane>
        <template v-if="commonTabInfo.text === '新增角色' || commonTabInfo.text === '编辑角色'">
          <el-tab-pane :label="commonTabInfo.text" name="second">
            <RoleInfo />
            <div class="cont-cancel">
              <el-button type="primary" icon="el-icon-close" circle @click.native="eventTab('', 'first', '')"></el-button>
            </div>
          </el-tab-pane>
        </template>
        <template v-if="commonTabInfo.text === '角色权限'">
          <el-tab-pane :label="commonTabInfo.text" name="third">
            <RoleLimit />
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
  import RoleInfo from './component/roleInfo'
  import RoleTable from './component/roleTable'
  import RoleLimit from './component/roleLimit'
  export default {
    name: 'Role',
    data() {
      return {}
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    components: {
      RoleInfo,
      RoleTable,
      RoleLimit
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