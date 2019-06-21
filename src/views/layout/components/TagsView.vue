<!--页面顶部tag快捷路由标签-->
<template>
  <div class="tags-view-container">
    <div class="tag-wrap" :class="{'tag-wrap-active': flagList[i]}" v-for="(todo,i) in tagslist" @click="toShowPath(todo,i)">
      {{todo.name}}
      <i @click.stop="toClose(i)">×</i>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'tagsView',
    computed: {
      ...mapGetters([
        'tagslist'
      ])
    },
    data() {
      return {
        flagList: [],
        activeFlag: true,
        defaultNum: 0
      }
    },
    mounted() {
      for (var i = 0; i < this.tagslist.length; i++) {
        if (window.sessionStorage.getItem('thisRouterUrl') === this.tagslist[i].path) {
          this.defaultNum = i
        }
      }
      this.resetTagsList(this.tagslist, this.defaultNum)
    },
    watch: {
      'tagslist': function(to, from, next) {
        this.resetTagsList(to, to.length - 1)
      },
      '$route': function(to) {
        var thisIndex = 0
        for (var i = 0; i < this.tagslist.length; i++) {
          if (to.name === this.tagslist[i].name) {
            thisIndex = i
          }
        }
        this.resetTagsList(this.tagslist, thisIndex)
      }
    },
    methods: {
      toShowPath(obj, index) {
        this.$router.replace({
          name: obj.name
        })
        this.resetTagsList(this.tagslist, index)
      },
      resetTagsList(flagList, index) {
        this.flagList.splice(0)
        for (var i = 0; i < flagList.length; i++) {
          this.flagList.push(false)
        }
        this.flagList[index] = true
      },
      toClose(index) {
        this.tagslist.splice(index, 1)
        this.$router.replace({
          name: this.tagslist[this.tagslist.length - 1].name
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tags-view-container {
    width: 100%;
    padding: 5px;
    font-size: 12px;
    box-shadow: 0px 2px 3px #ddd;
  }
  .tag-wrap{
    display: inline-block;
    padding: 0 30px 0 10px;
    height: 24px;
    line-height: 24px;
    margin: 2px 5px;
    cursor: pointer;
    color: #495060;
    border-radius: 2px;
    position: relative;
    border: 1px solid #d8dce5;
    i{
      font-style: normal;
      position: absolute;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      text-align: center;
      line-height: 16px;
      font-size: 16px;
      right: 6px;
      top: 4px;
    }
    i:hover{
      background: #ccc;
    }
  }
  .tag-wrap-active{
    background: #42b983;
    color: #fff;
    border: 0 none;
  }
</style>
