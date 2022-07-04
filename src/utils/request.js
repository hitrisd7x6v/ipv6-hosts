import Qs from 'qs';
import axios from 'axios'
import router from '@/router'
import {msgError} from "@/utils/message";
let baseURL = "";
if(import.meta.env.PROD) {
    baseURL = ""
} else {
    baseURL = 'http://localhost:3000/api';
}

let baseConfig = {
    baseURL: baseURL,
    contentType: 'application/json;charset=UTF-8',
    //消息框消失时间
    duration: 3000,
    //超时时间
    timeout: 5000,
    // 成功响应码
    success: 200,
    // 未授权
    unauthorized: 401,
    // 无权限
    notAccess: 403,
    // 找不到页面
    notPage: 404,
    // 服务端异常
    error: 500
}

/**
 * @description 处理code异常
 * @param {*} code
 * @param {*} msg
 */
const handleResponse = (code, msg) => {
    switch (code) {
        case baseConfig.unauthorized: // 未授权
            router.push({ path: '/login' }).catch(() => {});
            break
        case baseConfig.notAccess: // 无权限访问
            router.push({path: '/403'}).catch(()=>{});
            break
        case baseConfig.notPage:
            router.push({path: '/404'}).catch(()=>{})
            break
        case baseConfig.error:
            msgError(msg || `接口异常`)
            console.error(`后端异常：${msg}`)
            break;
        default:
            msgError(`未知错误`)
            console.error(`未知错误：${msg}`)
            break
    }
}

const instance = axios.create({
    baseURL: baseConfig.baseURL,
    timeout: baseConfig.timeout,
    headers: {
        Authorization: 'session', // 授权类型为 session
        'x-requested-with': 'XMLHttpRequest', // 是否是ajax请求
        'Content-Type': baseConfig.contentType,
    },
    paramsSerializer: (params) => {
        return Qs.stringify(params, {arrayFormat: 'indices', allowDots: true})
    }
})

instance.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    (response) => {

        const { data, config } = response
        const { code, msg } = data

        // 是否操作正常
        if (code == baseConfig.success) {
            return data
        } else {
            handleResponse(code, msg)
            return Promise.reject(`请求异常: ${JSON.stringify({ url: config.url, code, msg })}`)
        }
    },
    (error) => {
        const { response, message } = error

        if (response && response.data) {
            const { status, data } = response
            handleResponse(status, data.msg || message)
            return Promise.reject(error)
        } else {
            let { message } = error
            if(message === 'Network Error') {
                message = '网络连接异常'
            } else if(message.includes('timeout')) {
                message = '接口请求超时'
            } else if(message.includes('Request failed with status code')) {
                const code = message.substr(message.length - 3)
                message = `后端接口[${code}]异常`
            }
            msgError(message || `后端接口异常`)
            return Promise.reject(error)
        }
    }
)

let GET = instance.get;
let POST = instance.post;
export {GET, POST}

export default instance
