import Mock from "mockjs";
import Utils from "@/utils/SysUtils";

let data = [
    {id: 1, name: '铁观音类型', type: 'type.tea', status: 'enabled', remark: '清香, 浓香, 鲜香'},
    {id: 2, name: '设备开关状态', type: 'switch.status', status: 'enabled', remark: '开, 关'},
    {id: 3, name: '动物性别', type: 'type.sex', status: 'enabled', remark: '男, 女, 未知'},
]

Mock.mock(RegExp('/core/dictType/view'), 'get', args => {
    let {size, current} = Utils.resolverQueryOfUrl(args.url);
    return {
        code: 200, message: 'OK', data: {
            total: 3, records: data
        }
    }
})

Mock.mock(RegExp('/core/dictType/list'), 'get', args => {
    return {
        code: 200, message: 'OK', data: data
    }
})
Mock.mock(RegExp(`/core/dictType/edit`), 'get', (args) => {
    let query = Utils.resolverQueryOfUrl(args.url);
    return {
        code: 200,
        message: 'OK',
        data: data.filter(item => item['id'] == query['id'])[0]
    }
})
Mock.mock(RegExp(`/core/dictType/edit`), 'post', (args) => {
    let body = args.body
    let dept = data.filter(item => item['id'] == body['id'])[0];
    Object.assign(dept, body);

    return {
        code: 200,
        message: 'OK',
        data: null
    }
})
Mock.mock(RegExp(`/core/dictType/del`), 'post', (args) => {
    let query = args.body;
    data.forEach((item, index) =>
        item.id == query ? data.splice(index, 1) : null);
    return {
        code: 200,
        message: 'OK',
        data: data.filter(item => item['id'] == query['id'])[0]
    }
})
