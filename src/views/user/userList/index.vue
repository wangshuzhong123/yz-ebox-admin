<!--用户管理-->
<template>
  <div class="app-container">
    <div class="street-wrap">
      <el-tabs v-model="commonTabInfo.activeName" @tab-click="handleClick">
        <el-tab-pane label="用户列表" name="first" :disabled="commonTabInfo.disabled">
          <user-table></user-table>
        </el-tab-pane>
        <template v-if="commonTabInfo.flag">
          <el-tab-pane :label="commonTabInfo.text" name="second">
            <add-user></add-user>
          </el-tab-pane>
        </template>
        <el-tab-pane label="" name="fourth" disabled></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import UserTable from './component/userTable'
  import AddUser from './component/addUser'
  export default {
    name: 'User',
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
      'user-table': UserTable,
      'add-user': AddUser
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
