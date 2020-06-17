const baseConfig = require('./config.base')

const config = {
    dist:'./dist',
    htmlDist: './dist',
    // assetsPublicPath: './'
    assetsPublicPath: `/`,
}
module.exports = Object.assign({},baseConfig,config)