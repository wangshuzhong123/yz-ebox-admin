<template>
  <div class="event-info">
    <el-form :model="ruleForm" :rules="rules" ref="CustomerCompanyForm" label-width="120px" label-suffix="：">
      <div class="event-content">
        <el-form-item label="客户组织名称" prop="Name">
          <div class="cont-input">
            <el-input v-model="ruleForm.Name" placeholder="请输入客户组织名称"></el-input>
          </div>
        </el-form-item>
      </div>
      <div class="cont-footer">
        <el-button @click.native="eventTab('', 'first' )">取消</el-button>
        <template v-if="commonTabInfo.text === '新增客户组织'">
          <el-button type="primary" @click.native="addCustomerCompanyEvent">保存</el-button>
        </template>
        <template v-else-if="commonTabInfo.text === '编辑客户组织'">
          <el-button type="primary" @click.native="editCustomerCompanyEvent">保存编辑</el-button>
        </template>
      </div>
    </el-form>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { AddCustomerCompany, GetCustomerCompanySingle, UpdateCustomerCompany } from '@/api/requestConfig'
  export default {
    name: 'CustomerCompanyInfo',
    data() {
      return {
        ruleForm: {
          Name: ''
        },
        rules: {
          Name: [
            { required: true, message: '请输入客户组织名称', trigger: 'blur' }
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
      if (this.commonTabInfo.text === '编辑客户组织') {
        GetCustomerCompanySingle(this.commonTabInfo.custom.Id).then(res => {
          if (res.data) {
            const resData = res.data
            this.editData = resData
            if (this.editData) {
              // 渲染数据
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
      // 新增客户组织
      addCustomerCompanyEvent() {
        var self = this
        if (!this.addFlag) {
          return
        }
        this.$refs.CustomerCompanyForm.validate(function(valid) {
          if (valid) {
            var needData = {}
            needData.Name = self.ruleForm.Name
            self.addFlag = false
            AddCustomerCompany(needData).then(res => {
              if (res.status === 'success') {
                self.$message.success(res.message)
                setTimeout(function() {
                  self.eventTab('refresh', 'first', 'customerCompany')
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
      editCustomerCompanyEvent() {
        var self = this
        if (!this.addFlag) {
          return
        }
        this.$refs.CustomerCompanyForm.validate(function(valid) {
          if (valid) {
            var needData = {}
            needData.Name = self.ruleForm.Name
            needData.Id = self.editData.Id
            self.addFlag = false
            UpdateCustomerCompany(needData).then(res => {
              if (res.status === 'success') {
                self.$message.success(res.message)
                setTimeout(function() {
                  self.eventTab('update', 'first', 'customerCompany')
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
