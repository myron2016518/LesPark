import axios from 'axios';
import jsonp from 'jsonp';
import CONSTANS from 'Constans';
const successStatus = CONSTANS.APIS.successStatus;

function Get(options) {
    const {
        url,
        type = 'get',
        dataType = 'json',
        headers,
        data = {},
        mock
    } = options;
    return new Promise((resolve, reject) => {
        if (mock) return resolve(mock);
        axios({
            ...options,
            url,
            method: type,
            data,
            dataType,
            headers,
        }).then((res) => {
            let data = res.data;
            resolve(data);

        }).catch((error) => {
            reject(error);
        })
    })
}

function Post(options) {
    const {
        url,
        type = 'post',
        dataType = 'json',
        data = {},
        headers,
        mock
    } = options;
    return new Promise((resolve, reject) => {
        if (mock) return resolve(mock);
        let opt = {
            ...options,
            url,
            method: type,
            data,
            dataType,
            headers,
            transformRequest: [function (data) {
                // axios 在 'Content-Type' 为 'application/x-www-form-urlencoded' 时，Form Data 参数会变为 string 类型
                // 发送数据前，将请求参数转换为 json 对象（transformRequest 允许在向服务器发送前，修改请求数据）
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
        }
        axios(opt)
            .then(function (res) {
                let data = res.data;
                if (data.error == 0) {
                    resolve(data);
                } else {
                    toFail(data);
                    reject(data);
                }
            })
            .catch(function (res) {
                reject(res);
            });
    })
}

function Ajax(options) {
    const {
        url,
        type = 'get',
        dataType = 'json',
        data = {},
        mock
    } = options;
    return new Promise((resolve, reject) => {
        if (mock) return resolve(mock);
        axios({
            traditional: true,
            ...options,
            headers: {
                'Content-Security-Policy': "frame-ancestors 'self' http://www.growingio.com https://www.growingio.com"
            },
            url: url,
            method: type,
            data,
            dataType
        }).then((res) => {
            let data = res.data;
            if (data.error == 0) {
                resolve(data);
            } else {
                toFail(data);
                reject(data);
            }
        }).catch((error) => {
            reject(error);
        })
    })
}

function Jsonp(options) {
    const {
        url,
        data,
        mock
    } = options;
    return new Promise((resolve, reject) => {
        if (mock) return resolve(mock);
        if (data) console.log('data请直接以query的形式写到url上：', '参考文档 https://www.npmjs.com/package/jsonp');
        let opt = {
            ...options,
        };
        jsonp(url, opt, (err, data) => {
            if (err) {
                console.error(err.message);
                reject(error.message);
            } else {
                if (data.status.succeed === successStatus) {
                    resolve(data);
                } else {
                    toFail(data);
                    reject(data);
                }
            }
        });
    })
}
// 错误统一处理
function toFail(data) {
    console.log('in fail:', data);
}
export default {
    Jsonp,
    Get,
    Post,
    Ajax
}