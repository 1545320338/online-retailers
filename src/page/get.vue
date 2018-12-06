<template>
  <div>
    <el-steps :active="3" simple>
      <el-step title="选购"  icon="el-icon-sold-out"></el-step>
      <el-step title="确认" icon="el-icon-view"></el-step>
      <el-step title="支付" icon="el-icon-success"></el-step>
    </el-steps>
    &nbsp; <el-button style="margin-top: 12px;" @click="$router.push({name:'index'})"> <i class="el-icon-back
"></i> 回去重新选购鸭 qwq</el-button>
    <div class="list">
      商品清单:
      <div v-for='item in list' class="getitem">
        <img v-if='item.href' style="max-width: 50px;max-height: 50px;" :src="item.href">
        {{item.title}}X{{item.num}}  <span style="margin-left: 5px;color:#c24f4a">价格:¥{{item.price*item.num}}</span>
      </div>
    </div>
    <div class="info">
      <h4 style="padding: 15px">
      人个信息:第一次购买时要填写,之后会读取浏览器记录鸭!!!不会上传 or 盗用哦
      </h4>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="称呼" prop="name">
          <el-input placeholder='嘤' v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input  v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="地址鸭!" prop="address">
          <el-cascader
            v-model='ruleForm.address'
            placeholder="点我可以搜索!!!"
            :options="options"
            filterable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="addressnote">
          <el-input placeholder='再多告诉人家一点嘛 qwq' v-model="ruleForm.addressnote"></el-input>
        </el-form-item>
        <el-form-item label="联系类型" prop="type">
          <el-radio-group v-model="ruleForm.type">
            <el-radio label="QQ"></el-radio>
            <el-radio label="微信"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input  v-model="ruleForm.contact"></el-input>
        </el-form-item>
        <el-form-item label="支付类型" >
          <el-radio-group v-model="ruleForm.payType">
            <el-radio label="支付宝"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="性别" prop="age">
          <el-radio-group v-model="ruleForm.age">
            <el-radio label="小哥哥"></el-radio>
            <el-radio label="小姐姐"></el-radio>
            <el-radio label="无"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input placeholder='告诉我你的需求鸭!!'  type="textarea" v-model="ruleForm.note"></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">当场保存!</el-button>
          <span> 保存后下次就能不用重新填了!</span>
        </el-form-item> -->
      </el-form>
    </div>
    <div style="margin: 15px;float: right;">
      <span style="margin-right: 15px;color:#c24f4a">价格:¥{{priceNum}}</span>
      <el-button type="warning"  @click="getAlipay()">走吧,离离带你去下单哦!</el-button>
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
  </div>
</template>
<style lang="scss">
.list{
  margin: 5px;
  border-radius: 5px;
  padding: 5px;
  border: 1px solid rgba(0,0,0,.2);
  .getitem{
    margin: 5px;

  }
}
.info{
  margin: 5px;
  border-radius: 5px;
  padding: 5px;
  border: 1px solid rgba(0,0,0,.2);

}
</style>
<script>
let Clipboard = require('clipboard')
let address = require('../config/address.js').default.address;
address.forEach( function(element, index) {
  element.value=element.label
  if(element.children){
    element.children.forEach( function(element2, index2) {
      element2.value=element2.label;
      element2.children=[]
      if(element2.area){
        element2.area.forEach( function(element3, index3) {
          element2.children.push({
            value:element3,
            label:element3
          })
        });
      }
    });
  }
});
export default {
    data() {
      return {
        dialogVisible:false,
        url:"",
        list:[],
        options:address,
        priceNum:0,
        ruleForm: {
          name: '',
          age:'无',
          note: '',
          contact:'',
          type:'QQ',
          payType:'支付宝',
          phone:'',
          address:[],
          addressnote:''
        },
        rules: {
          addressnote:[
            { required: true, message: '详细一点啦!!!', trigger: 'blur' }
          ],
          address:[
            { required: true, message: '我要把你扛回家!!!', trigger: 'blur' }
          ],
          phone:[
            { required: true, message: '请告诉我手机号吧!!!', trigger: 'blur' }
          ],
          contact:[
            { required: true, message: '请告诉我联系方式吧!!!', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '一定要名称鸭!!!', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    created(){
      
    },
    mounted(){
      // console.log(this.$route.params)
      if(this.$route.params.list){
        this.list=this.$route.params.list
      }else{
        this.$router.replace({name:"payment"})
      }
      if(localStorage.address){
        try {
          this.ruleForm = JSON.parse(localStorage.address)
        } catch(e) {}
      }
      this.loadCopy();
    },
    methods: {
      paysuccess(){
        this.$confirm('已经支付完毕?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message.success('谢谢宠幸鸭qwq!')
          this.dialogVisible=false
          this.next()
        }).catch(() => {
          this.$message.error('再检查看看吧qwq!')
        });
      },
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
      getAlipay(){
        if(!this.submitForm('ruleForm'))
          return
        // if(this.submitForm)
          // retu¸Z
        var list=[]
        this.list.forEach( function(element, index) {
          list.push({
            id : element.id,
            num : element.num,
            index : element.list
          })
        });
        this.$refs['ruleForm'].validate((valid) => {
          this.$api.post('/goodsalipay',{
            list:list,
            userInfo:this.ruleForm
          },(data)=>{
            if(data.msg && data.msg.url){
              var href = 'https://openapi.alipay.com/gateway.do?'
              href+= data.msg.url
              window.open(href, "_blank");
              this.url=href
              this.dialogVisible=true
              this.delShopingCart();
            }else if(data.msg){
              this.$message({
                message:"下单成功鸭!\(^o^)/",
                type:'success'
              })
              this.delShopingCart();
              this.next()
            }
            // window.open(href);
            
          })
        });
      },
      delShopingCart(){
        let ShoppingCart=[]
        try {
          ShoppingCart=JSON.parse(localStorage.ShoppingCart)
        } catch(e) {}
        for (var i = 0; i < this.list.length; i++) {
          let item = {
            id: this.list[i].id,
            list: this.list[i].list,
            num: this.list[i].num
          }
          for (var j = ShoppingCart.length - 1; j >= 0; j--) {
            let item2 = ShoppingCart[j]
            if(JSON.stringify(item2)==JSON.stringify(item)){
              ShoppingCart.splice(j,1)
            }
          }
        }
        localStorage.ShoppingCart=JSON.stringify(ShoppingCart)
        this.list=[]
      },
      next(){
        setTimeout(()=>{
          this.$router.push({
            name:'selgoods'
          })
        },2000)
      },
      submitForm(formName) {
        let isTrue=false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            localStorage.address=JSON.stringify(this.ruleForm)
            this.$message({
              message:"保存成功!\(^o^)/",
              type:'success'
            })
            isTrue=true
          } else {
            this.$message({
              message:"有东西没填上哦!",
              type:'error'
            })
            return false;
          }
        });
        return isTrue
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    watch:{
      list(list){
        console.log(list)
        let priceNum=0
        list.forEach( function(element, index) {
          priceNum += element.price * element.num
        });
        this.priceNum=priceNum
      }
    }
  }
</script>
