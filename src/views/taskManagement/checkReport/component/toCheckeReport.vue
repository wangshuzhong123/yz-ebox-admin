<template>
  <div class="event-street">
    <div class="check-report-info" id="print-content">
      <div class="report-header">{{houseData.house.name}}巡检报告</div>
      <div class="report-cont">
        <div class="report-base-info">巡检日期：<span>{{turnTime(reportInfo.expectStartTime) + ' - ' + turnTime(reportInfo.expectEndTime)}}</span></div>
        <!--<div class="report-base-info">第 <span>X</span> 期</div>-->
        <div class="report-base-info">巡检人：<span>{{reportInfo.inspectorName}}</span></div>
        <div class="report-base-info">审核人：<span>{{reportInfo.principalName}}</span></div>
        <!--<div class="report-base-info">报告提交时间：<span>{{turnTime(reportInfo.reportSubTime, 2)}}</span></div>-->
        <div class="report-house-pic">
          <span class="report-base-info">房屋立面图：</span>
          <div class="problem-img-list" v-if="reportInfo.fileUrl && reportInfo.fileUrl.length > 0">
            <div class="img-wrap" v-for="(todo,index) in reportInfo.fileUrl" @click="viewBigPic(todo,index,reportInfo.fileUrl)">
              <img :src="turnPicSize(todo)" alt="">
            </div>
          </div>
        </div>
        <div class="report-base-info">房屋情况：<span :class="{'taskStatus-color': reportInfo.houseStatus===1}">{{turnHouseStatus(reportInfo.houseStatus)}}</span></div>
        <div class="report-base-info" v-if="reportInfo.houseStatus===2">腾空时间：<span>{{turnTime(reportInfo.checkOutTime)}}</span></div>
      </div>
      <div class="report-cont">
        <div class="task-info-title">1.房屋信息</div>
        <!--<div class="report-house-info">编号：<span></span></div>-->
        <div class="report-house-info">所属地：<span>{{turnAreaShow(houseData.province, houseData.city, houseData.county, houseData.street, houseData.community)}}</span></div>
        <div class="report-house-info" v-if="houseData.house.address">详细地址：<span>{{houseData.house.address}}</span></div>
        <div class="report-house-info" v-if="houseData.house.year">建造年份：<span>{{houseData.house.year}}</span> 年</div>
        <div class="report-house-info" v-if="houseData.house.area">面积：<span>{{houseData.house.area}}</span> ㎡</div>
        <div class="report-house-info">结构类型：<span>{{houseData.house.structType | turnStructType}}</span></div>
        <div class="report-house-info">鉴定等级：<span>{{houseData.house.appraisalLevel}}</span></div>
        <div class="report-house-info" v-if="houseData.house.propertyUnitDirector">联系人：<span>{{houseData.house.propertyUnitDirector}}</span></div>
        <div class="report-house-info" v-if="houseData.house.propertyUnitDirectorPhone">联系人电话：<span>{{houseData.house.propertyUnitDirectorPhone}}</span></div>
      </div>
      <div class="report-cont-info">
        <div class="task-info-title">2.巡检信息</div>
        <div class="report-house-info">使用情况：<span>无</span></div>
        <div class="report-house-info">居民反馈信息：<span>无</span></div>
        <template v-if="reportInfo.taskStatus !== 2 && reportInfo.taskStatus !== 3">
          <div class="report-house-info spec-title">已有问题跟踪情况：<span v-if="oldProblem.length < 1">无跟踪问题</span></div>
          <div class="problem-border" v-if="oldProblem && oldProblem.length > 0">
            <div class="report-problem-info" v-for="(todo, i) in oldProblem">
              <div class="big-problem-title">{{turnProblemType(todo.type) + '——' + todo.problemDesc}}</div>
              <div class="small-problem-cont" v-for="(toSec, j) in todo.partInspectionProblems">
                <div class="small-problem-info">
                  <span>{{j + 1 + '.'}}</span>
                  <span>{{toSec.positionProblem.problemDesc}}</span>
                  <span>{{toSec.description}}</span>
                  <span class="turn-color">（{{toSec.problemStatus | turnPrblemStatus}}）</span>
                  <div class="problem-img-list" v-if="toSec.fileUrl && toSec.fileUrl.length > 0">
                    <div class="img-wrap" v-for="(toThr,index) in toSec.fileUrl" @click="viewBigPic(toThr,index,toSec.fileUrl,todo,toSec)">
                      <img :src="turnPicSize(toThr)" alt="">
                    </div>
                  </div>
                </div>
              </div>
              <div class="report-line" v-if="oldProblem.length > 1 && i < oldProblem.length - 1"></div>
            </div>
          </div>
          <div class="report-house-info spec-title">新发现问题：<span v-if="newProblem.length < 1">无新发现问题</span></div>
          <div class="problem-border" v-if="newProblem && newProblem.length > 0">
            <div class="report-problem-info" v-for="(todo, j) in newProblem">
              <div class="big-problem-title">{{turnProblemType(todo.type) + '——' + todo.problemDesc}}</div>
              <div class="small-problem-cont" v-for="(toSec, j) in todo.partInspectionProblems">
                <div class="small-problem-info">
                  <span>{{j + 1 + '.'}}</span>
                  <span>{{toSec.positionProblem.problemDesc}}</span>
                  <span>{{toSec.description}}</span>
                  <div class="problem-img-list" v-if="toSec.fileUrl && toSec.fileUrl.length > 0">
                    <div class="img-wrap" v-for="(toThr,index) in toSec.fileUrl" @click="viewBigPic(toThr,index,toSec.fileUrl,todo,toSec)">
                      <img :src="turnPicSize(toThr)" alt="">
                    </div>
                  </div>
                </div>
              </div>
              <div class="report-line" v-if="newProblem.length > 1 && j < newProblem.length - 1"></div>
            </div>
          </div>
        </template>
      </div>
      <div class="report-footer">
        <div class="report-footer-top"></div>
        <div class="report-footer-bottom">
          ——卓诚建筑
        </div>
      </div>
    </div>
    <div class="user-say-about">
      <div class="task-info-title">3.综合评价</div>
      <!--巡检员评价-->
      <div class="user-say-wrap">
        <div class="report-house-info">巡检员评价：<span>{{turnTalkType(inspectionOverview.type)}}</span></div>
        <div class="report-house-info">评价内容：<span>{{inspectionOverview.userDesc}}</span></div>
      </div>
      <!--审核员评价-->
      <div class="user-say-wrap" v-if="projectUser.id">
        <div class="report-house-info">工程部经理评价：<span>{{turnTalkType(projectUser.type)}}</span></div>
        <div class="report-house-info">评价内容：<span>{{projectUser.userDesc}}</span></div>
      </div>
      <div class="user-say-wrap" v-else>
        <div class="street-form">
          <div class="street-form-inline">
            <span class="search-quest-title">工程部经理评价：</span>
            <el-select v-model="projectVal" placeholder="请选择">
              <el-option label="请选择" value=""></el-option>
              <el-option label="房屋原有危险点未得到彻底修缮，本次巡查未发现明显恶化情况" value="1"></el-option>
              <el-option label="房屋原有危险点未得到彻底修缮，并有新增或恶化危险点，请主管部门密切关注，必要时对房屋进行腾空" value="2"></el-option>
              <el-option label="房屋存在重大安全隐患，请主管部门及时腾空" value="3"></el-option>
            </el-select>
          </div>
        </div>
        <div class="street-form street-form-textarea">
          <div class="street-form-inline">
            <span class="search-quest-title" style="float: left;">评价内容：</span>
            <el-input class="reject-reason" type="textarea" v-model="projectReason"></el-input>
          </div>
        </div>
        <div class="street-footer-say">
          <el-button type="primary" @click.native="toPostSay('project')">提交</el-button>
        </div>
      </div>
      <!--技术部评价-->
      <div class="user-say-wrap" v-if="scienceUser.id">
        <div class="report-house-info">技术部经理评价：<span>{{turnTalkType(scienceUser.type)}}</span></div>
        <div class="report-house-info">评价内容：<span>{{scienceUser.userDesc}}</span></div>
      </div>
      <div class="user-say-wrap" v-else>
        <div class="street-form">
          <div class="street-form-inline">
            <span class="search-quest-title">技术部经理评价：</span>
            <el-select v-model="scienceVal" placeholder="请选择">
              <el-option label="请选择" value=""></el-option>
              <el-option label="房屋原有危险点未得到彻底修缮，本次巡查未发现明显恶化情况" value="1"></el-option>
              <el-option label="房屋原有危险点未得到彻底修缮，并有新增或恶化危险点，请主管部门密切关注，必要时对房屋进行腾空" value="2"></el-option>
              <el-option label="房屋存在重大安全隐患，请主管部门及时腾空" value="3"></el-option>
            </el-select>
          </div>
        </div>
        <div class="street-form street-form-textarea">
          <div class="street-form-inline">
            <span class="search-quest-title" style="float: left;">评价内容：</span>
            <el-input class="reject-reason" type="textarea" v-model="scienceReason"></el-input>
          </div>
        </div>
        <div class="street-footer-say">
          <el-button type="primary" @click.native="toPostSay('science')">提交</el-button>
        </div>
      </div>
    </div>
    <div class="street-form" v-if="reportStatus === 1">
      <div class="task-info-title">4.审批</div>
      <div class="street-form-inline">
        <span class="search-quest-title"><i class="form-must-tip">*</i>审批操作：</span>
        <el-select v-model="checkVal" placeholder="请选择">
          <el-option label="请选择" value=""></el-option>
          <el-option label="审批通过" value="2"></el-option>
          <el-option label="驳回继续巡检" value="3"></el-option>
          <el-option label="驳回修改巡检报告" value="4"></el-option>
        </el-select>
      </div>
    </div>
    <div class="street-form street-form-textarea" v-if="reportStatus === 1">
      <div class="street-form-inline">
        <span class="search-quest-title" style="float: left;">理由：</span>
        <el-input class="reject-reason" type="textarea" v-model="checkReason"></el-input>
      </div>
    </div>
    <div class="street-footer-btn" v-if="reportStatus === 1">
      <el-button @click.native="eventStreet(false, '1', false, 'first', '')">取消</el-button>
      <el-button type="primary" :loading="checkFlag" @click.native="toSure">审核</el-button>
    </div>
    <div class="street-footer-btn" v-else>
      <el-button type="primary" @click.native="eventStreet(false, '1', false, 'first', '')">关闭</el-button>
      <template v-if="reportStatus === 2">
        <el-button type="primary" @click.native="toPrint">打印巡检报告</el-button>
      </template>
    </div>
    <el-dialog :title="bigPicTile" custom-class="dialog-table" @close="closeViewBigPic" :visible.sync="handleFlag" width="550px" top="10vh" :close-on-click-modal="dialogInfo.default" :close-on-press-escape="dialogInfo.default">
      <div class="dialog-table-content">
        <img :src="bigPic" alt="">
        <span v-if="bigPicList.length > 1 && thisPicIndex > 0" class="changePicBtn prev-pic" @click="viewPrevPic"><</span>
        <span v-if="bigPicList.length > 1 && thisPicIndex < bigPicList.length-1" class="changePicBtn next-pic" @click="viewNextPic">></span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getReportInfoById, toCheckReportByAdmin, getHoseByHouseName, toOverview } from '@/api/requestConfig'
  import { formatTime } from '@/filters/index'
  export default {
    name: 'fillWays',
    data() {
      return {
        reportInfo: '',
        taskId: '',
        checkVal: '',
        checkReason: '',
        reportList: [],
        reportStatus: '',
        handleFlag: false, // 放大图片
        dialogInfo: {
          default: false // 禁止点击遮罩层关闭
        },
        checkFlag: false, // 审核标记
        houseData: {
          province: '',
          city: '',
          county: '',
          street: '',
          community: '',
          house: {
            address: '',
            area: '',
            year: '',
            structType: '',
            appraisalLevel: '',
            propertyUnitDirectorPhone: '',
            propertyUnitDirector: ''
          }
        },
        oldProblem: [], // 老问题数组
        newProblem: [], // 新问题数组
        bigPic: '', // 大图图片src
        bigPicList: [], // 大图pic数组
        thisPicIndex: '', // 当前大图索引
        bigPicTile: '', // 大图弹窗title
        inspectionOverview: {}, // 巡检员评价
        projectUser: {}, // 工程部经理评价
        projectVal: '', // 工程部经理评价备注
        projectReason: '', // 工程部经理评价
        scienceVal: '', // 技术部经理评价
        scienceReason: '', // 技术部经理评价备注
        scienceUser: {} // 技术部经理评价
      }
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    mounted() {
      this.reportInfo = this.commonTabInfo.custom
      this.reportStatus = this.reportInfo.status
      this.getHouseInfo(this.reportInfo.houseName)
      this.getReportInfo(this.reportInfo.id)
      var allInspectionOverview = this.reportInfo.inspectionOverviewList
      if (allInspectionOverview.length > 0) {
        for (var i = 0; i < allInspectionOverview.length; i++) {
          // userType为1：工程部经理 2：技术部经理 3：巡检员
          // 获取巡检员评价
          if (allInspectionOverview[i].userType === 3) {
            this.inspectionOverview = allInspectionOverview[i]
          } else if (allInspectionOverview[i].userType === 1) {
            this.projectUser = allInspectionOverview[i]
          } else if (allInspectionOverview[i].userType === 2) {
            this.scienceUser = allInspectionOverview[i]
          }
          console.log(this.inspectionOverview)
          console.log(this.projectUser)
          console.log(this.scienceUser)
        }
      }
    },
    methods: {
      eventStreet(flag, text, disabled, activeName, custom) {
        this.$store.dispatch('handleTabInfo', {
          flag: flag,
          text: text,
          disabled: disabled,
          activeName: activeName,
          custom: custom
        })
      },
      // 获取房屋信息
      getHouseInfo(houseName) {
        var paramsData = {}
        paramsData.houseName = houseName
        getHoseByHouseName(paramsData).then(res => {
          if (res.status === 200) {
            this.houseData = res.data
          } else {
            this.$message.error(res.message)
          }
        })
      },
      // 获取巡检报告信息
      getReportInfo(reportId) {
        getReportInfoById(reportId).then(res => {
          if (res.status === 200) {
            this.reportList = res.data
            if (this.reportList && this.reportList.length > 0) {
              for (var i = 0; i < this.reportList.length; i++) {
                var problemData = this.reportList[i]
                var newProblemObj = {}
                var oldProblemObj = {}
                var problemList = problemData.partInspectionProblems
                if (problemList && problemList.length > 0) {
                  var newList = []
                  var oldList = []
                  for (var j = 0; j < problemList.length; j++) {
                    var secProblemObj = problemList[j]
                    if (secProblemObj.isLast === 0) {
                      newList.push(secProblemObj)
                    } else {
                      oldList.push(secProblemObj)
                    }
                  }
                  if (newList.length > 0) {
                    newProblemObj.type = problemData.type
                    newProblemObj.problemDesc = problemData.problemDesc
                    newProblemObj.partInspectionProblems = newList
                    this.newProblem.push(newProblemObj)
                  }
                  if (oldList.length > 0) {
                    oldProblemObj.type = problemData.type
                    oldProblemObj.problemDesc = problemData.problemDesc
                    oldProblemObj.partInspectionProblems = oldList
                    this.oldProblem.push(oldProblemObj)
                  }
                }
              }
            }
          } else {
            this.$message.error(res.message)
          }
        })
      },
      // 审批
      toSure() {
        if (this.checkVal === '') {
          this.$message.error('请选择审批操作')
          return
        }
        if ((this.checkVal === '3' || this.checkVal === '4') && this.checkReason === '') {
          this.$message.error('请填写驳回理由')
          return
        }
        var needData = {}
        needData.status = Number(this.checkVal)
        needData.id = this.reportInfo.id
        needData.reason = this.checkReason
        this.checkFlag = true
        toCheckReportByAdmin(needData).then(res => {
          if (res.status === 200) {
            this.$message.success(res.message)
            this.eventStreet(false, 'update', false, 'first', '')
            this.checkFlag = false
          } else {
            this.$message.error(res.message)
            this.checkFlag = false
          }
        })
      },
      // 问题类型
      turnProblemType(val) {
        if (val === 1) {
          return '沉降倾斜'
        } else if (val === 2) {
          return '建筑物周边环境'
        } else if (val === 3) {
          return '基础'
        } else if (val === 4) {
          return '散水'
        } else if (val === 5) {
          return '砌体构件'
        } else if (val === 6) {
          return '混凝土构件'
        } else if (val === 7) {
          return '木构件'
        } else if (val === 8) {
          return '钢构件'
        } else if (val === 9) {
          return '屋顶及围护结构'
        }
      },
      // 转化时间格式
      turnTime(val, type) {
        if (val) {
          return formatTime(val, type)
        } else {
          return ''
        }
      },
      // 巡检报告状态
      turnReportStatus(val) {
        if (val === 0) {
          return '待巡检'
        } else if (val === 1) {
          return '待审核'
        } else if (val === 2) {
          return '审核通过'
        } else if (val === 3) {
          return '驳回重新巡检'
        } else if (val === 4) {
          return '驳回修改报告'
        }
      },
      // 大图弹窗打开关闭
      handlePop() {
        this.handleFlag = !this.handleFlag
      },
      // 关闭回调
      closeViewBigPic() {
        this.bigPic = ''
      },
      // 查看大图
      viewBigPic(picSrc, picIndex, picSrcList, firstObj, secObj) {
        if (!picSrc) {
          return
        }
        this.bigPicList = picSrcList
        this.thisPicIndex = picIndex
        if (!firstObj) {
          this.bigPicTile = this.houseData.house.name
        } else {
          this.bigPicTile = this.turnProblemType(firstObj.type) + '——' + firstObj.problemDesc + '(' + secObj.positionProblem.problemDesc + '，' + secObj.description + ')'
        }
        this.bigPic = picSrc.replace('w_100', 'w_500')
        console.log(this.bigPicList)
        console.log(this.thisPicIndex)
        this.handlePop()
      },
      // 上一张
      viewPrevPic() {
        if (this.thisPicIndex > 0) {
          this.thisPicIndex--
          this.bigPic = this.bigPicList[this.thisPicIndex].replace('w_100', 'w_500')
        } else {
          this.thisPicIndex = 0
        }
      },
      // 下一张
      viewNextPic() {
        if (this.thisPicIndex < this.bigPicList.length - 1) {
          this.thisPicIndex++
          this.bigPic = this.bigPicList[this.thisPicIndex].replace('w_100', 'w_500')
        } else {
          this.thisPicIndex = this.bigPicList.length - 1
        }
      },
      // 改变图片尺寸
      turnPicSize(picUrl) {
        if (!picUrl) {
          return
        }
        return picUrl.replace('w_100', 'w_200')
      },
      // 打印
      toPrint() {
        var subOutputRankPrint = document.getElementById('print-content')
        var newContent = subOutputRankPrint.innerHTML
        var oldContent = document.body.innerHTML
        document.body.innerHTML = newContent
        window.print()
        window.location.reload()

        document.body.innerHTML = oldContent

        return false
      },
      // 所属地
      turnAreaShow(province, city, county, street, community) {
        var pro = ''
        var ci = ''
        var co = ''
        var st = ''
        var com = ''
        if (province) {
          pro = province
        }
        if (city) {
          ci = city
        }
        if (county) {
          co = county
        }
        if (street) {
          st = street
        }
        if (community) {
          com = community
        }
        return pro + ci + co + st + com
      },
      // 房屋状态
      turnHouseStatus(val) {
        if (val === 0) {
          return '房屋正常'
        } else if (val === 1) {
          return '房屋已拆除'
        } else if (val === 2) {
          return '腾空'
        }
      },
      // 评价
      turnTalkType(val) {
        if (val === 1) {
          return '房屋原有危险点未得到彻底修缮，本次巡查未发现明显恶化情况'
        } else if (val === 2) {
          return '房屋原有危险点未得到彻底修缮，并有新增或恶化危险点，请主管部门密切关注，必要时对房屋进行腾空'
        } else if (val === 3) {
          return '房屋存在重大安全隐患，请主管部门及时腾空'
        }
      },
      // 评价请求
      toPostSay(type) {
        var needData = {}
        if (type === 'project') {
          if (this.projectVal === '') {
            this.$message.error('请选择工程部经理评价')
            return
          }
          if (this.projectReason === '') {
            this.$message.error('请填写工程部经理评价内容')
            return
          }
          needData.overviewUserType = 1
          needData.overviewType = this.projectVal
          needData.userOverviewDesc = this.projectReason
        } else {
          if (this.scienceVal === '') {
            this.$message.error('请选择技术部经理评价')
            return
          }
          if (this.scienceReason === '') {
            this.$message.error('请填写技术部经理评价内容')
            return
          }
          needData.overviewUserType = 2
          needData.overviewType = this.scienceVal
          needData.userOverviewDesc = this.scienceReason
        }
        needData.imtId = this.reportInfo.imtId
        needData.iorId = this.reportInfo.id
        toOverview(needData).then(res => {
          if (res.status === 200) {
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .street-form{
    width: 100%;
    margin: 15px 0;
    .street-form-input{
      display: inline-block;
      width: 220px;
    }
    .el-select{
      display: inline-block;
      width: 220px;
    }
    .el-textarea{
      width: 600px;
    }
  }
  .street-footer-btn{
    margin-top: 50px;
    text-align: center;
  }
  .street-footer-say{
    margin-top: 20px;
    padding-left: 100px;
  }
  .choose-person{
    overflow: hidden;
    .choose-title{
      display: block;
      height: 30px;
      line-height: 30px;
    }
    .choose-cont{
      display: inline-block;
      padding: 15px 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      width: 100%;
      .choose-cont-person{
        display: inline-block;
        padding: 5px;
        border: 1px dashed #ddd;
        margin: 5px;
        border-radius: 5px;
        cursor: pointer;
      }
    }
  }
  .choose-cont-person:hover{
    background: #409EFF;
    color: #fff;
  }
  .choose-person-active{
    background: #409EFF;
    color: #fff;
  }
  .choose-textarea{
    width: 800px;
    height: 200px;
    border-radius: 5px;
  }
  .form-must-tip{
    color: #f56c6c;
    margin-right: 5px;
  }
  .task-info-title{
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    font-weight: 600;
  }
  .report-info-wrap{
    border: 1px dashed #ccc;
    padding: 15px;
    border-radius: 5px;
  }
  .report-info{
    width: 100%;
    padding: 10px;
    border: 1px dashed #ccc;
    border-radius: 5px;
    margin: 10px 0;
  }
  .problem-border{
    width: 100%;
    padding: 10px;
    border: 1px solid #323232;
    border-radius: 5px;
    margin: 10px 0;
  }
  .report-problem-info{
    width: 100%;
  }
  .report-line{
    width: 100%;
    height: 1px;
    border-bottom: 1px dashed #ccc;
  }
  .small-problem-info{
    width: 100%;
    padding: 10px 0;
  }
  .big-problem-title{
    height: 40px;
    line-height: 40px;
    font-weight: 600;
  }
  .small-problem-cont span{
    padding: 0 10px;
  }
  .problem-img-list{
    width: 100%;
    padding: 10px 0;
    overflow: hidden;
  }
  .img-wrap{
    float: left;
    /*width: 100px;*/
    /*height: 100px;*/
    margin-right: 10px;
    cursor: pointer;
  }
  .check-report-info{
    padding: 15px;
  }
  .report-header{
    width: 100%;
    height: 100px;
    text-align: center;
    line-height: 100px;
    font-size: 20px;
    font-weight: bolder;
  }
  .report-cont{
    width: 100%;
    overflow: hidden;
    border-bottom: 1px solid #323232;
  }
  .report-base-info{
    width: 50%;
    float: left;
    height: 35px;
    line-height: 35px;
  }
  .report-house-info{
    width: 100%;
    height: 35px;
    line-height: 35px;
  }
  .turn-color{
    color: #ef4f4f;
  }
  .spec-title{
    font-weight: 600;
  }
  .report-house-pic{
    width: 100%;
    padding-bottom: 10px;
    overflow: hidden;
  }
  .report-footer{
    width: 100%;
    height: 300px;
  }
  .report-footer-top{
    width: 100%;
    height: 100px;
  }
  .report-footer-bottom{
    width: 100%;
    height: 100px;
    line-height: 100px;
    text-align: right;
    padding-right: 50px;
    font-size: 16px;
    font-weight: 600;
  }
  .taskStatus-color{
    color: #f56c6c;
  }
  .dialog-table-content{
    position: relative;
  }
  .changePicBtn{
    position: absolute;
    top: 50%;
    width: 50px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    background: #000;
    margin-top: -50px;
    background: rgba(50,50,50,.5);
    font-size: 50px;
    color: #fff;
    cursor: pointer;
  }
  .prev-pic{
    left: 0;
  }
  .next-pic{
    right: 10px;
  }
  .user-say-wrap{
    margin: 10px 0;
    width: 100%;
    padding: 10px;
    border: 1px dashed #aaa;
    border-radius: 5px;
  }
</style>
