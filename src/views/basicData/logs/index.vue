<template>
  <div class="app-container">
    <div class="zc-table-common">
      <div class="zc-table-search">
        <div class="search-quest">
          <span class="search-quest-title">日期：</span>
         <el-date-picker
          v-model="DateRange"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        </div>
        <div class="search-quest">
          <span class="search-quest-title">标题：</span>
          <div class="search-input">
            <el-input v-model="Title" placeholder="请输入标题"></el-input>
          </div>
        </div>
        <div class="search-quest">
          <span class="search-quest-title">内容：</span>
          <div class="search-input">
            <el-input v-model="Content" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="search-quest">
          <el-button @click.native="clearSearch">清空条件</el-button>
          <el-button type="primary" @click.native="searchTable">搜索</el-button>
        </div>
      </div>
      <div class="zc-table-event-btn">
        <el-button type="primary" :disabled="selectList.length < 1" @click.native="deleteALLEvent()">批量删除</el-button>
      </div>
      <div class="zc-table-body">
        <el-table
          :data="logsTable.list"
          :empty-text="emptyText"
          v-loading="tableLoading"
          @selection-change="handleSelectionChange"
          border
          style="width: 100%">
          <el-table-column
            type="selection"
            width="80">
          </el-table-column>
          <el-table-column
            prop="Id"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="Title"
            label="标题">
            <template slot-scope="scope">
              <div class="zc-col-view" @click="viewContent(scope.row.Id)">{{scope.row.Title}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="RequestURL"
            label="URL">
          </el-table-column>
          <el-table-column
            prop="IP"
            label="IP">
          </el-table-column>
          <el-table-column
            prop="AddDateTime"
            label="日期">
          </el-table-column>
          <el-table-column
            label="操作"
            width="300">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click.native="deleteEvent(scope.row.Id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="zc-page-box">
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pageInfo.PageSize"
            :current-page="pageInfo.pageNum"
            :total="logsTable.records"
            @current-change="changePage"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      title="日志详情"
      custom-class="dialog-wrap" 
      :visible.sync="dialogInfo.dialogFlag" 
      width="50%" 
      top="15vh" 
      :close-on-click-modal="dialogInfo.default" 
      :close-on-press-escape="dialogInfo.default"
      >
      <div class="dialog-container">
        <div class="log-info">
          <span>客户端IP：</span>
          <span>{{logInfoData.IP}}</span>
        </div>
        <div class="log-info">
          <span>时间：</span>
          <span>{{logInfoData.AddDateTime}}</span>
        </div>
        <div class="log-info">
          <span>请求头信息：</span>
          <span>{{logInfoData.Headers}}</span>
        </div>
        <div class="log-info">
          <span>请求URL：</span>
          <span>{{logInfoData.RequestURL}}</span>
        </div>
        <div class="log-info">
          <span>来源URL：</span>
          <span>{{logInfoData.SourceURL}}</span>
        </div>
        <div class="log-info">
          <span>日志内容：</span>
          <span>{{logInfoData.Content}}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { GetLogPageList, GetLogInfo, DeleteLog } from '@/api/requestConfig'
  import { formatTime } from '@/filters/index'
  export default {
    name: 'LogsTable',
    created() {
      // 获取日志表格
      this.getLogsTable()
    },
    data() {
      return {
        DateRange: [],
        Title: '', // 日志名称
        Content: '', // 内容
        selectList: [],
        emptyText: '未匹配到日志数据',
        logInfoData: {},
        logsTable: {},
        pageInfo: {
          SearchXml: 'platform/log/SearchLog',
          PageIndex: 1,
          PageSize: 20
        },
        dialogInfo: {
          dialogFlag: false,
          default: false
        },
        tableLoading: true
      }
    },
    methods: {
      // 清空搜索条件
      clearSearch() {
        this.DateRange = []
        this.Title = ''
        this.Content = ''
        this.getLogsTable()
      },
      // 搜索
      searchTable() {
        this.pageInfo.PageIndex = 1
        this.getLogsTable()
      },
      // 分页
      changePage(nowPage) {
        this.pageInfo.PageIndex = nowPage
        this.getLogsTable()
      },
      // 获取日志表格
      getLogsTable() {
        this.tableLoading = true
        var needData = {}
        needData.Param = {}
        needData.PageIndex = this.pageInfo.PageIndex
        needData.PageSize = this.pageInfo.PageSize
        needData.SearchXml = this.pageInfo.SearchXml
        if (this.DateRange.length > 0) {
          needData.Param.StartTime = formatTime(this.DateRange[0].getTime()) + ' 00:00:00'
          needData.Param.EndTime = formatTime(this.DateRange[1].getTime()) + ' 23:59:59'
        }
        if (this.Title) {
          needData.Param.Title = this.Title
        }
        if (this.Content) {
          needData.Param.Content = this.Content
        }
        GetLogPageList(needData).then(res => {
          if (res.data) {
            this.logsTable = res.data
          } else {
            this.$message.error(res.message)
          }
          this.tableLoading = false
        })
      },
      // 查看日志信息
      viewContent(rowId) {
        this.dialogInfo.dialogFlag = !this.dialogInfo.dialogFlag
        GetLogInfo(rowId).then(res => {
          if (res.data) {
            this.logInfoData = res.data
          }
        })
      },
      // 表格复选框
      handleSelectionChange(val) {
        this.selectList = val
      },
      // 删除日志
      deleteEvent(Id) {
        this.$confirm('是否删除此日志?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          this.requestDelete([Id])
        }).catch(() => {})
      },
      // 批量删除
      deleteALLEvent() {
        this.$confirm('是否删除选中的日志?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          var needArr = []
          this.selectList.map(x => {
            needArr.push(x.Id)
          })
          this.requestDelete(needArr)
        }).catch(() => {})
      },
      // 请求删除
      requestDelete(ids) {
        DeleteLog(ids).then(res => {
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
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/zc-table-common.scss";
  .log-info{
    padding: 5px 0;
  }
</style>
