<template>
  <div class="zc-table-common">
    <div class="zc-table-search">
      <div class="search-quest">
        <span class="search-quest-title">房屋名：</span>
        <div class="search-input">
          <el-input v-model="houseName" placeholder="请输入房屋名"></el-input>
        </div>
      </div>
      <div class="search-quest">
        <span class="search-quest-title">巡检报告状态：</span>
        <el-select v-model="reportStatus" placeholder="请选择">
          <el-option label="待巡检" value="0"></el-option>
          <el-option label="待审核" value="1"></el-option>
          <el-option label="审核通过" value="2"></el-option>
          <el-option label="驳回重新巡检" value="3"></el-option>
          <el-option label="驳回修改报告" value="4"></el-option>
        </el-select>
      </div>
      <div class="search-quest">
        <span class="search-quest-title">巡检人：</span>
        <div class="search-input">
          <el-input v-model="inspectorName" placeholder="请输入巡检人名字"></el-input>
        </div>
      </div>
      <div class="search-quest">
        <span class="search-quest-title">巡检报告提交时间：</span>
        <el-date-picker
          v-model="reportSubTime"
          type="daterange"
          :editable="false"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <!--<div class="search-quest">
        <span class="search-quest-title">所属地：</span>
        <areachoose ref="Areachoose" :type="areaSelectOption.type" :status="areaSelectOption.status" @areainfo="getAreaProps"></areachoose>
      </div>-->
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
            <span>{{turnTime(scope.row.reportSubTime, 2)}}</span>
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
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <template v-if="scope.row.status === 1">
              <el-button type="text" size="small" @click.native="checkReportInfo(scope.row)">审批巡检报告</el-button>
            </template>
            <template v-else>
              <el-button type="text" size="small" @click.native="lookReportInfo(scope.row)">查看巡检报告</el-button>
            </template>
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
  import Areachoose from '@/components/areaChoose'
  import { getAllCheckReportTable } from '@/api/requestConfig'
  import { formatTime } from '@/filters/index'
  export default {
    name: 'CheckReportTable',
    created() {
      // 获取巡检报告表格
      this.getReportTable()
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    components: {
      Areachoose
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
        emptyText: '未匹配到巡检报告数据',
        reportStatus: '1',
        reportSubTime: '',
        reportTable: {},
        houseName: '',
        inspectorName: '',
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        },
        reportLoading: true,
        areaSelectOption: {
          type: 5,
          data: '',
          status: ''
        } // 地区组件option
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
      // 获取子组件地区信息
      getAreaProps(needData) {
        this.areaSelectOption.data = needData
      },
      // 清空搜索条件
      clearSearch() {
        this.houseName = ''
        this.reportStatus = '1'
        this.inspectorName = ''
        this.reportSubTime = ''
        this.pageInfo.pageNum = 1
        // 清空地区信息
        // this.$refs.Areachoose.clearAreaInfo()
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
        if (this.houseName) {
          needData.houseName = this.houseName
        }
        // 报告状态
        if (this.reportStatus) {
          needData.status = this.reportStatus
        }
        // 巡检员
        if (this.inspectorName) {
          needData.inspectorName = this.inspectorName
        }
        if (this.reportSubTime) {
          needData.start = new Date(this.reportSubTime[0]).getTime()
          needData.end = new Date(this.reportSubTime[1]).getTime() + (24 * 60 * 60 * 1000 - 1)
        }
        getAllCheckReportTable(needData).then(res => {
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
      // 审核报告
      checkReportInfo(report) {
        this.commonTabInfo.custom = report
        this.eventStreet(true, '审批巡检报告', true, 'second', this.commonTabInfo.custom)
      },
      // 查看报告
      lookReportInfo(report) {
        this.commonTabInfo.custom = report
        this.eventStreet(true, '查看巡检报告', true, 'second', this.commonTabInfo.custom)
      },
      turnTime(val, type) {
        if (val) {
          return formatTime(val, type)
        } else {
          return '/'
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/zc-table-common.scss";
  .mnonitor-pointer{
    cursor: pointer;
    color: #409EFF;
  }
  .house-info-big{
    width: 100%;
    height: 550px;
    overflow-y: auto;
  }
  .house-info-wrap{
    min-width: 240px;
    height: 40px;
    line-height: 40px;
    display: inline-block;
    margin: 0 5px;
    .house-info-title{
      height: 40px;
      display: inline-block;
      color: #0C0F12;
    }
    .house-info-cont{
      height: 40px;
      display: inline-block;
    }
  }
</style>
