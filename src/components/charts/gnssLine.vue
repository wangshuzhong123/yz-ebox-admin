<!--GNSS组件-->
<template>
    <div :id="id" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'

export default {
  props: {
    id: String,
    width: String,
    height: String,
    xdata: Array,
    xsu: Array,
    ysu: Array,
    hsu: Array
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.renderChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    renderChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.initChart()
    },
    initChart() {
      this.chart.setOption({
        backgroundColor: '#394056',
        title: {
          top: 20,
          text: 'GNSS实时数据',
          subtext: '数据来自杭州卓诚建筑科技有限公司',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 20,
            color: '#F1F1F3'
          },
          x: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ['X轴', 'Y轴', 'H轴'],
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            zoomOnMouseWheel: false, // 鼠标滚轮控制缩放
            xAxisIndex: [0],
            handleSize: 15,
            height: 8,
            left: 50,
            right: 50,
            bottom: 20,
            handleColor: '#ddd',
            handleStyle: {
              borderColor: '#cacaca',
              borderWidth: '1',
              shadowBlur: 2,
              background: '#ddd',
              shadowColor: '#ddd'
            },
            fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
              offset: 0,
              color: '#1eb5e5'
            }, {
              offset: 1,
              color: '#5ccbb1'
            }]),
            backgroundColor: '#ddd',
            showDataShadow: false,
            showDetail: false,
            handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
            filterMode: 'filter'
          },
          {
            type: 'inside',
            show: true,
            zoomOnMouseWheel: false, // 鼠标滚轮控制缩放
            xAxisIndex: [0],
            start: 1,
            end: 100
          }
        ],
        grid: {
          top: 100,
          left: '3%',
          right: '3%',
          bottom: 40,
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          name: '时间',
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel: {
            formatter: function(value) {
              var date = new Date(value)
              var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
              var min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
              return hour + ':' + min
            }
          },
          data: this.xdata
        }],
        yAxis: [{
          type: 'value',
          name: 'mm',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: [{
          name: 'X轴',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(137, 189, 27, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(137, 189, 27, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(137,189,27)',
              borderColor: 'rgba(137,189,2,0.27)',
              borderWidth: 12
            }
          },
          data: this.xsu
        }, {
          name: 'Y轴',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0, 136, 212, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(0, 136, 212, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(0,136,212)',
              borderColor: 'rgba(0,136,212,0.2)',
              borderWidth: 12

            }
          },
          data: this.ysu
        }, {
          name: 'H轴',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(219, 50, 51, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(219, 50, 51, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(219,50,51)',
              borderColor: 'rgba(219,50,51,0.2)',
              borderWidth: 12
            }
          },
          data: this.hsu
        }]
      })
    }
  }
}
</script>
