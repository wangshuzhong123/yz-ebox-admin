<!--菜单管理-->
<template>
  <div class="app-container">
    <div class="tabs-wrap">
      <el-tabs v-model="commonTabInfo.tabsName">
        <el-tab-pane label="作业列表" name="first" :disabled="commonTabInfo.tabsName !== 'first'">
         <TaskListTable />
        </el-tab-pane>
        <template v-if="commonTabInfo.text === '新增作业' || commonTabInfo.text === '编辑作业'">
          <el-tab-pane :label="commonTabInfo.text" name="second">
            <TaskListInfo />
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
  import TaskListInfo from './component/taskListInfo'
  import TaskListTable from './component/taskListTable'
  export default {
    name: 'TaskList',
    data() {
      return {}
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    components: {
      TaskListInfo,
      TaskListTable
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