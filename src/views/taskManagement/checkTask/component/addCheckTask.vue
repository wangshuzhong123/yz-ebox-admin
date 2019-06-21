<template>
  <div class="event-street">
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title"><i class="form-must-tip">*</i>巡检房屋：</span>
        <div class="street-form-input" v-if="commonTabInfo.text === '新增巡检任务'">
          <span class="choose-input to-choose-target" @click="showHousePop">
            <span class="checked-resource-cont" v-for="list,i in multipleSelection" :title="list.house.name">
              <span v-text="list.house.name"></span><i class="close-icon-x" @click.stop="cancelChecked(i)">x</i>
            </span>
          </span>
        </div>
        <div class="street-form-input" v-else>
          {{showTargetName}}
        </div>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title"><i class="form-must-tip">*</i>巡检合同开始日期：</span>
        <el-date-picker
          v-model="startTime"
          type="date"
          placeholder="选择日期"
          :editable="false"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title"><i class="form-must-tip">*</i>巡检合同结束日期：</span>
        <el-date-picker
          v-model="endTime"
          type="date"
          :editable="false"
          placeholder="选择日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title"><i class="form-must-tip">*</i>负责人：</span>
        <template v-if="commonTabInfo.text === '新增巡检任务'">
          <el-select v-model="principalId" placeholder="请选择">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
          <template v-if="principalList.length > 0">
            <el-select v-model="principalVal" placeholder="请选择">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="item in principalList" :key="item.id" :label="turnUserName(item.realName, item.userName)" :value="item.id"></el-option>
            </el-select>
          </template>
        </template>
        <template v-else>
          <template v-if="personOne">
            <span class="house-areaInfo-edit">{{personOneVal}}</span>
          </template>
          <template v-else>
            <el-select v-model="principalId" placeholder="请选择">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
            </el-select>
            <template v-if="principalList.length > 0">
              <el-select v-model="principalVal" placeholder="请选择">
                <el-option label="请选择" value=""></el-option>
                <el-option v-for="item in principalList" :key="item.id" :label="turnUserName(item.realName, item.userName)" :value="item.id"></el-option>
              </el-select>
            </template>
          </template>
          <el-button type="primary" @click.native="toChangeOne">{{personOneBtn}}</el-button>
        </template>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title"><i class="form-must-tip">*</i>巡检人：</span>
        <template v-if="commonTabInfo.text === '新增巡检任务'">
          <el-select v-model="carryRoleId" placeholder="请选择">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
          <template v-if="carryRoleList.length > 0">
            <el-select v-model="carryRoleVal" placeholder="请选择">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="item in carryRoleList" :key="item.id" :label="turnUserName(item.realName, item.userName)" :value="item.id"></el-option>
            </el-select>
          </template>
        </template>
        <template v-else>
          <template v-if="personTwo">
            <span class="house-areaInfo-edit">{{personTwoVal}}</span>
          </template>
          <template v-else>
            <el-select v-model="carryRoleId" placeholder="请选择">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
            </el-select>
            <template v-if="carryRoleList.length > 0">
              <el-select v-model="carryRoleVal" placeholder="请选择">
                <el-option label="请选择" value=""></el-option>
                <el-option v-for="item in carryRoleList" :key="item.id" :label="turnUserName(item.realName, item.userName)" :value="item.id"></el-option>
              </el-select>
            </template>
          </template>
          <el-button type="primary" @click.native="toChangeTwo">{{personTwoBtn}}</el-button>
        </template>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title"><i class="form-must-tip">*</i>巡检频次：</span>
        <el-select v-model="checkTime" placeholder="请选择">
          <el-option label="请选择" value=""></el-option>
          <el-option v-for="todo in 10" :key="todo" :label="todo" :value="todo"></el-option>
        </el-select>
        <span style="margin-left: 15px;">周/次</span>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title" style="float: left;">鉴定报告问题：</span>
        <el-input class="reject-reason" type="textarea" v-model="reportProblem" placeholder="请输入鉴定报告问题"></el-input>
      </div>
    </div>
    <div class="street-footer-btn">
      <el-button @click.native="eventStreet(false, '1', false, 'first')">取消</el-button>
      <template v-if="commonTabInfo.text === '新增巡检任务'">
        <el-button type="primary" @click.native="saveEvent">保存</el-button>
      </template>
      <template v-else>
        <el-button type="primary" @click.native="editEvent">保存编辑</el-button>
      </template>
    </div>
    <el-dialog title="选择房屋" custom-class="dialog-table" :visible.sync="handleFlag" width="900px" top="10vh" :close-on-click-modal="dialogInfo.default" :close-on-press-escape="dialogInfo.default">
      <div class="zc-table-search dialog-table-search">
        <div class="search-quest">
          <span class="search-quest-title">地址：</span>
          <areachoose ref="Areachoose" :type="areaSelectOption.type" :status="areaSelectOption.status" @areainfo="getAreaProps"></areachoose>
        </div>
        <div class="search-quest">
          <span class="search-quest-title">房屋名称：</span>
          <div class="search-input">
            <el-input v-model="houseName" placeholder="请输入房屋名称"></el-input>
          </div>
        </div>
        <div class="search-quest">
          <el-button @click.native="clearSearch">清空条件</el-button>
          <el-button type="primary" @click.native="searchTable">搜索</el-button>
        </div>
      </div>
      <div class="dialog-table-content-checked">
        <div class="zc-table-body">
          <el-table
            :data="houseTable.list"
            :empty-text="emptyText"
            v-loading="houseLoading"
            @row-click="onClickRow"
            border
            style="width: 100%">
            <el-table-column
              type="index"
              width="80"
              label="序号">
            </el-table-column>
            <el-table-column
              prop="province"
              :formatter="tableFormatter"
              label="省">
            </el-table-column>
            <el-table-column
              prop="city"
              :formatter="tableFormatter"
              label="市">
            </el-table-column>
            <el-table-column
              prop="county"
              :formatter="tableFormatter"
              label="区">
            </el-table-column>
            <el-table-column
              prop="street"
              :formatter="tableFormatter"
              label="街道">
            </el-table-column>
            <el-table-column
              prop="community"
              :formatter="tableFormatter"
              label="社区">
            </el-table-column>
            <el-table-column
              prop="name"
              :formatter="tableFormatter"
              label="房屋">
              <template slot-scope="scope">
                <span>{{scope.row.house.name}}</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="zc-page-box">
            <el-pagination
              background
              layout="prev, pager, next"
              :page-size="pageInfo.pageSize"
              :current-page="pageInfo.pageNum"
              :total="houseTable.totalRow"
              @current-change="changePage"
            >
            </el-pagination>
          </div>
        </div>
        <div class="checked-resource">
          <span class="checked-resource-cont" v-for="list,i in multipleSelection" :title="list.house.name">
            <span v-text="list.house.name"></span><i class="close-icon-x" @click="cancelChecked(i)">x</i>
          </span>
        </div>
      </div>
      <div class="foot-empty"></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handlePop">取 消</el-button>
        <el-button type="primary" @click.native="toChooseTarget">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Areachoose from '@/components/areaChoose'
  import { addTask, getHouseTable, getRoleList, getUserByRoleId, updateTask } from '@/api/requestConfig'
  import { formatTime } from '@/filters/index'
  export default {
    name: 'AddCheckTask',
    data() {
      return {
        addFlag: true, // 新增标记
        showTargetName: '',
        startTime: '',
        endTime: '',
        principalId: '', // 负责人id
        carryRoleId: '', // 执行人id
        principalVal: '', // 负责人
        carryRoleVal: '', // 执行人
        principalList: [], // 负责人列表
        carryRoleList: [], // 执行人列表
        roleList: [], // 角色列表
        checkTime: '',
        handleFlag: false, // 选择房屋dialog
        dialogInfo: {
          default: false // 禁止点击遮罩层关闭
        },
        emptyText: '未匹配到房屋数据',
        houseName: '',
        houseTable: {},
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        },
        houseLoading: true,
        multipleSelection: [], // 多选值
        areaSelectOption: {
          type: 5,
          data: '',
          status: ''
        }, // 地区组件option
        personOne: true,
        personOneVal: '',
        personOneBtn: '更改',
        personTwo: true,
        personTwoVal: '',
        personTwoBtn: '更改',
        reportProblem: ''
      }
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
      'principalId': function(val, oldVal) {
        if (val) {
          this.principalVal = ''
          this.getUserById(val, 1)
        } else {
          this.principalList.splice(0)
        }
      },
      'carryRoleId': function(val, oldVal) {
        if (val) {
          this.carryRoleVal = ''
          this.getUserById(val, 2)
        } else {
          this.principalList.splice(0)
        }
      },
      'personOne': function(val, oldVal) {
        if (val) {
          this.personOneBtn = '更改'
        } else {
          this.personOneBtn = '返回'
        }
      },
      'personTwo': function(val, oldVal) {
        if (val) {
          this.personTwoBtn = '更改'
        } else {
          this.personTwoBtn = '返回'
        }
      }
    },
    created() {
      // 获取角色列表
      this.toGetRoleList()
      this.renderData()
    },
    methods: {
      // 获取角色列表
      toGetRoleList() {
        getRoleList().then(res => {
          if (res.status === 200) {
            this.roleList = res.data
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      // 通过角色获取用户 type（1：负责人，2：巡检人）
      getUserById(id, type) {
        getUserByRoleId(id).then(res => {
          if (res.status === 200) {
            if (type === 1) {
              this.principalList = res.data
            } else if (type === 2) {
              this.carryRoleList = res.data
            }
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      // 街道操作
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
      // 新增房屋
      saveEvent() {
        if (!this.addFlag) {
          return
        }
        if (this.multipleSelection.length < 1) {
          this.$message.error('请选择房屋')
          return
        }
        if (!this.startTime) {
          this.$message.error('请选择巡检开始日期')
          return
        }
        if (!this.endTime) {
          this.$message.error('请选择巡检结束日期')
          return
        }
        if (new Date(this.startTime).getTime() > new Date(this.endTime).getTime()) {
          this.$message.error('巡检开始日期不能晚于巡检结束日期')
          return
        }
        if (!this.principalVal) {
          this.$message.error('请选择负责人')
          return
        }
        if (!this.carryRoleVal) {
          this.$message.error('请选择巡检人')
          return
        }
        if (!this.checkTime) {
          this.$message.error('请选择巡检频次')
          return
        }
        var needArr = []
        for (var i = 0; i < this.multipleSelection.length; i++) {
          var needData = {}
          var infoData = {}
          infoData.houseId = this.multipleSelection[i].house.id
          infoData.houseName = this.multipleSelection[i].house.name
          infoData.position = this.multipleSelection[i].house.address
          infoData.lat = this.multipleSelection[i].house.lat
          infoData.lng = this.multipleSelection[i].house.lng
          infoData.structType = this.multipleSelection[i].house.structType
          infoData.area = this.multipleSelection[i].house.area
          infoData.totalFloorNum = this.multipleSelection[i].house.totalFloorNum
          infoData.buildYear = this.multipleSelection[i].house.year
          infoData.appraisalLevel = this.multipleSelection[i].house.appraisalLevel
          infoData.taskStartTime = new Date(this.startTime).getTime() - (8 * 60 * 60 * 1000)
          infoData.taskEndTime = new Date(this.endTime).getTime() + (16 * 60 * 60 * 1000 - 1)
          infoData.principal = this.principalVal
          infoData.inspector = this.carryRoleVal
          infoData.frequency = this.checkTime * 7
          needData.inspectionMajorTask = infoData
          var contentData = []
          if (this.reportProblem) {
            var contentList = {}
            contentList.content = this.reportProblem
            contentData.push(contentList)
          }
          needData.identificationReportProblemContent = contentData
          needArr.push(needData)
        }
        this.addFlag = false
        var turnSelf = this
        addTask(needArr).then(res => {
          if (res.status === 200) {
            this.$message.success(res.message)
            var that = this
            setTimeout(function() {
              that.eventStreet(false, 'refresh', false, 'first')
            }, 2000)
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
        })
        setTimeout(function() {
          turnSelf.addFlag = true
        }, 3000)
      },
      // 选择房屋
      showHousePop() {
        this.getHouseDataTable()
        this.handlePop()
      },
      // 弹窗打开关闭
      handlePop() {
        this.handleFlag = !this.handleFlag
      },
      // 清空房屋表格搜索条件
      clearSearch() {
        this.houseName = ''
        this.pageInfo.pageNum = 1
        // 清空地区信息
        this.$refs.Areachoose.clearAreaInfo()
        this.getHouseDataTable()
      },
      // 搜索房屋表格
      searchTable() {
        this.pageInfo.pageNum = 1
        this.getHouseDataTable()
      },
      // 获取房屋表格
      getHouseDataTable() {
        this.houseLoading = true
        var needData = {}
        needData.pageNum = this.pageInfo.pageNum
        needData.pageSize = this.pageInfo.pageSize
        // needData.isTarget = 0
        var getArea = this.areaSelectOption.data
        needData.provinceCode = getArea.provinceCode
        needData.cityCode = getArea.cityCode
        needData.countyCode = getArea.countyCode
        needData.streetCode = getArea.streetCode
        needData.communityCode = getArea.communityCode
        if (this.houseName) {
          needData.houseName = this.houseName
        }
        getHouseTable(needData).then(res => {
          if (res.status === 200) {
            this.houseTable = res.data
          } else {
            this.$message.error(res.message)
          }
          this.houseLoading = false
        })
      },
      // 点击取消已经选的
      cancelChecked(index) {
        this.multipleSelection.splice(index, 1)
      },
      // 选择房屋
      toChooseTarget() {
        if (this.multipleSelection.length < 1) {
          this.$message.error('请选择房屋')
          return
        } else {
          this.handlePop()
        }
      },
      // 房屋表格分页
      changePage(nowPage) {
        this.pageInfo.pageNum = nowPage
        this.getHouseDataTable()
      },
      // 表格列初始化
      tableFormatter(row, column, cellValue) {
        if (cellValue) {
          return cellValue
        } else {
          return '/'
        }
      },
      // 点击行
      onClickRow(row, event, column) {
        for (var i = 0; i < this.multipleSelection.length; i++) {
          if (row.areaHouseId === this.multipleSelection[i].areaHouseId) {
            return
          }
        }
        this.multipleSelection.push(row)
        console.log(this.multipleSelection)
      },
      turnUserName(realName, userName) {
        return realName + '（' + userName + '）'
      },
      // 编辑时，渲染值
      renderData() {
        if (this.commonTabInfo.custom === '') {
          return
        }
        var rendTaskInfo = this.commonTabInfo.custom.inspectionMajorTask
        this.showTargetName = rendTaskInfo.houseName
        this.startTime = formatTime(rendTaskInfo.taskStartTime)
        this.endTime = formatTime(rendTaskInfo.taskEndTime)
        this.personOneVal = rendTaskInfo.principalName
        this.personTwoVal = rendTaskInfo.inspectorName
        this.checkTime = (rendTaskInfo.frequency) / 7
      },
      // 保存编辑
      editEvent() {
        console.log(updateTask)
        if (!this.startTime) {
          this.$message.error('请选择巡检开始日期')
          return
        }
        if (!this.endTime) {
          this.$message.error('请选择巡检结束日期')
          return
        }
        if (new Date(this.startTime).getTime() > new Date(this.endTime).getTime()) {
          this.$message.error('巡检开始日期不能晚于巡检结束日期')
          return
        }
        if (!this.principalVal && !this.personOne) {
          this.$message.error('请选择负责人')
          return
        }
        if (!this.carryRoleVal && !this.personTwo) {
          this.$message.error('请选择巡检人')
          return
        }
        if (!this.checkTime) {
          this.$message.error('请选择巡检频次')
          return
        }
        var rendTaskInfo = this.commonTabInfo.custom.inspectionMajorTask
        var rendTaskId = this.commonTabInfo.custom.iprId
        var needData = {}
        needData.houseId = rendTaskInfo.houseId
        needData.houseName = rendTaskInfo.houseName
        needData.position = rendTaskInfo.position
        needData.lat = rendTaskInfo.lat
        needData.lng = rendTaskInfo.lng
        needData.structType = rendTaskInfo.structType
        needData.area = rendTaskInfo.area
        needData.totalFloorNum = rendTaskInfo.totalFloorNum
        needData.buildYear = rendTaskInfo.buildYear
        needData.appraisalLevel = rendTaskInfo.appraisalLevel
        needData.taskStartTime = new Date(this.startTime).getTime()
        needData.taskEndTime = new Date(this.endTime).getTime()
        if (this.personOne) {
          needData.principal = rendTaskInfo.principal
        } else {
          needData.principal = this.principalVal
        }
        if (this.personTwo) {
          needData.inspector = rendTaskInfo.inspector
        } else {
          needData.inspector = this.carryRoleVal
        }
        needData.frequency = this.checkTime * 7
        needData.id = rendTaskId
        needData.taskNo = rendTaskInfo.taskNo
        needData.taskStatus = rendTaskInfo.taskStatus
        updateTask(needData).then(res => {
          if (res.status === 200) {
            this.$message.success(res.message)
            var that = this
            setTimeout(function() {
              that.eventStreet(false, 'update', false, 'first')
            }, 2000)
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      toChangeOne() {
        this.personOne = !this.personOne
      },
      toChangeTwo() {
        this.personTwo = !this.personTwo
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/zc-table-common.scss";
  .street-header-title{
    width: 100%;
    height: 50px;
    line-height: 50px;
  }
  .street-form{
    width: 100%;
    .street-form-input{
      display: inline-block;
      width: 220px;
      input{
        width: 220px;
        height: 40px;
        text-indent: 15px;
        border:1px solid #dcdfe6;
        border-radius: 5px;
      }
    }
    .el-select{
      width: 220px;
    }
    .el-textarea{
      width: 600px;
    }
    .search-quest-title{
      display: inline-block;
      text-align: right;
      height: 40px;
      line-height: 40px;
      .form-must-tip{
        color: #f56c6c;
        margin-right: 5px;
      }
    }
    .search-quest-title-long{
      width: 130px;
    }
    .street-form-inline{
      display: inline-block;
      margin:5px 80px 5px 0;
    }
  }
  .street-form-textarea{
    overflow: hidden;
    margin: 5px 0;
    .el-textarea{
      float: left;
    }
    span{
      float: left;
    }
  }
  .street-footer-btn{
    margin-top: 50px;
    text-align: center;
  }
  .choose-input{
    cursor: pointer;
  }
  .foot-empty{
    width: 100%;
    height: 30px;
  }
  .to-choose-target{
    display: inline-block;
    border: 1px solid #dcdfe6;
    min-width: 600px;
    min-height: 60px;
    padding: 10px;
    font-size: 14px;
    border-radius: 5px;
    vertical-align: middle;
  }
  .house-areaInfo-edit{
    margin-right: 20px;
  }
  // 选择房屋
  .overStep-scroll{
    width: 50%;
    float: left;
  }
  .dialog-table{
    overflow: hidden;
  }
  .dialog-table-content-checked{
    overflow: hidden;
  }
  .dialog-table-content-checked .zc-table-body{
    width: 70%;
    float: left;
  }
  .dialog-table-content-checked .checked-resource{
    width: 30%;
    padding-left: 15px;
    max-height: 600px;
    overflow-y: auto;
    float: left;
  }
  .dialog-table-search{
    .search-quest{
      margin: 5px 10px 5px 0;
    }
    .el-button{
      padding: 12px;
    }
  }
  .checked-resource-cont{
    position: relative;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 5px 25px 5px 5px;
    background: #ccc;
    color: #fff;
    margin: 5px;
    border-radius: 5px;
    max-width: 90%;
  }
  .to-choose-target .close-icon-x{
    top: 6px;
  }
  .close-icon-x{
    position: absolute;
    font-style: normal;
    top: 10px;
    right: 5px;
    cursor: pointer;
    width: 15px;
    height: 15px;
    text-align: center;
    line-height: 15px;
    background: #888;
    border-radius: 50%;
  }
</style>
