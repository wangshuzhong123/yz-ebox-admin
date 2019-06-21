<template>
  <div class="zc-table-common">
    <div class="zc-table-search">
      <div class="search-quest">
        <span class="search-quest-title">报告状态：</span>
        <el-select v-model="reportStatus" placeholder="请选择">
          <el-option label="请选择" value=""></el-option>
          <el-option label="待巡检" value="0"></el-option>
          <el-option label="待审核" value="1"></el-option>
          <el-option label="审核通过" value="2"></el-option>
          <el-option label="驳回重新巡检" value="3"></el-option>
          <el-option label="驳回修改报告" value="4"></el-option>
        </el-select>
      </div>
      <div class="search-quest">
        <el-button @click.native="clearSearch">清空条件</el-button>
        <el-button type="primary" @click.native="searchTable">搜索</el-button>
      </div>
    </div>
    <div class="zc-table-event-btn">
      <el-button type="primary" plain @click.native="eventStreet(false, '', false, 'first')">返回总任务列表</el-button>
    </div>
    <div class="zc-table-body">
      <el-table
        :data="checkListTable.list"
        :empty-text="emptyText"
        v-loading="taskLoading"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          width="50"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="houseName"
          label="巡检房屋">
          <template slot-scope="scope">
            <span>{{commonTabInfo.custom.inspectionMajorTask.houseName}}</span>
          </template>
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
          prop="expectEndTime"
          :formatter="tableFormatter"
          label="巡检截止时间">
          <template slot-scope="scope">
            <span>{{scope.row.expectEndTime | formatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          :formatter="tableFormatter"
          label="巡检报告id">
        </el-table-column>
        <el-table-column
          prop="inspectorName"
          :formatter="tableFormatter"
          label="巡检员">
        </el-table-column>
        <el-table-column
          prop="reportSubTime"
          :formatter="tableFormatter"
          label="巡检报告提交时间">
          <template slot-scope="scope">
            <span>{{turnTime(scope.row.reportSubTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="weather"
          :formatter="tableFormatter"
          label="天气">
        </el-table-column>
        <el-table-column
          prop="status"
          label="巡检报告状态">
          <template slot-scope="scope">
            <span>{{turnReportStatus(scope.row.status)}}</span>
          </template>
        </el-table-column>
       <!-- <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native="lookReportInfo(scope.row)">审批巡检报告</el-button>
          </template>
        </el-table-column>-->
      </el-table>
      <div class="zc-page-box">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageInfo.pageSize"
          :current-page="pageInfo.pageNum"
          :total="checkListTable.totalRow"
          @current-change="changePage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getCheckTaskTable } from '@/api/requestConfig'
  import { formatTime } from '@/filters/index'
  export default {
    name: 'LookCheckTaskList',
    created() {
      // 获取任务表格
      this.getSmallCheckTable()
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
      }
    },
    data() {
      return {
        emptyText: '未匹配到任务数据',
        reportStatus: '',
        checkListTable: {},
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        },
        taskLoading: true
      }
    },
    methods: {
      // 任务操作
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
        this.reportStatus = ''
        this.pageInfo.pageNum = 1
        this.getSmallCheckTable()
      },
      // 搜索
      searchTable() {
        this.pageInfo.pageNum = 1
        this.getSmallCheckTable()
      },
      // 分页
      changePage(nowPage) {
        this.pageInfo.pageNum = nowPage
        this.getSmallCheckTable()
      },
      // 获取任务表格
      getSmallCheckTable() {
        this.taskLoading = true
        var needData = {}
        needData.pageNum = this.pageInfo.pageNum
        needData.pageSize = this.pageInfo.pageSize
        needData.resource = 'web'
        needData.imtId = this.commonTabInfo.custom.iprId
        // 巡检报告状态
        if (this.reportStatus) {
          needData.status = this.reportStatus
        }
        getCheckTaskTable(needData).then(res => {
          if (res.status === 200) {
            this.checkListTable = res.data
          } else {
            this.$message.error(res.message)
          }
          this.taskLoading = false
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
      turnReportStatus(val) {
        if (val === 0) {
          return '待巡检'
        } else if (val === 1) {
          return '待审核'
        } else if (val === 2) {
          return '审核通过'
        } else if (val === 3) {
          return '驳回重新巡检'
        } else if (val === 4) {
          return '驳回修改报告'
        }
      },
      // 查看报告
      lookReportInfo(report) {
        this.commonTabInfo.custom.myReportInfo = report
        this.eventStreet(true, '审批巡检报告', true, 'fifth', this.commonTabInfo.custom)
      },
      turnTime(val) {
        if (val) {
          return formatTime(val)
        } else {
          return '/'
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/zc-table-common.scss";
</style>
