import qs from 'qs'
import axios from 'axios'
import router from '@/router'
import {msgError} from "@/utils/message";
let loadingInstance
let baseConfig = {
    baseURL: 'http://localhost',
    contentType: 'application/json;charset=UTF-8',
    //消息框消失时间
    duration: 3000,
    //超时时间
    timeout: 5000,
    // 成功响应码
    success: 200,
    //登录失效code
    invalidCode: 402,
    //无权限
    unauthorized: 401,
}

/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 处理code异常
 * @param {*} code
 * @param {*} msg
 */
const handleResponse = (code, msg) => {
    switch (code) {
        case invalidCode:
            Vue.prototype.$baseMessage(msg || `后端接口${code}异常`, 'error')
            store.dispatch('user/resetAccessToken').catch(() => {})
            if (loginInterception) {
                location.reload()
            }
            break
        case baseConfig.unauthorized:
            router.push({ path: '/401' }).catch(() => {})
            break
        default:
            Vue.prototype.$baseMessage(msg || `后端接口${code}异常`, 'error')
            break
    }
}

const instance = axios.create({
    baseURL: baseConfig.baseURL,
    timeout: baseConfig.timeout,
    headers: {
        'Content-Type': baseConfig.contentType,
    },
})

instance.interceptors.request.use(
    (config) => {
        if (store.getters['user/accessToken']) {
            config.headers[tokenName] = store.getters['user/accessToken']
        }

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

export default instance
