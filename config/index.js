const isProduction = process.env.NODE_ENV === 'production';
let config = isProduction? require('./config.prod') : require('./config.dev');
module.exports = config;

/**
 * some auto-create-function
 */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const ExtractRootCss = new ExtractTextPlugin({filename:`styles/[name].root.[chunkhash].css`,allChunks:true});
const ExtractVueCss = new ExtractTextPlugin({filename:'styles/[name].vue.[chunkhash].css',allChunks:true});

//自动生成HTML模板
const createHTMLTamplate = function(obj){
    let htmlList = [];
    let pageList = obj;
    for(let key in pageList){
        const title = Array.isArray(pageList[key])&&pageList[key][1]
            ?pageList[key][1].toString()
            :(config.defaultTitle||'');
        const hadChunks = Array.isArray(pageList[key]) ? pageList[key][0].toString()
            : pageList[key].toString();
        htmlList.push(
            new HtmlWebpackPlugin({
                filename: path.resolve(__dirname,'../',`${config.htmlDist}/${key}.html`),
                title:title,
                template:path.resolve(__dirname,`../src/views/${key}.html`),
                chunks:hadChunks?[key,'vender','manifest','common']:['vender','manifest','common'],
                chunksSortMode: 'dependency'
            })
        )
    }
    return htmlList
}
//设置多入口
const setEntry = function(obj){
    let entry = {};
    let pageList = obj;
    for(let key in pageList){
        if(Array.isArray(pageList[key]) && pageList[key][0]){
            if(!pageList[key][0])continue;
            entry[key] = path.resolve(__dirname,'../'+pageList[key][0].toString());
        }else{
            if(!pageList[key])continue;
            entry[key] = path.resolve(__dirname,'../'+pageList[key].toString());
        }
    }
    return entry
}
//设置样式预处理器
const cssRules = {
    less: {name:'less'},
    sass: {name:'sass', options:{indentedSyntax: true}},
    scss: {name:'sass'},
    stylus: {name:'stylus'},
    styl: {name:'stylus'}
}
const cssLoaders = function(options){
    options = options || {}

    const loaderList = options.loaders
    const ExtractCss = options.isRootCss ? ExtractRootCss : ExtractVueCss;
    const cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: options.sourceMap
        }
    }

    const postcssLoader = {
        loader: 'postcss-loader',
        options: {
            sourceMap: options.sourceMap
        }
    }
    const frontLoader = options.usePostCSS ? [cssLoader,postcssLoader]:[cssLoader]
    let loaders = {};
    if(loaderList.indexOf('css') === -1)loaderList.unshift("css")
    loaderList.forEach(element => {
        const loaderOptions = cssRules[element]&&cssRules[element].options;
        const loaderName = cssRules[element]&&cssRules[element].name;
        let arr = element==="css" ? [] : [{
            loader: loaderName+"-loader",
            options: Object.assign({}, loaderOptions, {
                sourceMap: options.sourceMap
            })
        }]
        if(options.Extract){
            loaders[element] = ExtractCss.extract({
                use: frontLoader.concat(arr),
                fallback: 'vue-style-loader' 
            })
        }else{
            loaders[element] = ['vue-style-loader'].concat(frontLoader,arr)
        }
    });
    if(options.Extract){
        module.exports.plugins = (module.exports.plugins || []).concat([ExtractRootCss,ExtractVueCss]);
    }

    return loaders
}
const styleLoaders = function(options){
    options.isRootCss = true;
    let output = [];
    const loaders = cssLoaders(options);

    for (const extension in loaders) {
        let loader = loaders[extension]
        output.push({
          test: new RegExp('\\.' + extension + '$'),
          use: loader
        })
    }
    return output
}
module.exports.plugins = (module.exports.plugins || []).concat(
    createHTMLTamplate(config.pages)
);
module.exports.entry = setEntry(config.pages);
module.exports.styleLoaders = styleLoaders({
    loaders: config.cssLoader.split('!'),
    sourceMap : config.sourceMap,
    usePostCSS : config.usePostCSS,
    Extract : isProduction&&config.toExtractCss,
});
module.exports.cssLoaders = cssLoaders({
    loaders: config.cssLoader.split('!'),
    sourceMap : config.sourceMap,
    usePostCSS : isProduction&&config.usePostCSS,
    Extract : isProduction&&config.toExtractCss,
});
module.exports.htmlLoader = config.useHtmlLoader?[{
    test: /\.(htm|html)$/i,
    loader: 'html-loader'
}]:[];