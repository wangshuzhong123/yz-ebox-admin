<template>
  <div class="dashboard-container">
    <el-card class="box-card">
      <div slot="header" class="dashboard-header">
        <span class="big-text">天气信息</span>
      </div>
      <div class="dashboard-text text item">
        <iframe allowtransparency="true" frameborder="0" width="900" height="98" scrolling="no" src="//tianqi.eastday.com/plugin/widget_v1.html?sc=2&z=3&t=1&v=0&d=5&bd=0&k=&f=&q=1&a=0&c=60175&w=1000&h=98&align=center"></iframe>
        <iframe allowtransparency="true" frameborder="0" width="385" height="96" scrolling="no" src="//tianqi.eastday.com/plugin/widget_v1.html?sc=2&z=3&t=0&v=0&d=3&bd=0&k=&f=&q=1&a=1&c=54511&w=385&h=96&align=center"></iframe>
      </div>
    </el-card>
    <div class="street-chart-wrap">
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <leibie-chart/>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <street-chart/>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <jiegou-chart/>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="street-chart-wrap">
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <muqiang-table/>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <muqiangArea-chart/>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <year-chart/>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import streetChart from './component/streetChart'
  import leibieChart from './component/leibieChart'
  import jiegouChart from './component/jiegouChart'
  import muqiangTable from './component/muqiangTable'
  import muqiangAreaChart from './component/muqiangAreaChart'
  import yearChart from './component/yearChart'
  export default {
    components: {
      'street-chart': streetChart,
      'leibie-chart': leibieChart,
      'jiegou-chart': jiegouChart,
      'muqiang-table': muqiangTable,
      'muqiangArea-chart': muqiangAreaChart,
      'year-chart': yearChart
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 16px;
    line-height: 60px;
  }
}
.dashboard-header{
  font-size: 16px;
}
.big-text{
  font-weight: 600;
}
.box-card {
  width: 100%;
  background: #F4F8FB;
  box-shadow: 5px 5px 1px #ccc;
}
.cont-font{
  padding-left: 10px;
}
.street-chart-wrap{
  width: 100%;
  margin: 20px 0;
}
.chart-wrapper {
  background: #F4F8FB;
  padding: 15px 15px 0;
  box-shadow: 10px 10px 5px #ccc;
  border-radius: 5px;
}
</style>
