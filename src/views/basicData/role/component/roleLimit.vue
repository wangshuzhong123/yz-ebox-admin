<template>
  <div class="event-info">
    <div class="role-Tile">{{commonTabInfo.custom.RoleName}}的菜单权限选择</div>
    <div class="event-content">
      <el-tree
        ref="tree"
        :data="menuData"
        :props="defaultProps"
        :empty-text="emptyText"
        node-key="Id"
        :show-checkbox="true"
        :default-expand-all="true"
        accordion
        :check-on-click-node="true"
        :expand-on-click-node="false"
      ></el-tree>
    </div>
    <div class="cont-footer">
      <el-button @click.native="eventTab('', 'first' )">取消</el-button>
      <el-button type="primary" @click.native="getAllNodes">保存</el-button>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getAllMenuList, GetRoleMenu, UpdateRoleMenu, getMenuInfo } from '@/api/requestConfig'
  export default {
    name: 'RoleLimit',
    data() {
      return {
        menuData: [], // 菜单树形数据
        emptyText: '-',
        defaultProps: {
          children: 'children',
          label: 'Title'
        }, // 菜单配置
        ParentId: [],
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
        var needData = {}
        needData.Param = {}
        needData.PageIndex = 1
        needData.PageSize = 1000
        needData.SearchXml = 'platform/admin/SearchRoleMenu'
        needData.Param.RoleId = this.commonTabInfo.custom.Id
        GetRoleMenu(needData).then(res => {
          if (res.data && res.data.length > 0) {
            var needArr = []
            // 节点递归
            var getNodeChecked = function getNodeChecked(source, index) {
              if (source && source.length) {
                for (var item of source) {
                  // 只要叶子节点
                  if (item.Id === index && !item.children) {
                    needArr.unshift(index)
                  } else if (item.Id === index && item.children) {
                    break
                  } else if (item.children && item.children.length) {
                    getNodeChecked(item.children, index)
                  }
                }
              }
            }
            for (var i = 0; i < res.data.length; i++) {
              getNodeChecked(this.menuData, res.data[i].MenuId)
            }
            // 渲染叶子节点
            this.$refs.tree.setCheckedKeys(needArr, true)
          }
        })
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
      // 获取所有选中的节点并保存
      getAllNodes() {
        var checkedList = this.$refs.tree.getCheckedNodes(false, true) // 选中的子节点
        if (checkedList.length > 0) {
          var needData = []
          checkedList.map(x => {
            var needObj = {}
            needObj.RoleId = this.commonTabInfo.custom.Id
            needObj.MenuId = x.Id
            needData.push(needObj)
          })
          UpdateRoleMenu(needData).then(res => {
            if (res.status === 'success') {
              var that = this
              this.$message.success(res.message)
              setTimeout(function() {
                that.eventTab('update', 'first', 'role')
              }, 2000)
              // 更新菜单
              getMenuInfo().then(menuRes => {
                if (res.status === 'success') {
                  window.sessionStorage.setItem('roleMenu', JSON.stringify(menuRes.data)) // 存储菜单数据
                } else {
                  this.$message.error(res.message)
                }
              }).catch(error => {
                console.log(error)
              })
            } else {
              this.$message.error(res.message)
            }
          }).catch(error => {
            console.log(error)
          })
        } else {
          this.$message.error('请勾选角色的菜单权限')
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/info.scss";
  .role-Tile{
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    font-weight: 600;
  }
</style>
