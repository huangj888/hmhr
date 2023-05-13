import { getToken, setToken, removeToken } from '@/utils/auth'
import { loginAPI, getProfileAPI, getUserPhotoAPI } from '@/api'
import { resetRouter } from '@/router'
const getDefaultState = () => {
  return {
    token: getToken(), // vuex的state值, 使用本地持久化的(刷新时, 默认去本地取一个)
    name: '',
    avatar: '',
    userInfo: {} // 用户信息对象
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token // vuex里state存一份
    setToken(token) // 再给本地也存一份
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  // 删除token
  REMOVE_TOKEN(state) {
    state.token = ''
    removeToken()
  },
  //* *********操作userInfo这个变量************ */
  SET_USER(state, value) { // value->一会儿请求到的用户信息对象
    state.userInfo = value
  },
  // 删除用户信息
  REMOVE_USER(state) {
    state.userInfo = {}
  }
}

const actions = {
// 封装-登录逻辑
  async loginActions({ commit }, data) {
    const res = await loginAPI(data)
    // 当前在模块内不需要加模块名/
    commit('SET_TOKEN', res.data)

    return res // 把结果返回到调用处
    // 知识点:
    // async函数return的值
    // 只要不是Promise.reject()
    // 都是成功的值->返回给调用处的Promise对象内(那边得用await/then取这个return的值)
  },
  // 获取-用户信息
  async getUserInfoActions({ commit }) {
    const { data: userObj } = await getProfileAPI()// 获取用户基本资料对象
    const { data: photoObj } = await getUserPhotoAPI(userObj.userId)// 获取用户头像等
    commit('SET_USER', { ...userObj, ...photoObj }) // 用户信息对象, 交到mutations里保存到userInfo上
    // 把2个对象都展开, 形成一个全新的对象, 传递给userInfo保存

    return userObj.roles.menus // 返回页面权限点英文字符串数组['employees', ...]
  },
  // 封装-退出登录逻辑 (被动退出token过期 / 主动退出)
  logoutActions({ commit }) {
    commit('REMOVE_TOKEN')
    commit('REMOVE_USER')
    // state值清除, getters也受到影响
    resetRouter() // 让内存里router对象, 重置
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

