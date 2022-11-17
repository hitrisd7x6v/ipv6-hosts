import Mock from "mockjs";
import Utils from "@/utils/SysUtils";

let data = [
    {id: 1, name: '超级管理员', status: 'enabled', sort: 1, remark: '拥有所有角色', createTime: '2020-10-05'},
    {id: 2, name: '普通角色', status: 'disabled', sort: 2, remark: '只拥有特定权限', createTime: '2020-10-16'},
]

Mock.mock(RegExp('/core/role/view'), 'get', args => {
    let {size, current} = Utils.resolverQueryOfUrl(args.url);
    return {
        code: 200, message: 'OK', data: data
    }
})
Mock.mock(RegExp('/core/role/list'), 'get', args => {
    return {
        code: 200, message: 'OK', data: data
    }
})
Mock.mock(RegExp(`/core/role/edit`), 'get', (args) => {
    let query = Utils.resolverQueryOfUrl(args.url);
    return {
        code: 200,
        message: 'OK',
        data: data.filter(item => item['id'] == query['id'])[0]
    }
})
Mock.mock(RegExp(`/core/role/edit`), 'post', (args) => {
    let body = args.body
    let dept = data.filter(item => item['id'] == body['id'])[0];
    Object.assign(dept, body);

    return {
        code: 200,
        message: 'OK',
        data: null
    }
})
Mock.mock(RegExp(`/core/role/add`), 'post', (args) => {
    let body = args.body
    let parse = JSON.parse(body);
    parse['id'] = data.length + 1
    data.push(parse);
    return {
        code: 200,
        message: '',
        data: null
    }
})
Mock.mock(RegExp(`/core/role/del`), 'post', (args) => {
    let query = args.body;
    data.forEach((item, index) =>
        item.id == query ? data.splice(index, 1) : null);
    return {
        code: 200,
        message: 'OK',
        data: data.filter(item => item['id'] == query['id'])[0]
    }
})
