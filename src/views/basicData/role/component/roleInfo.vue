<template>
  <div class="event-info">
    <el-form :model="ruleForm" :rules="rules" ref="RoleForm" label-width="100px" label-suffix="：">
      <div class="event-content">
        <el-form-item label="角色名称" prop="RoleName">
          <div class="cont-input">
            <el-input v-model="ruleForm.RoleName" placeholder="请输入角色名称"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="Remark">
          <div class="cont-input">
            <el-input v-model="ruleForm.Remark" placeholder="请输入备注"></el-input>
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
        <template v-if="commonTabInfo.text === '新增角色'">
          <el-button type="primary" @click.native="addRoleEvent">保存</el-button>
        </template>
        <template v-else-if="commonTabInfo.text === '编辑角色'">
          <el-button type="primary" @click.native="editRoleEvent">保存编辑</el-button>
        </template>
      </div>
    </el-form>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { AddRole, GetRoleSingle, UpdateRole } from '@/api/requestConfig'
  export default {
    name: 'RoleInfo',
    data() {
      return {
        ruleForm: {
          IsActivity: true,
          RoleName: '',
          Remark: ''
        },
        rules: {
          RoleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' }
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
      if (this.commonTabInfo.text === '编辑角色') {
        GetRoleSingle(this.commonTabInfo.custom.Id).then(res => {
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
      // 新增角色
      addRoleEvent() {
        var self = this
        if (!this.addFlag) {
          return
        }
        this.$refs.RoleForm.validate(function(valid) {
          if (valid) {
            var needData = {}
            needData.RoleName = self.ruleForm.RoleName
            needData.Remark = self.ruleForm.Remark
            needData.IsActivity = self.ruleForm.IsActivity
            self.addFlag = false
            AddRole(needData).then(res => {
              if (res.status === 'success') {
                self.$message.success(res.message)
                setTimeout(function() {
                  self.eventTab('refresh', 'first', 'role')
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
      editRoleEvent() {
        var self = this
        if (!this.addFlag) {
          return
        }
        this.$refs.RoleForm.validate(function(valid) {
          if (valid) {
            var needData = {}
            needData.RoleName = self.ruleForm.RoleName
            needData.Remark = self.ruleForm.Remark
            needData.IsActivity = self.ruleForm.IsActivity
            needData.Id = self.editData.Id
            self.addFlag = false
            UpdateRole(needData).then(res => {
              if (res.status === 'success') {
                self.$message.success(res.message)
                setTimeout(function() {
                  self.eventTab('update', 'first', 'role')
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
