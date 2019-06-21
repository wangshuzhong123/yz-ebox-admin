<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  // import { getTiantaiHouseMuqiang } from '@/api/requestConfig'
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
            muqiangmianji: 560,
            jianzhumuqiang: '玻璃'
          },
          {
            muqiangmianji: 80,
            jianzhumuqiang: '石材'
          },
          {
            muqiangmianji: 230,
            jianzhumuqiang: '金属'
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
        // getTiantaiHouseMuqiang().then(res => {
        //   if (res.data.status === 200) {
        //     var resData = res.data.data
        //     if (resData && resData.length > 0) {
        //       var newArr = []
        //       for (var i = 0; i < resData.length; i++) {
        //         var newObj = {}
        //         newObj.muqiangmianji = resData[i].muqiangmianji
        //         if (resData[i].jianzhumuqiang === '玻璃') {
        //           newObj.jianzhumuqiang = '玻璃'
        //           newArr.push(newObj)
        //         } else if (resData[i].jianzhumuqiang === '石材') {
        //           newObj.jianzhumuqiang = '石材'
        //           newArr.push(newObj)
        //         } else if (resData[i].jianzhumuqiang === '金属') {
        //           newObj.jianzhumuqiang = '金属'
        //           newArr.push(newObj)
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
            text: '幕墙面积统计',
            textStyle: {
              color: '#409EFF',
              fontSize: 16,
              align: 'left'
            },
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} (㎡)'
          },
          legend: {
            left: 'center',
            bottom: '10',
            data: [this.chartData[0].jianzhumuqiang, this.chartData[1].jianzhumuqiang, this.chartData[2].jianzhumuqiang]
          },
          calculable: true,
          series: [
            {
              name: '幕墙面积统计',
              type: 'pie',
              roseType: 'radius',
              radius: ['25%', '50%'],
              center: ['50%', '45%'],
              data: [
                { value: this.chartData[0].muqiangmianji, name: this.chartData[0].jianzhumuqiang },
                { value: this.chartData[1].muqiangmianji, name: this.chartData[1].jianzhumuqiang },
                { value: this.chartData[2].muqiangmianji, name: this.chartData[2].jianzhumuqiang }
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
