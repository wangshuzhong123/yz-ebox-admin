<template>
  <div class="zc-table-common">
    <div class="zc-table-search">
      <div class="search-quest">
        <span class="search-quest-title"><i class="form-must-tip">*</i>担任转移任务角色：</span>
        <el-select v-model="isSponsor" placeholder="请选择">
          <el-option label="接收任务者" value="0"></el-option>
          <el-option label="发起任务者" value="1"></el-option>
        </el-select>
      </div>
      <div class="search-quest" v-if="originalInspectorNameFlag">
        <span class="search-quest-title">任务转移人：</span>
        <div class="search-input">
          <el-input v-model="originalInspectorName" placeholder="请输入任务转移人名称"></el-input>
        </div>
      </div>
      <div class="search-quest">
        <span class="search-quest-title">任务转移状态：</span>
        <el-select v-model="transferStatus" placeholder="请选择">
          <el-option label="请选择" value=""></el-option>
          <el-option label="待确认" value="0"></el-option>
          <el-option label="已确认" value="1"></el-option>
          <el-option label="已拒绝" value="2"></el-option>
        </el-select>
      </div>
      <div class="search-quest">
        <el-button @click.native="clearSearch">清空条件</el-button>
        <el-button type="primary" @click.native="searchTable">搜索</el-button>
      </div>
    </div>
    <div class="zc-table-body">
      <el-table
        :data="reportTable.list"
        :empty-text="emptyText"
        v-loading="reportLoading"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          width="50"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="houseName"
          :formatter="tableFormatter"
          label="巡检房屋">
        </el-table-column>
        <el-table-column
          prop="expectStartTime"
          :formatter="tableFormatter"
          label="巡检开始时间">
          <template slot-scope="scope">
            <span>{{scope.row.expectStartTime | formatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="originalInspectorName"
          :formatter="tableFormatter"
          label="任务转移发起者">
        </el-table-column>
        <el-table-column
          prop="createTime"
          :formatter="tableFormatter"
          label="任务转移发起时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | formatTime(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="transferTargetInspectorName"
          :formatter="tableFormatter"
          label="任务接收者">
        </el-table-column>
        <el-table-column
          prop="transferReason"
          :formatter="tableFormatter"
          label="任务转移理由">
        </el-table-column>
        <el-table-column
          prop="transferStatus"
          label="任务转移状态">
          <template slot-scope="scope">
            <span>{{turnTransferStatus(scope.row.transferStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="originalInspectorNameFlag"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native="receiveTask(scope.row)">接收</el-button>
            <el-button type="text" size="small" style="color: #f56c6c;" @click.native="rejectTask(scope.row)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="zc-page-box">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageInfo.pageSize"
          :current-page="pageInfo.pageNum"
          :total="reportTable.totalRow"
          @current-change="changePage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getWaitCheckTaskTable, putCheckTaskChecked } from '@/api/requestConfig'
  import { formatTime } from '@/filters/index'
  export default {
    name: 'CheckTaskCheckedTable',
    created() {
      // 获取巡检报告表格
      this.searchTable()
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    watch: {
      'commonTabInfo.text': function(val, oldVal) {
        if (val === 'refresh') {
          this.clearSearch()
        } else if (val === 'update') {
          this.searchTable()
        }
      },
      'isSponsor': function(val, oldVal) {
        if (val === '0') {
          this.originalInspectorNameFlag = true
        } else {
          this.originalInspectorNameFlag = false
        }
        this.clearSearch()
      }
    },
    data() {
      return {
        emptyText: '未匹配到转移任务列表',
        transferStatus: '',
        isSponsor: '0',
        reportTable: {},
        originalInspectorNameFlag: true,
        originalInspectorName: '',
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        },
        reportLoading: false
      }
    },
    methods: {
      // 巡检报告操作
      eventStreet(flag, text, disabled, activeName, custom) {
        this.$store.dispatch('handleTabInfo', {
          flag: flag,
          text: text,
          disabled: disabled,
          activeName: activeName,
          custom: custom
        })
      },
      // 清空搜索条件
      clearSearch() {
        this.originalInspectorName = ''
        this.transferStatus = ''
        this.pageInfo.pageNum = 1
        this.getReportTable()
      },
      // 搜索
      searchTable() {
        this.pageInfo.pageNum = 1
        this.getReportTable()
      },
      // 分页
      changePage(nowPage) {
        this.pageInfo.pageNum = nowPage
        this.getReportTable()
      },
      // 获取巡检报告表格
      getReportTable() {
        this.reportLoading = true
        var needData = {}
        needData.pageNum = this.pageInfo.pageNum
        needData.pageSize = this.pageInfo.pageSize
        // 转移任务角色
        needData.isSponsor = this.isSponsor
        if (this.originalInspectorName) {
          needData.originalInspectorName = this.originalInspectorName
        }
        // 报告状态
        if (this.transferStatus) {
          needData.transferStatus = this.transferStatus
        }
        getWaitCheckTaskTable(needData).then(res => {
          if (res.status === 200) {
            this.reportTable = res.data
          } else {
            this.$message.error(res.message)
          }
          this.reportLoading = false
        })
      },
      // 表格列初始化
      tableFormatter(row, column, cellValue) {
        if (cellValue) {
          return cellValue
        } else {
          return '/'
        }
      },
      cellFormatter(value) {
        if (value) {
          return value
        } else {
          return '/'
        }
      },
      turnTransferStatus(val) {
        if (val === 0) {
          return '待确认'
        } else if (val === 1) {
          return '已确认'
        } else if (val === 2) {
          return '已拒绝'
        }
      },
      turnTime(val, type) {
        if (val) {
          return formatTime(val, type)
        } else {
          return '/'
        }
      },
      // 接收任务
      receiveTask(row) {
        var receiveStr = ''
        receiveStr = '确认接收' + row.originalInspectorName + '转移给你的' + row.houseName + '巡检任务吗？'
        this.$confirm(receiveStr, '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          var needData = {}
          needData.iorIds = row.iorId
          needData.isAck = 1
          putCheckTaskChecked(needData).then(res => {
            if (res.status === 200) {
              this.$message.success(res.message)
              this.searchTable()
            } else {
              this.$message.error(res.message)
            }
          })
        }).catch(() => {})
      },
      // 拒绝任务
      rejectTask(row) {
        var receiveStr = ''
        receiveStr = '确认拒绝' + row.originalInspectorName + '转移给你的' + row.houseName + '巡检任务吗？'
        this.$confirm(receiveStr, '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          var needData = {}
          needData.iorIds = row.iorId
          needData.isAck = 2
          putCheckTaskChecked(needData).then(res => {
            if (res.status === 200) {
              this.$message.success(res.message)
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
  .search-quest-title{
    display: inline-block;
    text-align: right;
    height: 40px;
    line-height: 40px;
    .form-must-tip{
      color: #f56c6c;
      margin-right: 5px;
    }
  }
</style>
