<!--菜单管理-->
<template>
  <div class="app-container">
    <div class="tabs-wrap">
      <el-tabs v-model="commonTabInfo.tabsName">
        <el-tab-pane label="车辆进出电子围栏列表" name="first" :disabled="commonTabInfo.tabsName !== 'first'">
         <FencingListTable />
        </el-tab-pane>
        <!-- <template v-if="commonTabInfo.text === '新增车辆' || commonTabInfo.text === '编辑车辆'">
          <el-tab-pane :label="commonTabInfo.text" name="second">
            <CarListInfo />
            <div class="cont-cancel">
              <el-button type="primary" icon="el-icon-close" circle @click.native="eventTab('', 'first', '')"></el-button>
            </div>
          </el-tab-pane>
        </template> -->
      </el-tabs>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import FencingListTable from './component/fencingListTable'
  export default {
    name: 'fencingList',
    data() {
      return {}
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    components: {
      FencingListTable
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