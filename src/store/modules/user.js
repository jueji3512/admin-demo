import { getToken, setToken, removeToken } from "@/utils/auth"
import { getUserInfo, login, getUserDetailById } from "@/api/user"
import { setTimeStamp } from '@/utils/auth' 
import { resetRouter } from "@/router"

// state状态
const state = {
  // state将token设置为共享的状态
  // 初始化时，先从缓存中读取
  token : getToken(),
  userInfo: {}
}

// mutations修改状态
const mutations = {
  // 设置token
  setToken(state, token){
    // 这里传入的token是修改的数据，此处将其赋给vuex
    state.token = token
    // 同时，将其同步给缓存处理
    setToken(token)
  },
  // 删除缓存
  removeToken(state){
    state.token = null
    // 同时，从缓存中删除token
    removeToken()
  },
  // 设置用户信息
  setUserInfo(state, result) {
    state.userInfo = result
  },
  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}

// actions异步处理
const actions = {
  async login (context, data) {
    // 经过响应拦截器的处理之后 这里获取的result实际上就是token
    const result = await login(data) 
    context.commit('setToken', result)
    // 登录时，即设置时间戳开始
    setTimeStamp()
  },
  // getUserInfo获取用户资料
  async getUserInfo (context) {
    const result = await getUserInfo()
    // 获取头像信息
    const baseInfo = await getUserDetailById(result.userId) 
    // 将两个接口所获取来的信息结果合并
    const baseResult = { ...result, ...baseInfo } 
    context.commit('setUserInfo', baseResult)
    // 这里不同于上面的返回是因为有其他处理
    return baseResult
  },
  // logout实现登出操作
  logout (context) {
    // 删除token和用户信息
    context.commit('removeToken')
    context.commit('removeUserInfo')
    // 重置路由
    resetRouter()
    // 同级模块无法直接调用加了命名空间的另一个模块的actions等，故这里要做以下操作
    // 子模块调用子模块的action可以将commit的第三个参数设置成{ root: true }
    // 就表示当前的context不是子模块了，而是父模块
    context.commit('permission/setRoutes', [], { root: true })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}