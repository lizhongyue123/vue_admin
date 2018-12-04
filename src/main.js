// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

// 引入ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 导入css样式
import '@/assets/css/index.css'

// 导入自己封装的router
import router from './router'

// 导入axios
import axios from 'axios'
// 将axios添加到Vue的原型上
Vue.prototype.$axios = axios

// 设置请求公共路径：
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 拦截器
axios.interceptors.request.use(
  function (config) {
    // 统一添加Authorization请求头
    config.headers.Authorization = localStorage.getItem('token')
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 注册插件
Vue.use(ElementUI)

Vue.config.productionTip = false

// 作用: 告诉ESlint不要校验下一行代码的no-new规则,注释不能去掉
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',

  // 将路由实例和Vue实例关联起来
  router
})
