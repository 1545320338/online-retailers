<template>
  <el-row style="height:100%;margin: 10px"  v-loading="loading" >
    <el-input  placeholder="请输入下单手机号码查询" v-model="phone" class="input-with-select">
      <el-button slot="append" @click='selPhone' icon="el-icon-search"></el-button>
    </el-input>
    <div class="goodsList" v-if="goodslist.length>0">
      <div class="goodsItem">
        <template v-for='item in goodslist' >
          {{moment(item.date).format('YY-MM-DD HH:MM:SS')}}
        </template>
      </div>
    </div>
    <div v-else-if='not' class="not">
      一米哇嘎奈,没有找到任何订单耶( ⊙o⊙?),赶紧去下单吧!
    </div>
  </el-row>
</template>
<style lang="scss">
  .goodsList{
    .goodsItem{
      padding: 5px;
    }
  }
</style>
<script>
let moment = require('moment');
export default {
    data() {
      return {
        moment:moment,
        goodslist:[],
        loading:false,
        phone:'17621751536',
        not:false
      }
    },
    components: {
    },
    created(){
      
    },
    mounted(){

    },
    methods: {
      selPhone(){
        if(!this.phone){
          return this.$message({message:'请输入手机号',type:'error',showClose: true,})
        }else if(this.phone<=11){
          return this.$message({message:'手机号过短',type:'error',showClose: true,})
        }
        this.$api.get('/getPhoneGoods',{
          phone:this.phone
        },(data)=>{
          console.log(data)
          if(!data.msg || data.msg.length==0){
            this.not=true
            return
          }
          this.goodslist=data.msg
        },(error)=>{
          this.loading=false
        })
      }
    },
    watch:{
    }
  }
</script>
