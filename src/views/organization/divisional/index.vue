<!--部门管理-->
<template>
  <div class="app-container">
    <div class="tabs-wrap">
      <el-tabs v-model="commonTabInfo.tabsName">
        <el-tab-pane label="部门列表" name="first" :disabled="commonTabInfo.tabsName !== 'first'">
         <DivisionalTable />
        </el-tab-pane>
        <template v-if="commonTabInfo.text === '新增部门' || commonTabInfo.text === '编辑部门'">
          <el-tab-pane :label="commonTabInfo.text" name="second">
            <DivisionalInfo />
            <div class="cont-cancel">
              <el-button type="primary" icon="el-icon-close" circle @click.native="eventTab('', 'first', '')"></el-button>
            </div>
          </el-tab-pane>
        </template>
        <template v-if="commonTabInfo.text === '部门排序'">
          <el-tab-pane :label="commonTabInfo.text" name="third">
            <DivisionalSort />
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
  import DivisionalInfo from './component/divisionalInfo'
  import DivisionalTable from './component/divisionalTable'
  import DivisionalSort from './component/divisionalSort'
  export default {
    name: 'Divisional',
    data() {
      return {}
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    components: {
      DivisionalInfo,
      DivisionalTable,
      DivisionalSort
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