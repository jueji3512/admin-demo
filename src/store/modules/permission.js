// 此文件用来存放当前的静态路由加上当前用户的权限路由
import { asyncRoutes, constantRoutes } from "@/router";
const state = {
  routes: constantRoutes
}
const mutations = {
  // newRouters表示用户登录，通过对应权限得到的部分动态路由
  setRoutes(state, newRouters) {
    state.routes = [...constantRoutes, ...newRouters]
  }
}
const actions = {
  // 筛选权限路由，menus为当前用户所拥有的菜单权限，是一个数组
  filterRoutes(context, menus) {
    const routes = []
    menus.forEach(key => {
      routes.push(...asyncRoutes.filter(item => item.name === key))
    })
    // 调用setRoutes，将用于的权限路由设置
    context.commit('setRoutes', routes)
    return routes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}