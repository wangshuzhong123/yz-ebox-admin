<template>
  <div class="event-info">
    <el-form :model="ruleForm" :rules="rules" ref="TaskForm" label-width="100px" label-suffix="：">
      <div class="event-content">
        <el-form-item label="作业名称" prop="Title">
          <div class="cont-input">
            <el-input v-model="ruleForm.Title" clearable placeholder="请输入作业名称"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="作业类型" prop="TypeId">
          <div class="cont-input">
            <el-select v-model="ruleForm.TypeId" clearable placeholder="请选择">
              <el-option label="站内作业" value="1"></el-option>
              <el-option label="站内定时器" value="2"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="执行程序" prop="Assembly">
          <div class="cont-input">
            <el-input type="textarea" v-model="ruleForm.Assembly" placeholder="请输入" :disabled="ruleForm.Id > 0"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="执行时间" prop="TaskTime" v-show="ruleForm.TypeId == 1">
          <div class="cont-input-long">
            <tasktimecom-choose ref="TaskTimeCom" :value="ruleForm.TaskTime" @event="setTaskTime"></tasktimecom-choose>
          </div>
        </el-form-item>
        <el-form-item label="执行时间" prop="TaskTime2" v-if="ruleForm.TypeId == 2">
          <div class="cont-input">
            <el-input-number v-model="ruleForm.TaskTime2" controls-position="right" :min="1"></el-input-number> 秒/次
          </div>
        </el-form-item>
        <el-form-item label="开始时间" prop="BeginDateTime">
          <div class="cont-input">
            <el-date-picker v-model="ruleForm.BeginDateTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:185px"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="结束时间" prop="EndDateTime">
          <div class="cont-input">
            <el-date-picker v-model="ruleForm.EndDateTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:185px"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="通知方式" prop="TaskValues">
          <div class="cont-input">
            <el-checkbox-group v-model="ruleForm.TaskValues">
              <el-checkbox :label="1">邮件</el-checkbox>
              <el-checkbox :label="2">短信</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item label="接收人" prop="ReceiverIds">
          <div class="cont-input">
             <receiver-select :value="ruleForm.ReceiverIds" @event="setReceiver"></receiver-select>
          </div>
        </el-form-item>
        <el-form-item label="邮件模板" prop="EmailTemplate">
          <div class="cont-input">
            <el-input type="textarea" placeholder="请输入" v-model="ruleForm.EmailTemplate"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="短信模板" prop="SmsTemplate">
          <div class="cont-input">
            <el-input type="textarea" placeholder="请输入" v-model="ruleForm.SmsTemplate"></el-input>
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
      </div>
      <div class="cont-footer">
        <el-button @click.native="eventTab('', 'first' )">取消</el-button>
        <template v-if="commonTabInfo.text === '新增作业'">
          <el-button type="primary" @click.native="addTaskEvent">保存</el-button>
        </template>
        <template v-else-if="commonTabInfo.text === '编辑作业'">
          <el-button type="primary" @click.native="editTaskEvent">保存编辑</el-button>
        </template>
      </div>
    </el-form>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { AddTask, GetTaskSingle, UpdateTask } from '@/api/requestConfig'
  import TaskTimeCom from '@/components/taskTime'
  import Receiver from '@/components/Receiver'
  export default {
    name: 'TaskInfo',
    data() {
      return {
        ruleForm: {
          Id: '',
          Title: '',
          TypeId: '',
          TaskValues: [],
          TaskTime: undefined,
          TaskTime2: '',
          BeginDateTime: '',
          EndDateTime: '',
          Assembly: '',
          ReceiverIds: undefined,
          EmailTemplate: '',
          SmsTemplate: '',
          IsActivity: true
        },
        rules: {
          Title: [
            { required: true, message: '请输入作业名称', trigger: 'blur' }
          ],
          TypeId: [
            { required: true, message: '请选择作业类型', trigger: 'change' }
          ],
          TaskValues: [
            { required: false, message: '请选择通知方式', trigger: 'change' }
          ],
          TaskTime: [
            { required: true, message: '请选择执行时间', trigger: 'change' }
          ],
          TaskTime2: [
            { required: true, message: '请选择执行时间', type: 'number', trigger: 'change' }
          ],
          BeginDateTime: [
            { required: true, message: '请选择开始时间', trigger: 'change' }
          ],
          Assembly: [
            { required: true, message: '请输入执行程序', trigger: 'blur' }
          ]
        },
        editData: {},
        addFlag: true
      }
    },
    components: {
      'tasktimecom-choose': TaskTimeCom,
      'receiver-select': Receiver
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    mounted() {
      // 编辑时获取数据
      if (this.commonTabInfo.text === '编辑作业') {
        GetTaskSingle(this.commonTabInfo.custom.Id).then(res => {
          if (res.data) {
            const resData = res.data
            this.editData = resData
            if (this.editData) {
              for (var key in this.editData) {
                if (key === 'TaskTime') {
                  if (parseInt(this.editData.TypeId) === 1) {
                    this.ruleForm.TaskTime = this.editData.TaskTime
                  } else if (parseInt(this.editData.TypeId) === 2) {
                    this.ruleForm.TaskTime2 = this.editData.TaskTime
                  }
                } else if (key === 'TypeId') {
                  this.ruleForm[key] = String(this.editData[key])
                } else {
                  this.ruleForm[key] = this.editData[key]
                }
              }
            }
          }
        })
      } else {
        // 触发子组件
        this.ruleForm.ReceiverIds = []
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
      // 设置执行时间
      setTaskTime(value) {
        this.ruleForm.TaskTime = value
        this.$refs['TaskForm'].validateField('TaskTime')
      },
      // 设置接收人
      setReceiver(value) {
        this.ruleForm.ReceiverIds = value
      },
      // 新增作业
      addTaskEvent() {
        var self = this
        if (!this.addFlag) {
          return
        }
        this.$refs.TaskForm.validate(function(valid) {
          if (valid) {
            var needData = {}
            needData.Title = self.ruleForm.Title
            needData.TypeId = self.ruleForm.TypeId
            needData.TaskValues = self.ruleForm.TaskValues
            if (parseInt(needData.TypeId) === 1) {
              needData.TaskTime = self.ruleForm.TaskTime
            } else {
              needData.TaskTime = self.ruleForm.TaskTime2
            }
            needData.BeginDateTime = self.ruleForm.BeginDateTime
            needData.EndDateTime = self.ruleForm.EndDateTime
            needData.Assembly = self.ruleForm.Assembly
            needData.ReceiverIds = self.ruleForm.ReceiverIds
            needData.EmailTemplate = self.ruleForm.EmailTemplate
            needData.SmsTemplate = self.ruleForm.SmsTemplate
            needData.IsActivity = self.ruleForm.IsActivity
            self.addFlag = false
            AddTask(needData).then(res => {
              if (res.status === 'success') {
                self.$message.success(res.message)
                setTimeout(function() {
                  self.eventTab('refresh', 'first', 'taskList')
                }, 500)
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
        setTimeout(function() {
          self.addFlag = true
        }, 3000)
      },
      // 编辑
      editTaskEvent() {
        var self = this
        if (!this.addFlag) {
          return
        }
        this.$refs.TaskForm.validate(function(valid) {
          if (valid) {
            var needData = {}
            needData.Id = self.editData.Id
            needData.Title = self.ruleForm.Title
            needData.TypeId = self.ruleForm.TypeId
            needData.TaskValues = self.ruleForm.TaskValues
            if (parseInt(needData.TypeId) === 1) {
              needData.TaskTime = self.ruleForm.TaskTime
            } else {
              needData.TaskTime = self.ruleForm.TaskTime2
            }
            needData.BeginDateTime = self.ruleForm.BeginDateTime
            needData.EndDateTime = self.ruleForm.EndDateTime
            needData.Assembly = self.ruleForm.Assembly
            needData.ReceiverIds = self.ruleForm.ReceiverIds
            needData.EmailTemplate = self.ruleForm.EmailTemplate
            needData.SmsTemplate = self.ruleForm.SmsTemplate
            needData.IsActivity = self.ruleForm.IsActivity
            self.addFlag = false
            UpdateTask(needData).then(res => {
              if (res.status === 'success') {
                self.$message.success(res.message)
                setTimeout(function() {
                  self.eventTab('update', 'first', 'taskList')
                }, 500)
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
        setTimeout(function() {
          self.addFlag = true
        }, 3000)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/info.scss";
</style>
