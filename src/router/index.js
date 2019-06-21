import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_production')
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('404'), hidden: true },
  { path: '*', redirect: '/404', hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/mainIndex',
    name: '系统首页',
    hidden: true,
    children: [{
      path: 'mainIndex',
      component: _import('dashboard/index')
    }]
  }
  // {
  //   path: '/chengxiangProject',
  //   component: Layout,
  //   redirct: '/chengxiangProject/projectIndex',
  //   name: '城厢街道',
  //   meta: { title: '城厢街道', icon: 'table' },
  //   children: [
  //     {
  //       path: 'projectIndex',
  //       component: _import('chengxiangjiedao/chengxiangData/index'),
  //       name: '城厢项目首页',
  //       meta: { title: '城厢项目首页', icon: 'form' }
  //     },
  //     {
  //       path: 'chengxiangCheck',
  //       component: _import('chengxiangjiedao/chengxiangDeviceMap/index'),
  //       name: '城厢项目',
  //       meta: { title: '城厢项目', icon: 'form' }
  //     }
  //   ]
  // }
  // {
  //   path: '/system',
  //   component: Layout,
  //   redirct: '/system/basicData/menu',
  //   name: '系统管理',
  //   meta: { title: '系统管理', icon: 'table' },
  //   children: [
  //     {
  //       path: '/system/basicData',
  //       component: _import('commonRouterView/index'),
  //       redirct: '/system/basicData/menu',
  //       name: '基础数据管理',
  //       meta: { title: '基础数据管理', icon: 'form' },
  //       children: [
  //         {
  //           path: 'menu',
  //           component: _import('basicData/menu/index'),
  //           name: '菜单',
  //           meta: { title: '菜单', icon: 'example' }
  //         },
  //         {
  //           path: 'menuManagement',
  //           component: _import('basicData/menuManagement/index'),
  //           name: '菜单管理',
  //           meta: { title: '菜单管理', icon: 'example' }
  //         }
  //       ]
  //     },
  //     {
  //       path: '/system/userData',
  //       component: _import('commonRouterView/index'),
  //       redirct: '/system/userData/userList',
  //       name: '用户管理',
  //       meta: { title: '用户管理', icon: 'form' },
  //       children: [
  //         {
  //           path: 'userList',
  //           component: _import('user/userList/index'),
  //           name: '用户列表',
  //           meta: { title: '用户列表', icon: 'example' }
  //         }
  //       ]
  //     },
  //     {
  //       path: '/system/testData',
  //       component: _import('commonRouterView/index'),
  //       redirct: '/system/testData/three',
  //       name: '测试管理',
  //       meta: { title: '测试管理', icon: 'form' },
  //       children: [
  //         {
  //           path: 'three',
  //           component: _import('test/three'),
  //           name: 'Three',
  //           meta: { title: 'Three', icon: 'form' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'buildingType',
  //       component: _import('basicData/buildingType/index'),
  //       name: '建筑类型',
  //       meta: { title: '建筑类型', icon: 'form' }
  //     }
  //   ]
  // }
  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: '省市区管理',
  //       component: _import('area/index'),
  //       meta: { title: '省市区管理', icon: 'form' }
  //     }
  //   ]
  // },
  // {
  //   path: '/test',
  //   component: Layout,
  //   redirect: '/test/one',
  //   name: 'Test',
  //   meta: { title: 'Test', icon: 'user' },
  //   children: [
  //     {
  //       path: 'one',
  //       name: 'One',
  //       component: _import('test/one'),
  //       meta: { title: 'One', icon: '' }
  //     },
  //     {
  //       path: '/wang',
  //       name: 'Two',
  //       component: _import('commonRouterView/index'),
  //       redirect: '/wang/my',
  //       meta: { title: 'Two', icon: '' },
  //       children: [
  //         {
  //           path: 'my',
  //           name: 'My',
  //           component: _import('test/two'),
  //           meta: { title: 'My', icon: '' }
  //         },
  //         {
  //           path: 'nima',
  //           name: 'nima',
  //           component: _import('test/three'),
  //           meta: { title: 'nima', icon: '' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'three',
  //       name: 'Three',
  //       component: _import('test/three'),
  //       meta: { title: 'Three', icon: '' }
  //     },
  //     {
  //       path: 'four',
  //       name: 'Four',
  //       component: _import('test/four'),
  //       meta: { title: 'Four', icon: '' }
  //     },
  //     {
  //       path: 'five',
  //       name: 'Five',
  //       component: _import('test/five'),
  //       meta: { title: 'Five', icon: '' }
  //     }
  //   ]
  // },
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

