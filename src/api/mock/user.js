// 用户数据模拟接口
import Mock from "mockjs";
import Utils from "@/utils/SysUtils";

let userMock = {
    "id|+1": 1,
    "phone": '@phone', // 手机号
    "name": '@cname', // 昵称
    "orgId|1-5": 3, // 所属部门
    "sex|1": ['man', 'woman', 'non'],
    "account": '@name()', // 账号
    "email": '@email', // 邮箱
    "status": 'enabled',
    "createTime": '@now', // 创建时间
}
let userData = Mock.mock({"data|8-18": [userMock]}).data;
Mock.mock(RegExp('/core/admin/view'), 'get', args => {
    let {size, current} = Utils.resolverQueryOfUrl(args.url);
    return {
        code: 200, message: 'OK', data: {size: size, records: userData, total: userData.length}
    }
})

Mock.mock(RegExp(`/core/admin/edit`), 'get', (args) => {
    let query = Utils.resolverQueryOfUrl(args.url);
    return {
        code: 200,
        message: 'OK',
        data: userData.filter(item => item['id'] == query['id'])[0]
    }
})
Mock.mock(RegExp(`/core/admin/edit`), 'post', (args) => {
    let query = args.body

    return {
        code: 200,
        message: '修改成功',
        data: null
    }
})
Mock.mock(RegExp(`/core/admin/add`), 'post', (args) => {
    let body = args.body
    let parse = JSON.parse(body);
    parse['id'] = userData.length + 1
    userData.push(parse);
    return {
        code: 200,
        message: '',
        data: null
    }
})
Mock.mock(RegExp(`/core/admin/del`), 'post', (args) => {
    let query = args.body;
    userData.forEach((item, index) =>
        item.id == query ? userData.splice(index, 1) : null);
    return {
        code: 200,
        message: '删除成功',
        data: null
    }
})
