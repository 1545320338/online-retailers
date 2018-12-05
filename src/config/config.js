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
export default{
	v:'1.0',
	isTop:isTop,
  router:{
    helloword:'/#/helloword'
  }
}