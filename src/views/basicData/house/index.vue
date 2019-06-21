<!--房屋管理-->
<template>
  <div class="app-container">
    <div class="tabs-wrap">
      <el-tabs v-model="commonTabInfo.activeName" @tab-click="handleClick">
        <el-tab-pane label="房屋列表" name="first" :disabled="commonTabInfo.disabled">
          <house-table></house-table>
        </el-tab-pane>
        <template v-if="commonTabInfo.flag">
          <el-tab-pane :label="commonTabInfo.text" name="second">
            <house-info></house-info>
          </el-tab-pane>
        </template>
        <el-tab-pane label="帮助" name="third" :disabled="commonTabInfo.disabled">
          开发中，敬请期待。。。
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import HouseTable from './component/houseTable'
  import houseInfo from './component/houseInfo'
  export default {
    name: 'House',
    data() {
      return {
        eventFlag: false,
        secondLable: ''
      }
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    components: {
      'house-table': HouseTable,
      'house-info': houseInfo
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  
</style>
