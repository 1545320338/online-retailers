import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/page/index'
// import Index from '@/page/index'
// import Sr from '@/page/sr'
// import Love from '@/page/love'
// import Questionnaire from '@/page/questionnaire'
// import Getform from '@/page/getform'
// import Vote from '@/page/vote'
// import Blog from '@/page/blog'
import Login from '@/admin/login'
import List from '@/admin/list'
import Goods from '@/admin/goods'
import UserGoods from '@/admin/usergoods'
import Payment from '@/page/payment'
import Get from '@/page/get'
import SelGoods from '@/page/selgoods'
// import Ue from '@/page/ue'
// import Upimages from '@/page/upimages'
// import Index from '@/page/index'
// import HelloWord from '@/page/helloWord'
// import BlogList from '@/page/bloglist'
// import Blog from '@/page/blog'
Vue.use(Router)
export default new Router({
  routes: [
    {
      name:'index',
      path: '/',
      component:Index
    },{
      name:'login',
      path: '/login',
      component:Login 
    },{
      name:'list',
      path:'/list',
      component:List,
      meta: {checkLogined: true}
    },{
      name:'goods',
      path:'/goods',
      component:Goods,
      meta: {checkLogined: true}
    },{
      name:'ovo',
      path:'/ovo/:goods_id',
      props: { default: true, list: false },
      component:UserGoods
    },{
      name:"payment",
      path:'/qwq',
      component:Payment
    },{
      name:'get',
      path:'/get',
      component:Get
    },{
      name:'selgoods',
      path:'/selgoods',
      component:SelGoods
    }
  ]
})
