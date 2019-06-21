<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  // import { getTiantaiHouseJiegou } from '@/api/requestConfig'
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
            count: 20,
            jiegouleixing: '钢'
          },
          {
            count: 60,
            jiegouleixing: '钢、钢筋混凝土'
          },
          {
            count: 40,
            jiegouleixing: '钢筋混凝土'
          },
          {
            count: 30,
            jiegouleixing: '混合'
          },
          {
            count: 25,
            jiegouleixing: '砖木'
          },
          {
            count: 10,
            jiegouleixing: '木'
          },
          {
            count: 15,
            jiegouleixing: '其他'
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
        // getTiantaiHouseJiegou().then(res => {
        //   if (res.data.status === 200) {
        //     var resData = res.data.data
        //     if (resData && resData.length > 0) {
        //       var newArr = []
        //       for (var i = 0; i < resData.length; i++) {
        //         var newObj = {}
        //         if (resData[i].jiegouleixing === '钢') {
        //           newObj.jiegouleixing = '钢'
        //           newObj.count = resData[i].count
        //           newArr.push(newObj)
        //         } else if (resData[i].jiegouleixing === '钢、钢筋混凝土') {
        //           newObj.jiegouleixing = '钢、钢筋混凝土'
        //           newObj.count = resData[i].count
        //           newArr.push(newObj)
        //         } else if (resData[i].jiegouleixing === '钢筋混凝土') {
        //           newObj.jiegouleixing = '钢筋混凝土'
        //           newObj.count = resData[i].count
        //           newArr.push(newObj)
        //         } else if (resData[i].jiegouleixing === '混合') {
        //           newObj.jiegouleixing = '混合'
        //           newObj.count = resData[i].count
        //           newArr.push(newObj)
        //         } else if (resData[i].jiegouleixing === '砖木') {
        //           newObj.jiegouleixing = '砖木'
        //           newObj.count = resData[i].count
        //           newArr.push(newObj)
        //         } else if (resData[i].jiegouleixing === '木') {
        //           newObj.jiegouleixing = '木'
        //           newObj.count = resData[i].count
        //           newArr.push(newObj)
        //         } else if (resData[i].jiegouleixing === '砖混') {
        //           newObj.jiegouleixing = '其他'
        //           newObj.count = 0
        //           newArr.push(newObj)
        //         }
        //       }
        //       var otherNum = 0
        //       for (var j = 0; j < resData.length; j++) {
        //         if (resData[j].jiegouleixing === '框架' || resData[j].jiegouleixing === '混合,砖木' || resData[j].jiegouleixing === '混合,砖混' || resData[j].jiegouleixing === '砖混' || resData[j].jiegouleixing === '砖混,砖木' || resData[j].jiegouleixing === '钢混,混合,砖木') {
        //           otherNum = otherNum + resData[j].count
        //         }
        //       }
        //       for (var k = 0; k < newArr.length; k++) {
        //         if (newArr[k].jiegouleixing === '其他') {
        //           newArr[k].count = otherNum
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
            text: '房屋结构类型统计',
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
            data: [this.chartData[0].jiegouleixing, this.chartData[1].jiegouleixing, this.chartData[2].jiegouleixing, this.chartData[3].jiegouleixing, this.chartData[4].jiegouleixing, this.chartData[5].jiegouleixing, this.chartData[6].jiegouleixing]
          },
          calculable: true,
          series: [
            {
              name: '房屋结构类型统计',
              type: 'pie',
              roseType: 'radius',
              radius: ['20%', '50%'],
              center: ['50%', '45%'],
              data: [
                { value: this.chartData[0].count, name: this.chartData[0].jiegouleixing },
                { value: this.chartData[1].count, name: this.chartData[1].jiegouleixing },
                { value: this.chartData[2].count, name: this.chartData[2].jiegouleixing },
                { value: this.chartData[3].count, name: this.chartData[3].jiegouleixing },
                { value: this.chartData[4].count, name: this.chartData[4].jiegouleixing },
                { value: this.chartData[5].count, name: this.chartData[5].jiegouleixing },
                { value: this.chartData[6].count, name: this.chartData[6].jiegouleixing }
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
