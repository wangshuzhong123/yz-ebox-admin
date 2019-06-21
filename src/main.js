// vue实例化
import Vue from 'vue'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en'
import '@/styles/index.scss' // global css
import App from './App'
import router from './router'
import store from './store'
import '@/icons' // icon
import '@/permission' // permission control
import * as filters from './filters' // 全局filter

Vue.use(ElementUI)
// Vue.use(ElementUI, { locale })
Vue.config.productionTip = false

// vue过滤器设置
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// 父组件created→父组件beforeMounted→子组件created→子组件beforeMounted→子组件mounted→父组件mounted

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  mounted() {
    // 页面刷新之后重定向到刷新之前的页面(出来404页面和登录页)
    this.$router.replace({
      path: window.sessionStorage.getItem('thisRouterUrl') ? window.sessionStorage.getItem('thisRouterUrl') : '/'
    })
  }
})

window.addEventListener('beforeunload', function() {
  window.sessionStorage.setItem('menuFlag', 'none')
}) // 页面刷新菜单栏丢失，需重新生成
