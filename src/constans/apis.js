const IN_DEVELOPMENT = process.env.NODE_ENV === 'development'
const DOMAIN = process.constants.DOMAIN;

let DATA = {
    // 接口域名
    domain: DOMAIN,
    // 成功状态码
    successStatus: 1,
    apis: {
        // 按页面区分链接
        home: {
            getData : filterApi('/mock/5b1d1b2c46416950933ee518/xsy/getData')
        }
    }
}

// 配合本地服务器的代理功能，'/api'开头的链接会进入域名代理，防止跨域
function filterApi(src){
    if(IN_DEVELOPMENT){
        return '/api' + src ;
    }else{
        return DOMAIN + src ;
    }
};

export default DATA;