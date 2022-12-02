import { getToken, setToken, removeToken } from "@/utils/auth"
import { login } from "@/api/user"

// state状态
const state = {
  // state将token设置为共享的状态
  // 初始化时，先从缓存中读取
  token : getToken(),
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
  }
}

// actions异步处理
const actions = {
  async login (context, data) {
    // 经过响应拦截器的处理之后 这里获取的result实际上就是token
    const result = await login(data) 
    context.commit('setToken', result)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}