<template>
  <div class="event-street">
    <div class="task-info-wrap">
      <div class="task-info-title">任务信息</div>
      <div class="street-form">
        <div class="street-form-inline">
          <span class="search-quest-title">任务编号：</span>
          <span class="search-quest-content">{{taskInfo.taskNo}}</span>
        </div>
      </div>
      <div class="street-form">
        <div class="street-form-inline">
          <span class="search-quest-title">房屋名：</span>
          <span class="search-quest-content">{{taskInfo.houseName}}</span>
        </div>
      </div>
      <div class="street-form">
        <div class="street-form-inline">
          <span class="search-quest-title">房屋等级：</span>
          <span class="search-quest-content">{{taskInfo.appraisalLevel}}</span>
        </div>
      </div>
      <div class="street-form">
        <div class="street-form-inline">
          <span class="search-quest-title">房屋地址：</span>
          <span class="search-quest-content">{{taskInfo.position}}</span>
        </div>
      </div>
      <div class="street-form">
        <div class="street-form-inline">
          <span class="search-quest-title">经纬度：</span>
          <span class="search-quest-content">{{turnLatLng(taskInfo.lng,taskInfo.lat)}}</span>
        </div>
      </div>
      <div class="street-form">
        <div class="street-form-inline">
          <span class="search-quest-title">结构类型：</span>
          <span class="search-quest-content">{{turnStructType(taskInfo.structType)}}</span>
        </div>
      </div>
      <div class="street-form">
        <div class="street-form-inline">
          <span class="search-quest-title">建筑面积：</span>
          <span class="search-quest-content">{{taskInfo.area}} ㎡</span>
        </div>
      </div>
      <div class="street-form">
        <div class="street-form-inline">
          <span class="search-quest-title">楼层数：</span>
          <span class="search-quest-content">{{taskInfo.totalFloorNum}} 层</span>
        </div>
      </div>
      <div class="street-form">
        <div class="street-form-inline">
          <span class="search-quest-title">建造年代：</span>
          <span class="search-quest-content">{{taskInfo.buildYear}} 年</span>
        </div>
      </div>
      <div class="street-form">
        <div class="street-form-inline">
          <span class="search-quest-title">巡检合同开始日期：</span>
          <span class="search-quest-content">{{taskInfo.taskStartTime | formatTime}}</span>
        </div>
      </div>
      <div class="street-form">
        <div class="street-form-inline">
          <span class="search-quest-title">巡检合同结束日期：</span>
          <span class="search-quest-content">{{taskInfo.taskEndTime | formatTime}}</span>
        </div>
      </div>
    </div>
    <div class="task-info-title">巡检报告信息</div>
    <div class="report-info-wrap">
      <div class="problem-position">巡检信息：</div>
      <div class="street-form">
        <div class="street-form-inline">
          <span class="search-quest-title">巡检房屋：</span>
          <span class="search-quest-content">{{taskInfo.houseName}}</span>
        </div>
      </div>
      <div class="street-form">
        <div class="street-form-inline">
          <span class="search-quest-title">巡检开始时间：</span>
          <span class="search-quest-content">{{reportInfo.expectStartTime | formatTime}}</span>
        </div>
      </div>
      <div class="street-form">
        <div class="street-form-inline">
          <span class="search-quest-title">巡检截止时间：</span>
          <span class="search-quest-content">{{reportInfo.expectEndTime | formatTime}}</span>
        </div>
      </div>
      <div class="street-form">
        <div class="street-form-inline">
          <span class="search-quest-title">巡检人：</span>
          <span class="search-quest-content">{{reportInfo.inspectorName}}</span>
        </div>
      </div>
      <div class="street-form">
        <div class="street-form-inline">
          <span class="search-quest-title">立面图：</span>
          <div class="problem-img-list" v-if="reportInfo.fileUrl && reportInfo.fileUrl.length > 0">
            <div class="img-wrap" v-for="todo in reportInfo.fileUrl" @click="viewBigPic(todo)">
              <img :src="todo" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="street-form">
        <div class="street-form-inline">
          <span class="search-quest-title">巡检报告提交时间：</span>
          <span class="search-quest-content">{{turnTime(reportInfo.reportSubTime, 2)}}</span>
        </div>
      </div>
      <div class="street-form">
        <div class="street-form-inline">
          <span class="search-quest-title">巡检报告状态：</span>
          <span class="search-quest-content">{{turnReportStatus(reportInfo.status)}}</span>
        </div>
      </div>
      <div class="street-form" v-if="reportInfo.reason">
        <div class="street-form-inline">
          <span class="search-quest-title">驳回理由：</span>
          <span class="search-quest-content">{{reportInfo.reason}}</span>
        </div>
      </div>
      <div class="problem-position">巡检部位问题：</div>
      <div class="report-info" v-for="todo in reportList">
        <div class="big-problem-title">{{turnProblemType(todo.type) + '——' + todo.problemDesc}}</div>
        <div class="small-problem-cont" v-for="(toSec, j) in todo.partInspectionProblems">
          <div class="small-problem-info">
            <span>{{j + 1 + '.'}}</span>
            <span>{{toSec.createTime | formatTime}}</span>
            <span>{{toSec.positionProblem.problemDesc}}</span>
            <span>{{toSec.description}}</span>
            <div class="problem-img-list" v-if="toSec.fileUrl && toSec.fileUrl.length > 0">
              <div class="img-wrap" v-for="toThr in toSec.fileUrl" @click="viewBigPic(toThr)">
                <img :src="toThr" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="street-form" v-if="reportStatus === 1">
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
    <div class="street-form street-form-textarea" v-if="reasonFlag && reportStatus === 1">
      <span class="search-quest-title">驳回理由：</span>
      <el-input class="reject-reason" type="textarea" v-model="checkReason"></el-input>
    </div>
    <div class="street-footer-btn" v-if="reportStatus === 1">
      <el-button @click.native="eventStreet(true, '查看巡检任务', true, 'third', commonTabInfo.custom)">取消</el-button>
      <el-button type="primary" @click.native="toSure">审核</el-button>
    </div>
    <div class="street-footer-btn" v-else>
      <el-button type="primary" @click.native="eventStreet(true, '查看巡检任务', true, 'third', commonTabInfo.custom)">关闭</el-button>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getReportInfoById, toCheckReportByAdmin } from '@/api/requestConfig'
  import { formatTime } from '@/filters/index'
  export default {
    name: 'fillWays',
    data() {
      return {
        taskInfo: '',
        reportInfo: '',
        taskId: '',
        checkVal: '',
        checkReason: '',
        reasonFlag: false,
        reportList: [],
        reportStatus: ''
      }
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    watch: {
      'checkVal': function(val, old) {
        if (val === '3' || val === '4') {
          this.reasonFlag = true
        } else {
          this.reasonFlag = false
        }
      }
    },
    mounted() {
      this.taskInfo = this.commonTabInfo.custom.inspectionMajorTask
      this.reportInfo = this.commonTabInfo.custom.myReportInfo
      this.reportStatus = this.reportInfo.status
      this.taskId = this.commonTabInfo.custom.iprId
      this.getReportInfo(this.reportInfo.id)
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
      // 获取巡检报告信息
      getReportInfo(reportId) {
        getReportInfoById(reportId).then(res => {
          if (res.status === 200) {
            this.reportList = res.data
            console.log(this.reportList)
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
        toCheckReportByAdmin(needData).then(res => {
          if (res.status === 200) {
            this.$message.success(res.message)
            var that = this
            setTimeout(function() {
              that.eventStreet(true, '查看巡检任务', true, 'third', that.commonTabInfo.custom)
            }, 500)
          } else {
            this.$message.error(res.message)
          }
        })
      },
      // 经纬度
      turnLatLng(x, y) {
        if (x && y) {
          return '(' + x + ' , ' + y + ')'
        }
      },
      // 结构类型
      turnStructType(val) {
        if (val === 1) {
          return '砖木结构'
        } else if (val === 2) {
          return '砖混结构'
        } else if (val === 3) {
          return '框架结构'
        } else if (val === 4) {
          return '混合结构'
        } else if (val === 5) {
          return '泥木结构'
        } else if (val === 6) {
          return '砖木砖混'
        } else if (val === 7) {
          return '木'
        } else if (val === 8) {
          return '钢'
        }
      },
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
      turnTime(val, type) {
        if (val) {
          return formatTime(val, type)
        } else {
          return '/'
        }
      },
      // 查看大图
      viewBigPic(picSrc) {
        if (!picSrc) {
          return
        }
        var newPicSrc = picSrc.replace('w_100', 'w_500')
        this.$alert('<img src=' + newPicSrc + ' />', '查看大图', {
          dangerouslyUseHTMLString: true,
          showConfirmButton: false,
          closeOnClickModal: true
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
  }
  .street-footer-btn{
    margin-top: 50px;
    text-align: center;
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
  .reject-reason{
    margin-top: 10px;
  }
  .reject-reason textarea{
    min-height: 100px;
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
  .big-problem-title{
    height: 40px;
    line-height: 40px;
    font-weight: 600;
  }
  .small-problem-cont span{
    padding: 0 10px;
  }
  .problem-position{
    height: 40px;
    line-height: 40px;
    font-weight: 600;
  }
  .problem-img-list{
    width: 100%;
    padding: 10px 0;
    overflow: hidden;
  }
  .img-wrap{
    float: left;
    width: 100px;
    height: 100px;
    margin-right: 10px;
    cursor: pointer;
  }
</style>
