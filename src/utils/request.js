import axios from 'axios'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
import store from '@/store'

// 设置时间戳的超时时间，单位秒
const TimeOut = 3600

const service = axios.create({
  // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
  // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
  baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础的基础地址
  timeout: 5000 // 定义axios请求的5秒超时
}) // 创建一个axios的实例

// 请求拦截器，在这里处理：每次访问时对token的询问，避免每次在接口中都需要携带token
// 请求拦截器和响应拦截器的模板代码去axios官网cv即可
service.interceptors.request.use(config => {
  // 如果token存在 注入token
  if (store.getters.token) {
    // 只有在存在token的情况下，才有必要去检查时间戳是否超时
    if (IsCheckTimeOut()) {
      // 如果它为true表示token超时了
      store.dispatch('user/logout') // 登出操作
      // 跳转到登录页
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    // 这里看不懂没关系，用的是接口文档要求的格式
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(
  response => {
    const { success, message, data } = response.data
    if (success) {
      return data
    } else {
      Message.error(message)
      return Promise.reject(new Error(message))
    }
  },
  // 注意：这里的错误处理和上面是不一样的，上面的error处理指的是响应拦截器的处理
  // 而下面这里指的是响应拦截器处理成功后，得到的信息success是否为false，对false的处理
  // 但是处理方法是相同的
  error => {
    // error信息里面response的对象
    if (error.response && error.response.data && error.response.data.code === 10002) {
      // 当等于10002的时候 表示 后端告诉我token超时了
      store.dispatch('user/logout') // 登出action 删除token
      router.push('/login')
    } else {
      // 提示错误信息，注意，这里的提示仅是在界面上提示，但是处理需要加下面的语句
      Message.error(error.message)
    }
    // 返回执行错误，让当前的执行链跳出成功，直接进入catch
    // 如果不进行下面的处理，即使错误了，还是会进promise对象的then（即正确后的处理）
    // 而设置了reject后，就会进入catch（即错误后的处理）
    return Promise.reject(error)
  }
) // 响应拦截器

// 检测是否超时的函数
function IsCheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}

export default service // 导出axios实例
