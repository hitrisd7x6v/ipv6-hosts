// 用户数据模拟接口
import Mock from "mockjs";
import Utils from "@/utils/SysUtils";

let userMock = {
    "id|+1": 1,
    "phone": '@phone', // 手机号
    "name": '@cname', // 昵称
    "account": '@name()', // 账号
    "email": '@email', // 邮箱
    "createTime": '@now', // 创建时间
}
let userData = Mock.mock({"data|8-18": [userMock]}).data;
Mock.mock(RegExp('/core/user/view'), 'get', args => {
    let {size, current} = Utils.resolverQueryOfUrl(args.url);
    return {
        code: 200, message: 'OK', data: {size: size, records: userData, total: userData.length}
    }
})

Mock.mock(RegExp(`/core/user/edit`), 'get', (args) => {
    let query = Utils.resolverQueryOfUrl(args.url);
    return {
        code: 200,
        message: 'OK',
        data: userData.filter(item => item['id'] == query['id'])[0]
    }
})
Mock.mock(RegExp(`/core/user/edit`), 'post', (args) => {
    let query = args.body

    return {
        code: 200,
        message: 'OK',
        data: null
    }
})
Mock.mock(RegExp(`/core/user/del`), 'post', (args) => {
    let query = args.body;
    userData.forEach((item, index) =>
        item.id == query ? userData.splice(index, 1) : null);
    return {
        code: 200,
        message: 'OK',
        data: null
    }
})
