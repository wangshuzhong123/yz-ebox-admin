<template>
  <div class="zc-table-common">
    <div class="zc-table-search">
      <div class="search-quest">
        <span class="search-quest-title">地址：</span>
        <areachoose ref="Areachoose" :type="areaSelectOption.type" :status="areaSelectOption.status" @areainfo="getAreaProps"></areachoose>
      </div>
      <div class="search-quest">
        <span class="search-quest-title">房屋名称：</span>
        <div class="search-input">
          <el-input v-model="houseName" placeholder="请输入房屋名称"></el-input>
        </div>
      </div>
      <div class="search-quest">
        <el-button @click.native="clearSearch">清空条件</el-button>
        <el-button type="primary" @click.native="searchTable">搜索</el-button>
      </div>
    </div>
    <div class="zc-table-event-btn">
      <el-button type="primary" @click.native="eventStreet(true, '新增房屋', true, 'second', '')">新增房屋</el-button>
      <!--<el-button type="primary">批量导入</el-button>-->
      <el-button type="primary" @click.native="downLoadTable">批量下载</el-button>
    </div>
    <div class="zc-table-body">
      <el-table
        :data="houseTable.list"
        :empty-text="emptyText"
        v-loading="houseLoading"
        border
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          type="index"
          width="100"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="province"
          :formatter="tableFormatter"
          label="省">
        </el-table-column>
        <el-table-column
          prop="city"
          :formatter="tableFormatter"
          label="市">
        </el-table-column>
        <el-table-column
          prop="county"
          :formatter="tableFormatter"
          label="区">
        </el-table-column>
        <el-table-column
          prop="street"
          :formatter="tableFormatter"
          label="街道">
        </el-table-column>
        <el-table-column
          prop="community"
          :formatter="tableFormatter"
          label="社区">
        </el-table-column>
        <el-table-column
          prop="name"
          :formatter="tableFormatter"
          label="房屋">
          <template slot-scope="scope">
           <span>{{emptyShow(scope.row.house.name)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="year"
          :formatter="tableFormatter"
          label="年份">
          <template slot-scope="scope">
            <span>{{emptyShow(scope.row.house.year)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <!--<el-button type="text" size="small" @click.native="addStreet(true, '查看街道')">查看</el-button>-->
            <el-button type="text" size="small" @click.native="eventStreet(true, '编辑房屋', true, 'second', scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click.native="toDeleteHouse(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="zc-page-box">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageInfo.pageSize"
          :current-page="pageInfo.pageNum"
          :total="houseTable.totalRow"
          @current-change="changePage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Areachoose from '@/components/areaChoose'
  import { getHouseTable, exportHouse, deleteHouse } from '@/api/requestConfig'
  import { formatTime } from '@/filters/index'
  export default {
    name: 'HouseTable',
    created() {
      // 获取街道表格
      this.getStreetTable()
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    components: {
      Areachoose
    },
    watch: {
      'commonTabInfo.text': function(val, oldVal) {
        if (val === 'refresh') {
          this.clearSearch()
        } else if (val === 'update') {
          this.searchTable()
        }
      }
    },
    data() {
      return {
        areaSelectOption: {
          type: 5,
          data: '',
          status: ''
        }, // 地区组件option
        emptyText: '未匹配到房屋数据',
        exportFlag: true, // 导出标记
        houseName: '',
        houseTable: {},
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        },
        houseLoading: true
      }
    },
    methods: {
      // 街道操作
      eventStreet(flag, text, disabled, activeName, custom) {
        this.$store.dispatch('handleTabInfo', {
          flag: flag,
          text: text,
          disabled: disabled,
          activeName: activeName,
          custom: custom
        })
      },
      // 获取子组件地区信息
      getAreaProps(needData) {
        this.areaSelectOption.data = needData
      },
      // 清空搜索条件
      clearSearch() {
        this.houseName = ''
        this.pageInfo.pageNum = 1
        // 清空地区信息
        this.$refs.Areachoose.clearAreaInfo()
        this.getStreetTable()
      },
      // 搜索
      searchTable() {
        this.pageInfo.pageNum = 1
        this.getStreetTable()
      },
      // 分页
      changePage(nowPage) {
        this.pageInfo.pageNum = nowPage
        this.getStreetTable()
      },
      // 获取街道表格
      getStreetTable() {
        this.houseLoading = true
        var needData = {}
        needData.pageNum = this.pageInfo.pageNum
        needData.pageSize = this.pageInfo.pageSize
        var getArea = this.areaSelectOption.data
        needData.provinceCode = getArea.provinceCode
        needData.cityCode = getArea.cityCode
        needData.countyCode = getArea.countyCode
        needData.streetCode = getArea.streetCode
        needData.communityCode = getArea.communityCode
        if (this.houseName) {
          needData.houseName = this.houseName
        }
        getHouseTable(needData).then(res => {
          if (res.status === 200) {
            this.houseTable = res.data
          } else {
            this.$message.error(res.message)
          }
          this.houseLoading = false
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
      // 为空显示
      emptyShow(val) {
        if (val) {
          return val
        } else {
          return '/'
        }
      },
      // 下载
      downLoadTable() {
        if (!this.exportFlag) {
          this.$message.warning('正在导出表格，请稍等。。。')
          return
        }
        var needData = {}
        needData.fileName = '房屋信息'
        needData.titles = ['房屋名', '房屋编号', '建造年份', '房屋面积', '地址', '坐标-经度', '坐标-维度', '结构类型', '土地性质', '产权性质', '基础情况类型', '竣工日期', '总建筑面积', '总层数', '地上层数', '地下层数',
          '单元数量', '建设单位', '设计单位', '施工单位', '监理单位', '总套数', '直管公房套数', '单位自管公房套数', '私房数量', '商品房数量', '房改房数量', '拆迁安置房数量', '其它数量', '房屋场地类型', '化学侵蚀类型',
          '结构拆改类型', '加层改造类型', '修缮类型', '历史灾害类型', '使用功能变更类型', '其他调查内容', '鉴定情况类型', '解危处置情况', '图纸资料类型', '图纸资料存档信息', '调查登记机构', '主管部门', '描述', '物业单位名称',
          '物业单位负责人', '物业单位负责人电话', '物业单位联系人', '物业单位联系人电话', '产权单位名称', '产权单位负责人', '产权单位负责人电话', '产权单位联系人', '产权单位联系人电话', '产权单位联系人电话', '属地管理社区负责人电话',
          '房屋变形监测方案', '结构主要缺陷', '鉴定等级']
        this.exportFlag = false
        var turnSelf = this
        exportHouse(needData).then(res => {
          if (res.type === 'application/octet-stream') {
            var blob = res
            var a = document.createElement('a')
            var url = window.URL.createObjectURL(blob)
            var time = formatTime(new Date().getTime())
            console.log(url)
            a.href = url
            a.download = '房屋信息' + time
            a.click()
            window.URL.revokeObjectURL(url)
          } else {
            this.$message.error('该账号暂未开通此功能')
          }
          setTimeout(function() {
            turnSelf.exportFlag = true
          }, 3000)
        })
      },
      // 删除房屋
      toDeleteHouse(row) {
        this.$confirm('是否删除此房屋?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          var needData = {}
          needData.id = row.house.id
          deleteHouse(needData).then(res => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.searchTable()
            } else {
              this.$message.error(res.message)
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/zc-table-common.scss";
</style>
