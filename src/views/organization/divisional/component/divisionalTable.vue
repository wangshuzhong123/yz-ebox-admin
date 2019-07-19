<template>
  <div class="zc-table-common">
    <div class="zc-table-event-btn">
      <el-button type="primary" @click.native="eventTab('新增部门', 'second')">新增部门</el-button>
    </div>
    <div class="zc-table-body">
      <el-table
        :data="divisionalTable"
        :empty-text="emptyText"
        row-key="Id"
        v-loading="tableLoading"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        border
        style="width: 100%">
        <el-table-column
          prop="Name"
          label="部门名称">
        </el-table-column>
        <el-table-column
          prop="OrderId"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="AddDateTime"
          width="300"
          label="添加时间">
        </el-table-column>
        <el-table-column
          label="操作"
          width="250">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native="eventTab('部门排序', 'third', scope.row)">排序</el-button>
            <el-button type="text" size="small" @click.native="eventTab('编辑部门', 'second', scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click.native="openElePop(scope.row)">电子围栏</el-button>
            <template v-if="!scope.row.IsActivity">
              <el-button type="text" size="small" @click.native="toDeleteDivisional(scope.row.Id)">删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 维护电子围栏弹窗 -->
    <el-dialog
      :title="eventDialong.title"
      custom-class="dialog-wrap" 
      :visible.sync="eventDialong.eventFlag" 
      width="500px" 
      :close-on-click-modal="eventDialong.default" 
      :close-on-press-escape="eventDialong.default"
      >
      <div class="dialog-content">
        <div class="dialog-cont">
          <el-form :model="ruleForm" :rules="rules" ref="EleForm" label-width="120px" label-suffix="：">
              <el-form-item label="电子围栏名称" prop="ElecId">
                <div class="cont-input">
                   <el-select class="select-cont" v-model="ruleForm.ElecId" multiple placeholder="请选择">
                    <el-option
                      v-for="item in eleList"
                      :key="item.Id"
                      :label="item.Name"
                      :value="item.Id">
                    </el-option>
                  </el-select>
                </div>
              </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setPopFlag">取 消</el-button>
        <el-button type="primary" @click.native="saveEle">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { GetDivisionalTree, DeleteDivisional, GetElectronicPageList, GetUnitElectronicSingle, updateUnitElectronic } from '@/api/requestConfig'
  export default {
    name: 'DivisionalTable',
    created() {
      // 获取部门表格
      this.getDivisionalTable()
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    watch: {
      'commonTabInfo.text': function(val, oldVal) {
        if (val === 'refresh' && this.commonTabInfo.custom === 'divisional') {
          this.clearSearch()
        } else if (val === 'update' && this.commonTabInfo.custom === 'divisional') {
          this.searchTable()
        }
      }
    },
    data() {
      return {
        eleList: [], // 电子围栏列表
        menuName: '', // 部门名称
        emptyText: '未匹配到部门数据',
        divisionalTable: [],
        pageInfo: {
          PageIndex: 1,
          PageSize: 10
        },
        tableLoading: true,
        eventDialong: {
          title: '绑定电子围栏',
          eventFlag: false, // 弹窗是否显示
          default: false
        },
        ruleForm: {
          ElecId: []
        },
        DeptId: '',
        rules: {
          ElecId: [
            { required: true, message: '请选择电子围栏' }
          ]
        }
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
      // 获取电子围栏列表
      getEleList() {
        // 获取电子围栏列表
        if (this.eleList.length < 1) {
          var needData = {}
          needData.Param = {}
          needData.PageIndex = 0
          needData.SearchXml = 'platform/Car/SearchCar'
          GetElectronicPageList(needData).then(res => {
            if (res.data) {
              this.eleList = res.data.list
            }
          })
        }
      },
      // 清空搜索条件
      clearSearch() {
        this.getDivisionalTable()
      },
      // 搜索
      searchTable() {
        this.getDivisionalTable()
      },
      // 获取部门表格
      getDivisionalTable() {
        this.tableLoading = true
        GetDivisionalTree().then(res => {
          if (res.data) {
            this.divisionalTable = res.data[0].children
          } else {
            this.$message.error(res.message)
          }
          this.tableLoading = false
        })
      },
      // 删除部门
      toDeleteDivisional(code) {
        var self = this
        this.$confirm('是否删除此部门?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          DeleteDivisional(code).then(res => {
            if (res.status === 'success') {
              self.$message({
                type: 'success',
                message: '删除成功!'
              })
              self.searchTable()
            } else {
              self.$message.error(res.message)
            }
          })
        }).catch(() => {})
      },
      openElePop(row) {
        // 清空选中值
        this.ruleForm.ElecId = []
        this.getEleList() // 获取电子围栏列表
        if (row.Id) {
          this.DeptId = row.Id
          GetUnitElectronicSingle(row.Id).then(res => {
            if (res.data.length > 0) {
              this.ruleForm.ElecId = res.data
            }
          })
        }
        this.setPopFlag()
      },
      // 弹窗显示
      setPopFlag() {
        this.eventDialong.eventFlag = !this.eventDialong.eventFlag
      },
      // 绑定电子围栏与组织架构
      saveEle() {
        // if (this.ruleForm.ElecId.length < 1) {
        //   this.$message.error('请选择电子围栏')
        //   return
        // }
        var needData = {}
        needData.DeptId = this.DeptId
        needData.ElecId = this.ruleForm.ElecId.toString()
        updateUnitElectronic(needData).then(res => {
          if (res.status === 'success') {
            this.$message({
              type: 'success',
              message: '绑定成功!'
            })
            this.setPopFlag()
            this.searchTable()
          } else {
            this.$message.error(res.message)
          }
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/zc-table-common.scss";
  .select-cont{
    width: 100%;
  }
</style>
