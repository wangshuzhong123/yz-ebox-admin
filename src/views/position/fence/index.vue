<!--菜单管理-->
<template>
  <div class="app-container">
    <div class="tabs-wrap">
      <el-tabs v-model="commonTabInfo.tabsName">
        <el-tab-pane label="电子围栏列表" name="first" :disabled="commonTabInfo.tabsName !== 'first'">
         <FenceTable />
        </el-tab-pane>
        <template v-if="commonTabInfo.text === '新增电子围栏' || commonTabInfo.text === '编辑电子围栏'">
          <el-tab-pane :label="commonTabInfo.text" name="second">
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
  import FenceTable from './component/fenceTable'
  export default {
    name: 'Fence',
    data() {
      return {}
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    components: {
      FenceTable
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