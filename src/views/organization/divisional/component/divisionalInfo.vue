<template>
  <div class="event-info">
    <el-form :model="ruleForm" :rules="rules" ref="DivisionalForm" label-width="100px" label-suffix="：">
      <div class="event-content">
        <el-form-item label="上级部门" prop="ParentId">
          <div class="cont-input">
            <el-cascader
              v-model="ruleForm.ParentId"
              :options="divisionalData"
              change-on-select
              :props="propData"
              clearable>
            </el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="部门名称" prop="Name">
          <div class="cont-input">
            <el-input v-model="ruleForm.Name" placeholder="请输入部门名称"></el-input>
          </div>
        </el-form-item>
      </div>
      <div class="cont-footer">
        <el-button @click.native="eventTab('', 'first' )">取消</el-button>
        <template v-if="commonTabInfo.text === '新增部门'">
          <el-button type="primary" @click.native="addDivisionalEvent">保存</el-button>
        </template>
        <template v-else-if="commonTabInfo.text === '编辑部门'">
          <el-button type="primary" @click.native="editDivisionalEvent">保存编辑</el-button>
        </template>
      </div>
    </el-form>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { GetDivisionalTree, AddDivisional, GetDivisionalSingle, UpdateDivisional } from '@/api/requestConfig'
  import { getTreeDeepArr } from '@/utils/index' // 递归获取数组
  export default {
    name: 'DivisionalInfo',
    data() {
      return {
        propData: {
          value: 'Id',
          label: 'Name',
          children: 'children',
          disabled: 'disabled'
        }, // 上级部门配置
        ruleForm: {
          ParentId: '',
          Name: ''
        },
        rules: {
          ParentId: [
            { required: true, message: '请选择上级部门' }
          ],
          Name: [
            { required: true, message: '请输入部门名称', trigger: 'blur' }
          ]
        },
        divisionalData: [], // 部门树形数据
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
      // 获取部门数据
      GetDivisionalTree().then(res => {
        if (res.data) {
          this.divisionalData = res.data
        }
      }).then(() => {
        // 编辑时获取数据
        if (this.commonTabInfo.text === '编辑部门') {
          GetDivisionalSingle(this.commonTabInfo.custom.Id).then(res => {
            if (res.data) {
              const resData = res.data
              this.editData = resData
              if (this.editData) {
                // 渲染数据
                for (var key in this.editData) {
                  if (key === 'ParentId') {
                    this.ruleForm.ParentId = getTreeDeepArr(resData.ParentId, this.divisionalData) // 渲染上级选择的部门
                  } else {
                    this.ruleForm[key] = this.editData[key]
                  }
                }
                // 禁用编辑项
                var setDisabled = function setDisabled(treeData, sId) {
                  for (var i = 0; i < treeData.length; i++) {
                    if (treeData[i].Id === sId) {
                      treeData[i].disabled = true
                      break
                    } else if (treeData[i].children) {
                      setDisabled(treeData[i].children, sId)
                    }
                  }
                }
                setDisabled(this.divisionalData, this.editData.Id)
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
      // 新增部门
      addDivisionalEvent() {
        var self = this
        if (!this.addFlag) {
          return
        }
        this.$refs.DivisionalForm.validate(function(valid) {
          if (valid) {
            var needData = {}
            console.log(self.ruleForm.ParentId)
            needData.ParentId = self.ruleForm.ParentId[self.ruleForm.ParentId.length - 1]
            needData.Name = self.ruleForm.Name
            self.addFlag = false
            AddDivisional(needData).then(res => {
              if (res.status === 'success') {
                self.$message.success(res.message)
                setTimeout(function() {
                  self.eventTab('refresh', 'first', 'divisional')
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
      editDivisionalEvent() {
        var self = this
        if (!this.addFlag) {
          return
        }
        this.$refs.DivisionalForm.validate(function(valid) {
          if (valid) {
            var needData = {}
            needData.Name = self.ruleForm.Name
            needData.Id = self.editData.Id
            needData.ParentId = self.ruleForm.ParentId[self.ruleForm.ParentId.length - 1]
            self.addFlag = false
            UpdateDivisional(needData).then(res => {
              if (res.status === 'success') {
                self.$message.success(res.message)
                setTimeout(function() {
                  self.eventTab('update', 'first', 'divisional')
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
