<template>
  <div class="zc-table-common">
    <div class="zc-table-event-btn">
      <el-button type="primary" @click.native="eventTab('新增部门', 'second')">新增部门</el-button>
    </div>
    <div class="zc-table-body">
      <el-table
        :data="divisionalTable"
        :empty-text="emptyText"
        row-key="Id"
        v-loading="tableLoading"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        border
        style="width: 100%">
        <el-table-column
          prop="Name"
          label="部门名称">
        </el-table-column>
        <el-table-column
          prop="OrderId"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="AddDateTime"
          label="添加时间">
        </el-table-column>
        <el-table-column
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native="eventTab('部门排序', 'third', scope.row)">排序</el-button>
            <el-button type="text" size="small" @click.native="eventTab('编辑部门', 'second', scope.row)">编辑</el-button>
            <template v-if="!scope.row.IsActivity">
              <el-button type="text" size="small" @click.native="toDeleteDivisional(scope.row.Id)">删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { GetDivisionalTree, DeleteDivisional } from '@/api/requestConfig'
  export default {
    name: 'DivisionalTable',
    created() {
      // 获取部门表格
      this.getDivisionalTable()
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    watch: {
      'commonTabInfo.text': function(val, oldVal) {
        if (val === 'refresh' && this.commonTabInfo.custom === 'divisional') {
          this.clearSearch()
        } else if (val === 'update' && this.commonTabInfo.custom === 'divisional') {
          this.searchTable()
        }
      }
    },
    data() {
      return {
        menuName: '', // 部门名称
        emptyText: '未匹配到部门数据',
        divisionalTable: [],
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
        this.getDivisionalTable()
      },
      // 搜索
      searchTable() {
        this.getDivisionalTable()
      },
      // 获取部门表格
      getDivisionalTable() {
        this.tableLoading = true
        GetDivisionalTree().then(res => {
          if (res.data) {
            this.divisionalTable = res.data[0].children
          } else {
            this.$message.error(res.message)
          }
          this.tableLoading = false
        })
      },
      // 删除部门
      toDeleteDivisional(code) {
        var self = this
        this.$confirm('是否删除此部门?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          DeleteDivisional(code).then(res => {
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
