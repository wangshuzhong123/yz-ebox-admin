<!--客户组织管理-->
<template>
  <div class="app-container">
    <div class="tabs-wrap">
      <el-tabs v-model="commonTabInfo.tabsName">
        <el-tab-pane label="客户组织列表" name="first" :disabled="commonTabInfo.tabsName !== 'first'">
         <CusTomerCompanyTable />
        </el-tab-pane>
        <template v-if="commonTabInfo.text === '新增客户组织' || commonTabInfo.text === '编辑客户组织'">
          <el-tab-pane :label="commonTabInfo.text" name="second">
            <CusTomerCompanyInfo />
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
  import CusTomerCompanyInfo from './component/customerCompanyInfo'
  import CusTomerCompanyTable from './component/customerCompanyTable'
  export default {
    name: 'CustomerCompany',
    data() {
      return {}
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    components: {
      CusTomerCompanyInfo,
      CusTomerCompanyTable
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