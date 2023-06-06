import {GET, POST, baseURL} from '@/utils/request'

// 图像验证码url
const loginUri = "/core/login"
const captchaUri = `${baseURL}/valid/captcha`
const menuUri = "/core/center/menus"
const avatarUploadUri = "/core/center/avatar"

export {captchaUri, menuUri, loginUri, avatarUploadUri}

// 获取侧边菜单栏数据
export function getMenus() {
    return GET(menuUri)
}

// 用户中心 - 获取用户详情
export function getUser() {
    return GET('/core/center/detail')
}

// 用户中心 - 修改用户密码
export function editPwd(model) {
    return POST("/core/center/pwd", model)
}

// 用户中心 - 修改当前用户信息
export function editUser(user) {
    return POST('/core/center/editUser', user);
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
    return POST(loginUri, user);
}

// 注销系统
export function logout() {
    return POST('/core/logout')
}

// oauth2授权认证
export function oauth2(type) {
    return GET("/core/oauth2", {params: {type}}).then(resp => {
        location.href = resp.data
    })
}
