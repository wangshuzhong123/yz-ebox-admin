<template>
  <div class="event-info">
    <el-form :model="ruleForm" :rules="rules" ref="MenuForm" label-width="100px" label-suffix="：">
      <div class="event-content">
        <el-form-item label="上级菜单" prop="ParentId">
          <div class="cont-input">
            <el-cascader
              v-model="ruleForm.ParentId"
              :change-on-select="true"
              :options="menuData"
              :props="propData"
              :disabled="commonTabInfo.text === '编辑菜单' ? true : false"
              clearable>
            </el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="菜单名称" prop="Title">
          <div class="cont-input">
            <el-input v-model="ruleForm.Title" placeholder="请输入菜单名称"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="菜单图标" prop="Icon">
          <div class="cont-input">
            <el-input v-model="ruleForm.Icon" placeholder="请输入菜单图标"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="菜单URL" prop="LinkUrl">
          <div class="cont-input">
            <el-input v-model="ruleForm.LinkUrl" placeholder="请输入菜单URL"></el-input>
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
        <template v-if="commonTabInfo.text === '新增菜单'">
          <el-button type="primary" @click.native="addMenuEvent">保存</el-button>
        </template>
        <template v-else-if="commonTabInfo.text === '编辑菜单'">
          <el-button type="primary" @click.native="editMenuEvent">保存编辑</el-button>
        </template>
      </div>
    </el-form>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getAllMenuList, addMenu, GetMenuSingle, updateMenu } from '@/api/requestConfig'
  import { getTreeDeepArr } from '@/utils/index' // 递归获取数组
  export default {
    name: 'MenuInfo',
    data() {
      return {
        propData: {
          value: 'Id',
          label: 'Title',
          children: 'children'
        }, // 上级菜单配置
        ruleForm: {
          IsActivity: true,
          ParentId: [],
          Title: '',
          Icon: '',
          LinkUrl: ''
        },
        rules: {
          Title: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' }
          ]
        },
        menuData: [], // 菜单树形数据
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
      // 获取菜单数据
      getAllMenuList().then(res => {
        if (res.data) {
          this.menuData = res.data[0].children
        }
      }).then(() => {
        // 编辑时获取数据
        if (this.commonTabInfo.text === '编辑菜单') {
          GetMenuSingle(this.commonTabInfo.custom.Id).then(res => {
            if (res.data) {
              const resData = res.data
              this.editData = resData
              if (this.editData) {
                for (var key in this.editData) {
                  if (key === 'ParentId') {
                    if (resData.ParentId === 1) {
                      this.ruleForm.ParentId = []
                    } else {
                      this.ruleForm.ParentId = getTreeDeepArr(resData.ParentId, this.menuData) // 渲染上级选择的菜单
                    }
                  } else {
                    this.ruleForm[key] = this.editData[key]
                  }
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
      // 新增菜单
      addMenuEvent() {
        var self = this
        if (!this.addFlag) {
          return
        }
        this.$refs.MenuForm.validate(function(valid) {
          if (valid) {
            var needData = {}
            console.log(self.ruleForm.ParentId)
            if (self.ruleForm.ParentId.length < 1) {
              needData.ParentId = 1
            } else {
              needData.ParentId = self.ruleForm.ParentId[self.ruleForm.ParentId.length - 1]
            }
            needData.Title = self.ruleForm.Title
            needData.Icon = self.ruleForm.Icon
            needData.LinkUrl = self.ruleForm.LinkUrl
            needData.IsActivity = self.ruleForm.IsActivity
            self.addFlag = false
            addMenu(needData).then(res => {
              if (res.status === 'success') {
                self.$message.success(res.message)
                setTimeout(function() {
                  self.eventTab('refresh', 'first', 'menu')
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
      editMenuEvent() {
        var self = this
        if (!this.addFlag) {
          return
        }
        this.$refs.MenuForm.validate(function(valid) {
          if (valid) {
            var needData = {}
            needData.Title = self.ruleForm.Title
            needData.Icon = self.ruleForm.Icon
            needData.LinkUrl = self.ruleForm.LinkUrl
            needData.IsActivity = self.ruleForm.IsActivity
            needData.Id = self.editData.Id
            self.addFlag = false
            updateMenu(needData).then(res => {
              if (res.status === 'success') {
                self.$message.success(res.message)
                setTimeout(function() {
                  self.eventTab('update', 'first', 'menu')
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
