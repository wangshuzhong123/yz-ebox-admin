<template>
  <div class="zc-table-common">
    <div class="zc-table-search">
      <div class="search-quest">
        <span class="search-quest-title">组织名：</span>
        <div class="search-input">
          <el-input v-model="Name" placeholder="请输入组织名"></el-input>
        </div>
      </div>
      <div class="search-quest">
        <el-button @click.native="clearSearch">清空条件</el-button>
        <el-button type="primary" @click.native="searchTable">搜索</el-button>
      </div>
    </div>
    <div class="zc-table-event-btn">
      <el-button type="primary" @click.native="eventTab('新增客户组织', 'second')">新增客户组织</el-button>
    </div>
    <div class="zc-table-body">
      <el-table
        :data="customerCompanyTable.list"
        :empty-text="emptyText"
        row-key="Id"
        v-loading="tableLoading"
        border
        style="width: 100%">
        <el-table-column
          prop="Name"
          label="客户组织名称">
        </el-table-column>
        <el-table-column
          prop="AddDateTime"
          width="300"
          label="添加时间">
        </el-table-column>
        <el-table-column
          label="操作"
          width="250">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native="eventTab('编辑客户组织', 'second', scope.row)">编辑</el-button>
            <template v-if="!scope.row.IsActivity">
              <el-button type="text" size="small" @click.native="toDeleteCustomerCompany(scope.row.Id)">删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
       <div class="zc-page-box">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageInfo.PageSize"
          :current-page="pageInfo.pageNum"
          :total="customerCompanyTable.records"
          @current-change="changePage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { GetCustomerCompanyList, DeleteCustomerCompany } from '@/api/requestConfig'
  export default {
    name: 'CustomerCompanyTable',
    created() {
      // 获取客户组织表格
      this.getCustomerCompanyTable()
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    watch: {
      'commonTabInfo.text': function(val, oldVal) {
        if (val === 'refresh' && this.commonTabInfo.custom === 'customerCompany') {
          this.clearSearch()
        } else if (val === 'update' && this.commonTabInfo.custom === 'customerCompany') {
          this.searchTable()
        }
      }
    },
    data() {
      return {
        Name: '', // 客户组织名称
        emptyText: '未匹配到客户组织数据',
        customerCompanyTable: [],
        pageInfo: {
          // SearchXml: 'platform/abs/SearchCar',
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
        this.Name = ''
        this.getCustomerCompanyTable()
      },
      // 搜索
      searchTable() {
        this.pageInfo.PageIndex = 1
        this.getCustomerCompanyTable()
      },
      // 分页
      changePage(nowPage) {
        this.pageInfo.PageIndex = nowPage
        this.getCustomerCompanyTable()
      },
      // 获取客户组织表格
      getCustomerCompanyTable() {
        this.tableLoading = true
        var needData = {}
        needData.Param = {}
        needData.PageIndex = this.pageInfo.PageIndex
        needData.PageSize = this.pageInfo.PageSize
        needData.SearchXml = this.pageInfo.SearchXml
        if (this.Name) {
          needData.Param.Name = this.Name
        }
        GetCustomerCompanyList(needData).then(res => {
          if (res.data) {
            this.customerCompanyTable = res.data
          } else {
            this.$message.error(res.message)
          }
          this.tableLoading = false
        })
      },
      // 删除客户组织
      toDeleteCustomerCompany(code) {
        var self = this
        this.$confirm('是否删除此客户组织?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          DeleteCustomerCompany([code]).then(res => {
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
  .select-cont{
    width: 100%;
  }
</style>
