<template>
  <div class="zc-table-common">
    <div class="zc-table-search">
      <div class="search-quest">
        <span class="search-quest-title">房屋名称：</span>
        <div class="search-input">
          <el-input v-model="houseName" placeholder="请输入房屋名称"></el-input>
        </div>
      </div>
      <div class="search-quest">
        <span class="search-quest-title">任务编号：</span>
        <div class="search-input">
          <el-input v-model="taskNo" placeholder="请输入任务编号"></el-input>
        </div>
      </div>
      <div class="search-quest">
        <span class="search-quest-title">任务状态：</span>
        <el-select v-model="taskStatus" placeholder="请选择">
          <el-option label="请选择" value=""></el-option>
          <el-option label="合同期内" value="0"></el-option>
          <el-option label="已过期" value="1"></el-option>
        </el-select>
      </div>
      <!--<div class="search-quest">-->
        <!--<span class="search-quest-title">所属地：</span>-->
        <!--<areachoose ref="Areachoose" :type="areaSelectOption.type" :status="areaSelectOption.status" @areainfo="getAreaProps"></areachoose>-->
      <!--</div>-->
      <div class="search-quest">
        <span class="search-quest-title">巡检人：</span>
        <div class="search-input">
          <el-input v-model="inspectorName" placeholder="请输入巡检人名字"></el-input>
        </div>
      </div>
      <div class="search-quest">
        <el-button @click.native="clearSearch">清空条件</el-button>
        <el-button type="primary" @click.native="searchTable">搜索</el-button>
      </div>
    </div>
    <div class="zc-table-event-btn">
      <el-button type="primary" @click.native="eventStreet(true, '新增巡检任务', true, 'second', '')">新增巡检任务</el-button>
    </div>
    <div class="zc-table-body">
      <el-table
        :data="taskTable.list"
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
          prop="taskNo"
          label="任务编号">
          <template slot-scope="scope">
            <span>{{cellFormatter(scope.row.inspectionMajorTask.taskNo)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="houseName"
          label="房屋名">
          <template slot-scope="scope">
            <span>{{cellFormatter(scope.row.inspectionMajorTask.houseName)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="taskStartTime"
          label="巡检合同开始日期">
          <template slot-scope="scope">
            <span>{{scope.row.inspectionMajorTask.taskStartTime | formatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="taskEndTime"
          label="巡检合同结束日期">
          <template slot-scope="scope">
            <span>{{scope.row.inspectionMajorTask.taskEndTime | formatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="principalName"
          label="负责人">
          <template slot-scope="scope">
            <span>{{cellFormatter(scope.row.inspectionMajorTask.principalName)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="inspectorName"
          label="巡检人">
          <template slot-scope="scope">
            <span>{{cellFormatter(scope.row.inspectionMajorTask.inspectorName)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="frequency"
          label="巡检频次（天/次）">
          <template slot-scope="scope">
            <span>{{cellFormatter(scope.row.inspectionMajorTask.frequency)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="taskStatus"
          label="任务状态">
          <template slot-scope="scope">
            <span>{{scope.row.inspectionMajorTask.taskStatus === 0 ? '合同期内' : '已过期'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native="eventStreet(true, '查看巡检任务', true, 'third', scope.row)">查看巡检报告</el-button>
            <el-button type="text" size="small" @click.native="eventStreet(true, '延长任务', true, 'sixth', scope.row)">延长任务</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="zc-page-box">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageInfo.pageSize"
          :current-page="pageInfo.pageNum"
          :total="taskTable.totalRow"
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
  import { getTaskTable } from '@/api/requestConfig'
  export default {
    name: 'CheckTaskTable',
    created() {
      // 获取任务表格
      this.getMonitorTable()
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
        emptyText: '未匹配到任务数据',
        taskStatus: '',
        taskTable: {},
        taskNo: '',
        houseName: '',
        inspectorName: '',
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        },
        taskLoading: true,
        areaSelectOption: {
          type: 5,
          data: '',
          status: ''
        } // 地区组件option
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
      // 获取子组件地区信息
      getAreaProps(needData) {
        this.areaSelectOption.data = needData
      },
      // 清空搜索条件
      clearSearch() {
        this.taskStatus = ''
        this.taskNo = ''
        this.houseName = ''
        this.inspectorName = ''
        this.pageInfo.pageNum = 1
        // 清空地区信息
        // this.$refs.Areachoose.clearAreaInfo()
        this.getMonitorTable()
      },
      // 搜索
      searchTable() {
        this.pageInfo.pageNum = 1
        this.getMonitorTable()
      },
      // 分页
      changePage(nowPage) {
        this.pageInfo.pageNum = nowPage
        this.getMonitorTable()
      },
      // 获取任务表格
      getMonitorTable() {
        this.taskLoading = true
        var needData = {}
        needData.pageNum = this.pageInfo.pageNum
        needData.pageSize = this.pageInfo.pageSize
        needData.resource = 'web'
        // 监测类型
        if (this.taskStatus) {
          needData.taskStatus = this.taskStatus
        }
        if (this.taskNo) {
          needData.taskNo = this.taskNo
        }
        if (this.houseName) {
          needData.houseName = this.houseName
        }
        if (this.inspectorName) {
          needData.inspectorName = this.inspectorName
        }
        // needData.provinceCode = this.areaSelectOption.data.provinceCode
        // needData.cityCode = this.areaSelectOption.data.cityCode
        // needData.countyCode = this.areaSelectOption.data.countyCode
        // needData.streetCode = this.areaSelectOption.data.streetCode
        // needData.communityCode = this.areaSelectOption.data.communityCode
        getTaskTable(needData).then(res => {
          if (res.status === 200) {
            this.taskTable = res.data
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
      cellFormatter(value) {
        if (value) {
          return value
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
