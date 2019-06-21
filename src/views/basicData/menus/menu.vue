<!--菜单管理-->
<template>
  <div class="app-container">
    <div class="tabs-wrap">
      <el-tabs v-model="commonTabInfo.tabsName">
        <el-tab-pane label="菜单列表" name="first" :disabled="commonTabInfo.tabsName !== 'first'">
         <MenuTable />
        </el-tab-pane>
        <template v-if="commonTabInfo.text === '新增菜单' || commonTabInfo.text === '编辑菜单'">
          <el-tab-pane :label="commonTabInfo.text" name="second">
            <MenuInfo />
            <div class="cont-cancel">
              <el-button type="primary" icon="el-icon-close" circle @click.native="eventTab('', 'first', '')"></el-button>
            </div>
          </el-tab-pane>
        </template>
        <template v-if="commonTabInfo.text === '菜单排序'">
          <el-tab-pane :label="commonTabInfo.text" name="third">
            <MenuSort />
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
  import MenuInfo from './component/menuInfo'
  import MenuTable from './component/menuTable'
  import MenuSort from './component/menuSort'
  export default {
    name: 'Menu',
    data() {
      return {}
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    components: {
      MenuInfo,
      MenuTable,
      MenuSort
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