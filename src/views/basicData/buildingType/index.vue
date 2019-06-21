<!--建筑类型-->
<template>
  <div class="app-container">
    <div class="zc-table-common">
      <div class="zc-table-search">
        <div class="search-quest">
          <span class="search-quest-title">建筑类型名称：</span>
          <div class="search-input">
            <el-input v-model="name" placeholder="请输入建筑类型名称"></el-input>
          </div>
        </div>
        <div class="search-quest">
          <el-button @click.native="clearSearch">清空条件</el-button>
          <el-button type="primary" @click.native="searchTable">搜索</el-button>
        </div>
      </div>
      <div class="zc-table-event-btn">
        <el-button type="primary" @click.native="showPop">新增建筑类型</el-button>
      </div>
      <div class="zc-table-body">
        <el-table
          :data="buildingTable.list"
          :empty-text="emptyText"
          v-loading="buildingLoading"
          border
          style="width: 100%">
          <el-table-column
            type="index"
            width="50"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="id"
            :formatter="tableFormatter"
            label="建筑类型id">
          </el-table-column>
          <el-table-column
            prop="name"
            :formatter="tableFormatter"
            label="建筑类型">
          </el-table-column>
          <el-table-column
            prop="createTime"
            :formatter="tableFormatter"
            label="创建时间">
            <template slot-scope="scope">
              <span>{{scope.row.createTime | formatTime}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="delFlag"
            :formatter="tableFormatter"
            label="启用状态">
            <template slot-scope="scope">
              <span>{{scope.row.delFlag === 0 ? '正常' : '禁用'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <!--<el-button type="text" size="small" @click.native="addStreet(true, '查看建筑类型')">查看</el-button>-->
              <el-button type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="zc-page-box">
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pageInfo.pageSize"
            :total="buildingTable.totalRow"
            @current-change="changePage"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog title="新增建筑类型" :visible.sync="addFlag" width="400px" top="30vh" @close="closeCallBack" :close-on-click-modal="dialogInfo.default" :close-on-press-escape="dialogInfo.default">
      <el-input v-model="buildingName" placeholder="请输入建筑类型名称"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showPop">取 消</el-button>
        <el-button type="primary" @click="toAddMenu">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { addBuildingType, getBuildingTypePage } from '@/api/requestConfig'
  export default {
    created() {
      // 获取建筑类型表格
      this.getInstallShopTable()
    },
    data() {
      return {
        name: '',
        addTypeFlag: true, // 新增标记
        emptyText: '未匹配到建筑类型数据',
        buildingTable: {},
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        },
        buildingLoading: true,
        buildingName: '',
        dialogInfo: {
          default: false // 禁止点击遮罩层关闭
        },
        addFlag: false
      }
    },
    methods: {
      // 清空搜索条件
      clearSearch() {
        this.name = ''
        this.pageInfo.pageNum = 1
        this.getInstallShopTable()
      },
      // 搜索
      searchTable() {
        this.pageInfo.pageNum = 1
        this.getInstallShopTable()
      },
      // 分页
      changePage(nowPage) {
        this.pageInfo.pageNum = nowPage
        this.getInstallShopTable()
      },
      // 获取建筑类型表格
      getInstallShopTable() {
        this.buildingLoading = true
        var needData = {}
        needData.pageNum = this.pageInfo.pageNum
        needData.pageSize = this.pageInfo.pageSize
        if (this.name) {
          needData.name = this.name
        }
        getBuildingTypePage(needData).then(res => {
          if (res.status === 200) {
            this.buildingTable = res.data
          } else {
            this.$message.error(res.message)
          }
          this.buildingLoading = false
        })
      },
      // 表格列初始化
      tableFormatter(row, column, cellValue) {
        if (cellValue !== null || cellValue !== '' || cellValue !== undefined) {
          return cellValue
        } else {
          return '/'
        }
      },
      // 添加建筑类型弹窗显示与隐藏
      showPop() {
        this.addFlag = !this.addFlag
      },
      // 关闭回调
      closeCallBack() {
        this.buildingName = ''
      },
      // 新增建筑类型
      toAddMenu() {
        if (!this.addTypeFlag) {
          return
        }
        var needData = {}
        if (this.buildingName === '') {
          this.$message.error('请输入建筑类型名称')
          return
        }
        needData.name = this.buildingName
        this.addTypeFlag = false
        var turnSelf = this
        addBuildingType(needData).then(res => {
          if (res.status === 200) {
            this.clearSearch()
            this.showPop()
            // 更新建筑类型
            this.$store.dispatch('GetBuildingTypeList')
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
        })
        setTimeout(function() {
          turnSelf.addTypeFlag = true
        }, 3000)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/zc-table-common.scss";
</style>
