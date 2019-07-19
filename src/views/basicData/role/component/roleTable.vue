<template>
  <div class="zc-table-common">
    <div class="zc-table-search">
      <div class="search-quest">
        <span class="search-quest-title">角色名称：</span>
        <div class="search-input">
          <el-input v-model="RoleName" placeholder="请输入角色名称"></el-input>
        </div>
      </div>
      <div class="search-quest">
        <el-button @click.native="clearSearch">清空条件</el-button>
        <el-button type="primary" @click.native="searchTable">搜索</el-button>
      </div>
    </div>
    <div class="zc-table-event-btn">
      <el-button type="primary" @click.native="eventTab('新增角色', 'second')">新增角色</el-button>
    </div>
    <div class="zc-table-body">
      <el-table
        :data="roleTable"
        :empty-text="emptyText"
        v-loading="tableLoading"
        border
        style="width: 100%">
        <el-table-column
          prop="RoleName"
          label="角色名称">
        </el-table-column>
         <el-table-column
          prop="Remark"
          label="备注">
        </el-table-column>
        <el-table-column
          prop="AddDateTime"
          label="添加时间">
        </el-table-column>
        <el-table-column
          prop="IsActivity"
          width="180"
          label="状态">
          <template slot-scope="scope">
            <span>
              <i class="el-icon-success diy-success" v-if="scope.row.IsActivity"></i>
              <i class="el-icon-error diy-error" v-else></i>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.Id === 1" type="text" size="small" @click.native="eventTab('角色权限', 'third', scope.row)">权限</el-button>
            <el-button :disabled="scope.row.Id === 1" type="text" size="small" @click.native="eventTab('编辑角色', 'second', scope.row)">编辑</el-button>
            <template v-if="!scope.row.IsActivity">
              <el-button :disabled="scope.row.Id === 1" type="text" size="small" @click.native="deleteRole(scope.row.Id)">删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { GetRoleTable, DeleteRole } from '@/api/requestConfig'
  export default {
    name: 'UserTable',
    created() {
      // 获取角色表格
      this.getMenuTable()
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    watch: {
      'commonTabInfo.text': function(val, oldVal) {
        if (val === 'refresh' && this.commonTabInfo.custom === 'role') {
          this.clearSearch()
        } else if (val === 'update' && this.commonTabInfo.custom === 'role') {
          this.searchTable()
        }
      }
    },
    data() {
      return {
        RoleName: '', // 角色名称
        emptyText: '未匹配到角色数据',
        roleTable: [],
        pageInfo: {
          SearchXml: 'platform/admin/SearchRole',
          PageIndex: 1,
          PageSize: 10
        },
        tableLoading: true
      }
    },
    methods: {
      // tabs操作
      eventTab(text, tabsName, custom) {
        this.$store.dispatch('handleTabInfo', {
          text: text,
          tabsName: tabsName,
          custom: custom
        })
      },
      // 清空搜索条件
      clearSearch() {
        this.RoleName = ''
        this.getMenuTable()
      },
      // 搜索
      searchTable() {
        this.pageInfo.PageIndex = 1
        this.getMenuTable()
      },
      // 分页
      changePage(nowPage) {
        this.pageInfo.PageIndex = nowPage
        this.getMenuTable()
      },
      // 获取角色表格
      getMenuTable() {
        this.tableLoading = true
        var needData = {}
        needData.Param = {}
        needData.PageIndex = this.pageInfo.PageIndex
        needData.PageSize = this.pageInfo.PageSize
        needData.SearchXml = this.pageInfo.SearchXml
        if (this.RoleName) {
          needData.Param.RoleName = this.RoleName
        }
        GetRoleTable(needData).then(res => {
          if (res.data) {
            this.roleTable = res.data
          } else {
            this.$message.error(res.message)
          }
          this.tableLoading = false
        })
      },
      // 删除角色
      deleteRole(Id) {
        this.$confirm('是否删除此角色?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          DeleteRole(Id).then(res => {
            if (res.status === 'success') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.searchTable()
            } else {
              this.$message.error(res.message)
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/zc-table-common.scss";
</style>
