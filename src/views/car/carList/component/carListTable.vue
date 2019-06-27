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
        @selection-change="handleSelectionChange"
        style="width: 100%">
       <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="LicenseNum"
          label="车牌号">
        </el-table-column>
        <el-table-column
          prop="ChannelName"
          label="供应商">
        </el-table-column>
        <el-table-column
          prop="Lon"
          label="经度">
        </el-table-column>
        <el-table-column
          prop="Lat"
          label="纬度">
        </el-table-column>
        <el-table-column
          prop="Speed"
          label="车速（km/h）">
        </el-table-column>
        <el-table-column
          prop="Status"
          label="车辆状态">
        </el-table-column>
        <el-table-column
          prop="LastAddress"
          label="最新位置">
        </el-table-column>
        <el-table-column
          prop="LatAndLonUpdateTime"
          label="最新更新时间">
        </el-table-column>
        <el-table-column
          prop="LastAlarmName"
          label="报警信息">
          <template slot-scope="scope">
            <span>
              <span :class="scope.row.IsAlarm ? 'error-color' : ''">{{scope.row.LastAlarmName}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="IsActivity"
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
        <el-table-column
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native="eventTab('编辑车辆', 'second', scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="zc-page-box">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageInfo.PageSize"
          :current-page="pageInfo.pageNum"
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
  import { GetCarList, GetSupplierList, UpdateCarActivity } from '@/api/requestConfig'
  export default {
    name: 'CarListTable',
    created() {
      // 获取供应商下拉
      GetSupplierList({ PageIndex: 0 }).then(res => {
        if (res.data) {
          this.supplierList = res.data.list
        } else {
          this.$message.error(res.message)
        }
      })
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
        if (val === 'refresh' && this.commonTabInfo.custom === 'carList') {
          this.clearSearch()
        } else if (val === 'update' && this.commonTabInfo.custom === 'carList') {
          this.searchTable()
        }
      }
    },
    data() {
      return {
        supplierList: [], // 供应商列表
        selectCarList: [], // 选中车辆
        emptyText: '未匹配到车辆数据',
        LicenseNum: '', // 车牌号
        ChannelId: '', // 供应商id
        carListTable: {},
        pageInfo: {
          SearchXml: 'platform/Car/SearchCar',
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
        this.ChannelId = ''
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
        GetCarList(needData).then(res => {
          if (res.data) {
            this.carListTable = res.data
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
        UpdateCarActivity(needData).then(res => {
          if (needData.IsActivity) {
            this.$message.success('已启用')
          } else {
            this.$message.success('已禁用')
          }
        })
      },
      // 表格复选框
      handleSelectionChange(val) {
        this.selectCarList = val
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/zc-table-common.scss";
</style>
