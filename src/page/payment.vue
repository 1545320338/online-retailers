<template>
  <div>
    <div v-if='goodslist.length>0' style="padding: 5px">
      <el-steps :active="2" simple>
        <el-step title="选购" icon="el-icon-sold-out"></el-step>
        <el-step title="确认" icon="el-icon-view"></el-step>
        <el-step title="支付" icon="el-icon-success"></el-step>
      </el-steps>
      <el-button style="margin-top: 12px;" @click="next">回去重新选购鸭 qwq</el-button>

      <div v-for='(item,index) in goodslist' class="payment-item" >
        <el-col :span='24'>
          <div class="title">
          <img v-if='item.href' :src="item.href" style="max-width: 150px;max-height:150px;float: left;">
          <div style="">
            {{item.title}}
          </div>
        </div>
        </el-col>
        <el-col style='padding-top: 3px;' :span='12'>
          <el-checkbox @change='changePrice' v-model='item.checking'>
            <span style="color: #c24f4a">价格:{{item.price}}</span>
          </el-checkbox>
        </el-col>
        <el-col :span='8' >
          <el-input-number  @change='cPrice' v-model='item.num' size="mini" :precision="2" :min="1" :step="1">
          </el-input-number>
        </el-col>
        <el-col :span='4'>
          <i  style="float: right;color: red;margin-top: 6px;" @click='delGoods(index)' class="el-icon-delete"></i>
        </el-col>
        <div style="clear: both;"></div>
      </div>
      <div class="payment-bottom">
        <div class="fixe">
          <el-checkbox style='margin-left: 5px;' @change='allCheckIng' v-model='allCheck'>全选</el-checkbox>
          <span class="num-price">总价格:¥<b>{{price}}</b></span>
          <el-button type='success' class='btn' round @click='alipay'>买买买鸭!!!</el-button>
        </div>
      </div>
    </div>
    <div v-else style="margin: 5px;text-align: center;">哎哟QAQ,还没添加商品呢,去买买买鸭!<el-button style="margin-top: 12px;" @click="next">回去重新选购鸭 qwq</el-button></div>
  </div>
</template>
<style lang="scss">
  .payment-item{
    border: 1px solid rgba(0,0,0,.1);
    padding: 5px;
    border-radius: 5px;
    margin-bottom: 5px;
    margin-top: 5px;
  }
  .payment-bottom{
    height: 50px;
    .fixe{
      position: fixed;
      box-shadow: 1px 1px 5px 5px rgba(0,0,0,.1);
      bottom: 0;
      background: #fff;
      z-index: 100;
      width: 100%;
      left: 0;
      height: 50px;
      .num-price{
        color: #c24f4a;
        font-size:20px;
        line-height: 50px;
        display: inline-block;
        margin-left: 10px;
        b{
          font-size: 16px;
        }
      }
      .btn{
        float: right;
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
  .el-message-box{
    width: auto
  }
</style>
<script>
export default {
    data() {
      return {
        list:[],
        msg:[],
        goodslist:[],
        price:0,
        allCheck:false,
      }
    },
    created(){
      
    },
    mounted(){
      let list = localStorage.ShoppingCart;
      try {
        list=JSON.parse(list)
      } catch(e) {
        console.log(e);
      }
      if(list && list.length){
        //商品列
        this.list=list
        this.$api.get('/goodslist',{},
        (data)=>{
          console.log(data)
          this.msg=data.msg
          this.loadGoodsList()
        },(err)=>{
          
        })
      }else{
      }
    },
    methods: {
      delGoods(index){
        console.log(index)
        this.$confirm('真滴要删除人家家吗 QAQ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.goodslist.splice(index,1)
          this.list.splice(index,1)
          localStorage.ShoppingCart=JSON.stringify(this.list)
          this.$message.error('人家家被删除掉了 QAQ')
        }).catch(() => {
          this.$message.success('谢谢宠幸鸭 qwq!!')
        });
        
      },
      next(){
        this.$router.push({
          name:'index'
        })
      },
      loadGoodsList(){
        var list=[]
        this.msg.forEach( (element, index)=>{
          this.list.forEach((element2, index2)=>{
            if(element2.id==element.id){
              var templist={
                num:element2.num,
                list:[],
                title:'',
                price:0
              }
              for (var i = 0; i < element2.list.length; i+=2) {
                var claIndex = element2.list[i]
                var labelIndex = element2.list[i+1];
                var item = element.list[claIndex].list[labelIndex]
                if(item.title)
                  templist.title+=item.title+' ';
                if(item.price )
                  templist.price+=item.price;
                if(item.href)
                  templist.href=item.href;
                templist.id=element2.id
                templist.slist=element2.list
                templist.list.push(item);
              }
              // this.price += templist.price
              list.push(templist)
            }
          });
        });
        console.log(list)
        this.goodslist=list
      },
      cPrice(){
        setTimeout(this.changePrice, 0)
      },
      changePrice(){
        var price=0;
        var chekNum=0
        this.goodslist.forEach( function(element, index) {
          if(element.checking){
            chekNum++;
            price += element.price*element.num;
          }
        });
        if(this.goodslist.length==chekNum){
          this.allCheck=true
        }else{
          this.allCheck=false
        }
        console.log(price)
        this.price=price
      },
      alipay(){
        var list=[]
        this.goodslist.forEach( function(element, index) {
          if(element.checking){
            list.push({
              list:element.slist,
              num:element.num,
              title:element.title,
              price:element.price,
              href:element.href,
              id:element.id
            })
          }
        });
        if (list.length) {
          this.$router.push({
            name:'get',
            params:{
              list:list
            }
          })
        }else {
          return this.$message.error('没有选中鸭 qwq');
        }
        console.log(list)
      },
      allCheckIng(value){
        this.goodslist.forEach( function(element, index) {
          element.checking=value
        });
        this.changePrice()
      }
    },
    watch:{
      // allCheck(value){
      //   this.goodslist.forEach( function(element, index) {
      //     element.checking=value
      //   });
      //   this.changePrice()
      // }
    }
  }
</script>
