const package = require("../package.json");
const resolvePath = require("./units").resolvePath;
const isProduction = process.env.NODE_ENV === 'production';

const config = {
  // 以下所有地址都以项目根目录为相对地址
  dist: './dist',
  // 入口列表
  pages: {
    'index': './src/views/pages/home/index.js',
    'live': './src/views/pages/live/index.js',
    'live_start': './src/views/pages/live_start/index.js',
    'withdraw': './src/views/pages/withdraw/index.js',
    'topic': './src/views/pages/topic/index.js',
    'userinfo': './src/views/pages/userinfo/index.js',
    'loginhome': './src/views/pages/loginhome/index.js',
  },
  // 全局常量 在页面通过process.constants获取，一定要以'"constant"'形式赋值
  constants: {
    DOMAIN: `"http://wx.lespark.cn"` //链接请求头
  },
  // 页面第三方依赖
  externals: {
    'jquery': 'window.jQuery'
  },

  /** html */
  // html生成的目录
  htmlDist: `${isProduction ? './dist' : './dev'}`,
  // 使用了html-loader 对html文件内的img文件交给对应的loader加载
  useHtmlLoader: false,

  /** css */
  // 记得预先安装对应loader
  // cssLoader : 'less!sass',//可以用!号添加多个css预加载器
  cssLoader: 'scss',
  // 需要提前安装postcss-loader
  usePostCSS: true,
  // 把代码抽取合并
  toExtractCss: true,

  /** assetsPath */
  // 资源前缀、可以写cdn地址
  assetsPublicPath: `/`,
  // 创建的的静态资源目录地址
  assetsSubDirectory: 'static',
  // 目录前缀
  alias: {
    'Common': resolvePath('src/common'),
    'Constans': resolvePath('src/constans'),
    'Views': resolvePath('src/views'),
    'Components': resolvePath('src/views/components'),
    'static': resolvePath('static'),
  },

  /** dev-srver */
  host: 'localhost', // can be overwritten by process.env.HOST
  // host: 'http://192.168.199.210:8080/',
  port: 8181, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
  devPublic: null, // 映射的域名
  autoOpenBrowser: true,
  // 代理相关文档：https://github.com/nodejitsu/node-http-proxy#options
  proxy: {
    '/api': {
      target: "http://wx.lespark.cn",
      pathRewrite: {
        "^/api": ""
      },
      changeOrigin: true
    },
  },
  bundleAnalyzer: false, // 包依赖统计工具

  /** other */
  uglifyJs: true,
  sourceMap: true,
  plugins: []
}

module.exports = config;