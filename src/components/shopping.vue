<template>
  <div>
    <transition  
      enter-active-class=" rubberBand"
      leave-active-class=" rotateOut">
      <div class='return animated' v-if='menuShow'  @click="Return">
        <i class="el-icon-back icon"></i>
      </div>
    </transition>
    <transition  name='bounce'>
      <div v-if='menuShow' class='animated search' @click="search">
        <i class="el-icon-search icon"></i>
      </div>
    </transition>
    <transition  
      enter-active-class=" bounceInRight"
      leave-active-class=" bounceOutRight">
      <div class='shopping animated'   @click="shoPayment">
        <i class="el-icon-goods icon"></i>
        <span class="num" v-if="num">{{num}}</span>
      </div>
    </transition>
    <div class='menu' @click="menu">
      <i class="el-icon-menu icon"></i>
    </div>
  </div>
</template>
<style lang="scss">
.shopping,.search,.menu,.return{
  position: fixed;
  width: 50px;
  height: 50px;
  line-height: 50px;
  border-radius: 50%;
  background:#fff;
  box-shadow: 0px 5px 5px  rgba(0,0,0,.2);
  z-index: 100;
  
  right: 20px;
  text-align: center;
  opacity: .8;
  i.icon{
    font-size: 25px;
    color: #e6a23c;
    vertical-align: text-top
  }
  .num{
    position: absolute;
    right: 0px;
    top: -10px;
    font-size: 12px;
    background: red;
    border-radius: 50%;
    height: 22px;
    line-height: 22px;
    width: 22px;
    color: #fff;
  }
}
.shopping{
  bottom: 80px;
}
.search{
  bottom: 140px;
}
.menu{
 bottom: 20px; 
}
.return{
  bottom: 200px;
}
</style>
<script type="text/javascript">
export default {
  created () {
  },
  props: [],
  data () {
    return {
      list:[],
      num:0,
      menuShow:false
    }
  },
  mounted(){
    this.$Bus.$on('ShoppingCart',this.ShoppingCart)
    this.getNum();
  },
  destroyed(){
    this.$Bus.$off('ShoppingCart',this.ShoppingCart)
  },
  methods:{
    Return(){
      this.$router.go(-1)
    },
    menu(){
      this.menuShow=!this.menuShow
    },
    search(){
      this.$router.push({
        name:'selgoods'
      })
    },
    shoPayment(){
      this.$router.push({
        name:'payment'
      })
    },
  	ShoppingCart(info){
      if(info){
        if(info.goods ){
          let goods=info.goods;
          let id=goods.id;
          let list=goods.list;
          let num=goods.num
          if(id && list)
            this.addGoods(id,list,num);
        }
      }
    },
    addGoods(id,list,num=0){
      var localList=[];
      try {
        if(localStorage.ShoppingCart)
          localList = JSON.parse(localStorage.ShoppingCart);
      } catch(e) {
        console.error(e);
      }
      var tempList=JSON.parse(JSON.stringify([].concat(localList)) )
      var saveList=[].concat(localList);
      
      
      if(tempList.length){
        let isNew=true;
        for (var i = saveList.length - 1; i >= 0; i--) {
          let element=saveList[i] 
          // console.log(JSON.stringify(element.list)==JSON.stringify(list))
          if(element.id==id && JSON.stringify(element.list)==JSON.stringify(list)){
            if(element.num)
              element.num+=num
            else
              element.num=num
            isNew=false
          }
        };
        if(isNew)
        saveList.push({
          id:id,
          list:list,
          num:num
        })
      }else{
        saveList.push({
          id:id,
          list:list,
          num:num
        })
      }
      console.log(saveList)
      localStorage.ShoppingCart=JSON.stringify(saveList)
      this.getNum();
      // console.log(list)
    },
    getNum(){
      var localList=[]
      try {
        if(localStorage.ShoppingCart)
          localList = JSON.parse(localStorage.ShoppingCart);
      } catch(e) {
        console.error(e);
      }
      var num=0
      localList.forEach( function(element, index) {
        num+=element.num
      });
      this.num=num
      return num
    }
  }
}
	
</script>