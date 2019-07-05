<!--定位服务-->
<template>
  <div class="mainWrap" v-loading="mapLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 50, 50, 0.7)">
    <div class="treeWrap treeWrap-frist">
      <div class="treeWrap-header">
        <span>组织架构</span>
      </div>
      <div class="treeWrap-body">
        <div class="search-car-div">
          <el-input
            placeholder="输入车牌号进行搜索"
            v-model="Name">
          </el-input>
        </div>
        <div id="truckTree" class="tree-scroll-div">
          <el-tree
            class="filter-tree"
            :data="treeData"
            :props="defaultProps"
            :empty-text="emptyText"
            :default-expanded-keys="defaultList"
            node-key="Id"
            :filter-node-method="filterNode"
            @node-click="nodeClick"
            ref="divisionTree">
          </el-tree>
        </div>
      </div>
    </div>
    <div class="treeWrap">
      <div class="treeWrap-header">
        <span>已分配</span>
      </div>
      <div class="treeWrap-body">
        <div class="search-car-div">
          <el-input
            placeholder="输入车牌号进行搜索"
            v-model="haveName">
          </el-input>
        </div>
        <div id="truckTree" class="tree-scroll-div">
          <el-tree
            class="filter-tree"
            :data="haveTreeData"
            :props="LicenseNumProps"
            :empty-text="emptyText"
            :default-expanded-keys="defaultList"
            node-key="Id"
            show-checkbox
            :filter-node-method="filterDivisionalNode"
            ref="haveDivisionTree">
          </el-tree>
        </div>
      </div>
    </div>
    <div class="tree-event-center">
      <div class="tree-event-btn">
        <el-button type="primary" @click.native="saveRelation">到左边</el-button>
      </div>
      <div class="tree-event-btn">
        <el-button type="primary" @click.native="deleteRelation">到右边</el-button>
      </div>
    </div>
    <div class="treeWrap">
      <div class="treeWrap-header">
        <span>未分配</span>
      </div>
      <div class="treeWrap-body">
        <div class="search-car-div">
          <el-input
            placeholder="输入部门名称进行搜索"
            v-model="notName">
          </el-input>
        </div>
        <div id="truckTree" class="tree-scroll-div">
          <el-tree
            class="filter-tree"
            :data="notTreeData"
            :props="LicenseNumProps"
            :empty-text="emptyText"
            :default-expanded-keys="defaultList"
            node-key="Id"
            show-checkbox
            :filter-node-method="filterDivisionalNode"
            :render-content="renderContent"
            ref="notDivisionTree">
          </el-tree>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  // import { MapabcEncryptToBdmap, formatTime } from '@/filters/index'
  import { GetDivisionalTree, GetDivisionalCarList, UpdateDivisionalCar } from '@/api/requestConfig'
  export default {
    mounted() {
      // 获取组织
      this.getTreeData()
      // 获取所有未分配的
      this.getAllCarListNot()
    },
    data() {
      return {
        mapLoading: true,
        treeData: [], // 部门组织
        defaultList: [], // 部门组织默认展开
        defaultProps: {
          children: 'children',
          label: 'Name'
        },
        Name: '', // 部门组织搜索框
        emptyText: '暂无数据',
        DeptId: '', // 选中组织Id
        haveData: [],
        value: [],
        notSelect: [], // 未分配
        notTreeData: [], // 未分配树形数据
        haveTreeData: [], // 已分配树形数据
        notName: '', // 未分配树形数据搜索框
        haveName: '', // 已分配分配树形数据搜索框
        LicenseNumProps: {
          children: 'Chidern',
          label: 'LicenseNum'
        }
      }
    },
    watch: {
      'Name': function(val, oldVal) {
        this.$refs.divisionTree.filter(val)
      },
      'haveName': function(val, oldVal) {
        this.$refs.haveDivisionTree.filter(val)
      },
      'notName': function(val, oldVal) {
        this.$refs.notDivisionTree.filter(val)
      }
    },
    methods: {
      // 获取下拉列表
      getTreeData() {
        GetDivisionalTree().then(res => {
          if (res.data) {
            this.treeData = res.data // treeData
            this.defaultList = [this.treeData[0].Id]
          }
        })
      },
      // 搜索组织
      filterNode(value, data) {
        if (!value) return true
        return data.Name.indexOf(value) !== -1
      },
      // 搜索车牌
      filterDivisionalNode(value, data) {
        if (!value) return true
        console.log(data)
        return data.LicenseNum.indexOf(value) !== -1
      },
      // 点击部门获取对应数据
      nodeClick(data, node, $el) {
        // 获取部门下的车辆
        this.DeptId = data.Id
        this.getCarListByDivisional(data.Id)
      },
      // 获取当前部门已经分配车辆列表
      getCarListByDivisional(Id) {
        GetDivisionalCarList(Id).then(res => {
          this.haveTreeData = res.data
        })
      },
      // 获取当前部门未分配车辆列表
      getAllCarListNot() {
        GetDivisionalCarList().then(res => {
          this.notTreeData = res.data
          this.mapLoading = false // 隐藏遮罩层
        })
      },
      // 自定义未分配叶子节点内容
      renderContent(h, { node, data, store }) {
        var renderHtml = ''
        if (node.isLeaf) {
          renderHtml = (
            <span>{data.LicenseNum}</span>
          )
        } else {
          renderHtml = (
            <span>{data.Key}</span>
          )
        }
        return renderHtml
      },
      // 绑定关系
      saveRelation() {
        var selectData = this.$refs.notDivisionTree.getCheckedNodes(true, false)
        console.log(selectData)
        if (selectData.length < 1) {
          this.$message.error('请选择未分配车辆再进行操作')
          return
        }
        var needArr = []
        selectData.map(x => {
          var needObj = {}
          needObj.CarId = x.Id
          needObj.LicenseNum = x.LicenseNum
          needObj.VehTerminalNo = x.VehTerminalNo
          needObj.DeptId = this.DeptId
          needArr.push(needObj)
        })
        UpdateDivisionalCar(needArr).then(res => {
          if (res.status === 'success') {
            this.getCarListByDivisional(this.DeptId)
            this.getAllCarListNot()
          }
        })
      },
      // 解除关系
      deleteRelation() {}
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/zc-table-common.scss";
  .mainWrap{
    width: 100%;
    flex-grow: 1;
    padding: 20px;
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: row;
  }
  .tree-event-center{
    box-sizing: border-box;
    padding: 200px 20px;
    .tree-event-btn{
      width: 100px;
      display: flex;
      flex-direction: column;
      margin: 20px 0;
    }
  }
  .treeWrap-frist{
    margin-right: 200px;
  }
  .treeWrap{
    width: 300px;
    border: 1px solid #EBEEF5;
    box-sizing: border-box;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    .treeWrap-header{
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-indent: 15px;
      border-bottom: 1px solid #EBEEF5;
      background-color: #F2F6FC;
      font-size: 16px;
    }
    .treeWrap-body{
      width: 100%;
      box-sizing: border-box;
      padding: 15px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      .search-car-div{
        width: 100%;
        padding: 10px 0;
      }
      .tree-scroll-div{
        flex-grow: 1;
        width: 100%;
        overflow: hidden;
        .filter-tree{
          overflow-y: auto;
        }
      }
    }
  }
  .el-transfer-panel__item{
    display: block;
  }
</style>
