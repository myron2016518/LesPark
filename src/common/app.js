import Vue from 'vue'
import axios from 'axios';
import jsonp from 'jsonp';
import CONSTANS from 'Constans';
const successStatus = CONSTANS.APIS.successStatus;

Vue.config.silent = false; // 取消 Vue 所有的日志与警告。开发版本默认为 false，生产环境设置为 true
Vue.config.devtools = true; // 是否允许 vue-devtools 检查代码。开发版本默认为 true，生产版本默认为 false
Vue.config.productionTip = true; // 设置为 false 以阻止 vue 在启动时生成生产提示。默认为 true
//获取安全令牌
(function () {
    let token_key = new Object();
    token_key = GetRequest();
    if ((token_key.key) != null || (token_key.key) != undefined) {
        localStorage.setItem('key', token_key.key);
    }
    let key = localStorage.getItem('key');

    let nickname = new Object();
    nickname = GetRequest();
    if ((nickname.nickname) != null || (nickname.nickname) != undefined) {
        localStorage.setItem('nickname', nickname.nickname);
    }

    if(token_key.checkLogin !=0 ) console.log(12);
    
})();
//获取安全令牌end

//全局变量==============================================================
const domainName = 'http://stdmap.clarc.cn';//接口环境
// const domainName = 'https://8817102402.klark.cn';//接口环境
const appid = '1255310861';
const bucket = 'edumap';
const Region = 'ap-guangzhou';
const jigouImg = '/resource/institution/img/';
const jigouAvi = '/resource/institution/video/';
const CorLImg = '/resource/course/img/';
const CorLAvi = '/resource/course/video/';
let Request = new Object();
Request = GetRequest();
let successCallBack = function (result) {
};
let errorCallBack = function (result) {
    alert("上传失败!请重新选择图片");
};
let progressCallBack = function (curr) {
    let currrent = curr * 100;
    if (document.getElementById("progressBar")) {
        let pb = document.getElementById("progressBar");
        pb.value = Math.round(currrent);
        // if (Math.round(currrent) >= 100) {
        //     $('#progressBar').remove();
        // }
    }
};

//全局变量end===========================================================

//全局函数==============================================================

/**
 * 判断用户是否登录
 */
function is_login(){
    let key = localStorage.getItem('key');
    let name = localStorage.getItem('nickname')
    console.log(key);
    console.log(name);
    if(key == 'null' || name == 'null' || key == undefined || name == undefined){
        location.href = '/login.html?from=org';
    }
}
/**
 * 得到域名后的参数
 * @returns {Object}
 * @constructor
 */
function GetRequest() {
    let url = location.search;//获取url中"?"符后的字串
    url = decodeURI(url);
    let theRequest = new Object();
    if (url.indexOf("?") != -1) {
        let str = url.substr(1);
        let strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
/**
 * 得到唯一的文件名
 * @returns {string}
 */
function getGuid() {
    let guid = '';
    $.ajax({
        async: false,
        type: "get",
        url: domainName + "/institution/getguid",
        dataType: "json",
        data: "",
        success: function (data) {
            guid = data.data;
        }
    });
    return guid;
}
/**
 * 登录信息过期统一提示
 * 
 */
function toLogin(){
    //alert("登录信息已过期，请重新登录");
    location.href = '/login.html?from=org';
}

//返回首页
//回到首页
function backToHome(){
    console.log('backHome');
     window.location.href ='/';
}


function fetchItem(name){
    return window.localStorage.getItem(name);
}
  
function saveItem(name,value){
    // if(!typeof value != 'String'){
    //         value =  JSON.stringify(value);
    // }
    console.log('save',value);
    window.localStorage.setItem(name,value);
}
//全局函数end===========================================================

// 获取页面请求 GET 参数，后续访问使用 $_GET 变量
let $_GET = (function () {
    let url = window.document.location.href.toString();
    let u = url.split("?");
    if (typeof(u[1]) == "string") {
        u = u[1].split("&");
        let get = {};
        for (let i in u) {
            let j = u[i].split("=");
            get[j[0]] = j[1];
        }
        return get;
    } else {
        return {};
    }
})();

// 开发版本下 console 部分关键信息（上线后更改配置以阻止生产提示）
if (Vue.config.productionTip == true) {
    console.log('Vue.config =>', Vue.config);
    console.log('$_GET =>', $_GET);
}

//得到url的参数
function getQueryString(name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return unescape(r[2]); 
    return null; 
} 

export default{
    is_login,
    GetRequest,
    getGuid,
    toLogin,
    backToHome,
    fetchItem,
    saveItem

}
