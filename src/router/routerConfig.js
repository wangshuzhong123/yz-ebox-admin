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
  // 系统管理-组织管理
  'organization': {
    path: '/platform/organization',
    component: _import('commonRouterView/index')
  },
  // 部门管理
  'divisional': {
    path: 'divisional',
    component: _import('organization/divisional/index')
  },
  // 部门车辆
  'divisionalCar': {
    path: 'divisionalCar',
    component: _import('organization/divisionalCar/index')
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
  // 日志管理
  'logs': {
    path: 'logs',
    component: _import('basicData/logs/index')
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
  // abs
  'abs': {
    path: '/abs',
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
  // 位置服务--轨迹回放
  'replaying': {
    path: 'replaying',
    component: _import('position/replaying/index')
  },
  // 位置服务--电子围栏
  'fence': {
    path: 'fence',
    component: _import('position/fence/index')
  },
  // 位置服务-车辆进出电子围栏记录
  'fencingList': {
    path: 'fencingList',
    component: _import('position/fencingList/index')
  },
  // abs
  // abs设备管理
  'absDevice': {
    path: 'absDevice',
    component: _import('abs/device/index')
  },
  // 空二级路由页
  'emptySec': {
    path: '/emptySec',
    component: _import('commonRouterView/index')
  },
  // 空路由页
  'empty': {
    path: 'empty',
    component: _import('test/index')
  }
}

export default routerList

