<!--菜单管理-->
<template>
  <div class="app-container">
    <div class="tabs-wrap">
      <el-tabs v-model="commonTabInfo.tabsName">
        <el-tab-pane label="设备管理" name="first" :disabled="commonTabInfo.tabsName !== 'first'">
         <DeviceTable />
        </el-tab-pane>
        <template v-if="commonTabInfo.text === '新增设备' || commonTabInfo.text === '编辑设备'">
          <el-tab-pane :label="commonTabInfo.text" name="second">
            <DeviceInfo />
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
  import DeviceInfo from './component/deviceInfo'
  import DeviceTable from './component/deviceTable'
  export default {
    name: 'DeviceList',
    data() {
      return {}
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    components: {
      DeviceInfo,
      DeviceTable
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