<template>
  <div class="event-street">
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title"><i class="form-must-tip">*</i>巡检房屋：</span>
        <div class="street-form-input">
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
          :readonly="true"
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
          :readonly="true"
          :editable="false"
          placeholder="选择日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title"><i class="form-must-tip">*</i>延长巡检合同结束日期至：</span>
        <el-date-picker
          v-model="newEndTime"
          type="date"
          :editable="false"
          placeholder="选择日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
    </div>
    <div class="street-footer-btn">
      <el-button @click.native="eventStreet(false, '1', false, 'first')">取消</el-button>
      <el-button type="primary" :loading="editFlag" @click.native="saveEvent">确定延长任务</el-button>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { prolongTask } from '@/api/requestConfig'
  import { formatTime } from '@/filters/index'
  export default {
    name: 'ProlongPage',
    data() {
      return {
        showTargetName: '',
        startTime: '',
        editFlag: false,
        endTime: '',
        newEndTime: ''
      }
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    created() {
      this.renderData()
    },
    methods: {
      // 操作
      eventStreet(flag, text, disabled, activeName, custom) {
        this.$store.dispatch('handleTabInfo', {
          flag: flag,
          text: text,
          disabled: disabled,
          activeName: activeName,
          custom: custom
        })
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
      },
      // 延长任务
      saveEvent() {
        console.log(prolongTask)
        if (!this.newEndTime) {
          this.$message.error('请选择任务新的结束日期')
          return
        }
        if (new Date(this.newEndTime).getTime() <= new Date(this.endTime).getTime()) {
          this.$message.error('任务新的结束日期不得早于或等于老的结束日期')
          return
        }
        var needData = {}
        needData.mtId = this.commonTabInfo.custom.inspectionMajorTask.id
        needData.oldTaskEndTime = new Date(this.endTime).getTime()
        needData.newTaskEndTime = new Date(this.newEndTime).getTime()
        this.editFlag = true
        prolongTask(needData).then(res => {
          if (res.status === 200) {
            this.$message.success(res.message)
            this.eventStreet(false, 'update', false, 'first', '')
            this.editFlag = false
          } else {
            this.$message.error(res.message)
            this.editFlag = false
          }
        }).catch(error => {
          console.log(error)
          this.editFlag = false
        })
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
  .street-footer-btn{
    margin-top: 50px;
    text-align: center;
  }
</style>
