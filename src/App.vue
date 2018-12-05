<template>
  <div id="app" :style="style">
  	<transition name="bounce" mode="out-in">
    	<router-view ></router-view>
    </transition>
  </div>
</template>
<style type="text/css">

.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
<script>
// import config from 'config/config.js'
export default {
  name: 'app',
  data(){
    return {
      style:'height:100%'
    }
  },
  created(){
    var isTop=true
    if (window.top !== window.self) { // are you trying to put self in an iframe?  
      try {  
        if (window.top.location.host) { // this is illegal to access unless you share a non-spoofable document domain  
          // fun times  
          isTop=false
        } else {  
           // chrome executes this  
        }  
      } catch (ex) {  
         // everyone executes this  
      }  
    }
    if(!isTop)
    this.style=''
  }
}
</script>

<style lang="scss">
  @import "./style/style";
</style>
