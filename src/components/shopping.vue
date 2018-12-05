<template>
	<div class='shopping' @click="shoPayment">
		<i class="el-icon-goods icon"></i>
    <span class="num" v-if="num">{{num}}</span>
	</div>
</template>
<style lang="scss">
.shopping{
  position: fixed;
  width: 50px;
  height: 50px;
  line-height: 50px;
  border-radius: 50%;
  background:#fff;
  box-shadow: 0px 5px 5px  rgba(0,0,0,.2);
  z-index: 100;
  bottom: 60px;
  right: 20px;
  text-align: center;
  opacity: .8;
  i.icon{
    
    font-size: 25px;
    color: #e6a23c;
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
</style>
<script type="text/javascript">
export default {
  created () {
  },
  props: [],
  data () {
    return {
      list:[],
      num:0
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
    shoPayment(){
      this.$router.push({
        name:'payment'
      })
    },
  	ShoppingCart(info){
      console.log(info)
      if(info){
        if(info.goods){
          let goods=info.goods;
          let id=goods.id;
          let list=goods.list;
          if(id && list)
            this.addGoods(id,list);
        }
      }
    },
    addGoods(id,list){
      console.log(id,list)
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
              element.num++
            else
              element.num=2
            isNew=false
          }
        };
        if(isNew)
        saveList.push({
          id:id,
          list:list,
          num:1
        })
      }else{
        saveList.push({
          id:id,
          list:list,
          num:1
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