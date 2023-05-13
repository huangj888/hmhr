import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'

const service = axios.create({
  // process.env 是nodejs内置的固定环境变量对象
  // npm run dev -> 启动开发服务, 项目根目录 .env.development 环境变量配置文件里值
  // 添加到process.env对象上
  // npm run build:prod -> 启动打包, 项目根目录 .env.production 环境变量配置文件里值
  // 添加到process.env对象上

  // 问题: 为何不直接写在这里?
  // 答案: 开发的时候, 用的是基地址1
  // 上线的时候, 用的是基地址2
  baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础的基础地址
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    const token = store.getters.token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
      // 后台解析的方法要求必须前面拼接一个Bearer 和空格的字符串
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    // 因为后台成功/失败都是200, 如何区分成功和失败呢? 用success字段
    // response参数, axios响应对象(里面config/header/status/data字段)
    // data字段里对应的才是后台返回的全部的数据 (也是一个对象)
    // 第一个data: 是axios自带的
    // 第二个data: 是后台返回数据对象的
    const { success, message } = response.data
    if (success) {
      // 返回给逻辑页面的直接是后台的完整数据对象, 不再是axios封装response对象(防止逻辑页面.2次data)
      return response.data
    } else {
      Message.error(message) // http状态码2xx, 但是逻辑错误
      return Promise.reject(message) // 返回Promise错误的对象, 等同reject() -> 自己根据success字段判断逻辑错误(账号密码错误)
    }
  },
  error => {
    // 4xx/5xx的响应状态, 如果后台返回了响应数据, 我们就用一下, 如果没有, 就error对象本身message值
    // && 为了防止null.data报错
    Message.error((error.response && error.response.data && error.response.data.message) || error.message)
    // 上面是报错就提示, 下面是具体的分析
    // 可以用过http状态码来判断 error.response.status === 401
    // 或者还可以用code逻辑码来判断 (10002 和后台商定的值, 代表token过期)
    // 知识点: ?. (可选链操作符) 新版的语法, 需要babel支持才能用
    // 左侧有值才会继续往下去点属性 (防止空值去.任意的属性报错)
    if (error?.response?.data?.code === 10002) {
      // 前端token过期, 要在前端做些什么(经验):
      // (1): 清除token(vuex和本地都得清除)
      // (2): 清除用户信息(vuex里存)
      store.dispatch('user/logoutActions')
      // (3): 返回login页面(也要被被动退出时, 所在页面的路由地址字符串传递给登录页面)
      router.replace(`/login?redirect=${router.currentRoute.fullPath}`)
    }
    return Promise.reject(error)
  }
)

export default service
