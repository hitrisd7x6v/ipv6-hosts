// 用户数据模拟接口
import Mock from "mockjs";

let account = "admin", password = 'admin123456', captcha='168';
let detail = {id: 1, email: 'iteaj@outlook.com', nickName: '超级管理员', phone: '13123456028'
    , deptName: '厦门由创源科技', roleName: '管理员', remark: '活出自己', account: 'admin'}

/**
 * 获取用户详情
 */
Mock.mock(RegExp(`/core/center/detail`), 'post', (args) => {
    return {
        code: 200,
        message: 'OK',
        data: detail
    }
})

/**
 * 登录
 */
Mock.mock(RegExp(`/core/center/login`), 'post', (args) => {
    let body = JSON.parse(args.body)
    if(body.userName != account || body.password != password) {
        return {code: 500, message: '用户名或密码错误'}
    }
    if(body.captcha != captcha) {
        return {code: 500, message: '验证码错误'}
    }

    return {
        code: 200,
        message: '登录成功',
        data: null
    }
})

/**
 * 注销
 */
Mock.mock(RegExp(`/core/center/logout`), 'post', (args) => {
    return {
        code: 200,
        message: '注销成功',
        data: null
    }
})

/**
 * 修改用户详情
 */
Mock.mock(RegExp(`/core/center/editUser`), 'post', (args) => {
    return {
        code: 200,
        message: '修改成功',
        data: null
    }
})

/**
 * 修改密码
 */
Mock.mock(RegExp(`/core/center/pwd`), 'post', (args) => {
    let body = JSON.parse(args.body)
    if(body.oldPwd != password) {
        return {code: 500, message: '密码错误'}
    }

    return {
        code: 200,
        message: '修改成功',
        data: null
    }
})
