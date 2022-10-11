import {GET, POST, baseURL} from '@/utils/request'
import router from '@/router'

// 图像验证码url
const captchaUri = `${baseURL}/valid/captcha`
const menuUri = "/core/menus"
const loginUri = "/core/center/login"
const avatarUploadUri = "/core/center/avatar"

export {captchaUri, menuUri, loginUri, avatarUploadUri}

// 获取侧边菜单栏数据
export function getMenus() {
    return GET(menuUri)
}

// 获取用户中心详情
export function getUser() {
    return GET('/core/center/detail')
}

// 修改用户密码
export function editPwd(model) {
    return POST('', model)
}

// 修改当前用户信息
export function editUser(user) {
    return POST('', user);
}

export function getNotifyList() {
    return GET('/core/notify/view')
}

// 获取字典数据
export function getDict(type) {
    return GET('/core/dictData/listByType', {type}).then(({data}) => {
        let options;
        if(data instanceof Array) {
            options = data.map(item => {return {label: item.label, value: item.value}})
        }

        return options;
    })
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
