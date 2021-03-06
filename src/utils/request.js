import Qs from 'qs';
import axios from 'axios'
import router from '@/router'

let baseURL = "/api"
let baseConfig = {
    baseURL: baseURL,
    // 成功响应码
    success: 200,
    //消息框消失时间
    duration: 3000,
    //超时时间
    timeout: 20000,
}

/**
 * @description 处理code异常
 * @param {*} data
 * @param {*} config
 */
const handleResponse = (data, config) => {
    let {code, message} = data
    switch (code) {
        case 401: // 未授权
            router.push({ path: '/login' }).finally(() => {});
            return null;
        case 404:
            return Promise.reject(data);
        default: return data;
    }
}

const instance = axios.create({
    baseURL: baseConfig.baseURL,
    timeout: baseConfig.timeout,
    headers: {
        'x-requested-with': 'XMLHttpRequest', // 声明是ajax请求
        'Content-Type': 'application/json; charset=UTF-8',
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
        return handleResponse(data, config);
    },
    (error) => {
        const { response, message } = error

        if (response && response.data) {
            const { status, data, config } = response
            return handleResponse({code: status, message}, config)
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

            console.error(message || `后端接口异常`)
            return Promise.reject(error)
        }
    }
)

let POST = instance.post;
let GET = (url, data, config) => {
    if(config) {
        config['params'] = data;
    } else {
        config = {params: data}
    }

    return instance.get(url, config);
}

export {GET, POST, baseURL, instance as http}
