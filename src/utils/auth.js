import Cookies from 'js-cookie'

// 这里的key随便设，保证独一无二就行
const TokenKey = 'vue-admin-token'
// 设置时间戳的key
const timeKey = 'time-restrict'


// 从缓存中读取token
export function getToken() {
  return Cookies.get(TokenKey)
}
// 将token写入缓存
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
// 从缓存中删除token
export function removeToken() {
  return Cookies.remove(TokenKey)
}
// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(timeKey)
}
// 设置时间戳
export function setTimeStamp() {
  Cookies.set(timeKey, Date.now())
}
