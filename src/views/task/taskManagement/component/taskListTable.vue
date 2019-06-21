<template>
  <div class="zc-table-common">
    <div class="zc-table-search">
      <div class="search-quest">
        <span class="search-quest-title">作业名称：</span>
        <div class="search-input">
          <el-input v-model="Title" placeholder="请输入作业名称"></el-input>
        </div>
      </div>
      <div class="search-quest">
        <span class="search-quest-title">类型：</span>
        <div class="search-input">
          <el-select v-model="TypeId" placeholder="请选择">
              <el-option label="站内作业" value="1"></el-option>
              <el-option label="站内定时器" value="2"></el-option>
            </el-select>
        </div>
      </div>
      <div class="search-quest">
        <el-button @click.native="clearSearch">清空条件</el-button>
        <el-button type="primary" @click.native="searchTable">搜索</el-button>
      </div>
    </div>
    <div class="zc-table-event-btn">
      <el-button type="primary" @click.native="eventTab('新增作业', 'second')">新增作业</el-button>
    </div>
    <div class="zc-table-body">
      <el-table
        :data="taskTable"
        :empty-text="emptyText"
        v-loading="tableLoading"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          width="50"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="TypeId"
          label="类型">
          <template slot-scope="scope">
            <span>
              {{scope.row.TypeId == 1 ? '站内作业' : '站内定时器'}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="Title"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="TaskValue"
          label="通知方式">
          <template slot-scope="scope">
            <span>
              {{scope.row.TaskValue == 1 ? '邮件' : scope.row.TaskValue == 2 ? '短信' : scope.row.TaskValue == 3 ? '邮件+短信' : ''}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="RunTime"
          label="执行时间">
        </el-table-column>
        <el-table-column
          prop="Receiver"
          label="接收人">
        </el-table-column>
        <el-table-column
          prop="LastUpdateTime"
          label="最后运行时间">
           <template slot-scope="scope">
            <span :style="{color: scope.row.TimeColor}">
              {{scope.row.LastUpdateTime}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="IsActivity"
          label="状态">
          <template slot-scope="scope">
            <span>
              <i class="el-icon-success diy-success" v-if="scope.row.IsActivity"></i>
              <i class="el-icon-error diy-error" v-else></i>
            </span>
          </template>
        </el-table-column>
         <el-table-column
          prop="BeginDateTime"
          label="起始时间">
          <template slot-scope="scope">
            <span>
              <span>{{new Date(scope.row.BeginDateTime).getTime() | formatTime}} ~ </span>
              <span v-if="scope.row.EndDateTime">{{new Date(scope.row.EndDateTime).getTime() | formatTime}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native="eventTab('编辑作业', 'second', scope.row)">编辑</el-button>
            <el-button type="text" @click.native="runNow(scope.row.Id, $event)">运行</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { GetTaskList, RunTask } from '@/api/requestConfig'
  export default {
    name: 'TaskTable',
    created() {
      // 获取作业表格
      this.getTaskTable()
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    watch: {
      'commonTabInfo.text': function(val, oldVal) {
        if (val === 'refresh' && this.commonTabInfo.custom === 'taskList') {
          this.clearSearch()
        } else if (val === 'update' && this.commonTabInfo.custom === 'taskList') {
          this.searchTable()
        }
      }
    },
    data() {
      return {
        Title: '', // 作业名称
        TypeId: '',
        emptyText: '未匹配到作业数据',
        taskTable: [],
        tableLoading: true
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
      // 清空搜索条件
      clearSearch() {
        this.Title = ''
        this.TypeId = ''
        this.getTaskTable()
      },
      // 搜索
      searchTable() {
        this.getTaskTable()
      },
      // 获取作业表格
      getTaskTable() {
        this.tableLoading = true
        var needData = {}
        if (this.Title) {
          needData.Title = this.Title
        }
        if (this.TypeId) {
          needData.TypeId = this.TypeId
        }
        GetTaskList(needData).then(res => {
          if (res.data) {
            this.taskTable = res.data
          } else {
            this.$message.error(res.message)
          }
          this.tableLoading = false
        })
      },
      // 立即执行
      runNow(rowId, $event) {
        // 动态添加加载
        var ele = $event.path[1]
        ele.className = 'el-button el-button--text is-loading'
        ele.disabled = 'disabled'
        var i = document.createElement('i')
        i.className = 'el-icon-loading'
        ele.insertBefore(i, ele.lastChild)
        RunTask([rowId]).then(res => {
          if (res.status === 'success') {
            this.$notify({
              title: '任务运行',
              message: '运行成功',
              type: 'success'
            })
            this.searchTable()
          } else {
            this.$notify({
              title: '任务运行',
              message: '运行失败',
              type: 'error'
            })
          }
          // 动态去除加载
          var ele = $event.path[1]
          ele.className = 'el-button el-button--text'
          ele.disabled = ''
          ele.removeChild(ele.childNodes[2])
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/zc-table-common.scss";
</style>
