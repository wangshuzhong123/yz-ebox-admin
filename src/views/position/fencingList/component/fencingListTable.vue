<template>
  <div class="zc-table-common">
    <div class="zc-table-search">
      <div class="search-quest">
        <span class="search-quest-title">车牌号：</span>
        <div class="search-input">
          <el-input v-model="LicenseNum" placeholder="请输入车牌号"></el-input>
        </div>
      </div>
      <div class="search-quest">
        <span class="search-quest-title">供应商：</span>
        <div class="search-input">
          <el-select v-model="ChannelId" placeholder="请选择">
              <el-option
                v-for="item in supplierList"
                :key="item.Id"
                :label="item.Name"
                :value="item.Id">
              </el-option>
            </el-select>
        </div>
      </div>
      <div class="search-quest">
        <span class="search-quest-title">电子围栏：</span>
        <div class="search-input">
          <el-select v-model="ElecId" placeholder="请选择">
              <el-option
                v-for="item in ElecList"
                :key="item.Id"
                :label="item.Name"
                :value="item.Id">
              </el-option>
            </el-select>
        </div>
      </div>
      <div class="search-quest">
        <span class="search-quest-title">时间：</span>
        <el-date-picker
          v-model="dateTime"
          type="daterange"
          :editable="false"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div class="search-quest">
        <el-button @click.native="clearSearch">清空条件</el-button>
        <el-button type="primary" @click.native="searchTable">搜索</el-button>
      </div>
    </div>
    <!-- <div class="zc-table-event-btn">
      <el-button type="primary" @click.native="eventTab('新增车辆', 'second')">新增车辆</el-button>
    </div> -->
    <div class="zc-table-body">
      <el-table
        ref="carTable"
        :data="carListTable.list" 
        :empty-text="emptyText"
        v-loading="tableLoading"
        border
        style="width: 100%">
        <el-table-column
          prop="LicenseNum"
          label="车牌号">
        </el-table-column>
        <el-table-column
          prop="ChannelName"
          label="供应商">
        </el-table-column>
        <el-table-column
          prop="FenceName"
          label="电子围栏">
        </el-table-column>
        <el-table-column
          prop="AddDateTime"
          label="时间">
        </el-table-column>
        <el-table-column
          prop="Type"
          label="进/出">
          <template slot-scope="scope">
            <span>
              {{scope.row.Type == 1 ? '进' : '出'}}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="zc-page-box">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageInfo.PageSize"
          :current-page="pageInfo.PageIndex"
          :total="carListTable.records"
          @current-change="changePage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getCarFencingListPage, GetSupplierList, GetElectronicPageList } from '@/api/requestConfig'
  import { formatTime } from '@/filters/index'
  export default {
    name: 'FencingListTable',
    created() {
      // 获取供应商下拉
      GetSupplierList({ PageIndex: 0 }).then(res => {
        if (res.data) {
          this.supplierList = res.data.list
        } else {
          this.$message.error(res.message)
        }
      })
      // 获取电子围栏下拉
      this.getEleList()
      // 获取车辆表格
      this.getCarListTable()
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    watch: {
      'commonTabInfo.text': function(val, oldVal) {
        if (val === 'refresh' && this.commonTabInfo.custom === 'fencingList') {
          this.clearSearch()
        } else if (val === 'update' && this.commonTabInfo.custom === 'fencingList') {
          this.searchTable()
        }
      }
    },
    data() {
      return {
        supplierList: [], // 供应商列表
        emptyText: '未匹配到车辆数据',
        LicenseNum: '', // 车牌号
        ChannelId: '', // 供应商id
        ElecId: '', // 电子围栏
        ElecList: [], // 电子围栏列表
        dateTime: '',
        carListTable: {},
        pageInfo: {
          SearchXml: 'platform/fence/SearchEntryExit',
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
      // 获取电子围栏列表
      getEleList() {
        // 获取电子围栏列表
        var needData = {}
        needData.Param = {}
        needData.PageIndex = 0
        needData.SearchXml = 'platform/Car/SearchCar'
        GetElectronicPageList(needData).then(res => {
          if (res.data) {
            this.ElecList = res.data.list
          }
        })
      },
      // 清空搜索条件
      clearSearch() {
        this.LicenseNum = ''
        this.ChannelId = ''
        this.ElecId = ''
        this.dateTime = ''
        this.getCarListTable()
      },
      // 搜索
      searchTable() {
        this.pageInfo.PageIndex = 1
        this.getCarListTable()
      },
      // 分页
      changePage(nowPage) {
        this.pageInfo.PageIndex = nowPage
        this.getCarListTable()
      },
      // 获取车辆表格
      getCarListTable() {
        this.tableLoading = true
        var needData = {}
        needData.Param = {}
        needData.PageIndex = this.pageInfo.PageIndex
        needData.PageSize = this.pageInfo.PageSize
        needData.SearchXml = this.pageInfo.SearchXml
        if (this.LicenseNum) {
          needData.Param.LicenseNum = this.LicenseNum
        }
        if (this.ChannelId) {
          needData.Param.ChannelId = this.ChannelId
        }
        if (this.ElecId) {
          needData.Param.ElecId = this.ElecId
        }
        if (this.dateTime) {
          needData.Param.StartTime = formatTime(this.dateTime[0].getTime()) + ' 00:00:00'
          needData.Param.EndTime = formatTime(this.dateTime[1].getTime()) + ' 23:59:59'
        }
        getCarFencingListPage(needData).then(res => {
          if (res.data) {
            this.carListTable = res.data
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
