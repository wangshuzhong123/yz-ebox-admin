<!--菜单管理-->
<template>
  <div class="app-container">
    <div class="street-wrap">
      <el-tabs v-model="commonTabInfo.activeName" @tab-click="handleClick">
        <el-tab-pane label="街道列表" name="first" :disabled="commonTabInfo.disabled">
         <div>第一个</div>
        </el-tab-pane>
        <template v-if="commonTabInfo.flag">
          <el-tab-pane :label="commonTabInfo.text" name="second">
            <div>第二个</div>
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
//   import StreetTable from './component/streetTable'
//   import StreetEvent from './component/addStreet'
  console.log(mapGetters)
  export default {
    name: 'Meun',
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
    methods: {
      handleClick(tab, event) {
        console.log(tab, event)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .street-wrap{
    margin-top: -10px;
  }
</style>
