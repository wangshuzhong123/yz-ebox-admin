<template>
  <div class="zc-table-common">
    <div class="zc-table-search">
      <div class="search-quest">
        <span class="search-quest-title">用户名：</span>
        <div class="search-input">
          <el-input v-model="MemberName" placeholder="请输入用户名"></el-input>
        </div>
      </div>
      <div class="search-quest">
        <span class="search-quest-title">昵称：</span>
        <div class="search-input">
          <el-input v-model="NickName" placeholder="请输入昵称"></el-input>
        </div>
      </div>
      <div class="search-quest">
        <el-button @click.native="clearSearch">清空条件</el-button>
        <el-button type="primary" @click.native="searchTable">搜索</el-button>
      </div>
    </div>
    <div class="zc-table-event-btn">
      <el-button type="primary" @click.native="eventTab('新增用户', 'second')">新增用户</el-button>
    </div>
    <div class="zc-table-body">
      <el-table
        :data="userTable.list"
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
          prop="MemberName"
          label="用户名称">
        </el-table-column>
        <el-table-column
          prop="NickName"
          label="昵称">
        </el-table-column>
        <el-table-column
          prop="RoleName"
          label="角色">
        </el-table-column>
        <el-table-column
          prop="Mobile"
          label="手机">
        </el-table-column>
        <el-table-column
          prop="Email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="AddDateTime"
          label="添加时间">
        </el-table-column>
         <el-table-column
          prop="LastLoginIP"
          label="上次登录IP">
        </el-table-column>
         <el-table-column
          prop="LastLoginTime"
          label="上次登录时间">
        </el-table-column>
         <el-table-column
          prop="LoginCount"
          label="登录次数">
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
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native="eventTab('编辑用户', 'second', scope.row)">编辑</el-button>
            <!-- <template v-if="!scope.row.IsActivity">
              <el-button type="text" size="small" @click.native="deleteUser(scope.row.Id)">删除</el-button>
            </template> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="zc-page-box">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageInfo.PageSize"
          :current-page="pageInfo.pageNum"
          :total="userTable.records"
          @current-change="changePage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { GetUserPageList } from '@/api/requestConfig'
  export default {
    name: 'UserTable',
    created() {
      // 获取用户表格
      this.getUserTable()
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    watch: {
      'commonTabInfo.text': function(val, oldVal) {
        if (val === 'refresh' && this.commonTabInfo.custom === 'user') {
          this.clearSearch()
        } else if (val === 'update' && this.commonTabInfo.custom === 'user') {
          this.searchTable()
        }
      }
    },
    data() {
      return {
        MemberName: '', // 用户名称
        NickName: '', // 昵称
        emptyText: '未匹配到用户数据',
        userTable: {},
        pageInfo: {
          SearchXml: 'platform/admin/SearchAdmin',
          PageIndex: 1,
          PageSize: 10
        },
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
        this.MemberName = ''
        this.NickName = ''
        this.getUserTable()
      },
      // 搜索
      searchTable() {
        this.pageInfo.PageIndex = 1
        this.getUserTable()
      },
      // 分页
      changePage(nowPage) {
        this.pageInfo.PageIndex = nowPage
        this.getUserTable()
      },
      // 获取用户表格
      getUserTable() {
        this.tableLoading = true
        var needData = {}
        needData.Param = {}
        needData.PageIndex = this.pageInfo.PageIndex
        needData.PageSize = this.pageInfo.PageSize
        needData.SearchXml = this.pageInfo.SearchXml
        if (this.MemberName) {
          needData.Param.MemberName = this.MemberName
        }
        if (this.NickName) {
          needData.Param.NickName = this.NickName
        }
        GetUserPageList(needData).then(res => {
          if (res.data) {
            this.userTable = res.data
          } else {
            this.$message.error(res.message)
          }
          this.tableLoading = false
        })
      },
      // 删除用户
      deleteUser(Id) {
        this.$confirm('是否删除此用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          // DeleteUser(Id).then(res => {
          //   if (res.status === 'success') {
          //     this.$message({
          //       type: 'success',
          //       message: '删除成功!'
          //     })
          //     this.searchTable()
          //   } else {
          //     this.$message.error(res.message)
          //   }
          // })
        }).catch(() => {})
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/zc-table-common.scss";
</style>
