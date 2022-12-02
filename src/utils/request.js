// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import { Message } from 'element-ui'

const service = axios.create({
  // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
  // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
  baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础的基础地址
  timeout: 5000 // 定义5秒超时
}) // 创建一个axios的实例

service.interceptors.request.use() // 请求拦截器

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
    // 提示错误信息，注意，这里的提示仅是在界面上提示，但是处理需要加下面的语句
    Message.error(error.message)
    // 返回执行错误，让当前的执行链跳出成功，直接进入catch
    // 如果不进行下面的处理，即使错误了，还是会进promise对象的then（即正确后的处理）
    // 而设置了reject后，就会进入catch（即错误后的处理）
    return Promise.reject(error)
  }
) // 响应拦截器
export default service // 导出axios实例
