<!--菜单管理-->
<template>
  <div class="app-container">
    <div class="tabs-wrap">
      <el-tabs v-model="commonTabInfo.tabsName">
        <el-tab-pane label="供应商列表" name="first" :disabled="commonTabInfo.tabsName !== 'first'">
         <SupplierTable />
        </el-tab-pane>
        <template v-if="commonTabInfo.text === '新增供应商' || commonTabInfo.text === '编辑供应商'">
          <el-tab-pane :label="commonTabInfo.text" name="second">
            <SupplierInfo />
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
  import SupplierInfo from './component/supplierInfo'
  import SupplierTable from './component/supplierTable'
  export default {
    name: 'Supplier',
    data() {
      return {}
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    components: {
      SupplierInfo,
      SupplierTable
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