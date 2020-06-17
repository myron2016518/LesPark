const baseConfig = require('./config.base');

const config = {
  dist: './dev',
  htmlDist: './dev',
  assetsPublicPath: '/',
  // 代理相关文档：https://github.com/nodejitsu/node-http-proxy#options
  proxy: {
    '/api': {
      // target: "https://www.easy-mock.com",
      // target: "http://test.lespark.cn",
      target: "http://www.lespark.cn",
      pathRewrite: { "^/api": "" },
      changeOrigin: true
    },
    '/testlala': {
      target: "http://test.lespark.cn",
      pathRewrite: { "^/testlala": "" },
      changeOrigin: true
    },
    '/svga': {
      target: "https://h5.mythinkcar.cn",
      changeOrigin: true
    },
  }
}
module.exports = Object.assign({}, baseConfig, config)