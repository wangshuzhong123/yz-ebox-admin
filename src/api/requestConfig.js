import zcConfig from './urlConfig' // 引入开发和线上环境域名配置对象
import request from '@/utils/request' // 引入权限和axios拦截器

const localApi = zcConfig.localIp + zcConfig.localPort + zcConfig.localPath // 本地Api
const onlineApi = zcConfig.onlineIp + zcConfig.onlinePort + zcConfig.onlinePath // 线上Api
const zcApi = zcConfig.isOnline ? onlineApi : localApi
// 请求body用inputView包裹
const inputView = function(data) {
  return { inputView: data }
}
// 登录接口
export async function loginApi(dataInfo) {
  return request({
    url: zcApi + '/home/login',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 退出登录
export async function loginOut() {
  return request({
    url: zcApi + '/home/logout',
    method: 'post'
  })
}
// 获取所有菜单
export async function getAllMenuList() {
  return request({
    url: zcApi + '/platform/menu/getlist',
    method: 'post'
  })
}
// 获取当前权限侧边栏菜单
export async function getMenuInfo() {
  return request({
    url: zcApi + '/platform/menu/GetMenuList',
    method: 'post'
  })
}
// 获取菜单信息
export async function GetMenuSingle(dataInfo) {
  return request({
    url: zcApi + '/platform/menu/getsingle',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 更新菜单
export async function updateMenu(dataInfo) {
  return request({
    url: zcApi + '/platform/menu/Updae',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 添加菜单
export async function addMenu(dataInfo) {
  return request({
    url: zcApi + '/platform/menu/Add',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 删除菜单
export async function DeleteMenu(dataInfo) {
  return request({
    url: zcApi + '/platform/menu/delete',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 获取菜单排序
export async function GetMenuSort(dataInfo) {
  return request({
    url: zcApi + '/platform/menu/GetMenuSortInfo',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 更新菜单排序
export async function UpdateMenuSort(dataInfo) {
  return request({
    url: zcApi + '/platform/menu/UpdateMenuSort',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 角色列表
export async function GetRoleTable(dataInfo) {
  return request({
    url: zcApi + '/platform/admin/role/getlist',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 新增角色
export async function AddRole(dataInfo) {
  return request({
    url: zcApi + '/platform/admin/role/insert',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 更新角色信息
export async function UpdateRole(dataInfo) {
  return request({
    url: zcApi + '/platform/admin/role/Update',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 删除角色
export async function DeleteRole(dataInfo) {
  return request({
    url: zcApi + '/platform/admin/role/delete',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 获取单条角色信息
export async function GetRoleSingle(dataInfo) {
  return request({
    url: zcApi + '/platform/admin/role/getsingle',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 查询角色对应的菜单
export async function GetRoleMenu(dataInfo) {
  return request({
    url: zcApi + '/platform/admin/roleMenu/getlist',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 编辑角色对应菜单
export async function UpdateRoleMenu(dataInfo) {
  return request({
    url: zcApi + '/platform/admin/roleMenu/InsertOrUpdate',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 用户列表
export async function GetUserPageList(dataInfo) {
  return request({
    url: zcApi + '/platform/admin/admin/getpagerlist',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 新增用户
export async function AddUser(dataInfo) {
  return request({
    url: zcApi + '/platform/admin/admin/insert',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 编辑用户
export async function UpdateUser(dataInfo) {
  return request({
    url: zcApi + '/platform/admin/admin/update',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 获取用户详情
export async function GetUserSingle(dataInfo) {
  return request({
    url: zcApi + '/platform/admin/admin/getsingle',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 获取供应商列表
export async function GetSupplierList(dataInfo) {
  return request({
    url: zcApi + '/ebox/car/channelInfo/getpagerlist',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 新增供应商
export async function AddSupplier(dataInfo) {
  return request({
    url: zcApi + '/ebox/car/channelInfo/insert',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 编辑供应商
export async function UpdateSupplier(dataInfo) {
  return request({
    url: zcApi + '/ebox/car/channelInfo/update',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 获取供应商详情
export async function GetSupplierSingle(dataInfo) {
  return request({
    url: zcApi + '/ebox/car/channelInfo/getsingle',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 获取车辆列表
export async function GetCarList(dataInfo) {
  return request({
    url: zcApi + '/ebox/car/carInfo/getpagerlist',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 更新车辆启用状态
export async function UpdateCarActivity(dataInfo) {
  return request({
    url: zcApi + '/ebox/car/carInfo/UpdateActivity',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 获取任务表格
export async function GetTaskList(dataInfo) {
  return request({
    url: zcApi + '/platform/task/task/getlist',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 获取任务详情
export async function GetTaskSingle(dataInfo) {
  return request({
    url: zcApi + '/platform/task/task/getsingle',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 新增任务
export async function AddTask(dataInfo) {
  return request({
    url: zcApi + '/platform/task/task/save',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 更新任务
export async function UpdateTask(dataInfo) {
  return request({
    url: zcApi + '/platform/task/task/save',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 任务接收人
export async function GetReceiverList(dataInfo) {
  return request({
    url: zcApi + '/platform/task/person/getkeyvaluelist',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 执行任务接口
export async function RunTask(dataInfo) {
  return request({
    url: zcApi + '/platform/task/task/run',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 获取车辆最新位置
export async function GetLocationInfo(dataInfo) {
  return request({
    url: zcApi + '/ebox/car/carInfo/GetLocationInfo',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 获取车辆列表
export async function GetCarInfoTree(dataInfo) {
  return request({
    url: zcApi + '/ebox/car/carInfo/GetCarInfo',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 车辆轨迹回放
export async function GetLocationMap(dataInfo) {
  return request({
    url: zcApi + '/ebox/car/carInfo/GetLocationMap',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 日志列表
export async function GetLogPageList(dataInfo) {
  return request({
    url: zcApi + '/platform/log/getpagerlist',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 日志详情
export async function GetLogInfo(dataInfo) {
  return request({
    url: zcApi + '/platform/log/getsingle',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 删除日志
export async function DeleteLog(dataInfo) {
  return request({
    url: zcApi + '/platform/log/delete',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 组织架构树形列表
export async function GetDivisionalTree(dataInfo) {
  return request({
    url: zcApi + '/ebox/platform/deptInfo/GetTreeList',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 单条详情
export async function GetDivisionalSingle(dataInfo) {
  return request({
    url: zcApi + '/ebox/platform/deptInfo/getsingle',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 组织机构编辑
export async function UpdateDivisional(dataInfo) {
  return request({
    url: zcApi + '/ebox/platform/deptInfo/update',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 组织机构新增
export async function AddDivisional(dataInfo) {
  return request({
    url: zcApi + '/ebox/platform/deptInfo/insert',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 组织架构删除
export async function DeleteDivisional(dataInfo) {
  return request({
    url: zcApi + '/ebox/platform/deptInfo/delete',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 组织架构排序
export async function GetDivisionalSort(dataInfo) {
  return request({
    url: zcApi + '/ebox/platform/deptInfo/GetOrderList',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 组织架构保存排序
export async function UpdateDivisionalSort(dataInfo) {
  return request({
    url: zcApi + '/ebox/platform/deptInfo/updateorder',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 根据部门下的车辆
export async function GetDivisionalCarList(dataInfo) {
  return request({
    url: zcApi + '/ebox/platform/deptMapInfo/getlist',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 部门与车辆绑定
export async function UpdateDivisionalBindCar(dataInfo) {
  return request({
    url: zcApi + '/ebox/platform/deptMapInfo/Bind',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 部门与车辆解除绑定
export async function UpdateDivisionalUntyingCar(dataInfo) {
  return request({
    url: zcApi + '/ebox/platform/deptMapInfo/Untying',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 新增电子围栏
export async function AddElectronic(dataInfo) {
  return request({
    url: zcApi + '/ebox/electronic/fence/insert',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 编辑电子围栏
export async function UpdateElectronic(dataInfo) {
  return request({
    url: zcApi + '/ebox/electronic/fence/update',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 电子围栏分页列表
export async function GetElectronicPageList(dataInfo) {
  return request({
    url: zcApi + '/ebox/electronic/fence/getpagerlist',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 电子围栏详情
export async function GetElectronicSingle(dataInfo) {
  return request({
    url: zcApi + '/ebox/electronic/fence/getsingle',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 组织架构绑定电子围栏的信息
export async function GetUnitElectronicSingle(dataInfo) {
  return request({
    url: zcApi + '/ebox/electronic/carmap/getsingle',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 组织架构绑定电子围栏
export async function updateUnitElectronic(dataInfo) {
  return request({
    url: zcApi + '/ebox/electronic/carmap/update',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 车辆进出电子围栏记录
export async function getCarFencingListPage(dataInfo) {
  return request({
    url: zcApi + '/ebox/electronic/entryexit/getpagerlist',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// abs
// abs设备列表
export async function GetDeviceList(dataInfo) {
  return request({
    url: zcApi + '/ebox/abs/deviceinfo/getpagerlist',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// abs设备列表单条详情
export async function GetDeviceSingle(dataInfo) {
  return request({
    url: zcApi + '/ebox/abs/deviceinfo/getsingle',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// abs设备列表编辑
export async function UpdateDevice(dataInfo) {
  return request({
    url: zcApi + '/ebox/abs/deviceinfo/update',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// abs设备列表新增
export async function AddDevice(dataInfo) {
  return request({
    url: zcApi + '/ebox/abs/deviceinfo/insert',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// abs设备列表删除
export async function DeleteDevice(dataInfo) {
  return request({
    url: zcApi + '/ebox/abs/deviceinfo/delete',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 更新abs启用状态
export async function UpdateDeviceActivity(dataInfo) {
  return request({
    url: zcApi + '/ebox/abs/deviceinfo/UpdateActivity',
    method: 'post',
    data: inputView(dataInfo)
  })
}
// 1
// 1
// 1
// 1
// 1
// 1
// 1
// 1
// 1
// 1
// 1
// 1
// 1
// 1
// 1
// 1
// 1
// 1
// 1
// 1
// 登出
export async function logout() {
  return request({
    url: zcApi + '/house/user/logout',
    method: 'post'
  })
}
// 获取地区接口
export async function getAreaList(parentCode) {
  return request({
    url: zcApi + '/house/area/list',
    method: 'get',
    params: { parentCode }
  })
}
// 新增街道接口
export async function addStreet(streetInfo) {
  return request({
    url: zcApi + '/house/area/street',
    method: 'post',
    data: streetInfo
  })
}
// 获取所有街道列表接口
export async function getStreetTable(streetInfo) {
  return request({
    url: zcApi + '/house/area/street/list',
    method: 'get',
    params: streetInfo
  })
}
// 获取街道下的社区列表接口
export async function getCommunityList(parentCode) {
  return request({
    url: zcApi + '/house/community',
    method: 'get',
    params: { parentCode }
  })
}
/*
* 房屋相关
* */
// 获取所有房屋列表接口
export async function getHouseTable(houseInfo) {
  return request({
    url: zcApi + '/house/area_house',
    method: 'get',
    params: houseInfo
  })
}
// 新增房屋接口
export async function addHouse(houseInfo) {
  return request({
    url: zcApi + '/house/house',
    method: 'post',
    data: houseInfo
  })
}
// 删除房屋接口
export async function deleteHouse(params) {
  return request({
    url: zcApi + '/house/house',
    method: 'delete',
    params: params
  })
}
// 下载房屋接口
export async function exportHouse(params) {
  return request({
    url: zcApi + '/house/house/export',
    responseType: 'blob',
    method: 'post',
    data: params
  })
}
// 更新房屋接口
export async function editHouse(houseInfo) {
  return request({
    url: zcApi + '/house/house',
    method: 'put',
    data: houseInfo
  })
}
// 获取房屋信息接口
export async function getHouseInfoById(id) {
  return request({
    url: zcApi + '/house/house/' + id,
    method: 'get'
  })
}
// 房屋与地区关联接口
export async function buildHouseAndArea(relationInfo) {
  return request({
    url: zcApi + '/house/area_house',
    method: 'post',
    data: relationInfo
  })
}
// 编辑房屋与地区关联接口
export async function editbuildHouseAndArea(relationInfo) {
  return request({
    url: zcApi + '/house/area_house',
    method: 'put',
    data: relationInfo
  })
}
/*
* 用户相关
* */
// 新增用户
export async function addUser(userInfo) {
  return request({
    url: zcApi + '/house/user/info',
    method: 'post',
    data: userInfo
  })
}
// 删除用户
export async function deleteUser(params) {
  return request({
    url: zcApi + '/house/user/info',
    method: 'delete',
    params: params
  })
}
// 修改用户信息
export async function updateUserInfo(userInfo) {
  return request({
    url: zcApi + '/house/user/info',
    method: 'put',
    data: userInfo
  })
}
// 修改密码
export async function updatePassword(params) {
  return request({
    url: zcApi + '/house/user/info/edit/pass',
    method: 'put',
    data: params
  })
}
// 用户列表
export async function getUserList(userInfo) {
  return request({
    url: zcApi + '/house/user/info/list',
    method: 'get',
    params: userInfo
  })
}
// 角色列表(分页)
export async function getRoleTable(params) {
  return request({
    url: zcApi + '/house/user/role/page',
    method: 'get',
    params: params
  })
}
// 角色列表(不分页)
export async function getRoleList(params) {
  return request({
    url: zcApi + '/house/user/role/list',
    method: 'get',
    params: params
  })
}
// 根据角色获取用户
export async function getUserByRoleId(roleId) {
  return request({
    url: zcApi + '/house/user/info/user/' + roleId,
    method: 'get'
  })
}
// 新增角色
export async function addRole(roleInfo) {
  return request({
    url: zcApi + '/house/user/role',
    method: 'post',
    data: roleInfo
  })
}
// 权限列表
export async function permissionTable(params) {
  return request({
    url: zcApi + '/house/permission',
    method: 'get',
    params: params
  })
}
// 新增权限
export async function addPermission(needData) {
  return request({
    url: zcApi + '/house/permission',
    method: 'post',
    data: needData
  })
}
// 删除菜单
export async function deleteMenu(id) {
  return request({
    url: zcApi + '/house/menu',
    method: 'DELETE',
    params: { id: id }
  })
}
// 根据菜单的父级ID获取子菜单接口
export async function getMenuByParentId(parentId) {
  return request({
    url: zcApi + '/house/menu',
    method: 'get',
    params: { pid: parentId }
  })
}
// 获取资源接口
export async function getResourceTable(params) {
  return request({
    url: zcApi + '/house/resource/page',
    method: 'get',
    params: params
  })
}
// 菜单添加访问资源
export async function addMenuResource(needData) {
  return request({
    url: zcApi + '/house/permission',
    method: 'post',
    data: needData
  })
}
// 菜单添加访问资源
export async function getResourceByMenuId(thisMenuId) {
  return request({
    url: zcApi + '/house/permission/list/' + thisMenuId,
    method: 'get'
  })
}
// 角色添加权限
export async function addRoleResource(needData) {
  return request({
    url: zcApi + '/house/permission/role/permission',
    method: 'post',
    data: needData
  })
}
// 新增资源
export async function addResource(needData) {
  return request({
    url: zcApi + '/house/resource',
    method: 'post',
    data: needData
  })
}
// 获取社区表格
export async function getCommunityTable(params) {
  return request({
    url: zcApi + '/house/community',
    method: 'get',
    params: params
  })
}
// 新增社区
export async function addCommunity(needData) {
  return request({
    url: zcApi + '/house/community',
    method: 'post',
    data: needData
  })
}
// 获取街道下的社区社区
export async function getCommunityByStreet(streetCode) {
  return request({
    url: zcApi + '/house/community/list/' + streetCode,
    method: 'get'
  })
}
// 设备管理设备表格
export async function installTable(params) {
  return request({
    url: zcApi + '/house/device/list',
    method: 'get',
    params: params
  })
}
// 设备供应商列表
export async function getDeviceShopList() {
  return request({
    url: zcApi + '/house/device/vender/list',
    method: 'get'
  })
}
// 设备类型列表
export async function getDeviceTypeList() {
  return request({
    url: zcApi + '/house/device/type/list',
    method: 'get'
  })
}
// 新增设备
export async function addInstall(needData) {
  return request({
    url: zcApi + '/house/device',
    method: 'post',
    data: needData
  })
}
// 编辑设备
export async function editInstall(needData) {
  return request({
    url: zcApi + '/house/device',
    method: 'put',
    data: needData
  })
}
// 删除设备
export async function deleteInstall(params) {
  return request({
    url: zcApi + '/house/device',
    method: 'delete',
    params: params
  })
}
// 根据地区获取房屋
export async function getHoseListByArea(params) {
  return request({
    url: zcApi + '/house/area_house/list',
    method: 'get',
    params: params
  })
}
// 根据房屋名获取房屋
export async function getHoseByHouseName(params) {
  return request({
    url: zcApi + '/house/area_house/name',
    method: 'get',
    params: params
  })
}
// 设备供应商表格
export async function getDeviceShopPage(params) {
  return request({
    url: zcApi + '/house/device/vender/page',
    method: 'get',
    params: params
  })
}
// 设备类型表格
export async function getDeviceTypePage(params) {
  return request({
    url: zcApi + '/house/device/type/page',
    method: 'get',
    params: params
  })
}
// 新增设备供应商
export async function addDeviceShop(needData) {
  return request({
    url: zcApi + '/house/device/vender',
    method: 'post',
    data: needData
  })
}
// 新增设备类型
export async function addDeviceType(needData) {
  return request({
    url: zcApi + '/house/device/type',
    method: 'post',
    data: needData
  })
}
// 新增建筑类型
export async function addBuildingType(needData) {
  return request({
    url: zcApi + '/house/building/type',
    method: 'post',
    data: needData
  })
}
// 建筑类型不分页
export async function getBuildingType() {
  return request({
    url: zcApi + '/house/building/type/list',
    method: 'get'
  })
}
// 建筑类型分页
export async function getBuildingTypePage(params) {
  return request({
    url: zcApi + '/house/building/type/page',
    method: 'get',
    params: params
  })
}
// 监测对象分页
export async function getMonitorPage(params) {
  return request({
    url: zcApi + '/house/mtarget/page',
    method: 'get',
    params: params
  })
}
// 新增监测对象
export async function addMonitor(needData) {
  return request({
    url: zcApi + '/house/mtarget',
    method: 'post',
    data: needData
  })
}
// 删除监测对象
export async function deleteMonitor(ids) {
  return request({
    url: zcApi + '/house/mtarget',
    method: 'delete',
    params: ids
  })
}
// 获取当前角色的地区权限
export async function getUserAreaPerssion() {
  return request({
    url: zcApi + '/house/area/user/list',
    method: 'get'
  })
}
// 新增设备监测对象
export async function buildDeviceTarget(needData) {
  return request({
    url: zcApi + '/house/mtarget/device',
    method: 'post',
    data: needData
  })
}
// 编辑设备监测对象
export async function editDeviceTarget(needData) {
  return request({
    url: zcApi + '/house/mtarget/device',
    method: 'put',
    data: needData
  })
}
// 获取设备监测对象列表
export async function getDeviceTargetPage(params) {
  return request({
    url: zcApi + '/house/mtarget/device/page',
    method: 'get',
    params: params
  })
}
// 获取监测对象
export async function getMonitorTargetList() {
  return request({
    url: zcApi + '/house/mtarget/list/house',
    method: 'get'
  })
}
/*
* SCM相关
* */
// 获取SCM项目的表格数据
export async function getScmProjectPage(params) {
  return request({
    url: zcApi + '/house/api/scm/project/plan/page',
    method: 'get',
    params: params
  })
}
// scm项目合同列表
export async function getProjectContractPage(params) {
  return request({
    url: zcApi + '/house/api/scm/project/contract/page',
    method: 'get',
    params: params
  })
}
// scm新增项目合同
export async function addProjectContract(needData) {
  return request({
    url: zcApi + '/house/api/scm/project/contract',
    method: 'post',
    data: needData
  })
}
// 项目合同房屋列表
export async function getProjectContractHousePage(params) {
  return request({
    url: zcApi + '/house/house/contract/page',
    method: 'get',
    params: params
  })
}
// 新增项目合同房屋
export async function addProjectContractHouse(needData) {
  return request({
    url: zcApi + '/house/house/contract',
    method: 'post',
    data: needData
  })
}

/*
* 设备数据相关
* */
// 获取GNSS数据
export async function getGNSSData(params) {
  return request({
    url: zcApi + '/house/api/iot/gnss/xyh',
    method: 'get',
    params: params
  })
}
// 获取振弦设备
export async function getElasticWireDevice(params) {
  return request({
    url: zcApi + '/house/api/iot/vibrating/device',
    method: 'get',
    params: params
  })
}
// 获取振弦数据
export async function getElasticWireDeviceData(params) {
  return request({
    url: zcApi + '/house/api/iot/vibrating/data',
    method: 'get',
    params: params
  })
}
// 根据地区获取监测对象列表
export async function getMonitorByArea(params) {
  return request({
    url: zcApi + '/house/mtarget/list',
    method: 'get',
    params: params
  })
}
// 根据监测对象id和设备类型获取设备列表
export async function getDeviceBymIdAndType(params) {
  return request({
    url: zcApi + '/house/device/target/list',
    method: 'get',
    params: params
  })
}
// 新增dtu
export async function addDtu(needData) {
  return request({
    url: zcApi + '/house/device/dtu',
    method: 'post',
    data: needData
  })
}
// 编辑dtu
export async function editDtu(needData) {
  return request({
    url: zcApi + '/house/device/dtu',
    method: 'put',
    data: needData
  })
}
// 删除dtu
export async function deleteDtu(params) {
  return request({
    url: zcApi + '/house/device/dtu',
    method: 'delete',
    params: params
  })
}
// 获取dtu列表
export async function getDtuTable(params) {
  return request({
    url: zcApi + '/house/device/dtu/page',
    method: 'get',
    params: params
  })
}
// 获取dtu列表
export async function getDtuList(params) {
  return request({
    url: zcApi + '/house/device/dtu/list',
    method: 'get',
    params: params
  })
}
// 获取设备原始数据
export async function getDeviceOriginalTable(params) {
  return request({
    url: zcApi + '/house/device/data/page',
    method: 'get',
    params: params
  })
}
// 获取倾角仪的数据
export async function getInclinometer(params) {
  return request({
    url: zcApi + '/house/sensor/data/slantChartData',
    method: 'get',
    params: params
  })
}
// 获取倾角仪日速率的数据
export async function getInclinometerDayData(params) {
  return request({
    url: zcApi + '/house/sensorSlantDay',
    method: 'get',
    params: params
  })
}
// 删除街道
export async function deleteStreet(params) {
  return request({
    url: zcApi + '/house/area/street',
    method: 'delete',
    params: params
  })
}
// 删除社区
export async function deleteCommounity(params) {
  return request({
    url: zcApi + '/house/community',
    method: 'delete',
    params: params
  })
}
// 新建任务
export async function addTask(needData) {
  return request({
    url: zcApi + '/house/inspection/major/task',
    method: 'post',
    data: needData
  })
}
// 更新任务
export async function updateTask(needData) {
  return request({
    url: zcApi + '/house/inspection/major/task',
    method: 'put',
    data: needData
  })
}
// 延长任务
export async function prolongTask(needData) {
  return request({
    url: zcApi + '/house/inspection/major/task/extend',
    method: 'put',
    data: needData
  })
}
// 总任务列表
export async function getTaskTable(params) {
  return request({
    url: zcApi + '/house/inspection/major/task/page',
    method: 'get',
    params: params
  })
}
// 总任务下的巡检任务列表
export async function getCheckTaskTable(params) {
  return request({
    url: zcApi + '/house/inspection/regular/task/page',
    method: 'get',
    params: params
  })
}
// 巡检报告详情
export async function getReportInfoById(reportId) {
  return request({
    url: zcApi + '/house/inspection/partInspection/' + reportId,
    method: 'get'
  })
}
// 审核巡检报告
export async function toCheckReportByAdmin(needData) {
  return request({
    url: zcApi + '/house/inspection/regular/task/status',
    method: 'put',
    data: needData
  })
}
// 巡检报告总列表
export async function getAllCheckReportTable(params) {
  return request({
    url: zcApi + '/house/inspection/regular/task/page/status',
    method: 'get',
    params: params
  })
}
// 巡检任务转移列表
export async function getCheckTaskApplyTable(params) {
  return request({
    url: zcApi + '/house/inspection/regular/task/transfer/notTransfer/page',
    method: 'get',
    params: params
  })
}
// 巡检任务转移接口
export async function postCheckTaskApply(needData) {
  return request({
    url: zcApi + '/house/inspection/regular/task/transfer',
    method: 'post',
    data: needData
  })
}
// 巡检任务转移待审核列表
export async function getWaitCheckTaskTable(params) {
  return request({
    url: zcApi + '/house/inspection/regular/task/transfer/page',
    method: 'get',
    params: params
  })
}
// 巡检任务转移确认操作
export async function putCheckTaskChecked(needData) {
  return request({
    url: zcApi + '/house/inspection/regular/task/transfer/ack',
    method: 'put',
    data: needData
  })
}
/*
* 文件上传
*/
// 上上传文件
export async function postFile(needData) {
  return request({
    url: zcApi + '/house/file',
    method: 'post',
    data: needData
  })
}
// 获取文件
export async function getFile(params) {
  return request({
    url: zcApi + '/house/file/list',
    method: 'get',
    params: params
  })
}
// 巡检房屋定位统计列表
export async function getLocationStatisticsPage(params) {
  return request({
    url: zcApi + '/house/position/count',
    method: 'get',
    params: params
  })
}
/*
巡检月报相关
*/
// 获取巡检月报合同的房屋数量
export async function getHouseNumByContractId(contractId) {
  return request({
    url: zcApi + '/house/house/contract/count/' + contractId,
    method: 'get'
  })
}
// 根据巡检月报合同和月份查巡检次数
export async function getInfoByContract(params) {
  return request({
    url: zcApi + '/house/monthly/report/inspection/sum',
    method: 'get',
    params: params
  })
}
// 获取巡检月报新增问题列表
export async function getAddProblemList(params) {
  return request({
    url: zcApi + '/house/monthly/report/house/problem/added/list',
    method: 'get',
    params: params
  })
}
// 获取巡检月报恶化问题列表
export async function getBadProblemList(params) {
  return request({
    url: zcApi + '/house/monthly/report/house/problem/deterioration/list',
    method: 'get',
    params: params
  })
}
// 获取巡检月报房屋入住和腾空
export async function getHouseInNumAndOutNum(params) {
  return request({
    url: zcApi + '/house/monthly/report/house/check_in_or_out/count',
    method: 'get',
    params: params
  })
}
// 获取巡检月报评价次数
export async function getHouseOverViewTimes(params) {
  return request({
    url: zcApi + '/house/inspection/overview/count',
    method: 'get',
    params: params
  })
}
// 获取巡检月报居民反馈
export async function getHouseResidentList(params) {
  return request({
    url: zcApi + '/house/inspection/resident/feedback/list',
    method: 'get',
    params: params
  })
}

/*
综合评价
*/

// 综合评价
export async function toOverview(needData) {
  return request({
    url: zcApi + '/house/inspection/overview',
    method: 'post',
    data: needData
  })
}

/*
临安房屋
*/
// 获取临安房屋列表
export async function getLinanHouseList(params) {
  return request({
    url: zcApi + '/house/api/linan/house/page',
    method: 'get',
    params: params
  })
}
// 编辑临安房屋
export async function putLinanHouse(needData) {
  return request({
    url: zcApi + '/house/api/linan/house',
    method: 'put',
    data: needData
  })
}
// 录入临安房屋
export async function enteringLinanHouse(needData) {
  return request({
    url: zcApi + '/house/api/linan/house/entry',
    method: 'put',
    data: needData
  })
}
// 新增临安房屋
export async function addLinanHouse(needData) {
  return request({
    url: zcApi + '/house/api/linan/house/web/house',
    method: 'post',
    data: needData
  })
}
/*
天台房屋
*/
// 获取天台房屋列表
export async function getTiantaiHouseList(params) {
  return request({
    url: zcApi + '/house/api/tiantai/house/page',
    method: 'get',
    params: params
  })
}
// 编辑天台房屋
export async function putTiantaiHouse(needData) {
  return request({
    url: zcApi + '/house/api/tiantai/house',
    method: 'put',
    data: needData
  })
}
// 录入天台房屋
export async function enteringTiantaiHouse(needData) {
  return request({
    url: zcApi + '/house/api/tiantai/house/entry',
    method: 'put',
    data: needData
  })
}
// 获取天台房屋列表地图用简约版
export async function getTiantaiHouseListPosition(params) {
  return request({
    url: zcApi + '/house/api/tiantai/house/position/page',
    method: 'get',
    params: params
  })
}
// 城厢设备数据查询
export async function getChengxiangDeviceData(params) {
  return request({
    url: zcApi + '/house/sensor/cx/map/data/list',
    method: 'get',
    params: params
  })
}

