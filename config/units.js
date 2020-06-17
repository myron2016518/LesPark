const path = require('path');

// 获取文件绝对地址
function resolvePath(src){
    return path.resolve(__dirname,'../',src);
}

module.exports ={
    resolvePath
}  