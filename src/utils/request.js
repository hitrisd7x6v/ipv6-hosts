import Qs from 'qs';
import axios from 'axios'
import router from '@/router'
import {msgError} from "@/utils/message";

let baseURL = "http://localhost:3000/api";
// 以下是生产环境配置
if(import.meta.env.PROD) {
    baseURL = "";
}

let baseConfig = {
    baseURL: baseURL,
    contentType: 'application/json;charset=UTF-8',
    // 成功响应码
    success: 200,
    //消息框消失时间
    duration: 3000,
    //超时时间
    timeout: 20000,
}

/**
 * @description 处理code异常
 * @param {*} code
 * @param {*} msg
 */
const handleResponse = (code, msg) => {
    switch (code) {
        case 401: // 未授权
            router.push({ path: '/login' }).catch(() => {});
            break;
        case 500:
            msgError(msg)
            break;
        case 404:
            msgError("资源没找到(404)")
            break;
        default:
            msgError(msg);
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
        config['autoMsg'] = true; // 自动提示消息
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    (response) => {

        const { data, config } = response
        const { code, message } = data

        // 是否操作正常
        if (code == baseConfig.success) {
            return data
        } else {
            if(config['autoMsg']) {
                handleResponse(code, message)
            }

            return Promise.reject(`请求失败: ${JSON.stringify({ url: config.url, code, message })}`)
        }
    },
    (error) => {
        const { response, message } = error

        if (response && response.data) {
            const { status, data, config } = response
            if(config['autoMsg']) {
                handleResponse(status, data.message || message)
            }

            return Promise.reject(data.message || message)
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
export {GET, POST, baseURL, instance as http}

export default instance
