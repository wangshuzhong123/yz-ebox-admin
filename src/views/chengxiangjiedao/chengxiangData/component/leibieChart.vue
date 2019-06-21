<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  // import { getTiantaiHouseLeibie } from '@/api/requestConfig'
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
            count: 30,
            leibie: '甲类'
          },
          {
            count: 120,
            leibie: '乙类'
          },
          {
            count: 50,
            leibie: '丙类'
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
        // getTiantaiHouseLeibie().then(res => {
        //   if (res.data.status === 200) {
        //     var resData = res.data.data
        //     if (resData && resData.length > 0) {
        //       var newArr = []
        //       for (var i = 0; i < resData.length; i++) {
        //         var newObj = {}
        //         newObj.count = resData[i].count
        //         if (resData[i].leibie === '1') {
        //           newObj.leibie = '甲类'
        //           newArr.unshift(newObj)
        //         } else if (resData[i].leibie === '2') {
        //           newObj.leibie = '乙类'
        //           newArr.unshift(newObj)
        //         } else if (resData[i].leibie === '3') {
        //           newObj.leibie = '丙类'
        //           newArr.unshift(newObj)
        //         }
        //       }
        //       newArr = newArr.reverse()
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
            text: '房屋类别统计',
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
            data: [this.chartData[0].leibie, this.chartData[1].leibie, this.chartData[2].leibie]
          },
          calculable: true,
          series: [
            {
              name: '房屋类别统计',
              type: 'pie',
              roseType: 'radius',
              radius: ['40%', '50%'],
              center: ['50%', '45%'],
              data: [
                { value: this.chartData[0].count, name: this.chartData[0].leibie },
                { value: this.chartData[1].count, name: this.chartData[1].leibie },
                { value: this.chartData[2].count, name: this.chartData[2].leibie }
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
