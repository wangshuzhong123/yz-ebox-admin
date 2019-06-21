/**
 * Created by wsz on 17/12/29.
 * 公用方法
 */
export function formatTime(date, type) {
  // 判断传入值date是否存在
  if (date === undefined) {
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
    return Y + '-' + M + '-' + D + ' ' + h + ' : ' + m + ' : ' + s // YYYY/MM/DD  hh:mm:ss
  } else if (type === 3) {
    return Y + '-' + M// YYYY/MM
  } else {
    return Y + '-' + M + '-' + D// YYYY/MM/DD
  }
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

// 递归获取数组
export function getTreeDeepArr(key, treeData) {
  var arr = [] // 在递归时操作的数组
  var returnArr = [] // 存放结果的数组
  var depth = 0 // 定义全局层级
  // 定义递归函数
  function childrenEach(childrenData, depthN) {
    for (var j = 0; j < childrenData.length; j++) {
      depth = depthN // 将执行的层级赋值 到 全局层级
      arr[depthN] = (childrenData[j].Id)
      if (childrenData[j].Id === key) {
        // returnArr = arr; // 原写法不行, 因 此赋值存在指针关系
        returnArr = arr.slice(0, depthN + 1) // 将目前匹配的数组，截断并保存到结果数组，
        break
      } else {
        if (childrenData[j].children) {
          depth = depth + 1
          childrenEach(childrenData[j].children, depth)
        }
      }
    }
    return returnArr
  }
  return childrenEach(treeData, depth)
}
