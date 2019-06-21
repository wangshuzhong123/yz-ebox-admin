<!--定位服务-->
<template>
  <div class="mainWrap"  
    v-loading="mapLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 50, 50, 0.7)">
    <div id="carMap"></div>
    <!-- 下拉选择车牌 -->
    <div class="tree-wrap" :style="{'height': treeHeight}">
      <div class="tree-header">
          <div class="header-item"><i class="car-status-icon car-all-status el-icon-truck"></i><span>全部:</span><span>{{allCar}}</span></div>
          <div class="header-item"><i class="car-status-icon car-success-status el-icon-loading"></i><span>运行:</span><span>{{RunCar}}</span></div>
          <div class="header-item"><i class="car-status-icon car-warning-status el-icon-moon"></i><span>停车:</span><span>{{StopCar}}</span></div>
          <div class="header-item"><i class="car-status-icon car-info-status el-icon-scissors"></i><span>离线:</span><span>{{OffLineCar}}</span></div>
          <div class="header-item"><i class="car-status-icon car-danger-status el-icon-alarm-clock"></i><span>告警:</span><span>{{''}}</span></div>
          <div class="header-item"><i class="car-event-btn" :class="showFlag ? ' el-icon-caret-bottom':' el-icon-caret-top'" @click="showTree"></i></div>
      </div>
      <div class="tree-body">
        <div class="search-car-div">
          <el-input
            placeholder="输入车牌号进行搜索"
            v-model="LicenseNum">
          </el-input>
        </div>
        <div id="truckTree" class="tree-scroll-div">
          <el-tree
            :style="{'maxHeight': maxHeight}"
            class="filter-tree"
            :data="carTreeData"
            :props="defaultProps"
            :empty-text="emptyText"
            :default-expanded-keys="defaultList"
            show-checkbox
            node-key="Id"
            :filter-node-method="filterNode"
            :render-content="renderContent"
            @check="checkTreeChange"
            ref="CarTree">
          </el-tree>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { MapabcEncryptToBdmap } from '@/filters/index'
  import { GetLocationInfo, GetCarInfoTree } from '@/api/requestConfig'
  import BMap from 'BMap'
  import BMapLib from '@/utils/MakerClusterer'
  import BMAPNORMALMAP from 'BMAP_NORMAL_MAP'
  import BMAPHYBRIDMAP from 'BMAP_HYBRID_MAP'
  import { setTimeout } from 'timers'
  export default {
    name: 'LocationService',
    mounted() {
      // 设置树形最大高度
      this.maxHeight = document.getElementById('truckTree').offsetHeight + 'px'
      // 创建地图
      this.renderMap()
      // 获取所有车辆数
      this.getCarList()
    },
    data() {
      return {
        maxHeight: '', // 最大高度
        mapLoading: true,
        showFlag: true,
        treeHeight: '90%',
        LicenseNum: '', // 搜索框值
        carTreeData: [], // treeData
        defaultList: [], // 默认展开第一项
        allCar: '', // 所有车辆
        RunCar: '', // 运行车辆
        StopCar: '', // 停车车辆
        OffLineCar: '', // 离线车辆
        emptyText: '暂无数据',
        defaultProps: {
          children: 'Child',
          label: 'Name'
        },
        carMap: null, // 地图实例
        checkedCarList: [], // 选中车辆列表
        markerClusterer: null, // 聚合
        carPointList: [] // 点聚合
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
            this.RunCar = resData.Run // 运行车辆
            this.StopCar = resData.Stop // 停车车辆
            this.OffLineCar = resData.OffLine // 离线车辆
            this.allCar = parseInt(resData.Run) + parseInt(resData.Stop) + parseInt(resData.OffLine)
            this.carTreeData = resData.Infos // treeData
            this.defaultList = [this.carTreeData[0].Id]
            this.mapLoading = false // 隐藏遮罩层
          }
        })
      },
      // 自定义叶子节点内容
      renderContent(h, { node, data, store }) {
        var renderHtml = ''
        if (data.Child && data.Child.length > 0) {
          renderHtml = (
            <span>{data.Name}</span>
          )
        } else {
          renderHtml = (
            <span>
              <span style='padding: 0 5px;'>
                { data.Status === '行驶' ? <i class='el-icon-loading' style='color: #67C23A'></i> : ''}
                { data.Status === '停放' ? <i class='el-icon-moon' style='color: #E6A23C'></i> : ''}
                { data.Status === '离线' ? <i class='el-icon-scissors' style='color: #909399'></i> : ''}
                { !data.Status ? <i style='display: inline-block;width: 14px;height: 14px;'></i> : ''}
              </span>
              <span>{data.Name}</span>
              <span style='padding: 0 5px;'>
                { data.IsAlarm ? <i class='el-icon-alarm-clock' style='color: #F56C6C' on-click={ () => this.viewWarnInfo(data) }></i> : ''}
              </span>
            </span>
          )
        }
        return renderHtml
      },
      // 查看报警信息
      viewWarnInfo(data) {
        this.$message.error('报警的车牌号为' + data.Name)
      },
      // 初始化地图
      renderMap() {
        this.carMap = new BMap.Map('carMap', { minZoom: 5 }) // 创建地图实例
        this.carMap.centerAndZoom('西安', 6) // 初始化地图，设置中心点坐标和地图级别
        this.carMap.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
        // 地图控件
        var mapType = new BMap.MapTypeControl({ mapTypes: [BMAPNORMALMAP, BMAPHYBRIDMAP] })
        this.carMap.addControl(mapType)
      },
      // 展开与隐藏tree
      showTree() {
        this.showFlag = !this.showFlag
        this.treeHeight = this.showFlag ? '90%' : '100px'
      },
      // 搜索下拉
      filterNode(value, data) {
        if (!value) return true
        return data.Name.indexOf(value) !== -1
      },
      // 选中车牌号
      checkTreeChange(node, allNode) {
        var checkedList = this.$refs.CarTree.getCheckedKeys(true) // 获取所有选中的叶子节点
        // 清楚已有聚合marker
        if (this.carPointList.length > 0) {
          this.carPointList.splice(0)
          this.carMap.closeInfoWindow() // 关闭
          this.markerClusterer.clearMarkers() // 清楚聚合
        }
        // 重新加载聚合marker
        if (checkedList.length > 0) {
          this.getMapPointByCar(checkedList.toString())
        }
      },
      // 取出两个数组不同的地方
      getArrDifference(arr1, arr2) {
        return arr1.concat(arr2).filter(function(v, i, arr) {
          return arr.indexOf(v) === arr.lastIndexOf(v)
        })
      },
      // 根据车牌获取对应数据，渲染地图
      getMapPointByCar(ids) {
        var needData = {}
        needData.PageIndex = 0
        needData.SearchXml = 'platform/Location/SearchLocation'
        needData.Param = {}
        needData.Param.IdStr = ids
        GetLocationInfo(needData).then(res => {
          if (res.data) {
            this.checkedCarList = res.data.list
            // 渲染地图标记
            this.renderAllTag()
          } else {
            this.$message.error(res.message)
          }
        })
      },
      // 渲染地图标记
      renderAllTag() {
        // 生成marker
        for (var i = 0; i < this.checkedCarList.length; i++) {
          var monitorData = this.checkedCarList[i]
          if (monitorData.Lat && monitorData.Lon) {
            var turnBadiDu = MapabcEncryptToBdmap(monitorData.Lon, monitorData.Lat)
            var newPointer = new BMap.Point(turnBadiDu.lon, turnBadiDu.lat)
            var marker = null
            marker = new BMap.Marker(newPointer)
            marker.data = monitorData
            // 标注标签
            var labelOption = {
              offset: new BMap.Size(-20, -20)
            }
            var label = new BMap.Label(monitorData.LicenseNum, labelOption)
            // 根据状态设置颜色
            var labelStatus = monitorData.Status
            if (labelStatus === '行驶') {
              label.setStyle({ color: '#ffffff', fontSize: '12px', background: '#67C23A', border: 0 })
            } else if (labelStatus === '停放') {
              label.setStyle({ color: '#ffffff', fontSize: '12px', background: '#E6A23C', border: 0 })
            } else if (labelStatus === '离线') {
              label.setStyle({ color: '#ffffff', fontSize: '12px', background: '#909399', border: 0 })
            }
            marker.setLabel(label)
            this.carPointList.push(marker) // marker集合
            // marker绑定事件
            this.addClickHandler(monitorData, marker)
          }
        }
        // 聚合
        this.markerClusterer = new BMapLib.MarkerClusterer(this.carMap, { markers: this.carPointList }) // 聚合
        // 设置最后一个marker为地图中心
        var centerPoint = new BMap.Point(this.carPointList[this.carPointList.length - 1].point.lng, this.carPointList[this.carPointList.length - 1].point.lat)
        this.carMap.setCenter(centerPoint) // 设置点击的标记为地图中心
      },
      // 地图标注添加事件
      addClickHandler(json, marker) {
        var self = this
        marker.addEventListener('click', function(e) {
          var p = e.target
          var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat)
          self.carMap.setCenter(point) // 设置点击的标记为地图中心
          var needStr = `<div>
            <h4 style='margin:0 0 5px 0;padding:0.2em 0'>${json.LicenseNum}</h4>
            <p style='margin:0;line-height:1.5;font-size:13px;text-indent:1em'><span>经度：</span><span>${json.Lon}</span></p>
            <p style='margin:0;line-height:1.5;font-size:13px;text-indent:1em'><span>纬度：</span><span>${json.Lat}</span></p>
            <p style='margin:0;line-height:1.5;font-size:13px;text-indent:1em'><span>车速(km/h)：</span><span>${json.Speed}</span></p>
            <p style='margin:0;line-height:1.5;font-size:13px;text-indent:1em'><span>状态：</span><span>${json.Status}</span></p>
            <p style='margin:0;line-height:1.5;font-size:13px;text-indent:1em'><span>最新位置：</span><span>${json.LastAddress}</span></p>
            <p style='margin:0;line-height:1.5;font-size:13px;text-indent:1em'><span>最新更新时间：</span><span>${json.LatAndLonUpdateTime}</span></p>
            <button style='margin: 10px;font-size:13px;width: 50px;height: 25px;cursor:pointer;background-color: #409EFF;color: #ffffff;border: 0;text-align: center;' id="${json.Id}">路径</button>
          </div>`
          var infoWindow = new BMap.InfoWindow(needStr) // 创建信息窗口对象
          self.carMap.openInfoWindow(infoWindow, point) // 开启信息窗口
          setTimeout(() => {
            self.testClick(json.Id) // 路径的点击事件
          }, 0)
        })
      },
      testClick(id) {
        var ele = document.getElementById(id + '')
        ele.addEventListener('click', function(e) {
          alert(id)
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .mainWrap{
    width: 100%;
    flex-grow: 1;
    padding: 15px;
    box-sizing: border-box;
    position: relative;
  }
  #carMap{
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .tree-wrap{
    width: 350px;
    min-height: 100px;
    height: 90%;
    z-index: 99;
    overflow: hidden;
    position: absolute;
    top: 30px;
    left: 30px;
    background: #fff;
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    flex-direction: column;
    transition: height 1s;
    .tree-header{
      width: 100%;
      min-height: 80px !important;
      overflow: hidden;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      line-height: 40px;
      .header-item{
        width: 33%;
        text-align: center;
      }
    }
    .tree-body{
      width: 100%;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      .search-car-div{
        width: 100%;
        padding: 10px 0;
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
    .car-status-icon{
      font-size: 18px;
      margin-right: 2px;
    }
    .car-all-status{
      color: #409EFF;
    }
    .car-success-status{
      color: #67C23A;
    }
    .car-warning-status{
      color: #E6A23C;
    }
    .car-danger-status{
      color: #F56C6C;
    }
    .car-info-status{
      color: #909399;
    }
    .car-event-btn{
      cursor: pointer;
      font-size: 26px;
      color: #409EFF;
    }
  }
</style>
