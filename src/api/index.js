import {GET, POST, baseURL} from '@/utils/request'
import router from '@/router'

// 图像验证码url
const captchaUri = `${baseURL}/captcha`
const menuUri = "/core/menus"
const loginUri = "/core/login"

export {captchaUri, menuUri, loginUri}

// 获取侧边菜单栏数据
export function getMenus() {
    return GET(menuUri)
}

// 获取字典数据
export function getDict(dictType) {
    return GET('/core/dict', {dictType})
}

// 提交登录接口
export function login(user) {
    return POST(loginUri, user).then(resp=>{
        router.push("/").then(r => {});
    });
}

// oauth2授权认证
export function oauth2(type) {
    return GET("/core/oauth2", {params: {type}}).then(resp => {
        location.href = resp.data
    })
}
