import Mock from "mockjs";
import Utils from "@/utils/SysUtils";

let data = [
    {id: 1, name: '系统名称', label: 'sys_name', value: '由创源科技'},
    {id: 1, name: '系统logo', label: 'sys_logo', value: '/img/logo.png'},
]

Mock.mock(RegExp('/core/dict/view'), 'get', args => {
    let {size, current} = Utils.resolverQueryOfUrl(args.url);
    return {
        code: 200, message: 'OK', data: data
    }
})

Mock.mock(RegExp(`/core/dict/edit`), 'get', (args) => {
    let query = Utils.resolverQueryOfUrl(args.url);
    return {
        code: 200,
        message: 'OK',
        data: data.filter(item => item['id'] == query['id'])[0]
    }
})
Mock.mock(RegExp(`/core/dict/edit`), 'post', (args) => {
    let body = args.body
    let dept = data.filter(item => item['id'] == body['id'])[0];
    Object.assign(dept, body);

    return {
        code: 200,
        message: 'OK',
        data: null
    }
})
Mock.mock(RegExp(`/core/dict/del`), 'post', (args) => {
    let query = args.body;
    data.forEach((item, index) =>
        item.id == query ? data.splice(index, 1) : null);
    return {
        code: 200,
        message: 'OK',
        data: data.filter(item => item['id'] == query['id'])[0]
    }
})
