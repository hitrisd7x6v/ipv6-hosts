import {GET, POST, baseURL} from '@/utils/request'
import router from '@/router'

// 图像验证码url
const captchaUri = `${baseURL}/captcha`
export {captchaUri}

// 获取首页菜单
export function getMenus() {
    return GET("/core/menus")
}

// 提交登录接口
export function login(user) {
    return POST('/core/login', user).then(resp=>{
        router.push("/");
    });
}

// oauth2授权认证
export function oauth2(type) {
    return GET("/core/oauth2", {params: {type}}).then(resp => {
        location.href = resp.data
    })
}
