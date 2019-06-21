import router from './router'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { getToken } from '@/utils/auth' // 验权
import store from './store'
import RouterList from '@/router/routerConfig'

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  // 判断token
  if (getToken()) {
    // if (to.path === '/login') {
    //   next({ path: '/' })
    // } else {
    // }
    // 判断是否已经生成过侧边栏菜单
    var menuFlag = window.sessionStorage.getItem('menuFlag')
    // 刷新的路由
    if (to.path !== '/404') {
      window.sessionStorage.setItem('thisRouterUrl', to.path)
    }
    if (menuFlag && menuFlag === 'none') {
      var roleMenuData = JSON.parse(window.sessionStorage.getItem('roleMenu'))
      // 暂时隐藏动态路由
      addRouterByRole(roleMenuData)
      window.sessionStorage.setItem('menuFlag', 'have')
      next()
    } else {
      next()
    }
    // 跳转页面，清空页面tab的信息
    store.dispatch('handleTabInfo', {
      text: '',
      tabsName: 'first',
      custom: ''
    })
    // 页面顶部导航栏
    store.dispatch('SetTagsList', to)
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
// 动态生成路由(多级)
function addRouterByRole(roleMenuData) {
  // 角色无菜单权限
  if (!roleMenuData[0].children) {
    return
  }
  // 生成对应菜单
  var roleMenu = roleMenuData[0].children
  var routersArr = []
  // 第一层
  for (var i = 0; i < roleMenu.length; i++) {
    var routerObj = {}
    routerObj.path = RouterList[roleMenu[i].LinkUrl] ? RouterList[roleMenu[i].LinkUrl].path : '/' + RouterList.empty.path
    if (roleMenu[i].children && roleMenu[i].children.length > 0) {
      routerObj.name = roleMenu[i].Title
      routerObj.component = RouterList[roleMenu[i].LinkUrl] ? RouterList[roleMenu[i].LinkUrl].component : RouterList.empty.component
      routerObj.selfId = roleMenu[i].Id
      routerObj.parentId = roleMenu[i].ParentId
      routerObj.meta = {
        title: roleMenu[i].Title, icon: roleMenu[i].Icon
      }
      var listTwo = roleMenu[i].children
      if (listTwo[0].children && listTwo[0].children.length > 0) {
        routerObj.redirect = RouterList[listTwo[0].LinkUrl].path + '/' + RouterList[listTwo[0].children[0].LinkUrl].path
      } else {
        // 重定向为空时，指向测试页
        if (RouterList[listTwo[0].LinkUrl]) {
          routerObj.redirect = RouterList[roleMenu[0].LinkUrl].path + '/' + RouterList[listTwo[0].LinkUrl].path
        } else {
          routerObj.redirect = RouterList[roleMenu[0].LinkUrl].path + '/' + RouterList.empty.path
        }
      }
      routerObj.children = []
      // 第二层
      for (var j = 0; j < listTwo.length; j++) {
        var routerTwo = {}
        routerTwo.path = RouterList[listTwo[j].LinkUrl] ? RouterList[listTwo[j].LinkUrl].path : RouterList.empty.path
        routerTwo.name = listTwo[j].Title
        routerTwo.component = RouterList[listTwo[j].LinkUrl] ? RouterList[listTwo[j].LinkUrl].component : RouterList.empty.component
        routerTwo.selfId = listTwo[j].Id
        routerTwo.parentId = listTwo[j].ParentId
        routerTwo.meta = {
          title: listTwo[j].Title, icon: listTwo[j].Icon
        }
        if (listTwo[j].children && listTwo[j].children.length > 0) {
          var listThree = listTwo[j].children
          // 重定向为空时，指向测试页
          if (RouterList[listThree[0].LinkUrl]) {
            routerTwo.redirect = RouterList[listTwo[j].LinkUrl].path + '/' + RouterList[listThree[0].LinkUrl].path
          } else {
            routerObj.redirect = RouterList[listTwo[j].LinkUrl].path + '/' + RouterList.empty.path
          }
          routerTwo.children = []
          // 第三层
          for (var k = 0; k < listThree.length; k++) {
            var routerThree = {}
            routerThree.path = RouterList[listThree[k].LinkUrl] ? RouterList[listThree[k].LinkUrl].path : RouterList.empty.path
            routerThree.name = listThree[k].Title
            routerThree.component = RouterList[listThree[k].LinkUrl] ? RouterList[listThree[k].LinkUrl].component : RouterList.empty.component
            routerThree.selfId = listThree[k].Id
            routerThree.parentId = listThree[k].ParentId
            routerThree.meta = {
              title: listThree[k].Title, icon: listThree[k].Icon
            }
            routerTwo.children.push(routerThree)
          }
        }
        routerObj.children.push(routerTwo)
      }
    } else {
      routerObj.component = RouterList.layout.component
      routerObj.children = [
        {
          path: 'index',
          component: RouterList[roleMenu[i].LinkUrl] ? RouterList[roleMenu[i].LinkUrl].component : RouterList.empty.component,
          name: roleMenu[i].Title,
          meta: { title: roleMenu[i].Title, icon: roleMenu[i].Icon },
          selfId: roleMenu[i].Id,
          parentId: roleMenu[i].ParentId
        }
      ]
    }
    routersArr.push(routerObj)
  }
  router.options.routes = router.options.routes.concat(routersArr)
  router.addRoutes(router.options.routes)
}
