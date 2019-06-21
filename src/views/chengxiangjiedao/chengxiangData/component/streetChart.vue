<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  // import { getTiantaiHouseStreet } from '@/api/requestConfig'
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
            count: 590,
            jiedao: '赤城街道'
          },
          {
            count: 780,
            jiedao: '始丰街道'
          },
          {
            count: 320,
            jiedao: '福溪街道'
          },
          {
            count: 110,
            jiedao: '其他'
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
        // getTiantaiHouseStreet().then(res => {
        //   if (res.data.status === 200) {
        //     var resData = res.data.data
        //     if (resData && resData.length > 0) {
        //       var newArr = []
        //       for (var i = 0; i < resData.length; i++) {
        //         var newObj = {}
        //         newObj.count = resData[i].count
        //         if (resData[i].jiedao === '001') {
        //           newObj.jiedao = '赤城街道'
        //           newArr.unshift(newObj)
        //         } else if (resData[i].jiedao === '002') {
        //           newObj.jiedao = '始丰街道'
        //           newArr.unshift(newObj)
        //         } else if (resData[i].jiedao === '003') {
        //           newObj.jiedao = '福溪街道'
        //           newArr.unshift(newObj)
        //         } else {
        //           newObj.jiedao = '其他'
        //           newArr.unshift(newObj)
        //         }
        //       }
        //       this.chartData = newArr
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
            text: '房屋街道统计',
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
            data: [this.chartData[0].jiedao, this.chartData[1].jiedao, this.chartData[2].jiedao, this.chartData[3].jiedao]
          },
          calculable: true,
          series: [
            {
              name: '房屋街道统计',
              type: 'pie',
              roseType: 'radius',
              radius: [15, 95],
              center: ['50%', '45%'],
              data: [
                { value: this.chartData[0].count, name: this.chartData[0].jiedao },
                { value: this.chartData[1].count, name: this.chartData[1].jiedao },
                { value: this.chartData[2].count, name: this.chartData[2].jiedao },
                { value: this.chartData[3].count, name: this.chartData[3].jiedao }
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
