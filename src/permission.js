// 权限拦截 导航守卫 路由守卫  router
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex store实例

import NProgress from 'nprogress' // 引入一份进度条插件

import 'nprogress/nprogress.css' // 引入进度条样式

// 定义白名单：所有不受权限控制的页面
const whiteList = ['/login', '/404']
// 路由的前置守卫
router.beforeEach(async function (to, from, next) {
  NProgress.start() // 开启进度条
  // 首先判断有无token
  if (store.getters.token) {
    // 如果有token，继续判断是不是去登录页
    // 如果是，则直接跳到首页
    if (to.path === '/login') {
      next('/')
    } else {
      if (!store.getters.userId) {

        const { roles } = await store.dispatch('user/getUserInfo')
        // 这里获取到当前用户的角色，从而获取到此角色对应的可访问权限
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true}])
        next(to.path)
      }
      next()
    }
  } else {
    // 如果没有token，则在白名单中找
    // 如果找到了，则继续
    // 否则，跳到登录页
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
  // 手动强制关闭一次：为了解决，手动切换地址时进度条的不关闭的问题
  NProgress.done()
})

// 路由的后置守卫
router.afterEach(function () {
  // 关闭进度条
  NProgress.done()
})
