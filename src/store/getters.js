const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device, // 这2个控制dashboard面板页左侧导航,不要注释
  token: state => state.user.token,
  avatar: state => state.user.userInfo.staffPhoto, // 返回用户头像地址
  name: state => state.user.userInfo.username, // 返回用户名
  companyId: state => state.user.userInfo.companyId, // 返回公司 ID
  userId: state => state.user.userInfo.userId // 用户ID
}
export default getters
