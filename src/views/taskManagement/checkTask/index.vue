<!--巡检任务管理-->
<template>
  <div class="app-container">
    <div class="street-wrap">
      <el-tabs v-model="commonTabInfo.activeName" @tab-click="handleClick">
        <el-tab-pane label="巡检总任务列表" name="first" :disabled="commonTabInfo.disabled">
          <checkTask-table></checkTask-table>
        </el-tab-pane>
        <template v-if="commonTabInfo.flag && commonTabInfo.activeName === 'second'">
          <el-tab-pane :label="commonTabInfo.text" name="second">
            <add-checkTask></add-checkTask>
          </el-tab-pane>
        </template>
        <template v-if="commonTabInfo.flag && commonTabInfo.activeName === 'third'">
          <el-tab-pane :label="commonTabInfo.text" name="third">
            <look-checkTaskList></look-checkTaskList>
          </el-tab-pane>
        </template>
        <template v-if="commonTabInfo.flag && commonTabInfo.activeName === 'fifth'">
          <el-tab-pane :label="commonTabInfo.text" name="fifth">
            <to-checkReport></to-checkReport>
          </el-tab-pane>
        </template>
        <template v-if="commonTabInfo.flag && commonTabInfo.activeName === 'sixth'">
          <el-tab-pane :label="commonTabInfo.text" name="sixth">
            <prolong-page></prolong-page>
          </el-tab-pane>
        </template>
        <el-tab-pane label="" name="fourth" disabled></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import CheckTaskTable from './component/checkTaskTable'
  import AddCheckTask from './component/addCheckTask'
  import LookCheckTaskList from './component/checkTaskList'
  import ToCheckReport from './component/toCheckeReport'
  import ProlongPage from './component/prolongPage'
  export default {
    name: 'User',
    data() {
      return {

      }
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    components: {
      'checkTask-table': CheckTaskTable,
      'add-checkTask': AddCheckTask,
      'look-checkTaskList': LookCheckTaskList,
      'to-checkReport': ToCheckReport,
      'prolong-page': ProlongPage
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .street-wrap{
    margin-top: -25px;
  }
  .event-street{
    width: 100%;
    max-height: 750px;
    overflow-y: auto;
  }
</style>
