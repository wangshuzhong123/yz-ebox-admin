<template>
  <div class="zc-table-common">
    <div class="zc-table-search">
      <div class="search-quest">
        <span class="search-quest-title">供应商名称：</span>
        <div class="search-input">
          <el-input v-model="Name" placeholder="请输入供应商名称"></el-input>
        </div>
      </div>
      <div class="search-quest">
        <el-button @click.native="clearSearch">清空条件</el-button>
        <el-button type="primary" @click.native="searchTable">搜索</el-button>
      </div>
    </div>
    <div class="zc-table-event-btn">
      <el-button type="primary" @click.native="eventTab('新增供应商', 'second')">新增供应商</el-button>
    </div>
    <div class="zc-table-body">
      <el-table
        :data="supplierTable.list"
        :empty-text="emptyText"
        v-loading="tableLoading"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          width="50"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="Name"
          label="供应商名称">
        </el-table-column>
        <el-table-column
          prop="Url"
          label="官网地址">
        </el-table-column>
        <el-table-column
          prop="APIUrl"
          label="API网址">
        </el-table-column>
        <el-table-column
          prop="AppKey"
          label="公钥">
        </el-table-column>
        <el-table-column
          prop="AppSecret"
          label="私钥">
        </el-table-column>
        <el-table-column
          prop="AddDateTime"
          width="180"
          label="添加时间">
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
            <el-button type="text" size="small" @click.native="eventTab('编辑供应商', 'second', scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="zc-page-box">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageInfo.PageSize"
          :current-page="pageInfo.pageNum"
          :total="supplierTable.records"
          @current-change="changePage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { GetSupplierList } from '@/api/requestConfig'
  export default {
    name: 'SupplierTable',
    created() {
      // 获取供应商表格
      this.getSupplierTable()
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    watch: {
      'commonTabInfo.text': function(val, oldVal) {
        if (val === 'refresh' && this.commonTabInfo.custom === 'supplierList') {
          this.clearSearch()
        } else if (val === 'update' && this.commonTabInfo.custom === 'supplierList') {
          this.searchTable()
        }
      }
    },
    data() {
      return {
        Name: '', // 供应商名称
        emptyText: '未匹配到供应商数据',
        supplierTable: {},
        pageInfo: {
          SearchXml: 'platform/Channel/SearchChannel',
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
        this.getSupplierTable()
      },
      // 搜索
      searchTable() {
        this.pageInfo.PageIndex = 1
        this.getSupplierTable()
      },
      // 分页
      changePage(nowPage) {
        this.pageInfo.PageIndex = nowPage
        this.getSupplierTable()
      },
      // 获取供应商表格
      getSupplierTable() {
        this.tableLoading = true
        var needData = {}
        needData.Param = {}
        needData.PageIndex = this.pageInfo.PageIndex
        needData.PageSize = this.pageInfo.PageSize
        needData.SearchXml = this.pageInfo.SearchXml
        if (this.Name) {
          needData.Param.Name = this.Name
        }
        GetSupplierList(needData).then(res => {
          if (res.data) {
            this.supplierTable = res.data
          } else {
            this.$message.error(res.message)
          }
          this.tableLoading = false
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/zc-table-common.scss";
</style>
