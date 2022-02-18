import Qs from 'qs'
import axios from 'axios'
import Logger from './logger.utils'
import Global from '../components/global.config' // 全局配置

const $http = axios.create({
    timeout: Global.timeout,
    baseURL: Global.izCtx,
    headers: {
        ApiForm: 'Ivzone',
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
            Logger.errorNELog('响应失败', '请检查服务端接口', data);
            return Promise.reject(data.message)
        } else if (data.code === 200) {
            let datum = data['data'];
            datum['IzMsg'] = data['message'];
            datum['IzCode'] = data['code'];
            return datum
        } else {
            Logger.errorNELog('响应失败', '未知情况', response);
            return Promise.reject(`糟糕, 未知错误！`)
        }
    },
    error => { // 响应错误处理
        let errMsg = error;
        if (error.code === 'ECONNABORTED') {
            errMsg = '访问超时,请检查网络'
        } else {
            let response = error.response
            if (response.status === 401) {
                let data = response.data;
                let loginUrl = data.message;
                window.parent.location.href = loginUrl;
            } else if (response.status === 404) {
                errMsg = '您请求的功能不存在!';
            } else if(response.status === 403) {
                errMsg = '您没有权限访问此功能!';
            }
        }

        return Promise.reject(errMsg)
    }
)
export default $http
