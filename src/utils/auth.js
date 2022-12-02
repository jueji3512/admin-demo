import Cookies from 'js-cookie'

// 这里的key随便设，保证独一无二就行
const TokenKey = 'vue-admin-token'

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
