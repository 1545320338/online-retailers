<template>
  <div style="height:100%;max-width: 800px;margin:0 auto">
    <el-breadcrumb separator="/" style="padding: 5px">
      <el-breadcrumb-item :to="{ name: 'index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>ovo</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'index' }"><el-tag type="success" size="mini" style="margin-top: -2px"><i class="el-icon-back
"></i>返回上一级</el-tag></el-breadcrumb-item>
    </el-breadcrumb>
    <div class="usergoods">
      <img v-if="goods.banner" style="width: 100%;max-width: 500px;margin: 0 auto;display: block;" :src="info.img">
      <br/>
      商品名:{{goods.title}}
      <br/>
      <template v-if="info.price">
      价格:{{info.price}} <br/>
      </template>
      <template v-if="info.save">
        库存:{{info.save}} <br/>
      </template>
      
      <div v-for="(cla,claIndex) in list">
        <h3>{{cla.title}}</h3>
        <label v-for="(item,index) in cla.list" class="classItem" :class=" item.active==true?'active':''" :key="index" :disabled="item.disabled" @click="addActive(claIndex,index)">{{item.title}}</label>
      </div>
        <label>购买数量:</label>
        <el-input-number @input="numChange" :min="1" v-model="info.Num" size="mini" :precision="2">
        </el-input-number>
      <el-button type="warning" @click="addGoods">加入购物车</el-button>
    </div>
    <el-card style="margin: 10px" shadow="always" v-if="goods.note">
      <h2>简介:</h2>
      <div v-html="goods.note"></div>
    </el-card>
    <shop-ping></shop-ping>
  </div>
</template>
<style lang="scss">
.classItem{
  cursor: pointer;
  border: 1px rgba(0,0,0,.05) solid;
  border-radius: 5px;
  padding: 5px;
  margin: 5px;
  font-size: 12px;
  user-select: none;
  display: inline-block;
}
.classItem[disabled]{
  color: #999;
  cursor:no-drop;
}
.usergoods{
  margin: 5px;border: 1px rgba(0,0,0,.05) solid;border-radius: 5px;padding: 10px
}
.classItem.active{
  color: #e6a23c;
  border-color: #e6a23c
}
.addList{
  padding: 5px;
  .addItem{
    padding-bottom: 5px;
    border: 1px rgba(0,0,0,.05) solid;
    border-radius: 5px;
    padding: 10px;
    margin: 5px;
    .el-form-item{
      margin-bottom: 0
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  table {
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
  }
  table td,
  table th {
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding: 3px 5px;
  }
  table th {
    border-bottom: 2px solid #ccc;
    text-align: center;
  }

  /* blockquote 样式 */
  blockquote {
    display: block;
    border-left: 8px solid #d0e5f2;
    padding: 5px 10px;
    margin: 10px 0;
    line-height: 1.4;
    font-size: 100%;
    background-color: #f1f1f1;
  }

  /* code 样式 */
  code {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    background-color: #f1f1f1;
    border-radius: 3px;
    padding: 3px 5px;
    margin: 0 3px;
  }
  pre code {
    display: block;
  }

  /* ul ol 样式 */
  ul, ol {
    margin: 10px 0 10px 20px;
  }
}
</style>
<script>
let moment = require('moment');
let shopPing = require('../components/shopping.vue').default
export default {
  components:{
    shopPing:shopPing
  },
    data() {
      let list=[]
      let id=moment().format('YYYY-MM-DDTHH:mm:ss')+Math.random();
      console.log(id)
      return {
        list:list,
        id:id,
        info:{
          price:0,
          singlePrice:0,
          Num:1,
          img:'',
          save:0
        },
        goods:{
          title:"",
          banner:"http://img.yxlovo.com/item/MT.jpg",
          note:""
        },
        form:{

        }
      };
    },
    mounted(){
      //load info
      let params= this.$route.params.list
      let id = this.$route.params.goods_id
      console.log(params)
      if(params && params.list){
        this.list=params.list||this.list
        this.goods.banner=params.banner||this.goods.banner
        this.goods.title=params.title||this.goods.title
        this.goods.note=params.note
      }else if(id){
        this.$api.get('/goodslist',{
          id:id
        },
        (data)=>{
          console.log(data)
          let msg=data.msg[0]
          this.list=msg.list
          this.goods.banner=msg.banner
          this.goods.title=msg.title
          this.goods.note=msg.note
          this.info.img=this.goods.banner
        },(error)=>{
          this.loading=false
        })
      }else{
        this.$router.replace({name:"index"})
      }
      this.info.img=this.goods.banner
    },
    created(){
      
    },
    methods: {
      addGoods(){
        var goods={
          id:this.$route.params.goods_id
        }
        var list=[]
        for (var i = this.list.length - 1; i >= 0; i--) {
          let element = this.list[i]
          var labelIndex=-1;
          element.list.forEach( (element2, index2)=>{
            if(element2.active){
              labelIndex=index2
            }
          });
          console.log(labelIndex)
          if(labelIndex>=0)
            list.push(i,labelIndex);
          else
            return this.$message.error('请选择'+element.title+'哦!')
        }
        goods.list=list;
        goods.num=this.info.Num
        this.$Bus.$emit('ShoppingCart',{
          goods:goods
        })
        this.$message.success('添加成功')
      },
      isChange(){
        this.list.forEach( (element, index)=> {
          element.list.forEach( (element2, index2)=> {
            if(!element.isPice)
              element2.price=0
            if(!element.isDisabled)
              delete element2.disabled
            if(!element.isNum)
              delete element2.num
            if(!element.isImage)
              element2.href=''
          });
        });
      },
      numChange(){
        this.info.price=this.info.Num*this.info.singlePrice
      },
      addActive(claIndex,index){
        let item = this.list[claIndex].list[index]
        if(item.disabled) return this.$message.error('缺货!');
        if(item.href){
          this.goods.banner=item.href
        }
        if(item.href)
          this.info.img=item.href
        if(item.active){
          this.list[claIndex].list[index].active=false
          if(item.price)
            this.info.singlePrice-=item.price;
          if(item.num)
            this.info.save-=item.num
          this.info.price=this.info.singlePrice*this.info.Num
        }else{
          this.list.forEach( (element, index1)=> {
            if(claIndex==index1)
            element.list.forEach( (element2, index2)=> {
              if(index!=index2 && element2.active){
                element2.active=false
                this.info.singlePrice-=element2.price;
                if(element2.num)
                  this.info.save-=element2.num
              }
            });
          });
          this.list[claIndex].list[index].active=true
          if(item.price)
            this.info.singlePrice+=item.price;
          if(item.num)
            this.info.save+=item.num
          this.info.price=this.info.singlePrice*this.info.Num
        }
        this.$forceUpdate()
      },
      
      returnList(){
        this.$confirm('此操作将返回列表,当前页数据不保存, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.replace({
            name:'list'
          })
        }).catch(() => {
        });
      }
    },
    watch:{
    }
  }
</script>
