<template>
  <el-row style="height:100%;"  v-loading="loading" >
    <h3 style='margin: 10px'> 这是查询订单页面</h3>
    <h3 style='margin: 10px'> 十五分钟未支付的单会被删掉哦QAQ</h3>
    <el-input style='padding: 0 10px;width: 90%;' placeholder="请输入下单手机号码查询" v-model="phone" class="input-with-select">
      <el-button slot="append" @click='selPhone' icon="el-icon-search"></el-button>
    </el-input>
    <div class="goodsList" v-if="goodslist.length>0">
      <div class="goodsItem">
        <el-table
          :default-sort = "{prop: 'date', order: 'descending'}"
          :data="goodslist"
          style="width: 100%"
          :height='400'
          :row-class-name="tableRowClassName">
          <el-table-column
            prop="title"
            label="商品清单"
            width="150">
            <template slot-scope="scope">
              <span v-html="scope.row.title"></span>
            </template>
          </el-table-column>
          <el-table-column
            prop="price"
            label="价格"
            width="">
          </el-table-column>
          <el-table-column
            label="支付">
            <template slot-scope='scope' >
              <span v-if='scope.row.isPay' >已支付</span>
              <el-button size='mini' type='primary' @click='pay(scope.row.url)' v-else>去支付</el-button>
            </template>
          </el-table-column>
          <el-table-column
          width='100'
            label="状态">
            <template slot-scope='scope'>
              <span v-if='scope.row.state.code===1'>
                <el-button size='mini'>查快递单号</el-button>
              </span>
              <span v-else><el-tag type='success'>{{scope.row.state.msg}}</el-tag></span>
            </template>
          </el-table-column>
          <el-table-column
            prop="date"
            label="日期"
            width='100'>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-else-if='not' class="not">
      一米哇嘎奈,没有找到任何订单耶( ⊙o⊙?),赶紧去下单吧!
    </div>
    <el-dialog
      title="如果没有自动打开支付接口,请复制链接到浏览器打开鸭!"
      :visible.sync="dialogVisible"
      width="300px"
      :close-on-click-modal='false'
      :show-close='false'
      >
      <el-input
        type="textarea"
        class='urllink'
        :rows="10"
        :data-clipboard-text="url"
        v-model="url">
      </el-input>
        
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="paysuccess">已支付完成</el-button>
      </span>
    </el-dialog>
    <shop-ping></shop-ping>
  </el-row>
</template>
<style lang="scss">
  .goodsList{
    .el-table .success-row {
      background: #f0f9eb;
    }
    .goodsItem{
      padding: 5px;
    }
  }
</style>
<script>
let moment = require('moment');
let Clipboard = require('clipboard')
let shopPing = require('../components/shopping.vue').default
export default {
    components: {
      shopPing:shopPing
    },
    data() {
      return {
        goodslist:[],
        loading:false,
        phone:'',
        url:"",
        not:false,
        dialogVisible:false
      }
    },
    created(){
      
    },
    mounted(){
      if(localStorage.address){
        try {
          let address = JSON.parse(localStorage.address)
          this.phone=address.phone
        } catch(e) {}
      }
      if(this.phone)
        this.selPhone();
      this.loadCopy();
    },
    methods: {
      loadCopy(){
        var clipboard = new Clipboard('.urllink')  
        clipboard.on('success', e => {  
          this.$message({message:'复制成功',type:'success'});
          // 释放内存  
          clipboard.destroy()  
        })  
        clipboard.on('error', e => {  
          // 不支持复制  
          this.$message({message:'该浏览器不支持自动复制',type:'error'})  
          // 释放内存  
          clipboard.destroy()  
        })  
      },
      paysuccess(){
        this.$confirm('已经支付完毕?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message.success('谢谢宠幸鸭qwq!')
          this.dialogVisible=false
          this.selPhone()
        }).catch(() => {
          this.selPhone()
          // this.$message.error('再检查看看吧qwq!')
        });
      },
      pay(url) {
        console.log('url',url)
        this.dialogVisible=true;
        var href = 'https://openapi.alipay.com/gateway.do?'
        href+= url
        this.url=href
        window.open(href, "_blank");
      },
      tableRowClassName({row, rowIndex}){
        if (row.isPay === true) {
          return 'success-row';
        }
        return ''
      },
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
          var msg=data.msg
          if(!data.msg || data.msg.length==0){
            this.not=true
            this.goodslist=[]
            return
          }
          msg.forEach((element)=>{
            if(!element.price)
                element.price=0
            element.date=moment(element.date).format('YY-MM-DD')
            element.title=element.title.replace(/\)/g,')<br/>')
            element.goodsInfo.forEach((element2)=>{
              element.price+=element2.price
            })
          })
          this.goodslist=msg
        },(error)=>{
          this.loading=false
        })
      }
    },
    watch:{
    }
  }
</script>
