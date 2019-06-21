<!--房屋地图-->
<template>
  <div class="app-container">
    <div id="deviceMap"></div>
    <el-dialog :title="houseName" :visible.sync="showFlag" width="900px" top="30vh" :close-on-click-modal="dialogInfo.default" :close-on-press-escape="dialogInfo.default">
      <div class="dialog-table-content">
        <div class="zc-table-body">
          <el-table
            :data="installTable.list"
            :empty-text="emptyText"
            v-loading="installLoading"
            border
            style="width: 100%">
            <el-table-column
              prop="deviceId"
              :formatter="tableFormatter"
              label="设备ID">
              <template slot-scope="scope">
                <span>{{scope.row.xdata.deviceId}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="deviceSn"
              :formatter="tableFormatter"
              label="设备编号">
              <template slot-scope="scope">
                <span>{{scope.row.xdata.deviceSn}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              :formatter="tableFormatter"
              label="上传时间">
              <template slot-scope="scope">
                <span>{{scope.row.xdata.createTime}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="xVal"
              :formatter="tableFormatter"
              label="X轴倾斜率">
              <template slot-scope="scope">
                <span>{{scope.row.xdata.val}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="yVal"
              :formatter="tableFormatter"
              label="Y轴倾斜率">
              <template slot-scope="scope">
                <span>{{scope.row.ydata.val}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showPop">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getHoseListByArea, getChengxiangDeviceData } from '@/api/requestConfig'
  import { MapabcEncryptToBdmap } from '@/filters/index'
  import BMap from 'BMap'
  import BMAPNORMALMAP from 'BMAP_NORMAL_MAP'
  import BMAPHYBRIDMAP from 'BMAP_HYBRID_MAP'
  export default {
    name: 'DeviceMap',
    mounted() {
      // 获取城厢房屋
      this.getMonitorTable()
      // 创建地图
      this.createdMap()
    },
    data() {
      return {
        houseTable: {},
        monitorMap: null,
        houseName: '',
        markerList: [],
        dialogInfo: {
          default: false // 禁止点击遮罩层关闭
        },
        showFlag: false,
        installTable: {},
        emptyText: '未匹配到设备数据',
        installLoading: false
      }
    },
    methods: {
      createdMap() {
        this.monitorMap = new BMap.Map('deviceMap') // 创建地图实例
        this.monitorMap.centerAndZoom('萧山城厢', 14) // 初始化地图，设置中心点坐标和地图级别
        this.monitorMap.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
        // 地图控件
        var mapType = new BMap.MapTypeControl({ mapTypes: [BMAPNORMALMAP, BMAPHYBRIDMAP] })
        this.monitorMap.addControl(mapType)
      },
      // 渲染所有地图标记
      renderAllTag(json) {
        console.log(json)
        for (var i = 0; i < json.length; i++) {
          var monitorData = json[i].house
          if (monitorData && monitorData.lat && monitorData.lng) {
            var turnBadiDu = MapabcEncryptToBdmap(monitorData.lat, monitorData.lng)
            console.log(monitorData.name)
            console.log(turnBadiDu)
            var newPointer = new BMap.Point(turnBadiDu.lng, turnBadiDu.lat)
            var redMarker = new BMap.Marker(newPointer) // 创建标注
            redMarker.data = monitorData
            this.markerList.push(redMarker)
            this.addClickHandler(monitorData, redMarker)
            this.monitorMap.addOverlay(redMarker) // 将标注添加到地图中
          }
        }
      },
      addClickHandler(json, marker) {
        var self = this
        marker.addEventListener('click', function(e) {
          self.houseName = json.name
          var needData = {}
          needData.houseId = json.id
          getChengxiangDeviceData(needData).then(res => {
            console.log(res)
          })
          self.showPop()
        })
      },
      // 获取监测对象表格
      getMonitorTable() {
        var needData = {}
        needData.streetCode = '330109006' // 城厢街道
        getHoseListByArea(needData).then(res => {
          if (res.status === 200) {
            this.houseTable = res.data
            if (this.houseTable && this.houseTable.length > 0) {
              this.renderAllTag(this.houseTable)
            }
          } else {
            this.$message.error(res.message)
          }
        })
      },
      // 设备数据弹窗显示与隐藏
      showPop() {
        this.showFlag = !this.showFlag
      },
      // 表格列初始化
      tableFormatter(row, column, cellValue) {
        if (cellValue !== null && cellValue !== '' && cellValue !== undefined) {
          return cellValue
        } else {
          return '/'
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/zc-table-common.scss";
  #deviceMap{
    width: 100%;
    height: 800px;
  }
</style>
