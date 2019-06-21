<template>
  <div class="event-info">
    <el-form :model="ruleForm" :rules="rules" ref="SupplierForm" label-width="100px" label-suffix="：">
      <div class="event-content">
        <el-form-item label="供应商名称" prop="Name" label-width="120px">
          <div class="cont-input">
            <el-input v-model="ruleForm.Name" placeholder="请输入供应商名称"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="API网址" prop="APIUrl">
          <div class="cont-input">
            <el-input v-model="ruleForm.APIUrl" placeholder="请输入API网址"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="公钥" prop="AppKey">
          <div class="cont-input">
            <el-input v-model="ruleForm.AppKey" placeholder="请输入公钥"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="私钥" prop="AppSecret">
          <div class="cont-input">
            <el-input v-model="ruleForm.AppSecret" placeholder="请输入私钥"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="官网地址" prop="Url">
          <div class="cont-input">
            <el-input v-model="ruleForm.Url" placeholder="请输入官网地址"></el-input>
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
        <template v-if="commonTabInfo.text === '新增供应商'">
          <el-button type="primary" @click.native="addSupplierEvent">保存</el-button>
        </template>
        <template v-else-if="commonTabInfo.text === '编辑供应商'">
          <el-button type="primary" @click.native="editSupplierEvent">保存编辑</el-button>
        </template>
      </div>
    </el-form>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { AddSupplier, GetSupplierSingle, UpdateSupplier } from '@/api/requestConfig'
  export default {
    name: 'SupplierInfo',
    data() {
      return {
        ruleForm: {
          IsActivity: true,
          Name: '',
          Url: '',
          APIUrl: '',
          AppKey: '',
          AppSecret: ''
        },
        rules: {
          Name: [
            { required: true, message: '请输入供应商名称', trigger: 'blur' }
          ],
          APIUrl: [
            { required: true, message: '请输入API网址', trigger: 'blur' }
          ],
          AppKey: [
            { required: true, message: '请输入公钥', trigger: 'blur' }
          ],
          AppSecret: [
            { required: true, message: '请输入私钥', trigger: 'blur' }
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
      if (this.commonTabInfo.text === '编辑供应商') {
        GetSupplierSingle(this.commonTabInfo.custom.Id).then(res => {
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
      // 新增供应商
      addSupplierEvent() {
        var self = this
        if (!this.addFlag) {
          return
        }
        this.$refs.SupplierForm.validate(function(valid) {
          if (valid) {
            var needData = {}
            needData.Name = self.ruleForm.Name
            needData.Url = self.ruleForm.Url
            needData.APIUrl = self.ruleForm.APIUrl
            needData.AppKey = self.ruleForm.AppKey
            needData.AppSecret = self.ruleForm.AppSecret
            needData.IsActivity = self.ruleForm.IsActivity
            self.addFlag = false
            AddSupplier(needData).then(res => {
              if (res.status === 'success') {
                self.$message.success(res.message)
                setTimeout(function() {
                  self.eventTab('refresh', 'first', 'supplierList')
                }, 2000)
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
      editSupplierEvent() {
        var self = this
        if (!this.addFlag) {
          return
        }
        this.$refs.SupplierForm.validate(function(valid) {
          if (valid) {
            var needData = {}
            needData.Name = self.ruleForm.Name
            needData.Url = self.ruleForm.Url
            needData.APIUrl = self.ruleForm.APIUrl
            needData.AppKey = self.ruleForm.AppKey
            needData.AppSecret = self.ruleForm.AppSecret
            needData.IsActivity = self.ruleForm.IsActivity
            needData.Id = self.editData.Id
            self.addFlag = false
            UpdateSupplier(needData).then(res => {
              if (res.status === 'success') {
                self.$message.success(res.message)
                setTimeout(function() {
                  self.eventTab('update', 'first', 'supplierList')
                }, 2000)
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
