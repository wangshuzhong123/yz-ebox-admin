// 用户与权限
import { loginApi, logout, getMenuInfo } from '@/api/requestConfig'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken()
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginApi(userInfo.userName, userInfo.password).then(res => {
          if (res.status === 200) {
            const token = res.token
            setToken(token)
            commit('SET_TOKEN', token)
            resolve(res.data)
          } else {
            reject(res.message)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取权限菜单
    GetMenu({ commit }) {
      return new Promise((resolve, reject) => {
        getMenuInfo().then(res => {
          if (res.status === 200) {
            resolve(res.data)
          } else {
            reject(res.message)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(res => {
          if (res.status === 200) {
            commit('SET_TOKEN', '')
            removeToken()
            resolve(res)
          } else if (res.message === '用户已注销或未登录') {
            commit('SET_TOKEN', '')
            removeToken()
            resolve(res)
          } else {
            reject(res.message)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        window.sessionStorage.clear()
        resolve()
      })
    }
  }
}

export default user
