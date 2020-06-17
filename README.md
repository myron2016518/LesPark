# 配置与打包说明

## Start up

安装项目依赖
```
npm install
```
运行开发环境
```
npm run dev
```
打包生成代码
```
npm run build
```

## 1 npm script 说明
> clean : 清理打包目录

> dev : 开发调试环境

> build : 生成测试版代码包

> watch : 实时生成测试代码

## 2 项目名称
package.json 的 name对应项目名

每次新建项目时要设置项目名称，名称也同时对于七牛上的目录名。

## 3 文件路径规范
开发目录路径如下
```
src
┣━━common
┣━━constans
┣━━router
┣━━store
┣━━views
┃  ┣━━components
┃  ┣━━css
┃  ┣━━images
┃  ┣━━js
┃  ┣━━pages
┃  ┃   ┗━━home
┃  ┃      ┣━━app.vue
┃  ┃      ┗━━index.js
┃  ┃   ┗━━live
┃  ┃   ┗━━live_start
┃  ┣━━router
┃  ┣━━sdk
┃  ┣━━store
┃  ┗━━index.html
┃  ┗━━live.html
┃  ┗━━live_start.html
static
┣━━img
┣━━js
┃...
```
1. common：公共文件目录
2. constans：全局常量目录
3. router：vue-router 前端路由目录（按需使用）
4. store：vuex 状态管理目录（按需使用）
5. views：视图目录，也就是页面开发主目录
    1. components： 共用的vue组件目录
    2. css：样式
    3. images： 图片
    4. pages：压面目录
        * home 首页开发目录
            - index.js 本页面的入口文件
    5. index.html: 首页HTML模板
6. static：静态资源目录(不用进入webpack进行过滤的资源文件)


## 4 webpack入口设置（多入口配置）
多页面开发需要配置多入口，webpack规定js文件为入口文件，从入口文件建立依赖树进行模块的打包。

对应pages/[dir]目录下的入口文件, 到`config/config.base.js`的config里面手动设置入口，如下
```
const config = {
    ...
    pages:{
        index:'./src/views/pages/home/index.js',
        page2:'./src/views/pages/page2/index.js'
    }
    ...
}
```
`pages[key]` , `key` 一定要和 `src/views` 下的 .html文件 名字一样，因为打包出来的html文件就是以`key`命名。

## 5 webpack其他配置项
`config/config.base.js` <br>webpack基础配置文件，是对webpack 进行统一配置的配置文件

`config/config.dev.js` <br>webpack开发环境配置文件（可覆盖base）

`config/config.prod.js` <br>webpack生产环境配置文件（可覆盖base）

具体配置项的说明请详细查阅`config.base.js`内的注释
#### 举例说明：
* dist： 代码生成目录
* pages： 多面手动配置页面列表
* constants： webpack环境全局常量
    - DOMAIN： api接口域名

* htmlDist：html目录

* assetsPublicPath： 资源前缀
* alias 目录前缀，用于文件应用的简写

* proxy 本地域名代理，防止跨域
```
proxy: {
    '/api':{
        target: "https://www.easy-mock.com",
        pathRewrite: {"^/api" : ""},
        changeOrigin: true
    },
}
```
通过带'/api'前缀的链接，接口就会通过webpack-dev-sever服务器代理带'https://www.easy-mock.com'域名下。

`target:'https://www.easy-mock.com'` 是测试环境域名，上面`DOMAIN`是正式环境的域名，
`DOMAIN`一定要正确不然生产环境的接口就不能指向正确的域名。

例如： `ajax.get('/api/getData')`实际就是向`https://www.easy-mock.com/getData`链接发出GET请求

## 6 公共模块（中间件）说明
### 1 ajax异步模块
异步模块的主目录在`src/common/ajax.js`

封装了 Get Post Jsonp Ajax 四个方法

例：
```
ajax.Get({
    url:'https://www.easy-mock.com/mock/5b1d1b2c46416950933ee518/xsy/getData'
}).then(res=>{
    console.log(res);
}).catch(res=>{
    console.log(res);
})
```

api接口链接统一配置文件 `/src/constans/apis.js`
```
let DATA = {
    // 成功状态码
    successStatus: 1,
    apis: {
        // 按页面区分链接
        home: {
            getData : filterApi('/mock/5b1d1b2c46416950933ee518/xsy/getData')
        }
    }
}
```
```
import API from 'Constans/apis.js'
ajax.Get({
    url: API.home.getData
})
```
successStatus 成功的状态码，和接口返回的状态码相同时进入异步方法的成功回调，反之进入失败回到

filterApi 过滤链接，配合上面的proxy域名代理给链接带上`'/api'`前缀。

> `src/common/ajax.js` 代码最下面有toFail方法是接口错误统一处理方法，安装业务需求可以自行进行设置
```
// 错误统一处理
function toFail(data) {
    console.log('in fail:',data);
}
```

### 2 cookie操作模块
cookie操作模块的主目录在`src/common/cookie.js`

例子：

```
//设置cookie 第三参数书有效期
cookie.setCookie('cookieOne','test',30)

//获取cookie
cookie.getCookie('cookieOne')
```
