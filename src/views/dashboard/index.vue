<!--网站首页-->
<template>
  <div class="mainWrap">
    <iframe id="sugar" src="https://sugar.baidubce.com/dashboard/ad05b8cc03383d7cf291feb8300c4c68"></iframe>
  </div>
</template>
<script>
export default {
  name: 'mainIndex'
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .mainWrap{
    width: 100%;
    flex-grow: 1;
    padding: 15px;
    box-sizing: border-box;
  }
  #sugar{
    width: 100%;
    height: 100%;
    border: 0;
  }
</style>
