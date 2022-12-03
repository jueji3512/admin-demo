const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device, 
  // 在根级的getters上,开发子模块的属性给别人看、给别人用
  token: state => state.user.token, 
  // 用户名称的映射
  name: state => state.user.userInfo.username,
  // 建立用户id的映射
  userId: state => state.user.userInfo.userId, 
  // 建立用户头像的映射
  staffPhoto: state => state.user.userInfo.staffPhoto 
}
export default getters
