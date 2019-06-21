<template>
  <div class="event-info">
    <!-- 菜单排序 -->
    <div class="event-content">
        <template v-for="(item, index) in sortData">
            <div class="event-cont">
                <span class="cont-title"><i class="cont-must-tip">*</i>{{item.Title}}：</span>
                <div class="cont-input">
                    <el-input v-model="sortData[index].OrderId" placeholder="请输入菜单排序号"></el-input>
                </div>
            </div>
        </template>
    </div>
    <div class="cont-footer">
        <el-button @click.native="eventTab('', 'first' )">取消</el-button>
        <el-button type="primary" @click.native="saveMenuSortEvent">保存排序</el-button>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { GetMenuSort, UpdateMenuSort } from '@/api/requestConfig'
  export default {
    name: 'MenuSort',
    data() {
      return {
        sortData: [],
        addFlag: true
      }
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    created() {
      // 获取菜单排序数据
      if (this.commonTabInfo.text === '菜单排序') {
        GetMenuSort(this.commonTabInfo.custom.Id).then(res => {
          if (res.data) {
            this.sortData = res.data
          }
        })
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
      // 保存排序
      saveMenuSortEvent() {
        if (!this.addFlag) {
          return
        }
        var needData = []
        var emptyFlag = this.sortData.some(x => {
          if (x.OrderId === '') {
            return true
          }
          var needObj = {}
          needObj.Id = x.Id
          needObj.OrderId = x.OrderId
          needData.push(needObj)
        })
        // 是否存在为空的值
        if (emptyFlag) {
          this.$message.error('排序值不能为空')
          return
        }
        this.addFlag = false
        var turnSelf = this
        UpdateMenuSort(needData).then(res => {
          if (res.status === 'success') {
            this.$message.success(res.message)
            var that = this
            setTimeout(function() {
              that.eventTab('update', 'first', 'menu')
            }, 2000)
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
        })
        setTimeout(function() {
          turnSelf.addFlag = true
        }, 3000)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/info.scss";
</style>
