<template>
  <div class="zc-table-common">
    <!-- <div class="zc-table-search">
      <div class="search-quest">
        <span class="search-quest-title">菜单名称：</span>
        <div class="search-input">
          <el-input v-model="menuName" placeholder="请输入菜单名称："></el-input>
        </div>
      </div>
      <div class="search-quest">
        <el-button @click.native="clearSearch">清空条件</el-button>
        <el-button type="primary" @click.native="searchTable">搜索</el-button>
      </div>
    </div> -->
    <div class="zc-table-event-btn">
      <el-button type="primary" @click.native="eventTab('新增菜单', 'second')">新增菜单</el-button>
    </div>
    <div class="zc-table-body">
      <el-table
        :data="menuTable"
        :empty-text="emptyText"
        row-key="Id"
        v-loading="tableLoading"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        border
        style="width: 100%">
        <el-table-column
          width="300"
          prop="Title"
          label="菜单名称">
        </el-table-column>
        <el-table-column
          prop="OrderId"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="Icon"
          label="菜单图标">
        </el-table-column>
        <el-table-column
          prop="LinkUrl"
          label="菜单URL">
        </el-table-column>
        <el-table-column
          prop="IsActivity"
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
            <el-button type="text" size="small" @click.native="eventTab('菜单排序', 'third', scope.row)">排序</el-button>
            <el-button type="text" size="small" @click.native="eventTab('编辑菜单', 'second', scope.row)">编辑</el-button>
            <template v-if="!scope.row.IsActivity">
              <el-button type="text" size="small" @click.native="toDeleteMenu(scope.row.Id)">删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getAllMenuList, DeleteMenu } from '@/api/requestConfig'
  export default {
    name: 'MenuTable',
    created() {
      // 获取菜单表格
      this.getMenuTable()
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    watch: {
      'commonTabInfo.text': function(val, oldVal) {
        if (val === 'refresh' && this.commonTabInfo.custom === 'menu') {
          this.clearSearch()
        } else if (val === 'update' && this.commonTabInfo.custom === 'menu') {
          this.searchTable()
        }
      }
    },
    data() {
      return {
        menuName: '', // 菜单名称
        emptyText: '未匹配到菜单数据',
        menuTable: [],
        pageInfo: {
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
        this.getMenuTable()
      },
      // 搜索
      searchTable() {
        this.getMenuTable()
      },
      // 获取菜单表格
      getMenuTable() {
        this.tableLoading = true
        getAllMenuList().then(res => {
          if (res.data) {
            this.menuTable = res.data[0].children
          } else {
            this.$message.error(res.message)
          }
          this.tableLoading = false
        })
      },
      // 删除菜单
      toDeleteMenu(code) {
        var self = this
        this.$confirm('是否删除此菜单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          DeleteMenu(code).then(res => {
            if (res.status === 'success') {
              self.$message({
                type: 'success',
                message: '删除成功!'
              })
              self.searchTable()
            } else {
              self.$message.error(res.message)
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
