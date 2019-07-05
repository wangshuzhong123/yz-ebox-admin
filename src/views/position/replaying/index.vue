<!--定位服务-->
<template>
  <div class="mainWrap"  
    v-loading="mapLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 50, 50, 0.7)">
    <div class="zc-table-search">
      <div class="search-quest">
        <span class="search-quest-title">车牌号：</span>
        <div class="search-input search-input-position">
          <el-input v-model="LicenseNum" placeholder="输入车牌号进行搜索" @focus="chooseLicenseNum" clearable></el-input>
          <div v-show="showSelectBox" class="choose-box">
            <div class="tree-body">
              <div id="truckTree" class="tree-scroll-div">
                <el-tree
                  :style="{'maxHeight': maxHeight}"
                  class="filter-tree"
                  :data="carTreeData"
                  :props="defaultProps"
                  :empty-text="emptyText"
                  :default-expanded-keys="defaultList"
                  node-key="Id"
                  :filter-node-method="filterNode"
                  @node-click="treeClick"
                  ref="CarTree">
                </el-tree>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="search-quest">
        <span class="search-quest-title">时间段：</span>
        <el-date-picker
          v-model="carRoadTime"
          type="datetimerange"
          :picker-options="pickerOptions"
          align="right"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </div>
      <div class="search-quest">
        <el-button type="primary" @click.native="searchRoad">绘制路径</el-button>
      </div>
      <div class="search-quest road-event-btn">
        <el-tooltip content="播放" placement="bottom">
          <el-button type="success" icon="el-icon-video-play" :disabled="!canPlay" circle @click.native="playRoad"></el-button>
        </el-tooltip>
        <el-tooltip content="暂停" placement="bottom">
          <el-button type="warning" icon="el-icon-video-pause" :disabled="!canPlay" circle @click.native="pauseRoad"></el-button>
        </el-tooltip>
        <el-tooltip content="重置路径" placement="bottom">
          <el-button icon="el-icon-refresh" circle @click.native="resetRoad"></el-button>
        </el-tooltip>
      </div>
    </div>
    <div id="carMap"></div>
  </div>
</template>
<script>
  import { MapabcEncryptToBdmap, formatTime } from '@/filters/index'
  import { GetCarInfoTree, GetLocationMap } from '@/api/requestConfig'
  import BMap from 'BMap'
  import BMapLib from '@/utils/MakerClusterer'
  import BMAPNORMALMAP from 'BMAP_NORMAL_MAP'
  import BMAPHYBRIDMAP from 'BMAP_HYBRID_MAP'
  import CarImg from '@/assets/img/car.png'
  export default {
    name: 'Replaying',
    mounted() {
      // 设置树形最大高度
      this.maxHeight = document.getElementById('truckTree').offsetHeight + 'px'
      // 默认时间段为今天
      var today = formatTime(new Date().getTime())
      this.carRoadTime = [new Date(today + ' 00:00:00'), new Date(today + ' 23:59:59')]
      // 创建地图
      this.renderMap()
      // 获取所有车辆数
      this.getCarList()
    },
    data() {
      const pickerOptions = {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            const end = new Date()
            const endTime = formatTime(end.getTime()) + ' 23:59:59'
            const startTime = formatTime(end.getTime()) + ' 00:00:00'
            picker.$emit('pick', [new Date(startTime), new Date(endTime)])
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
            const endTime = formatTime(start.getTime()) + ' 23:59:59'
            const startTime = formatTime(start.getTime()) + ' 00:00:00'
            picker.$emit('pick', [new Date(startTime), new Date(endTime)])
          }
        }, {
          text: '前天',
          onClick(picker) {
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
            const endTime = formatTime(start.getTime()) + ' 23:59:59'
            const startTime = formatTime(start.getTime()) + ' 00:00:00'
            picker.$emit('pick', [new Date(startTime), new Date(endTime)])
          }
        }, {
          text: '最近三天',
          onClick(picker) {
            const end = new Date()
            const endTime = formatTime(end.getTime()) + ' 23:59:59'
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
            const startTime = formatTime(start.getTime()) + ' 00:00:00'
            picker.$emit('pick', [new Date(startTime), new Date(endTime)])
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const endTime = formatTime(end.getTime()) + ' 23:59:59'
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            const startTime = formatTime(start.getTime()) + ' 00:00:00'
            picker.$emit('pick', [new Date(startTime), new Date(endTime)])
          }
        }]
      }
      return {
        maxHeight: '', // 树形最大高度
        showSelectBox: true, // 车牌选择显示/隐藏
        mapLoading: true,
        carId: '', // 选中的车牌Id
        LicenseNum: '', // 搜索框车牌值
        carTreeData: [], // treeData
        defaultList: [], // 默认展开第一项
        emptyText: '暂无数据',
        defaultProps: {
          children: 'Child',
          label: 'Name'
        },
        carMap: null, // 车辆地图实例
        canPlay: false, // 能否播放
        carRoadTime: [], // 选择的时间段
        roadData: [], // 路径数据
        roadMarkerData: [], // 路径点集合数据
        pickerOptions: pickerOptions,
        speed: 10000, // 速度
        roadLuShu: null, // 路书
        carMarker: null // 汽车标记
      }
    },
    watch: {
      'LicenseNum': function(val, oldVal) {
        this.$refs.CarTree.filter(val)
      }
    },
    methods: {
      // 获取下拉列表
      getCarList() {
        GetCarInfoTree().then(res => {
          if (res.data) {
            var resData = res.data
            this.carTreeData = resData.Infos // treeData
            this.defaultList = [this.carTreeData[0].Id]
            this.mapLoading = false // 隐藏遮罩层
          }
        })
      },
      // 显示选择车牌树形控件
      chooseLicenseNum() {
        this.showSelectBox = true
      },
      // 初始化地图
      renderMap() {
        this.carMap = new BMap.Map('carMap', { minZoom: 5 }) // 创建地图实例
        this.carMap.centerAndZoom('西安', 6) // 初始化地图，设置中心点坐标和地图级别
        this.carMap.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
        // 地图控件
        var mapType = new BMap.MapTypeControl({ mapTypes: [BMAPNORMALMAP, BMAPHYBRIDMAP] })
        this.carMap.addControl(mapType)
        this.carMap.addControl(new BMap.NavigationControl())
        this.carMap.addControl(new BMap.ScaleControl())
        this.carMap.addControl(new BMap.OverviewMapControl({ isOpen: true }))
      },
      // 搜索下拉
      filterNode(value, data) {
        if (!value) return true
        return data.Name.indexOf(value) !== -1
      },
      // 选中车牌
      treeClick(data, Node, $el) {
        if (Node.isLeaf) {
          this.LicenseNum = data.Name
          this.carId = data.Id
          this.showSelectBox = false
        }
      },
      // 获取路径数据
      searchRoad() {
        if (!this.LicenseNum) {
          this.$message.error('请选择车辆')
          return
        }
        if (!this.carRoadTime || this.carRoadTime.length < 1) {
          this.$message.error('请选择查询时间段')
          return
        }
        var needData = {}
        needData.LicenseNumStr = this.LicenseNum
        needData.StartTime = formatTime(this.carRoadTime[0].getTime(), 2)
        needData.EndTime = formatTime(this.carRoadTime[1].getTime(), 2)
        GetLocationMap(needData).then(res => {
          var resData = res.data
          if (resData && resData.length > 0) {
            if (this.roadLuShu) {
              this.roadLuShu.stop() // 清楚路书
            }
            this.carMap.clearOverlays() // 清楚所有覆盖物
            this.roadData = resData[0].Info
            var pointList = []
            this.roadData.map(x => {
              var turnPoint = MapabcEncryptToBdmap(x.lon, x.lat)
              var point = new BMap.Point(turnPoint.lon, turnPoint.lat)
              pointList.push(point)
            })
            this.roadMarkerData = pointList
            this.carMap.centerAndZoom(this.roadMarkerData[0], 10) // 设置地图中心为起点
            this.drawRoad() // 绘制路径
            this.canPlay = true // 可以播放
          }
        })
      },
      // 绘制路径
      drawRoad() {
        var self = this
        self.carMap.addOverlay(new BMap.Polyline(self.roadMarkerData, { strokeColor: 'green', strokeWeight: 5, strokeOpacity: 1 })) // 画路径
        self.carMap.setViewport(self.roadMarkerData) // 最佳视野
        self.carMarker = new BMap.Marker(self.roadMarkerData[0], { icon: new BMap.Icon(CarImg, new BMap.Size(55, 21), { anchor: new BMap.Size(27, 13) }) })
        // 小车信息
        var label = new BMap.Label(self.LicenseNum, { offset: new BMap.Size(0, -35) })
        label.setStyle({ border: '1px solid rgb(204, 204, 204)', color: 'rgb(0, 0, 0)', borderRadius: '5px', padding: '5px', background: 'rgb(255, 255, 255)' })
        self.carMarker.setLabel(label) // 车标样式
        self.carMap.addOverlay(self.carMarker) // 把车标记加入地图
        self.LuShuStart() // 开启路书
      },
      // 路书
      LuShuStart() {
        var self = this
        self.roadLuShu = new BMapLib.LuShu(self.carMap, self.roadMarkerData, {
          defaultContent: self.LicenseNum,
          autoView: true, // 是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
          icon: new BMap.Icon(CarImg, new BMap.Size(55, 21), { anchor: new BMap.Size(27, 13) }),
          speed: self.speed,
          enableRotation: true, // 是否设置marker随着道路的走向进行旋转
          landmarkPois: [
            // { lng: 116.306954, lat: 40.05718, html: '加油站', pauseTime: 2 }
          ]
        })
      },
      // 开始播放
      playRoad() {
        this.carMarker.enableMassClear() // 设置后可以隐藏改点的覆盖物
        this.carMarker.hide()
        this.roadLuShu.start()
      },
      // 暂停播放
      pauseRoad() {
        this.roadLuShu.pause()
      },
      // 重置
      resetRoad() {
        this.searchRoad()
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/zc-table-common.scss";
  .mainWrap{
    width: 100%;
    flex-grow: 1;
    padding: 15px;
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  #carMap{
    width: 100%;
    flex-grow: 1;
    z-index: 1;
  }
  .search-input-position{
    position: relative;
  }
  .choose-box{
    position: absolute;
    left: 0;
    top: 45px;
    width: 250px;
    height: 400px;
    border-radius: 4px;
    background-color: #ffffff;
    border: 1px solid #efefef;
    box-sizing: border-box;
    padding: 5px;
    z-index: 99;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .tree-body{
      width: 100%;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      .search-car-div{
        width: 100%;
        padding: 5px 0;
      }
      .tree-scroll-div{
        flex-grow: 1;
        width: 100%;
        overflow: hidden;
        .filter-tree{
          overflow-y: auto;
        }
      }
    }
  }
</style>
