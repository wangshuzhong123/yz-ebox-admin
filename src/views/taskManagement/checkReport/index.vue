<!--巡检报告管理-->
<template>
  <div class="app-container">
    <div class="street-wrap">
      <el-tabs v-model="commonTabInfo.activeName" @tab-click="handleClick">
        <el-tab-pane label="巡检报告管理" name="first" :disabled="commonTabInfo.disabled">
          <checkReport-table></checkReport-table>
        </el-tab-pane>
        <template v-if="commonTabInfo.flag && commonTabInfo.activeName === 'second'">
          <el-tab-pane :label="commonTabInfo.text" name="second">
            <to-checkReport></to-checkReport>
          </el-tab-pane>
        </template>
        <el-tab-pane label="" name="fourth" disabled></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import CheckReportTable from './component/checkReportTable'
  import ToCheckReport from './component/toCheckeReport'
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
      'checkReport-table': CheckReportTable,
      'to-checkReport': ToCheckReport
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
