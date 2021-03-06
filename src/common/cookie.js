function setCookie(cname,cvalue,exdays){
  var d = new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  var expires = "expires="+d.toGMTString();
  document.cookie = cname + "=" + encodeURIComponent(cvalue) + "; " + expires+";path=/";
}

function getCookie(cname){
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return decodeURIComponent(c.substring(name.length,c.length));
  }
  return "";
}
function getOrderCookie(cname){
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=ca.length-1; i>0; i--) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return decodeURIComponent(c.substring(name.length,c.length));
  }
  return "";
}

export default {
  setCookie,
  getCookie,
  getOrderCookie
}