// 导入Vue
import Vue from 'vue'
// 导入组件
import Home from '@/components/home/Home'
import Login from '@/components/login/Login'

import Router from 'vue-router'
// 在Vue中注册路由实例
Vue.use(Router)

// 注册路由实例
const router = new Router({
  routes: [
    { path: '/home', component: Home },
    { path: '/login', component: Login }
  ]
})

// 导出router
export default router
