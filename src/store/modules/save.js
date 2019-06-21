import { getDeviceShopList, getDeviceTypeList, getBuildingType } from '@/api/requestConfig'

const save = {
  state: {
    tagslist: [
      {
        path: '/',
        redirect: '/mainIndex',
        name: '系统首页'
      }
    ],
    commonTabInfo: {
      text: '',
      tabsName: 'first',
      custom: ''
    }, // 页面tab传递数据
    deviceShopList: [],
    deviceTypeList: [],
    buildingTypeList: []
  },
  mutations: {
    SET_TAGSLIST: (state, routerInfo) => {
      var flag = true
      if (state.tagslist && state.tagslist.length === 0) {
        state.tagslist.push(routerInfo)
      } else {
        for (var i = 0; i < state.tagslist.length; i++) {
          if (!routerInfo.name || state.tagslist[i].name === routerInfo.name) {
            flag = false
            break
          }
        }
        if (flag) {
          state.tagslist.push(routerInfo)
          if (state.tagslist.length > 10) {
            state.tagslist.splice(1, 1)
          }
        }
      }
    },
    SET_ROLELISTINFO: (state, roleListInfo) => {
      state.roleListInfo = roleListInfo
    },
    SET_DEVICESHOPLIST: (state, data) => {
      state.deviceShopList = data
    },
    SET_DEVICETYPELIST: (state, data) => {
      state.deviceTypeList = data
    },
    SET_BUILDINGTYPELIST: (state, data) => {
      state.buildingTypeList = data
    },
    SET_COMMONTABINFO: (state, commonTabInfo) => {
      state.commonTabInfo = commonTabInfo
    }
  },

  actions: {
    // 登录获取侧边栏
    SetTagsList({ commit }, routerInfo) {
      commit('SET_TAGSLIST', routerInfo)
    },
    // 角色tab操作
    toRoleListInfo({ commit }, eventInfo) {
      commit('SET_ROLELISTINFO', eventInfo)
    },
    // 设备tab操作
    handleTabInfo({ commit }, eventInfo) {
      commit('SET_COMMONTABINFO', eventInfo)
    },
    // 获取设备供应商列表
    GetDeviceShopList({ commit }) {
      return new Promise((resolve, reject) => {
        getDeviceShopList().then(res => {
          if (res.status === 200) {
            commit('SET_DEVICESHOPLIST', res.data)
            resolve()
          } else {
            reject(res.message)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取设备类型列表
    GetDeviceTypeList({ commit }) {
      return new Promise((resolve, reject) => {
        getDeviceTypeList().then(res => {
          if (res.status === 200) {
            commit('SET_DEVICETYPELIST', res.data)
            resolve()
          } else {
            reject(res.message)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取建筑类型列表
    GetBuildingTypeList({ commit }) {
      return new Promise((resolve, reject) => {
        getBuildingType().then(res => {
          if (res.status === 200) {
            commit('SET_BUILDINGTYPELIST', res.data)
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

export default save
