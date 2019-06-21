/**
 * Created by wsz on 2018/01/22.
 * 自定义vue过滤器
 */

export function formatTime(date, type) {
  // 判断传入值date是否存在
  if (date === undefined) {
    return
  }
  if (date === null) {
    return
  }
  date = Number(date)// 后台有些数据为string 类型   转换为number

  if (date.toString().length === 10) {
    date = date * 1000
  }// 后台有些数据位数为10位 *1000转换为number
  // 将date时间戳转换为标准时间
  var time = new Date(date)
  // 提取年月日
  var Y = time.getFullYear()
  var M = time.getMonth() + 1
  var D = time.getDate()
  // 提取星期
  var W = time.getDay()
  // 提取时分秒
  var h = time.getHours()
  var m = time.getMinutes()
  var s = time.getSeconds()
  // 不足10的填充0
  M = M >= 10 ? M : '0' + M
  D = D >= 10 ? D : '0' + D
  h = h >= 10 ? h : '0' + h
  m = m >= 10 ? m : '0' + m
  s = s >= 10 ? s : '0' + s
  // 输出时间格式
  if (type === 1) {
    var weekDay = ['一', '二', '三', '四', '五', '六', '天']
    return Y + '-' + M + '-' + D + ' 星期' + weekDay[W] + ' ' + h + ' : ' + m + ' : ' + s // YYYY/MM/DD  W  hh:mm:ss
  } else if (type === 2) {
    return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s // YYYY/MM/DD  hh:mm:ss
  } else if (type === 3) {
    return Y + '-' + M // YYYY/MM
  } else if (type === 4) {
    return Y + '-' + M + '-' + D + ' ' + h + ':' + m // YYYY/MM/DD  hh:mm
  } else if (type === 5) {
    return h + ':' + m // hh:mm
  } else {
    return Y + '-' + M + '-' + D // YYYY/MM/DD
  }
}
/*
   * 转换金额显示格式的函数
   *  s : 需要转换的金额
   *  n : 小数点后几位
 * */
export function turnMoney(s, n) {
  if (!s) {
    s = 0
  }
  var minus = s < 0 ? ('' + s).slice(0, 1) : '' // 如果是负数；先截取负号

  if (minus) {
    s = ('' + s).slice(1)
  }

  n = n > 0 && n <= 20 ? n : 2
  s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + ''
  var l = s.split('.')[0].split('').reverse()
  var r = s.split('.')[1]
  var t = ''

  for (var i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '')
  }
  return minus + t.split('').reverse().join('') + '.' + r
}
/*
   * 结构类型
   *  val
 * */
export function turnStructType(val) {
  var struct = ''
  switch (val) {
    case 1:
      struct = '砖木结构'
      break
    case 2:
      struct = '砖混结构'
      break
    case 3:
      struct = '框架结构'
      break
    case 4:
      struct = '混合结构'
      break
    case 5:
      struct = '泥木结构'
      break
    case 6:
      struct = '砖木砖混'
      break
    case 7:
      struct = '木'
      break
    case 8:
      struct = '钢'
      break
    default:
      struct = ''
  }
  return struct
}
/*
   * 巡检问题状态
   *  val
 * */
export function turnPrblemStatus(val) {
  var status = ''
  switch (val) {
    case 0:
      status = '和上次一样'
      break
    case 1:
      status = '恶化'
      break
    case 2:
      status = '改善'
      break
    case 3:
      status = '无需关注'
      break
    case 4:
      status = '持续关注'
      break
    default:
      status = ''
  }
  return status
}
/*
   * gps转为百度地图坐标
   *  lat纬度
   *  lon经度
 * */
export function MapabcEncryptToBdmap(lon, lat) {
  var point = {}
  var x_pi = 3.14159265358979324 * 3000.0 / 180.0
  var x = Number(lon)
  var y = Number(lat)
  var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi)
  var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi)
  var bd_lon = z * Math.cos(theta) + 0.0065
  var bd_lat = z * Math.sin(theta) + 0.006
  point.lon = bd_lon
  point.lat = bd_lat
  return point
}
/*
*  转化字节
* */
export function bytesToSize(bytes) {
  if (bytes === 0) return '0 B'
  var k = 1024
  var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  var i = Math.floor(Math.log(bytes) / Math.log(k))

  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
}
