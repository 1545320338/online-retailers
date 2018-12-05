// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import '../node_modules/element-ui/lib/theme-chalk/index.css'
import router from './router'
// 引用API文件
import api from './api/index.js'
import config from './config/config.js';
let moment = require('moment');
// 将API方法绑定到全局
router.beforeEach((to, from, next) => {
  // console.log(to,from,sessionStorage.Checking)
  // 判断要去的路由界面是不是要鉴权
  if (to.meta.checkLogined) {
    // 查看是否登陆
    if (!sessionStorage.Checking) {
      // 没登录的做处理
      next({
        path: '/login'
      })
    } else {
      // 登陆的正常跳
      next()
    }
  } else {
    // 不需要鉴权的正常跳
    next()
  }
})

Vue.prototype.$api = api;
Vue.prototype.$Bus = new Vue();
Vue.config.productionTip = false;
Vue.use(ElementUI)
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
})
if(config.isTop){
  console.log("%c欢迎来到神人的控制台", "font-size:20pt;background-color:#424951;color:#FFFFFF;padding:10pt;border-radius:5px")
  console.log("%c请勿复制任何东西", "font-size:20pt;background-color:#424951;color:#FFFFFF;padding:10pt;border-radius:5px")
  console.log("%c否则会导致个人信息泄露哦", "font-size:20pt;background-color:#424951;color:#FFFFFF;padding:10pt;border-radius:5px")
}