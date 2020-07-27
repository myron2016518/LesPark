import Vue from 'vue'
import axios from 'axios';
import jsonp from 'jsonp';
import CONSTANS from 'Constans';
import cookie from 'Common/cookie';
import ajax from 'Common/ajax';
const successStatus = CONSTANS.APIS.successStatus;
const appid = '1255310861';
const bucket = 'edumap';
const Region = 'ap-guangzhou';
var that = this

function is_login () {
  let token = cookie.getCookie('lespark_token');
  let user_id = cookie.getCookie('lespark_user_id');

  if (token == null || token == '') {
    alert('登录状态失效,请重新登陆')
  }
  if (user_id == null || user_id == '') {
    alert('登录状态失效,请重新登陆')
  }

}

function liveStartisLogin () {
  let token = cookie.getCookie('lespark_token');
  let user_id = cookie.getCookie('lespark_user_id');
  if (token == null || token == '' || user_id == null || user_id == '') {
    return false;
  } else {
    return true;
  }
}

function getQueryString (name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null)
    return unescape(r[2]);
  return "";
}

/**
 * 解析查询字符串，返回包含所有参数的对象
 */
function getQueryStringArgs () {
  var qs = (location.search.length > 0) ? location.search.substring(1) : "",
    args = {},
    items = qs.length > 0 ? qs.split("&") : [],
    item = null,
    name = null,
    value = null;
  items.map((arg, index) => {

    let _sub = '=', _v = '';
    let _urlindex = arg.indexOf(_sub)
    _v = arg.substring(_urlindex + _sub.length, arg.length);
    _v && (value = decodeURIComponent(_v));

    item = arg.split("=");
    name = decodeURIComponent(item[0]);
    // value = item[1] && decodeURIComponent(item[1]);
    if (name.length) {
      args[name] = value;
    }
  })
  return args;

}

function getNowTime () {
  var now = new Date();
  var time = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
  return time + " 00:00:00";
}

function getNowTimeHM () {
  var now = new Date();
  var time = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate() + " " + now.getHours() + ":" + now.getMinutes();
  return time;
}

//返回年月日  00：00:00 格式：04/30：00:00:00
function formatDayTime (time) {
  var time_format = time.replace(/-/g, '/');
  var now = new Date(time_format + ":00");
  var time = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
  return time + " 00:00:00";
}

function ieVersion () {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串

  var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器

  if (isIE) {
    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp["$1"]);
    if (fIEVersion == 9) {
      // console.log("当前IE版本为9")
      cookie.setCookie("ie", "9")
    } else if (fIEVersion > 9) {
      // console.log("大于9版本可正常使用")
    } else {
      cookie.setCookie("ie", "9")
      alert("请将IE浏览器升级到IE9版本")
    }
  } else { }
}

// 数据转化  
function formatNumber (n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 时间格式化
function formatTime (number, format) {
  if (!number) return '--'

  const formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  let returnArr = [];
  const date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (const i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

export default {
  getQueryString,
  getQueryStringArgs,
  getNowTime,
  getNowTimeHM,
  formatDayTime,
  is_login,
  ieVersion,
  liveStartisLogin,
  formatTime
}