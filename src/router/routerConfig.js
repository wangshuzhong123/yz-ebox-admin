// 侧边栏菜单项，路由配置文件，对应新增菜单的meueId
const _import = require('./_import_production')
import Layout from '../views/layout/Layout'

const routerList = {
  'layout': {
    path: '/layout',
    component: Layout
  },
  // 系统管理
  'platform': {
    path: '/platform',
    component: Layout
  },
  // 系统管理--基本数据管理
  'system': {
    path: '/platform/system',
    component: _import('commonRouterView/index')
  },
  // 系统管理--供应商管理
  'supplier': {
    path: '/platform/supplier',
    component: _import('commonRouterView/index')
  },
  // 系统管理--任务管理
  'task': {
    path: '/platform/task',
    component: _import('commonRouterView/index')
  },
  // 菜单管理
  'menus': {
    path: 'menus',
    component: _import('basicData/menus/menu')
  },
  // 角色管理
  'role': {
    path: 'role',
    component: _import('basicData/role/index')
  },
  // 用户管理
  'user': {
    path: 'user',
    component: _import('basicData/user/index')
  },
  // 供应商列表
  'supplierList': {
    path: 'supplierList',
    component: _import('supplierManagement/supplierList/index')
  },
  // 车辆管理
  'car': {
    path: '/car',
    component: Layout
  },
  // 车辆列表
  'carList': {
    path: 'carList',
    component: _import('car/carList/index')
  },
  // 作业管理
  'taskManagement': {
    path: 'taskManagement',
    component: _import('task/taskManagement/index')
  },
  // 位置服务
  'position': {
    path: '/position',
    component: Layout
  },
  // 位置服务--定位服务
  'locationService': {
    path: 'locationService',
    component: _import('position/locationService/index')
  },
  2: {
    path: '/system/basicData',
    component: _import('commonRouterView/index')
  },
  3: {
    path: '/system/scm',
    component: _import('commonRouterView/index')
  },
  17: {
    path: '/system/limint',
    component: _import('commonRouterView/index')
  },
  23: {
    path: '/system/fileDownload',
    component: _import('commonRouterView/index')
  },
  14: {
    path: 'menu',
    component: _import('basicData/menu/index')
  },
  16: {
    path: 'organization',
    component: _import('test/index')
  },
  13: {
    path: 'resource',
    component: _import('basicData/resource/index')
  },
  10: {
    path: 'permission',
    component: _import('basicData/permission/index')
  },
  22: {
    path: 'projectCompact',
    component: _import('project/projectContract/index')
  },
  12: {
    path: 'role',
    component: _import('basicData/role/index')
  },
  21: {
    path: 'fillProject',
    component: _import('project/fillProject/index')
  },
  11: {
    path: 'userList',
    component: _import('user/userList/index')
  },
  20: {
    path: 'projectAppoint',
    component: _import('project/projectAppoint/index')
  },
  19: {
    path: 'houseManage',
    component: _import('basicData/house/index')
  },
  18: {
    path: 'streetManage',
    component: _import('basicData/street/index')
  },
  15: {
    path: 'areaManage',
    component: _import('basicData/area/index')
  },
  4: {
    path: 'houseInfo',
    component: _import('test/index')
  },
  5: {
    path: 'houseOnlineTable',
    component: _import('test/index')
  },
  6: {
    path: 'system',
    component: _import('test/index')
  },
  7: {
    path: 'performance',
    component: _import('test/index')
  },
  8: {
    path: 'mobileFile',
    component: _import('test/index')
  },
  9: {
    path: 'QA',
    component: _import('test/index')
  },
  35: {
    path: 'community',
    component: _import('basicData/community/index')
  },
  36: {
    path: '/system/install',
    component: _import('commonRouterView/index')
  },
  38: {
    path: 'installList',
    component: _import('device/installBasic/index')
  },
  39: {
    path: 'installShop',
    component: _import('device/installShop/index')
  },
  40: {
    path: 'installType',
    component: _import('device/installType/index')
  },
  41: {
    path: 'buildingType',
    component: _import('basicData/buildingType/index')
  },
  42: {
    path: '/system/monitor',
    component: _import('commonRouterView/index')
  },
  43: {
    path: 'monitorList',
    component: _import('monitorTarget/monitorTargetList/index')
  },
  44: {
    path: 'perMonitor',
    component: _import('test/index')
  },
  45: {
    path: 'installMonitor',
    component: _import('monitorTarget/installMonitor/index')
  },
  46: {
    path: '/dataMonitor',
    component: Layout
  },
  47: {
    path: '/dataMonitor/deviceData',
    component: _import('commonRouterView/index')
  },
  48: {
    path: 'GNSS',
    component: _import('deviceDataView/equipData/GNSS/index')
  },
  49: {
    path: 'test2',
    component: _import('test/index')
  },
  50: {
    path: 'displacement',
    component: _import('test/index')
  },
  51: {
    path: '/abcdef',
    component: _import('test/index')
  },
  52: {
    path: 'staticLevel',
    component: _import('deviceDataView/equipData/staticLevel/index')
  },
  54: {
    path: 'inclinometer',
    component: _import('deviceDataView/equipData/inclinometer/index')
  },
  56: {
    path: 'dtu',
    component: _import('device/dtuManage/index')
  },
  57: {
    path: 'deviceOriginalData',
    component: _import('deviceDataView/deviceOriginalData/index')
  },
  58: {
    path: 'elasticWire',
    component: _import('deviceDataView/equipData/elasticWire/index')
  },
  // 监测对象地图
  61: {
    path: 'monitorMap',
    component: _import('monitorTarget/monitorMap/index')
  },
  // 房屋地图
  62: {
    path: 'houseMap',
    component: _import('monitorTarget/houseMap/index')
  },
  // 任务管理
  63: {
    path: '/taskManagement',
    component: Layout
  },
  // 巡检任务
  64: {
    path: 'checkTask',
    component: _import('taskManagement/checkTask/index')
  },
  // 巡检报告管理
  65: {
    path: 'checkReport',
    component: _import('taskManagement/checkReport/index')
  },
  // 巡检报告转移申请
  66: {
    path: 'checkTaskApply',
    component: _import('taskManagement/checkTaskApply/index')
  },
  // 巡检报告转移审核
  67: {
    path: 'checkTaskChecked',
    component: _import('taskManagement/checkTaskChecked/index')
  },
  // 项目合同房屋
  68: {
    path: 'contractHouse',
    component: _import('project/contractHouse/index')
  },
  // 定位统计页面
  69: {
    path: 'locationStatistics',
    component: _import('monitorTarget/locationStatistics/index')
  },
  // 月报管理
  70: {
    path: '/monthlyMagazine',
    component: Layout
  },
  // 巡检月报
  71: {
    path: 'contractMonthlyMagazine',
    component: _import('monthlyMagazine/contractMonthlyMagazine/index')
  },
  // 临安房屋
  72: {
    path: '/linanHouse',
    component: Layout
  },
  // 临安房屋列表
  73: {
    path: 'linanHouseList',
    component: _import('linanHouse/house/index')
  },
  // 天台房屋
  74: {
    path: '/tiantaiHouse',
    component: Layout
  },
  // 天台房屋列表
  75: {
    path: 'tiantaiHouseList',
    component: _import('tiantaiHouse/house/index')
  },
  // 天台房屋地图
  76: {
    path: 'tiantaiHouseMap',
    component: _import('tiantaiHouse/tiantaiHouseMap/index')
  },
  // 城厢项目
  77: {
    path: '/chengxiangProject',
    component: Layout
  },
  78: {
    path: 'projectIndex',
    component: _import('chengxiangjiedao/chengxiangData/index')
  },
  79: {
    path: 'chengxiangCheck',
    component: _import('chengxiangjiedao/chengxiangDeviceMap/index')
  },
  'empty': {
    path: 'empty',
    component: _import('test/index')
  }
}

export default routerList

