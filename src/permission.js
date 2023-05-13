import router, { asyncRoutes } from './router'
// 导入进度条插件
import NProgress from 'nprogress'
// 导入进度条样式
import 'nprogress/nprogress.css'
import store from './store'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/404'] // 白名单

// 问题: 为何动态路由添加后, 在动态路由地址上刷新会404?
// 前提1: 刷新时, 所有代码重新执行, 回归初始化
// 前提2: 刷新时, 路由会从/ 跳转到浏览器地址栏所在的路由地址 (走一次路由守卫代码)
// 动态的还未添加, 所以404了

// 问题: 右上角退出登录+重新登录, 进入到首页时, 网页刷新不? (不刷新)
// 网页本身是不刷新的, 完全依赖路由业务场景的切换 (单页面应用好处: 用户的体验更好, 切换业务场景更快)
// 内存里路由表, 之前添加的筛选后路由规则对象还在不? (在)
// 问题2: 为何重新登录, 路由定义重复了?
// 退出登录的时候, 把token和用户信息清除了
// 登录的时候, 先获取到token保存到vuex和本地, 然后才是跳转路由, 才执行路由守卫(所以判断token有值)
// 但是用户信息没有, 重新请求, 再添加一遍筛选后的路由对象, 所以导致了路由重复

// 解决: 退出登录的时候, 让路由也回归初始化

// 问题: 什么是路由(导航)守卫?
// 答案: 当路由发生跳转的时候, 会触发一个钩子"函数", 在函数中可以通过跳转或取消或强制切换跳转地址来守卫导航
// 路由守卫里必须要有一个next()调用, 出口, 让路由页面跳转
router.beforeEach(async(to, from, next) => {
  // to：即将要进入的目标
  // from：当前导航正要离开的路由
  // next：next 是一个函数，通常是指放行，next() 直接放行 ，next(路径) 跳转到某一个页面

  // 获取到 token
  const token = store.getters.token
  // 登录了->不能去登录页
  // 非登录->只能去登录页
  if (token) {
    if (to.path === '/login') {
      // 如果存在 token，访问的是登录页面，直接跳转到主页
      next('/')
      NProgress.done()
    } else {
      // 如果存在 token，访问的是其他页面，直接放行
      next()
      if (!store.getters.name) {
      // 如果存在 token，访问的是其他页面，直接放行
        const menus = await store.dispatch('user/getUserInfoActions')
        // 根据用户实际的权限 menus 从asyncRouteArr里, 过滤出用户能访问的页面的路由对象
        const filterList = asyncRoutes.filter(routeObj => {
          const routeName = routeObj.children[0].name.toLowerCase()
          return menus.includes(routeName)
        })
        filterList.push(
          { path: '*', redirect: '/404', hidden: true }
        )
        router.addRoutes(filterList)
        // 始终都动态添加先8个路由规则对象
        // 知识点: 路由切换匹配的路由规则对象数组存在于内存中的
        // new Router时, 有一些初始的路由规则对象
        // addRoutes, 会给路由表, 再额外的增加一个规则对象
        // 现象: 路由规则对象添加成功, 但是左侧的导航不见了
        router.addRoutes(filterList)
        // 将动态路由传递给 mutation 方法，进行合并
        store.commit('permission/setRoutes', filterList)
        // 路由再跳转一次, 因为上面next() 会导致白屏(因为放行时, 动态路由还没有加入到内存中路由表里)
        // 添加完, 立刻再跳转一次
        next({
          path: to.path,
          replace: true // 不让回退 类似于this.$router.replace() 防止进入刚才的白屏
        })
      }
    }
  } else {
    // 如果不存在 token，访问的是白名单内容，直接放行
    if (whiteList.includes(to.path)) {
      next()
    } else {
      // 没有 token，且不是白名单页面，跳转到登录页面
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach((to, from) => {
  document.title = getPageTitle(to.meta.title)
  NProgress.done()
})

