<template>
  <div class="zc-table-common">
    <div class="zc-table-search">
      <div class="search-quest">
        <span class="search-quest-title">房屋名：</span>
        <div class="search-input">
          <el-input v-model="houseName" placeholder="请输入房屋名"></el-input>
        </div>
      </div>
      <div class="search-quest">
        <el-button @click.native="clearSearch">清空条件</el-button>
        <el-button type="primary" @click.native="searchTable">搜索</el-button>
      </div>
    </div>
    <div class="zc-table-event-btn">
      <el-button type="primary" :disabled="isDisabled" @click.native="clickPointerBtn">批量转移任务</el-button>
    </div>
    <div class="zc-table-body">
      <el-table
        ref="multipleTable"
        :data="reportTable.list"
        :empty-text="emptyText"
        v-loading="reportLoading"
        @selection-change="handleSelectionChange"
        border
        style="width: 100%">
        <el-table-column
          type="selection"
          :selectable="canSelect"
          width="55">
        </el-table-column>
        <el-table-column
          type="index"
          width="50"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="houseName"
          :formatter="tableFormatter"
          label="巡检房屋">
        </el-table-column>
        <el-table-column
          prop="expectStartTime"
          :formatter="tableFormatter"
          label="巡检开始时间">
          <template slot-scope="scope">
            <span>{{scope.row.expectStartTime | formatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="expectEndTime"
          :formatter="tableFormatter"
          label="巡检截止时间">
          <template slot-scope="scope">
            <span>{{scope.row.expectEndTime | formatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          :formatter="tableFormatter"
          label="巡检报告id">
        </el-table-column>
        <el-table-column
          prop="principalName"
          :formatter="tableFormatter"
          label="负责人">
        </el-table-column>
        <el-table-column
          prop="inspectorName"
          :formatter="tableFormatter"
          label="巡检员">
        </el-table-column>
        <el-table-column
          prop="status"
          label="巡检报告状态">
          <template slot-scope="scope">
            <span>{{turnReportStatus(scope.row.status)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="zc-page-box">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageInfo.pageSize"
          :current-page="pageInfo.pageNum"
          :total="reportTable.totalRow"
          @current-change="changePage"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog title="转移任务给巡检员" :visible.sync="pointerFlag" width="800px" top="30vh" @close="closeCallBack" :close-on-click-modal="dialogInfo.default" :close-on-press-escape="dialogInfo.default">
      <div class="street-form">
        <div class="street-form-inline">
          <span class="search-quest-title"><i class="form-must-tip">*</i>巡检员：</span>
          <el-select v-model="principalId" placeholder="请选择">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
          <template v-if="principalList.length > 0">
            <el-select v-model="principalVal" placeholder="请选择">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="item in principalList" :key="item.id" :label="turnUserName(item.realName, item.userName)" :value="item.id"></el-option>
            </el-select>
          </template>
        </div>
      </div>
      <div class="street-form street-form-textarea">
        <div class="street-form-inline">
          <span class="search-quest-title" style="float: left"><i class="form-must-tip">*</i>转移理由：</span>
          <el-input class="reject-reason" type="textarea" v-model="transferReason"></el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showPop">取 消</el-button>
        <el-button type="primary" @click="toPointer">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getCheckTaskApplyTable, postCheckTaskApply, getRoleList, getUserByRoleId } from '@/api/requestConfig'
  import { formatTime } from '@/filters/index'
  export default {
    name: 'CheckTaskApply',
    created() {
      var userRole = JSON.parse(window.sessionStorage.getItem('userInfo'))
      this.inspectorName = userRole.realName
      // 获取巡检报告表格
      this.getReportTable()
      // 获取角色列表
      this.toGetRoleList()
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    watch: {
      'commonTabInfo.text': function(val, oldVal) {
        if (val === 'refresh') {
          this.clearSearch()
        } else if (val === 'update') {
          this.searchTable()
        }
      },
      'multipleSelection': function(val, oldVal) {
        console.log(val)
        if (val.length > 0) {
          this.isDisabled = false
        } else {
          this.isDisabled = true
        }
      },
      'principalId': function(val, oldVal) {
        if (val) {
          this.principalVal = ''
          this.getUserById(val)
        } else {
          this.principalList.splice(0)
        }
      }
    },
    data() {
      return {
        emptyText: '未匹配到巡检报告数据',
        inspectorName: '',
        reportTable: {},
        houseName: '',
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        },
        reportLoading: true,
        pointerFlag: false,
        dialogInfo: {
          default: false // 禁止点击遮罩层关闭
        },
        principalId: '', // 负责人id
        principalVal: '', // 负责人
        principalList: [], // 负责人列表
        roleList: [], // 角色列表
        isDisabled: true, // 是否选择了巡检报告
        transferReason: '',
        multipleSelection: [] // 选择的巡检报告
      }
    },
    methods: {
      // 获取角色列表
      toGetRoleList() {
        getRoleList().then(res => {
          if (res.status === 200) {
            this.roleList = res.data
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      // 通过角色获取用户 type（1：负责人，2：巡检人）
      getUserById(id) {
        getUserByRoleId(id).then(res => {
          if (res.status === 200) {
            this.principalList = res.data
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      // 巡检报告操作
      eventStreet(flag, text, disabled, activeName, custom) {
        this.$store.dispatch('handleTabInfo', {
          flag: flag,
          text: text,
          disabled: disabled,
          activeName: activeName,
          custom: custom
        })
      },
      // 清空搜索条件
      clearSearch() {
        this.houseName = ''
        this.pageInfo.pageNum = 1
        this.getReportTable()
      },
      // 搜索
      searchTable() {
        this.pageInfo.pageNum = 1
        this.getReportTable()
      },
      // 分页
      changePage(nowPage) {
        this.pageInfo.pageNum = nowPage
        this.getReportTable()
      },
      // 获取巡检报告表格
      getReportTable() {
        this.reportLoading = true
        var needData = {}
        needData.pageNum = this.pageInfo.pageNum
        needData.pageSize = this.pageInfo.pageSize
        needData.status = 0 // 待巡检的任务
        needData.inspectorName = this.inspectorName // 巡检员为当前登录用户
        if (this.houseName) {
          needData.houseName = this.houseName
        }
        getCheckTaskApplyTable(needData).then(res => {
          if (res.status === 200) {
            this.reportTable = res.data
          } else {
            this.$message.error(res.message)
          }
          this.reportLoading = false
        })
      },
      // 表格列初始化
      tableFormatter(row, column, cellValue) {
        if (cellValue) {
          return cellValue
        } else {
          return '/'
        }
      },
      cellFormatter(value) {
        if (value) {
          return value
        } else {
          return '/'
        }
      },
      turnReportStatus(val) {
        if (val === 0) {
          return '待巡检'
        } else if (val === 1) {
          return '待审核'
        } else if (val === 2) {
          return '审核通过'
        } else if (val === 3) {
          return '驳回重新巡检'
        } else if (val === 4) {
          return '驳回修改报告'
        }
      },
      turnTime(val, type) {
        if (val) {
          return formatTime(val, type)
        } else {
          return '/'
        }
      },
      // 表格选择框
      handleSelectionChange(val) {
        this.multipleSelection = val
        console.log(val)
      },
      // 当前列是否可选择
      canSelect(row, index) {
        // 待巡检和驳回重新巡检状态可以转移
        if (row.status === 0 || row.status === 3) {
          return true
        } else {
          return false
        }
      },
      // 点击指派巡检员按钮
      clickPointerBtn() {
        this.showPop()
      },
      // 指派巡检员弹窗显示与隐藏
      showPop() {
        this.pointerFlag = !this.pointerFlag
      },
      turnUserName(realName, userName) {
        return realName + '（' + userName + '）'
      },
      // 指派
      toPointer() {
        if (this.principalVal === '') {
          this.$message.error('请选择巡检任务接收人')
          return
        }
        if (this.transferReason === '') {
          this.$message.error('请填写转移巡检任务理由')
          return
        }
        // 获取巡检员
        var signUserName = ''
        for (var x = 0; x < this.principalList.length; x++) {
          if (this.principalList[x].id === this.principalVal) {
            signUserName = this.principalList[x].realName
          }
        }
        var needArr = []
        var allHouseName = ''
        for (var i = 0; i < this.multipleSelection.length; i++) {
          console.log(this.multipleSelection[i])
          if (i === 0) {
            allHouseName += this.multipleSelection[i].houseName + '(' + this.turnTime(this.multipleSelection[i].expectStartTime) + ' - ' + this.turnTime(this.multipleSelection[i].expectEndTime) + ')'
          } else {
            allHouseName += ';' + this.multipleSelection[i].houseName + '(' + this.turnTime(this.multipleSelection[i].expectStartTime) + ' - ' + this.turnTime(this.multipleSelection[i].expectEndTime) + ')'
          }
          var needData = {}
          needData.iorId = this.multipleSelection[i].id
          needData.transferReason = this.transferReason
          needData.transferTargetInspector = this.principalVal
          needData.transferTargetInspectorName = signUserName
          needArr.push(needData)
        }
        this.$confirm('是否将巡检任务' + allHouseName + '转移给' + signUserName + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          postCheckTaskApply(needArr).then(res => {
            if (res.status === 200) {
              this.$message.success(res.message)
              this.showPop()
              this.searchTable()
            } else {
              this.$message.error(res.message)
            }
          })
        }).catch(() => {})
      },
      // 弹窗关闭的时候清空已经选择的
      closeCallBack() {
        this.toggleSelection()
      },
      // 取消表格选择
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/zc-table-common.scss";
  .street-form{
    width: 100%;
    .street-form-input{
      display: inline-block;
      width: 220px;
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
    .street-form-inline{
      display: inline-block;
    }
  }
  .street-form-textarea{
    margin-top: 15px;
  }
</style>
