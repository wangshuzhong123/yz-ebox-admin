<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  // import { getTiantaiHouseYear } from '@/api/requestConfig'
  import { debounce } from '@/utils'

  export default {
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '300px'
      }
    },
    data() {
      return {
        chart: null,
        chartData: [
          {
            count: 90,
            year: '小于10年'
          },
          {
            count: 60,
            year: '10~20年'
          },
          {
            count: 40,
            year: '20~30年'
          },
          {
            count: 10,
            year: '大于30年'
          }
        ]
      }
    },
    mounted() {
      this.getData()
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      window.removeEventListener('resize', this.__resizeHandler)
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      getData() {
        // getTiantaiHouseYear().then(res => {
        //   if (res.data.status === 200) {
        //     var resData = res.data.data
        //     if (resData && resData.length > 0) {
        //       var one = 0
        //       var two = 0
        //       var three = 0
        //       var four = 0
        //       var nowYear = (new Date()).getFullYear()
        //       for (var i = 0; i < resData.length; i++) {
        //         var getYear = parseInt(resData[i].nianfen)
        //         if (nowYear - getYear <= 10) {
        //           one = one + resData[i].count
        //         } else if (nowYear - getYear > 10 && nowYear - getYear <= 20) {
        //           two = two + resData[i].count
        //         } else if (nowYear - getYear > 20 && nowYear - getYear <= 30) {
        //           three = three + resData[i].count
        //         } else if (nowYear - getYear > 30) {
        //           four = four + resData[i].count
        //         }
        //       }
        //       this.chartData[0].count = one
        //       this.chartData[1].count = two
        //       this.chartData[2].count = three
        //       this.chartData[3].count = four
        //     }
        this.initChart()
        //   }
        // })
      },
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')

        this.chart.setOption({
          title: {
            top: 0,
            text: '房屋竣工日期统计',
            textStyle: {
              color: '#409EFF',
              fontSize: 16,
              align: 'left'
            },
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '10',
            data: [this.chartData[0].year, this.chartData[1].year, this.chartData[2].year, this.chartData[3].year]
          },
          calculable: true,
          series: [
            {
              name: '房屋竣工日期统计',
              type: 'pie',
              roseType: 'radius',
              radius: ['40%', '50%'],
              center: ['50%', '45%'],
              data: [
                { value: this.chartData[0].count, name: this.chartData[0].year },
                { value: this.chartData[1].count, name: this.chartData[1].year },
                { value: this.chartData[2].count, name: this.chartData[2].year },
                { value: this.chartData[3].count, name: this.chartData[3].year }
              ],
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ]
        })
      }
    }
  }
</script>
