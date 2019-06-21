// 缓存地区数据，请求过的数据就不再二次请求了
import { getAreaList } from '@/api/requestConfig'

const area = {
  state: {
    areaList: []
  },
  mutations: {
    GET_PROVINCE: (state, areaList) => {
      if (areaList.length > 0 && state.areaList.length === 0) {
        for (var i = 0; i < areaList.length; i++) {
          var obj = {}
          obj.id = areaList[i].id
          obj.code = areaList[i].code
          obj.parentCode = areaList[i].parentCode
          obj.name = areaList[i].name
          obj.type = areaList[i].type
          obj.delFlag = areaList[i].delFlag
          obj.parentIndex = 'all'
          if (areaList[i].type === 'PROVINCE') {
            obj.children = [{
              id: 1,
              code: 0,
              parentCode: 0,
              name: '21132',
              type: 'CITY',
              delFlag: 0
            }]
          }
          state.areaList.push(obj)
        }
      }
    },
    GET_CITY: (state, cityInfo) => {
      if (cityInfo.cityList.length > 0) {
        var cityArr = []
        for (var i = 0; i < cityInfo.cityList.length; i++) {
          var obj = {}
          obj.id = cityInfo.cityList[i].id
          obj.code = cityInfo.cityList[i].code
          obj.parentCode = cityInfo.cityList[i].parentCode
          obj.name = cityInfo.cityList[i].name
          obj.type = cityInfo.cityList[i].type
          obj.delFlag = cityInfo.cityList[i].delFlag
          obj.parentIndex = cityInfo.index // 记录父级的index
          if (cityInfo.cityList[i].type === 'CITY') {
            obj.children = [{
              id: 1,
              code: 0,
              parentCode: 0,
              name: '21132',
              type: 'COUNTY',
              delFlag: 0
            }]
          }
          cityArr.push(obj)
        }
        state.areaList[cityInfo.index].children = cityArr
      }
    },
    GET_COUNTY: (state, countyInfo) => {
      var eventList = countyInfo.countyList
      if (eventList.length > 0) {
        var countyArr = []
        for (var i = 0; i < eventList.length; i++) {
          var obj = {}
          obj.id = eventList[i].id
          obj.code = eventList[i].code
          obj.parentCode = eventList[i].parentCode
          obj.name = eventList[i].name
          obj.type = eventList[i].type
          obj.delFlag = eventList[i].delFlag
          obj.parentIndex = countyInfo.index // 记录父级的index
          countyArr.push(obj)
        }
        state.areaList[countyInfo.firstIndex].children[countyInfo.index].children = countyArr
      }
    }
  },

  actions: {
    // 获取地区省列表
    GetProvinceList({ commit }, provinceInfo) {
      return new Promise((resolve, reject) => {
        getAreaList(provinceInfo.code).then(res => {
          if (res.status === 200) {
            commit('GET_PROVINCE', res.data)
            resolve()
          } else {
            reject(res.message)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取市列表
    GetCityList({ commit }, cityInfo) {
      return new Promise((resolve, reject) => {
        getAreaList(cityInfo.code).then(res => {
          if (res.status === 200) {
            var toCityInfo = {
              cityList: res.data,
              index: cityInfo.index
            }
            commit('GET_CITY', toCityInfo)
            resolve()
          } else {
            reject(res.message)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取区县列表
    GetCountyList({ commit }, countyInfo) {
      return new Promise((resolve, reject) => {
        getAreaList(countyInfo.code).then(res => {
          if (res.status === 200) {
            var toCountyInfo = {
              countyList: res.data,
              firstIndex: countyInfo.firstIndex,
              index: countyInfo.index
            }
            commit('GET_COUNTY', toCountyInfo)
            resolve()
          } else {
            reject(res.message)
          }
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default area
