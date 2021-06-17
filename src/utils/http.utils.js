import Qs from 'qs'
import axios from 'axios'
import Logger from './logger.utils'

const $http = axios.create({
    timeout: 20000,
    baseURL: window.izCtx,
    headers: {
        Authorization: 'session', // 授权类型为 session
        'x-requested-with': 'XMLHttpRequest' // 是否是ajax请求
    },
    paramsSerializer: (params) => {
        return Qs.stringify(params, {arrayFormat: 'indices', allowDots: true})
    }
})

$http.interceptors.request.use(
    config => {
        return config
    },
    error => { // 请求错误处理
        Promise.reject(error)
    }
)

$http.interceptors.response.use(
    response => { // 成功请求到数据
        // 这里根据后端提供的数据进行对应的处理
        let data = response.data
        if (data.code === 500) {
            Logger.errorLog(data);
            throw new Error(data.message)
        } else if (data.code === 200) {
            let datum = data['data'];
            datum['IzMsg'] = data['message'];
            datum['IzCode'] = data['code'];
            return datum
        } else {
            throw new Error(`未知的错误状态：${data}`)
        }
    },
    error => { // 响应错误处理
        let errMsg = error;
        if (error.code === 'ECONNABORTED') {
            errMsg = '访问超时,请检查网络'
        } else {
            let response = error.response
            if (response.status === 401) {
                if (parent) parent.location.reload()
                else location.reload()
            } else if (response.status === 404) {
                errMsg = '您请求的功能不存在或没有权限!';
            }
        }
        return Promise.reject(errMsg)
    }
)
export default $http
