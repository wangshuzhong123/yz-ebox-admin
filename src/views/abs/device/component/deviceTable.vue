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
        <span class="search-quest-title">设备号：</span>
        <div class="search-input">
          <el-input v-model="DeviceNo" placeholder="请输入设备号"></el-input>
        </div>
      </div>
      <div class="search-quest">
        <el-button @click.native="clearSearch">清空条件</el-button>
        <el-button type="primary" @click.native="searchTable">搜索</el-button>
      </div>
    </div>
    <div class="zc-table-event-btn">
      <el-button type="primary" @click.native="eventTab('新增设备', 'second')">新增设备</el-button>
    </div>
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
          prop="baiduAddress"
          label="百度位置">
        </el-table-column>
        <el-table-column
          prop="ABSInfo"
          label="ABS版本号">
        </el-table-column>
        <el-table-column
          prop="Mileage"
          label="里程(KM)">
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
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <span>
              <el-button type="text" size="small" @click.native="eventTab('编辑设备', 'second', scope.row)">编辑</el-button>
              <template v-if="!scope.row.IsActivity">
                <el-button type="text" size="small" @click.native="DeleteDeviceId(scope.row.Id)">删除</el-button>
              </template>
            </span>
          </template>
        </el-table-column>
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
    <div id="myMap"></div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { GetDeviceList, UpdateDeviceActivity, DeleteDevice } from '@/api/requestConfig'
  import { MapabcEncryptToBdmap } from '@/filters/index'
  import BMap from 'BMap'
  export default {
    name: 'deviceTable',
    mounted() {
      // 获取车辆表格
      this.getDeviceTable()
      this.renderMap()
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    watch: {
      'commonTabInfo.text': function(val, oldVal) {
        if (val === 'refresh' && this.commonTabInfo.custom === 'deviceList') {
          this.clearSearch()
        } else if (val === 'update' && this.commonTabInfo.custom === 'deviceList') {
          this.searchTable()
        }
      }
    },
    data() {
      return {
        carMap: null,
        emptyText: '未匹配到设备数据',
        LicenseNum: '', // 车牌号
        DeviceNo: '', // 设备号
        deviceTable: { list: [] },
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
            // 增加地址字段
            if (this.deviceTable.list && this.deviceTable.list.length > 0) {
              var resultArr = []
              this.deviceTable.list.map((x) => {
                var obj = { ...x, baiduAddress: '' }
                resultArr.push(obj)
              })
              this.deviceTable.list = resultArr
              this.renderAddress()
            }
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
      },
      // 删除角色
      DeleteDeviceId(Id) {
        this.$confirm('是否删除此设备?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          DeleteDevice([Id]).then(res => {
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
        }).catch(() => {})
      },
      // 初始化地图
      renderMap() {
        this.carMap = new BMap.Map('myMap', { minZoom: 5 }) // 创建地图实例
        this.carMap.centerAndZoom('西安', 6) // 初始化地图，设置中心点坐标和地图级别
        this.carMap.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
      },
      // gps=>百度坐标
      turnAdress(lon, lat, index) {
        var self = this
        if (lon && lat) {
          var baiduObj = MapabcEncryptToBdmap(lon, lat)
          // 创建地理编码实例
          var myGeo = new BMap.Geocoder()
          // 根据坐标得到地址描述
          myGeo.getLocation(new BMap.Point(baiduObj.lon, baiduObj.lat), function(result) {
            if (result.addressComponents) {
              var resultData = result.addressComponents
              var resultAdress = resultData.province + ' ' + resultData.city + ' ' + resultData.district + ' ' + resultData.street + ' ' + resultData.streetNumber
              self.deviceTable.list[index].baiduAddress = resultAdress
            }
          })
        } else {
          this.deviceTable.list[index].baiduAddress = ''
        }
      },
      // 更改表格数据
      renderAddress(resultAdress, index) {
        this.deviceTable.list.map((x, index) => {
          this.turnAdress(x.Lat, x.lon, index)
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/zc-table-common.scss";
</style>
