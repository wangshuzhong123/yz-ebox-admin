<template>
  <div class="event-info">
    <el-form :model="ruleForm" :rules="rules" ref="DeviceForm" label-width="100px" label-suffix="：">
      <div class="event-content">
        <el-form-item label="车牌号" prop="LicenseNum">
          <div class="cont-input">
            <el-input v-model="ruleForm.LicenseNum" placeholder="请输入车牌号"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="设备号" prop="DeviceNo">
          <div class="cont-input">
            <el-input v-model="ruleForm.DeviceNo" placeholder="请输入设备号"></el-input>
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
        <template v-if="commonTabInfo.text === '新增设备'">
          <el-button type="primary" @click.native="addDeviceEvent">保存</el-button>
        </template>
        <template v-else-if="commonTabInfo.text === '编辑设备'">
          <el-button type="primary" @click.native="editDeviceEvent">保存编辑</el-button>
        </template>
      </div>
    </el-form>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { AddDevice, GetDeviceSingle, UpdateDevice } from '@/api/requestConfig'
  export default {
    name: 'DeviceInfo',
    data() {
      return {
        supplierList: [],
        ruleForm: {
          IsActivity: true,
          DeviceNo: '',
          LicenseNum: ''
        },
        rules: {
          DeviceNo: [
            { required: true, message: '请输入设备号', trigger: 'blur' }
          ],
          LicenseNum: [
            { required: true, message: '请输入车牌号', trigger: 'blur' }
          ]
        },
        editData: {},
        addFlag: true
      }
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    created() {
      // 编辑时获取数据
      if (this.commonTabInfo.text === '编辑设备') {
        GetDeviceSingle(this.commonTabInfo.custom.Id).then(res => {
          if (res.data) {
            const resData = res.data
            this.editData = resData
            if (this.editData) {
              for (var key in this.editData) {
                this.ruleForm[key] = this.editData[key]
              }
            }
          }
        })
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
      // 新增设备
      addDeviceEvent() {
        var self = this
        if (!this.addFlag) {
          return
        }
        this.$refs.DeviceForm.validate(function(valid) {
          if (valid) {
            var needData = {}
            needData.DeviceNo = self.ruleForm.DeviceNo
            needData.LicenseNum = self.ruleForm.LicenseNum
            needData.IsActivity = self.ruleForm.IsActivity
            self.addFlag = false
            AddDevice(needData).then(res => {
              if (res.status === 'success') {
                self.$message.success(res.message)
                setTimeout(function() {
                  self.eventTab('refresh', 'first', 'deviceList')
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
      editDeviceEvent() {
        var self = this
        if (!this.addFlag) {
          return
        }
        this.$refs.DeviceForm.validate(function(valid) {
          if (valid) {
            var needData = {}
            needData.DeviceNo = self.ruleForm.DeviceNo
            needData.LicenseNum = self.ruleForm.LicenseNum
            needData.IsActivity = self.ruleForm.IsActivity
            needData.Id = self.editData.Id
            self.addFlag = false
            UpdateDevice(needData).then(res => {
              if (res.status === 'success') {
                self.$message.success(res.message)
                setTimeout(function() {
                  self.eventTab('update', 'first', 'deviceList')
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
