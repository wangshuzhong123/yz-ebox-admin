<!--巡检任务转移审核-->
<template>
  <div class="app-container">
    <div class="street-wrap">
      <el-tabs v-model="commonTabInfo.activeName" @tab-click="handleClick">
        <el-tab-pane label="巡检任务转移审核" name="first" :disabled="commonTabInfo.disabled">
          <checkTaskChecked-table></checkTaskChecked-table>
        </el-tab-pane>
        <el-tab-pane label="" name="fourth" disabled></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import CheckTaskCheckedTable from './component/checkTaskCheckedTable'
  export default {
    name: 'checkTaskCheckedIndex',
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
      'checkTaskChecked-table': CheckTaskCheckedTable
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
