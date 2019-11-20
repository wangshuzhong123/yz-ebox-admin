<!--组织绑定车辆-->
<template>
  <div class="mainWrap" v-loading="mapLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 50, 50, 0.7)">
    <div class="treeWrap treeWrap-frist">
      <div class="treeWrap-header">
        <span>客户组织列表</span>
      </div>
      <div class="treeWrap-body">
        <!-- <div class="search-car-div">
          <el-input
            placeholder="输入部门名称进行搜索"
            @input="filterNode"
            v-model="Name">
          </el-input>
        </div> -->
        <div class="tree-scroll-div">
          <div class="customer-div" :style="{'maxHeight': maxHeight}">
            <el-radio-group v-model="DeptId">
              <template v-for="item in treeData">
                <div class="customer-item">
                  <el-radio :label="item.Id">{{item.Name}}</el-radio>
                </div>
              </template>
            </el-radio-group>
          </div>
        </div>
      </div>
    </div>
    <div class="treeWrap">
      <div class="treeWrap-header">
        <span>已分配</span><span v-if="DeptName">（{{DeptName}}）</span>
      </div>
      <div class="treeWrap-body">
        <div class="search-car-div">
          <el-input
            placeholder="输入车牌号进行搜索"
            v-model="haveName">
          </el-input>
        </div>
        <div class="tree-scroll-div">
          <el-tree
            :style="{'maxHeight': maxHeight}"
            class="filter-tree"
            :data="haveTreeData"
            :props="LicenseNumProps"
            :empty-text="emptyText"
            node-key="Id"
            show-checkbox
            :filter-node-method="filterDivisionalNode"
            @check="haveCheckTreeChange"
            ref="haveDivisionTree">
          </el-tree>
        </div>
      </div>
    </div>
    <div class="tree-event-center">
      <div class="event-position">
        <div class="tree-event-btn">
          <el-button type="primary" @click.native="saveRelation" :disabled="notSelectDisabled"> 《 到左边</el-button>
        </div>
        <div class="tree-event-btn">
          <el-button type="primary" @click.native="deleteRelation" :disabled="haveSelectDisabled">到右边 》 </el-button>
        </div>
      </div>
    </div>
    <div class="treeWrap">
      <div class="treeWrap-header">
        <span>未分配</span><span v-if="DeptName">（{{DeptName}}）</span>
      </div>
      <div class="treeWrap-body">
        <div class="search-car-div">
          <el-input
            placeholder="输入车牌号进行搜索"
            v-model="notName">
          </el-input>
        </div>
        <div id="truckTree" class="tree-scroll-div">
          <el-tree
            :style="{'maxHeight': maxHeight}"
            class="filter-tree"
            :data="notTreeData"
            :props="LicenseNumProps"
            :empty-text="emptyText"
            node-key="Id"
            show-checkbox
            :filter-node-method="filterDivisionalNode"
            @check="checkTreeChange"
            ref="notDivisionTree">
          </el-tree>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  // import { MapabcEncryptToBdmap, formatTime } from '@/filters/index'
  import { GetCustomerCompanyList, GetCustomerHaveCarList, GetCustomerHaveNotCarList, SaveCustomerCarList } from '@/api/requestConfig'
  export default {
    mounted() {
      // 获取高度
      this.maxHeight = document.getElementById('truckTree').offsetHeight + 'px'
      // 获取组织列表
      this.getCustomerTree()
      // 获取所有未分配的
      // this.getAllCarListNot(0)
    },
    data() {
      return {
        maxHeight: '',
        mapLoading: true,
        treeData: [], // 部门组织
        defaultProps: {
          children: 'children',
          label: 'Name'
        },
        Name: '', // 部门组织搜索框
        emptyText: '暂无数据',
        DeptId: '', // 选中组织Id
        DeptName: '', // 选中组织名
        haveData: [],
        value: [],
        notSelect: [], // 未分配
        notTreeData: [], // 未分配树形数据
        haveTreeData: [], // 已分配树形数据
        notName: '', // 未分配树形数据搜索框
        haveName: '', // 已分配分配树形数据搜索框
        haveSelectDisabled: true, // 到右边按钮禁用
        notSelectDisabled: true, // 到左边按钮禁用
        LicenseNumProps: {
          children: 'Children',
          label: 'LicenseNum'
        }
      }
    },
    watch: {
      'DeptId': function(val, oldVal) {
        this.treeData.map(x => {
          // 选中的组织
          if (x.Id === val) {
            this.DeptName = x.Name
            this.haveSelectDisabled = true
            this.notSelectDisabled = true
            this.mapLoading = true // 打开遮罩层
            // 获取组织绑定车辆列表
            this.getCarListByDivisional(this.DeptId)
            // 获取组织未绑定车辆列表
            this.getAllCarListNot(this.DeptId)
          }
        })
      },
      'haveName': function(val, oldVal) {
        this.$refs.haveDivisionTree.filter(val)
      },
      'notName': function(val, oldVal) {
        this.$refs.notDivisionTree.filter(val)
      }
    },
    methods: {
      // 获取组织列表
      getCustomerTree() {
        GetCustomerCompanyList({ PageIndex: 0 }).then(res => {
          if (res.data) {
            this.treeData = res.data.list // treeData
            this.mapLoading = false // 隐藏遮罩层
          }
        })
      },
      // 搜索车牌
      filterDivisionalNode(value, data) {
        if (!value) return true
        return data.LicenseNum.indexOf(value) !== -1
      },
      // 获取当前部门已经分配车辆列表
      getCarListByDivisional(Id) {
        GetCustomerHaveCarList({ Param: { DeptId: Id }, PageIndex: 0, SearchXml: 'platform/custdept/Searchcustdeptcar' }).then(res => {
          this.haveTreeData = res.data.list
        })
      },
      // 获取当前部门未分配车辆列表
      getAllCarListNot(customerId) {
        GetCustomerHaveNotCarList(customerId).then(res => {
          this.notTreeData = res.data
          this.mapLoading = false // 隐藏遮罩层
        })
      },
      // 选中分配
      haveCheckTreeChange(node, allNode) {
        if (this.DeptId) {
          if (allNode.checkedKeys.length > 0) {
            this.haveSelectDisabled = false
          } else {
            this.haveSelectDisabled = true
          }
        }
      },
      // 选中未分配
      checkTreeChange(node, allNode) {
        if (this.DeptId) {
          if (allNode.checkedKeys.length > 0) {
            this.notSelectDisabled = false
          } else {
            this.notSelectDisabled = true
          }
        }
      },
      // 绑定关系
      saveRelation() {
        var selectData = this.$refs.notDivisionTree.getCheckedNodes(true, false)
        var needArr = []
        selectData.map(x => {
          var needObj = {}
          needObj.CarId = x.Id
          needObj.LicenseNum = x.LicenseNum
          needObj.VehTerminalNo = x.VehTerminalNo
          needObj.DeptId = this.DeptId
          needArr.push(needObj)
        })
        this.haveTreeData.map(y => {
          var needObj2 = {}
          needObj2.CarId = y.CarId
          needObj2.LicenseNum = y.LicenseNum
          needObj2.VehTerminalNo = y.VehTerminalNo
          needObj2.DeptId = this.DeptId
          needArr.push(needObj2)
        })
        SaveCustomerCarList({ DeptId: this.DeptId, Child: needArr }).then(res => {
          if (res.status === 'success') {
            this.$message.success('绑定成功')
            this.haveSelectDisabled = true
            this.notSelectDisabled = true
            this.mapLoading = true // 打开遮罩层
            // 获取组织绑定车辆列表
            this.getCarListByDivisional(this.DeptId)
            // 获取组织未绑定车辆列表
            this.getAllCarListNot(this.DeptId)
          }
        })
      },
      // 解除关系
      deleteRelation() {
        var selectData = this.$refs.haveDivisionTree.getCheckedKeys()
        for (var i = 0; i < selectData.length; i++) {
          for (var j = 0; j < this.haveTreeData.length; j++) {
            if (selectData[i] === this.haveTreeData[j].Id) {
              this.haveTreeData.splice(j, 1)
            }
          }
        }
        SaveCustomerCarList({ DeptId: this.DeptId, Child: this.haveTreeData }).then(res => {
          if (res.status === 'success') {
            this.$message.success('解除绑定成功')
            this.haveSelectDisabled = true
            this.notSelectDisabled = true
            this.mapLoading = true // 打开遮罩层
            // 获取组织绑定车辆列表
            this.getCarListByDivisional(this.DeptId)
            // 获取组织未绑定车辆列表
            this.getAllCarListNot(this.DeptId)
          }
        })
      }
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
    justify-content: space-around;
  }
  .treeWrap-frist{
    margin-right: 100px;
  }
  .treeWrap{
    width: 200px;
    flex-grow: 1;
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
        display: flex;
        display: flex;
        flex-direction: column;
        .el-tree, .customer-div{
          overflow-y: auto;
        }
        .customer-item{
          box-sizing: border-box;
          margin: 10px 0;
        }
      }
    }
  }
  .tree-event-center{
    flex-grow: 1;
    box-sizing: border-box;
    padding: 200px 20px;
    position: relative;
    .event-position{
      width: 100px;
      height: 150px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      .tree-event-btn{
        width: 100px;
        display: flex;
        flex-direction: column;
        margin: 20px 0;
      }
    }
  }
  .el-transfer-panel__item{
    display: block;
  }
</style>
