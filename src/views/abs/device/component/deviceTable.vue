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
          <el-input v-model="DeviceNo" placeholder="请输入设备号"></el-input>
        </div>
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
        :data="deviceTable.list"
        :empty-text="emptyText"
        v-loading="tableLoading"
        border
        style="width: 100%">
        <el-table-column
          prop="LicenseNum"
          label="车牌号">
        </el-table-column>
        <el-table-column
          prop="DeviceNo"
          label="设备号">
        </el-table-column>
        <el-table-column
          prop="ChannelName"
          label="供应商">
           <template slot-scope="scope">
            <span>威伯科</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="Lat"
          label="经度">
        </el-table-column>
        <el-table-column
          prop="lon"
          label="纬度">
        </el-table-column>
        <el-table-column
          prop="ABSInfo"
          label="ABS版本号">
        </el-table-column>
        <el-table-column
          prop="Mileage"
          label="里程">
        </el-table-column>
        <el-table-column
          prop="BrkTims"
          label="制动次数">
        </el-table-column>
        <el-table-column
          prop="RunningTims"
          label="运行次数">
        </el-table-column>
        <el-table-column
          prop="AbsBrkTims"
          label="ABS激活次数">
        </el-table-column>
        <el-table-column
          prop="UpdateTime"
          width="180"
          label="更新时间">
        </el-table-column>
        <el-table-column
          prop="IsActivity"
          width="100"
          label="是否启用">
          <template slot-scope="scope">
           <el-switch
            v-model="scope.row.IsActivity"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeIsActivity($event, scope.row.Id)">
          </el-switch>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native="eventTab('编辑车辆', 'second', scope.row)">编辑</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="zc-page-box">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageInfo.PageSize"
          :current-page="pageInfo.pageNum"
          :total="deviceTable.records"
          @current-change="changePage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { GetDeviceList, UpdateDeviceActivity } from '@/api/requestConfig'
  export default {
    name: 'deviceTable',
    created() {
      // 获取车辆表格
      this.getDeviceTable()
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    watch: {
      'commonTabInfo.text': function(val, oldVal) {
        if (val === 'refresh' && this.commonTabInfo.custom === 'carList') {
          this.clearSearch()
        } else if (val === 'update' && this.commonTabInfo.custom === 'carList') {
          this.searchTable()
        }
      }
    },
    data() {
      return {
        emptyText: '未匹配到设备数据',
        LicenseNum: '', // 车牌号
        DeviceNo: '', // 设备号
        deviceTable: {},
        pageInfo: {
          SearchXml: 'platform/abs/SearchCar',
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
        this.LicenseNum = ''
        this.DeviceNo = ''
        this.getDeviceTable()
      },
      // 搜索
      searchTable() {
        this.pageInfo.PageIndex = 1
        this.getDeviceTable()
      },
      // 分页
      changePage(nowPage) {
        this.pageInfo.PageIndex = nowPage
        this.getDeviceTable()
      },
      // 获取车辆表格
      getDeviceTable() {
        this.tableLoading = true
        var needData = {}
        needData.Param = {}
        needData.PageIndex = this.pageInfo.PageIndex
        needData.PageSize = this.pageInfo.PageSize
        needData.SearchXml = this.pageInfo.SearchXml
        if (this.LicenseNum) {
          needData.Param.LicenseNum = this.LicenseNum
        }
        if (this.DeviceNo) {
          needData.Param.DeviceNo = this.DeviceNo
        }
        GetDeviceList(needData).then(res => {
          if (res.data) {
            this.deviceTable = res.data
          } else {
            this.$message.error(res.message)
          }
          this.tableLoading = false
        })
      },
      // 是否启用
      changeIsActivity(e, rowId) {
        var needData = {}
        needData.Id = rowId
        needData.IsActivity = e
        UpdateDeviceActivity(needData).then(res => {
          if (needData.IsActivity) {
            this.$message.success('已启用')
          } else {
            this.$message.success('已禁用')
          }
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/zc-table-common.scss";
</style>
