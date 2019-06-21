// 获取token和设置token
const adminToken = 'Admin-Token'

export function getToken() {
  return window.sessionStorage.getItem(adminToken)
}

export function setToken(token) {
  return window.sessionStorage.setItem(adminToken, token)
}

export function removeToken() {
  return window.sessionStorage.clear()
}
