process.env.NODE_ENV = 'development'
const path = require('path')
const config = require('../config')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require("./webpack.config.js")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const webpackConfig = merge(baseWebpackConfig,{
    devtool : '#eval-source-map',
    output:{
        path:path.resolve(__dirname,'../',config.dist || './dist'),
        filename:"js/[name].js",
        publicPath:config.assetsPublicPath || '/'
    },
    devServer : {
        clientLogLevel: 'warning',
        historyApiFallback: true,
        hot: true,
        compress: true,
        host: HOST || config.host,
        port: PORT || config.port,
        open: config.autoOpenBrowser,
        inline:true,
        publicPath:config.assetsPublicPath || '/',
        public: config.devPublic || '',
        proxy:config.proxy
    },
    plugins : [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"',
            }
        })
        
        // new webpack.HotModuleReplacementPlugin()
    ].concat(config.bundleAnalyzer ? [
        // bundle分析
        new BundleAnalyzerPlugin()
    ] : [])
})
module.exports = webpackConfig;