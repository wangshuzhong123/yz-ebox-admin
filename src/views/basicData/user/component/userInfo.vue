<template>
  <div class="event-info">
    <el-form :model="ruleForm" :rules="rules" ref="UserForm" label-width="100px" label-suffix="：">
      <div class="event-content">
        <el-form-item label="用户名" prop="MemberName">
          <div class="cont-input">
            <el-input v-model="ruleForm.MemberName" placeholder="请输入用户名"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="角色" prop="RoleIds">
          <div class="cont-input">
            <el-select v-model="ruleForm.RoleIds" multiple placeholder="请选择">
              <el-option
                v-for="item in roleData"
                :key="item.Id"
                :label="item.RoleName"
                :value="item.Id">
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="所属组织" prop="DeptIds">
          <div class="cont-input">
            <el-select v-model="ruleForm.DeptIds" multiple placeholder="请选择">
              <el-option
                v-for="item in deptData"
                :key="item.Id"
                :label="item.Name"
                :value="item.Id">
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="手机" prop="Mobile">
          <div class="cont-input">
            <el-input v-model="ruleForm.Mobile" placeholder="请输入手机"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="邮箱" prop="Email">
          <div class="cont-input">
            <el-input v-model="ruleForm.Email" placeholder="请输入邮箱"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="昵称" prop="NickName">
          <div class="cont-input">
            <el-input v-model="ruleForm.NickName" placeholder="请输入昵称"></el-input>
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
        <template v-if="commonTabInfo.text === '新增用户'">
          <el-button type="primary" @click.native="addUserEvent">保存</el-button>
        </template>
        <template v-else-if="commonTabInfo.text === '编辑用户'">
          <el-button type="primary" @click.native="editUserEvent">保存编辑</el-button>
        </template>
      </div>
    </el-form>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { AddUser, GetUserSingle, UpdateUser, GetRoleTable, GetCustomerCompanyList } from '@/api/requestConfig'
  export default {
    name: 'UserInfo',
    data() {
      // 手机号验证规则
      var phoneReg = (rule, value, callback) => {
        if (rule.required) {
          if (value === '') {
            callback(new Error('请输入手机号'))
          }
        }
        if (value) {
          if (!(/^1[3456789]\d{9}$/.test(value))) {
            callback(new Error('请输入格式正确的手机号'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      // 邮箱验证规则
      var emailReg = (rule, value, callback) => {
        if (rule.required) {
          if (value === '') {
            callback(new Error('请输入邮箱'))
          }
        }
        if (value) {
          if (!(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value))) {
            callback(new Error('请输入格式正确的邮箱'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }

      return {
        roleData: [],
        deptData: [],
        ruleForm: {
          IsActivity: true,
          MemberName: '',
          RoleIds: [],
          DeptIds: [],
          Mobile: '',
          Email: '',
          NickName: ''
        },
        rules: {
          MemberName: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          RoleIds: [
            { required: true, message: '请选择角色', trigger: 'change' }
          ],
          Mobile: [
            { required: false, type: 'number', validator: phoneReg, trigger: 'blur' }
          ],
          Email: [
            { required: false, validator: emailReg, trigger: 'blur' }
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
      // 获取组织
      GetCustomerCompanyList({ PageIndex: 0 }).then(res => {
        if (res.data) {
          this.deptData = res.data.list
        }
      })
      // 获取角色
      GetRoleTable().then(res => {
        if (res.data) {
          this.roleData = res.data
        } else {
          this.$message.error(res.message)
        }
      }).then(() => {
        // 编辑时获取数据
        if (this.commonTabInfo.text === '编辑用户') {
          GetUserSingle(this.commonTabInfo.custom.Id).then(res => {
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
      })
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
      // 新增用户
      addUserEvent() {
        var self = this
        if (!this.addFlag) {
          return
        }
        this.$refs.UserForm.validate(function(valid) {
          if (valid) {
            var needData = {}
            needData.MemberName = self.ruleForm.MemberName
            needData.Email = self.ruleForm.Email
            needData.RoleIds = self.ruleForm.RoleIds
            needData.DeptIds = self.ruleForm.DeptIds
            needData.Mobile = self.ruleForm.Mobile
            needData.NickName = self.ruleForm.NickName
            needData.IsActivity = self.ruleForm.IsActivity
            self.addFlag = false
            AddUser(needData).then(res => {
              if (res.status === 'success') {
                self.$message.success(res.message)
                setTimeout(function() {
                  self.eventTab('refresh', 'first', 'user')
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
      editUserEvent() {
        var self = this
        if (!this.addFlag) {
          return
        }
        this.$refs.UserForm.validate(function(valid) {
          if (valid) {
            var needData = {}
            needData.MemberName = self.ruleForm.MemberName
            needData.Email = self.ruleForm.Email
            needData.RoleIds = self.ruleForm.RoleIds
            needData.DeptIds = self.ruleForm.DeptIds
            needData.Mobile = self.ruleForm.Mobile
            needData.NickName = self.ruleForm.NickName
            needData.IsActivity = self.ruleForm.IsActivity
            needData.Id = self.editData.Id
            self.addFlag = false
            UpdateUser(needData).then(res => {
              if (res.status === 'success') {
                self.$message.success(res.message)
                setTimeout(function() {
                  self.eventTab('update', 'first', 'user')
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
