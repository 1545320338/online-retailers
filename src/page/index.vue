<template>
  <el-row style="height:100%" v-loading="loading" >
    <div class="goodsList" v-if="list.length>0">
      <!-- <vueWaterfallEasy :imgsArr="imgsArr" >
        <template slot-scope="props">
          <div class="player_info">
            {{props}}
          </div>
        </template>
      </vueWaterfallEasy> -->
      <vueWaterfallEasy :imgsArr="imgsArr" :imgWidth="160" >
        <template slot-scope="props" @click='goodsPage(props.value.info.id,props.value.index)'>
          <!-- <div v-for="(item,index) in list"  :key="index"  class="goodsItem"> -->
          <div class="goodsItem">
            <div class="goodsItemBorder" @click='goodsPage(props.value.info.id,props.index)'>
              <!-- <img :src="props.value.info.banner" class="banner"> -->
              <h4>{{props.value.info.title}} <span class="fr">{{props.value.info.minPrice}}¥</span> <div class="clear"></div></h4>
              <!-- <div class="note" v-html="props.value.info.note"></div> -->
            </div>
          </div>
          <!-- </div> -->
        </template>
      </vueWaterfallEasy>
    </div>
    <div v-else class="not">
      一米哇嘎奈,没有找到任何商品耶( ⊙o⊙?)
    </div>
    <shop-ping></shop-ping>
  </el-row>
</template>
<style lang="scss">
  .goodsList{
    max-width: 1200px;
    width: 100%;
    height: 100%;
    .vue-waterfall-easy-container > .loading{
      display: none;
    }
    .clear{
      clear:both;
    }
    .fr{
      float: right;
      margin-right: 10px;
    }
    .goodsItem:nth-child(2n+1){
      padding-right: 5px;
    }
    .goodsItem:nth-child(2n+2){
      padding-left: 0px;
    }
    .goodsItem{
      border-radius: 4px;
      margin-bottom: 5px;
      cursor: pointer;
      cursor: pointer;
      padding: 10px;
      h4{
        line-height: 25px;
        margin-left: 10px;
        font-size: 14px;
        span{
          color: #c24f4a;
          font-size: 16px;
        }
      }
      .goodsItemBorder{
        border-radius: 10px;
        /*border: 1px solid rgba(0,0,0,0.1);*/
      }
      .banner{
        display: block;
        border-radius: 10px;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
      }
      .note{
        margin: 10px;
        margin-top: 0px;
        height: 25px;
        width:90%;
        overflow: hidden;
      }
    }
  }
  .not{
    color: #c24f4a;
    text-align: center;
    margin-top: 150px;
  }
</style>
<script>
// import shopping form '../components/shopping'
let shopPing = require('../components/shopping.vue').default
let vueWaterfallEasy=require('vue-waterfall-easy')
export default {
    data() {
      return {
        imgsArr:[],
        list:[],
        loading:true
      }
    },
    components: {
      vueWaterfallEasy:vueWaterfallEasy,
      shopPing:shopPing
    },
    created(){
      
    },
    mounted(){
      this.$api.get('/goodslist',{},
      (data)=>{
        let msg = data.msg;
        let imgsArr=[]
        msg.forEach( function(element, index) {
          element.minPrice=99999;
          imgsArr.push({
            id:index,
            src:element.banner,
            info:element
          })
          // element.title+=element.title+element.title+element.title
          element.list.forEach( function(element2, index2) {
            element2.list.forEach( function(element3, index3) {
              if(element3.price!=0 && element3.price<element.minPrice)
                element.minPrice=element3.price
            });
          });
          if(element.minPrice==99999)
          element.minPrice=0
        });
        this.imgsArr=imgsArr;
        this.list=msg;
        // this.minPrice=0
        this.loading=false
      },(error)=>{
        this.loading=false
      })
    },
    methods: {
      showShopPing(){
        this.$Bus.$emit('ShoppingCart',{
          'show':true
        })
      },
      goodsPage(id,index){
        console.log(id,index);
        // return false;
        // this.$router.list=this.list[index];
        this.$router.push({
          name:'ovo',
          params:{
            goods_id:id,
            list:this.list[index]
          }
        })
        return false;
        
      }
    },
    watch:{
    }
  }
</script>
