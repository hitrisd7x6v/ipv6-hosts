import Mock from "mockjs";
import Utils from "@/utils/SysUtils";

let configData = [
    {id: 1, name: '系统名称', label: 'sys_name', value: '由创源科技', type: 'sys'},
    {id: 2, name: '系统logo', label: 'sys_logo', value: '/img/logo.png', type: 'sys'},
]

Mock.mock(RegExp('/core/config/view'), 'get', args => {
    let {size, current} = Utils.resolverQueryOfUrl(args.url);
    return {
        code: 200, message: 'OK', data: configData
    }
})

Mock.mock(RegExp(`/core/config/edit`), 'get', (args) => {
    let query = Utils.resolverQueryOfUrl(args.url);
    return {
        code: 200,
        message: 'OK',
        data: configData.filter(item => item['id'] == query['id'])[0]
    }
})
Mock.mock(RegExp(`/core/config/add`), 'post', (args) => {
    let body = args.body
    let parse = JSON.parse(body);
    parse['id'] = configData.length + 1
    configData.push(parse);
    return {
        code: 200,
        message: '',
        data: null
    }
})
Mock.mock(RegExp(`/core/config/edit`), 'post', (args) => {
    let body = args.body
    let dept = configData.filter(item => item['id'] == body['id'])[0];
    Object.assign(dept, body);

    return {
        code: 200,
        message: 'OK',
        data: null
    }
})
Mock.mock(RegExp(`/core/config/del`), 'post', (args) => {
    let query = args.body;
    configData.forEach((item, index) =>
        item.id == query ? configData.splice(index, 1) : null);
    return {
        code: 200,
        message: 'OK',
        data: configData.filter(item => item['id'] == query['id'])[0]
    }
})
