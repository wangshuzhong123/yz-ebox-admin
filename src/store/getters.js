// 声明需要缓存在vuex中的变量，vuex的getters，从vuex缓存的数据中取数据时需要用到的变量
const getters = {
  sidebar: state => state.app.sidebar, // 菜单栏状态(展开与收起)
  token: state => state.user.token,
  tagslist: state => state.save.tagslist, // 页面顶部tab路由
  areaList: state => state.area.areaList, // 地区管理地区列表
  roleListInfo: state => state.save.roleListInfo, // 角色管理列表tab数据
  deviceShopList: state => state.save.deviceShopList, // 设备供应商列表
  deviceTypeList: state => state.save.deviceTypeList, // 设备类型列表
  buildingTypeList: state => state.save.buildingTypeList, // 建筑类型类型列表
  commonTabInfo: state => state.save.commonTabInfo // 页面tab数据
}
export default getters
