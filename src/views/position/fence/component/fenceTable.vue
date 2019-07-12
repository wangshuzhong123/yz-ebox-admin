<template>
  <div class="zc-table-common">
    <div class="zc-table-search">
      <div class="search-quest">
        <span class="search-quest-title">电子围栏：</span>
        <div class="search-input">
          <el-input v-model="Name" placeholder="请输入电子围栏名称"></el-input>
        </div>
      </div>
      <div class="search-quest">
        <el-button @click.native="clearSearch">清空条件</el-button>
        <el-button type="primary" @click.native="searchTable">搜索</el-button>
      </div>
    </div>
    <div class="zc-table-event-btn">
      <el-button type="primary" @click.native='showRoadFlag'>新增围栏</el-button>
    </div>
    <div class="zc-table-body">
      <el-table
        ref="carTable"
        :data="carListTable.list"
        :empty-text="emptyText"
        v-loading="tableLoading"
        border
        style="width: 100%">
        <el-table-column
          prop="Name"
          label="电子围栏名称">
        </el-table-column>
        <el-table-column
          prop="Comment"
          label="备注">
        </el-table-column>
        <el-table-column
            prop="AddDateTime"
            label="日期">
        </el-table-column>
         <el-table-column
          prop="IsActivity"
          label="状态">
          <template slot-scope="scope">
            <span>
              <i class="el-icon-success diy-success" v-if="scope.row.IsActivity"></i>
              <i class="el-icon-error diy-error" v-else></i>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native="editEle(scope.row.Id)">编辑</el-button>
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
    <!-- 电子围栏地图 -->
    <el-dialog
      ref="roadRef"
      :title="dialogInfo.title"
      custom-class="dialog-wrap" 
      :visible.sync="dialogInfo.roadFlag" 
      width="90%" 
      top="2vh" 
      :close-on-click-modal="dialogInfo.default" 
      :close-on-press-escape="dialogInfo.default"
      >
      <div class="dialog-content">
        <div class="dialog-search">
          <div class="zc-table-search">
            <div class="search-quest">
              <el-button type="primary" @click.native="removeLayerInformation">清除覆盖物</el-button>
              <!-- <el-button type="primary" @click.native="getLayerInformation">获取覆盖物</el-button> -->
            </div>
          </div>
        </div>
        <div class="dialog-cont">
          <div id="roadMapDiv"></div>
        </div>
      </div>
    </el-dialog>
     <!-- 新增电子围栏 -->
    <el-dialog
      :title="eventDialong.title"
      custom-class="dialog-wrap" 
      :visible.sync="eventDialong.eventFlag" 
      width="500px" 
      :close-on-click-modal="eventDialong.default" 
      :close-on-press-escape="eventDialong.default"
      >
      <div class="dialog-content">
        <div class="dialog-cont">
          <el-form :model="ruleForm" :rules="rules" ref="EleForm" label-width="120px" label-suffix="：">
              <el-form-item label="电子围栏名称" prop="Name">
                <div class="cont-input">
                  <el-input v-model="ruleForm.Name" placeholder="请输入电子围栏名称"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="中心点纬度" prop="Lat">
                <div class="cont-input">
                  <el-input v-model="ruleForm.Lat" placeholder="请输入中心点纬度" disabled></el-input>
                </div>
              </el-form-item>
              <el-form-item label="中心点经度" prop="Lon">
                <div class="cont-input">
                  <el-input v-model="ruleForm.Lon" placeholder="请输入中心点经度" disabled></el-input>
                </div>
              </el-form-item>
              <el-form-item label="半径" prop="Radius">
                <div class="cont-input">
                  <el-input v-model="ruleForm.Radius" placeholder="请输入半径" disabled></el-input>
                </div>
              </el-form-item>
              <el-form-item label="备注" prop="Comment">
                <div class="cont-input">
                  <el-input v-model="ruleForm.Comment" placeholder="请输入备注"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="状态" prop="IsActivity">
                <div class="cont-input">
                  <el-switch
                    v-model="ruleForm.IsActivity"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </el-switch>
                </div>
              </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addElePop">取 消</el-button>
        <template v-if="eventStatus === 'add'">
          <el-button type="primary" @click.native="postInfo">新增</el-button>
        </template>
        <template v-else-if="eventStatus === 'edit'">
          <el-button type="primary" @click.native="saveEditInfo">保存编辑</el-button>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { GetElectronicPageList, AddElectronic, UpdateElectronic, GetElectronicSingle } from '@/api/requestConfig'
import BMap from 'BMap'
import BMapLibOut from 'BMapLib'
import BMapLib from '@/utils/MakerClusterer'
import { bd09togcj02, gcj02towgs84 } from '@/utils/transformLatLng'
import BMAP_ANCHOR_TOP_RIGHT from 'BMAP_ANCHOR_TOP_RIGHT'
export default {
  name: 'FenceTable',
  mounted() {
    console.log(BMapLibOut)
    // 获取电子围栏表格
    this.getCarListTable()
  },
  computed: {
    ...mapGetters(['commonTabInfo'])
  },
  watch: {
    'commonTabInfo.text': function(val, oldVal) {
      if (val === 'refresh' && this.commonTabInfo.custom === 'fence') {
        this.clearSearch()
      } else if (val === 'update' && this.commonTabInfo.custom === 'fence') {
        this.searchTable()
      }
    }
  },
  data() {
    return {
      eventStatus: '',
      emptyText: '未匹配到电子围栏数据',
      Name: '', // 电子围栏
      carListTable: {},
      pageInfo: {
        SearchXml: 'platform/Car/SearchCar',
        PageIndex: 1,
        PageSize: 10
      },
      dialogMapHeight: '',
      roadMap: null,
      drawingManager: null,
      dialogInfo: {
        title: '电子围栏',
        roadFlag: false, // 弹窗是否显示
        default: false
      },
      overlays: [], // 覆盖物
      tableLoading: true,
      eventDialong: {
        title: '电子围栏',
        eventFlag: false, // 弹窗是否显示
        default: false
      },
      ruleForm: {
        IsActivity: true,
        Name: '',
        Lat: '',
        Lon: '',
        Radius: '',
        JsonData: '',
        Comment: ''
      },
      editData: '',
      rules: {
        Name: [
          { required: true, message: '请输入电子围栏名称', trigger: 'blur' }
        ]
      }
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
      this.Name = ''
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
    // 获取电子围栏表格
    getCarListTable() {
      this.tableLoading = true
      var needData = {}
      needData.Param = {}
      needData.PageIndex = this.pageInfo.PageIndex
      needData.PageSize = this.pageInfo.PageSize
      needData.SearchXml = this.pageInfo.SearchXml
      if (this.Name) {
        needData.Param.Name = this.Name
      }
      // 获取电子围栏列表
      GetElectronicPageList(needData).then(res => {
        if (res.data) {
          this.carListTable = res.data
        } else {
          this.$message.error(res.message)
        }
        this.tableLoading = false
      })
    },
    // 路径地图弹窗显示隐藏
    showRoadFlag() {
      this.eventStatus = 'add'
      this.showRoadPop()
      // 加载路径地图(dialog未加载，需要nextTick触发)
      this.$nextTick(() => {
        this.renderRoadMap()
      })
    },
    // 路径地图弹窗显示隐藏
    showRoadPop() {
      this.dialogInfo.roadFlag = !this.dialogInfo.roadFlag
    },
    // 初始化路径地图
    renderRoadMap() {
      var self = this
      this.roadMap = new BMap.Map('roadMapDiv', { minZoom: 5 }) // 创建地图实例
      this.roadMap.centerAndZoom('西安', 6) // 初始化地图，设置中心点坐标和地图级别
      this.roadMap.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
      // 加载完地图获取数据
      console.log(BMapLib)
      var styleOptions = {
        strokeColor: 'red', // 边线颜色。
        fillColor: 'red', // 填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3, // 边线的宽度，以像素为单位。
        strokeOpacity: 0.8, // 边线透明度，取值范围0 - 1。
        fillOpacity: 0.6, // 填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' // 边线的样式，solid或dashed。
      }
      // 实例化鼠标绘制工具
      this.drawingManager = new BMapLibOut.DrawingManager(this.roadMap, {
        isOpen: false, // 是否开启绘制模式
        enableDrawingTool: true, // 是否显示工具栏
        drawingToolOptions: {
          anchor: BMAP_ANCHOR_TOP_RIGHT, // 位置
          offset: new BMap.Size(5, 5) // 偏离值
        },
        circleOptions: styleOptions, // 圆的样式
        polylineOptions: styleOptions, // 线的样式
        polygonOptions: styleOptions, // 多边形的样式
        rectangleOptions: styleOptions // 矩形的样式
      })
      // 添加鼠标绘制工具监听事件，用于获取绘制结果
      this.drawingManager.addEventListener('overlaycomplete', self.overlaycomplete)
    },
    // 绘制结束事件
    overlaycomplete(e) {
      console.log(e)
      if (e.drawingMode === 'circle') {
        this.overlays.push(e.overlay)
        this.toAddEle()
      } else {
        this.removeLayerInformation()
        this.$message.error('目前只支持圆形电子围栏')
        return
      }
    },
    // 清除覆盖物
    removeLayerInformation() {
      for (var i = 0; i < this.overlays.length; i++) {
        this.roadMap.removeOverlay(this.overlays[i])
      }
    },
    // 获取绘制覆盖物信息
    getLayerInformation() {
      console.log(this.overlays[0].getRadius())
      var center = this.overlays[0].point
      var cH = bd09togcj02(center.lng, center.lat)
      console.log('圆心', gcj02towgs84(cH[0], cH[1]))
      console.log('半径', this.overlays[0].getRadius())
      var dot = this.overlays[0].getPath()
      var dotOne = dot[0]
      var dotOneHa = bd09togcj02(dotOne.lng, dotOne.lat)
      console.log('点', gcj02towgs84(dotOneHa[0], dotOneHa[1]))
    },
    // 新增电子围栏弹窗
    toAddEle() {
      // 清楚之前的
      if (this.eventStatus === 'add') {
        this.ruleForm.Name = ''
        this.ruleForm.Comment = ''
        this.ruleForm.Lat = ''
        this.ruleForm.Lon = ''
        this.ruleForm.IsActivity = true
        this.ruleForm.Radius = ''
        this.ruleForm.JsonData = ''
      }
      this.getLayerInformation()
      this.addElePop()
      var center = this.overlays[0].point
      var cH = bd09togcj02(center.lng, center.lat) // 圆心
      var cHGPS = gcj02towgs84(cH[0], cH[1]) // 圆心
      var allDot = this.overlays[0].getPath() // 所有点
      this.ruleForm.Lat = cHGPS[0]
      this.ruleForm.Lon = cHGPS[1]
      this.ruleForm.Radius = this.overlays[0].getRadius()
      this.ruleForm.JsonData = JSON.stringify(allDot)
    },
    // 新增电子围栏弹窗显示
    addElePop() {
      this.eventDialong.eventFlag = !this.eventDialong.eventFlag
    },
    // 提交信息
    postInfo() {
      var self = this
      this.$refs.EleForm.validate(function(valid) {
        if (valid) {
          var needData = {}
          needData.Name = self.ruleForm.Name
          needData.Lat = self.ruleForm.Lat
          needData.Lon = self.ruleForm.Lon
          needData.Radius = self.ruleForm.Radius
          needData.Comment = self.ruleForm.Comment
          needData.JsonData = self.ruleForm.JsonData
          needData.Type = 1
          needData.IsActivity = self.ruleForm.IsActivity
          AddElectronic(needData).then(res => {
            if (res.status === 'success') {
              self.$message.success(res.message)
              self.addElePop()
              self.showRoadFlag()
              self.getCarListTable()
            } else {
              self.$message.error(res.message)
            }
          }).catch(error => {
            console.log(error)
          })
        } else {
          return
        }
      })
    },
    // 保存编辑
    saveEditInfo() {
      var self = this
      this.$refs.EleForm.validate(function(valid) {
        if (valid) {
          var needData = {}
          needData.Name = self.ruleForm.Name
          needData.Lat = self.ruleForm.Lat
          needData.Lon = self.ruleForm.Lon
          needData.Radius = self.ruleForm.Radius
          needData.Comment = self.ruleForm.Comment
          needData.JsonData = self.ruleForm.JsonData
          needData.Type = 1
          needData.IsActivity = self.ruleForm.IsActivity
          needData.Id = self.editData.Id
          UpdateElectronic(needData).then(res => {
            if (res.status === 'success') {
              self.$message.success(res.message)
              self.addElePop()
              self.showRoadFlag()
              self.getCarListTable()
            } else {
              self.$message.error(res.message)
            }
          }).catch(error => {
            console.log(error)
          })
        } else {
          return
        }
      })
    },
    // 编辑电子围栏
    editEle(rowId) {
      this.eventStatus = 'edit'
      this.showRoadPop()
      // 获取详情
      this.getEleInfo(rowId)
      // 加载路径地图(dialog未加载，需要nextTick触发)
      this.$nextTick(() => {
        this.renderRoadMap()
      })
    },
    // 获取电子围栏详情
    getEleInfo(rowId) {
      GetElectronicSingle(rowId).then(res => {
        this.editData = res.data
        this.renderEleInfo()
      })
    },
    // 渲染详情
    renderEleInfo() {
      this.addElePop()
      this.ruleForm.Name = this.editData.Name
      this.ruleForm.Comment = this.editData.Comment
      this.ruleForm.Lat = this.editData.Lat
      this.ruleForm.Lon = this.editData.Lon
      this.ruleForm.Radius = this.editData.Radius
      this.ruleForm.IsActivity = this.editData.IsActivity
      this.ruleForm.JsonData = this.editData.JsonData
      // 画圆
      var renderPoint = JSON.parse(this.editData.JsonData)
      var polArry = []
      renderPoint.forEach(item => {
        var p = new BMap.Point(item.lng, item.lat)
        polArry.push(p)
      })
      var styleOptions = {
        strokeColor: 'red', // 边线颜色。
        fillColor: 'red', // 填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3, // 边线的宽度，以像素为单位。
        strokeOpacity: 0.8, // 边线透明度，取值范围0 - 1。
        fillOpacity: 0.6, // 填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' // 边线的样式，solid或dashed。
      }
      var polygon = new BMap.Polygon(polArry, styleOptions)
      this.roadMap.addOverlay(polygon)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/zc-table-common.scss";
@import "src/styles/info.scss";
.dialog-content{
  width: 100%;
  box-sizing: border-box;
}
.dialog-cont{
  width: 100%;
  box-sizing: border-box;
  #roadMapDiv{
    width: 100%;
    height: 600px;
  }
}
</style>
