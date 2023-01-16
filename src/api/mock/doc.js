import Mock from "mockjs";
import Utils from "@/utils/SysUtils";

let data = [
    {id: 1, name: '普通铁观音', type: '清香型', status: 'enabled', createTime: '2099-10-05'},
    {id: 2, name: '特级铁观音', type: '清香型', status: 'disabled', createTime: '2098-10-16'},
    {id: 3, name: '春茶一级铁观音', type: '浓香型', status: 'disabled', createTime: '2098-10-16'},
]

Mock.mock(RegExp('/doc/product/view'), 'get', args => {
    let {size, current} = Utils.resolverQueryOfUrl(args.url);
    return {
        code: 200, message: 'OK', data: data
    }
})

Mock.mock(RegExp(`/doc/product/edit`), 'get', (args) => {
    let query = Utils.resolverQueryOfUrl(args.url);
    return {
        code: 200,
        message: 'OK',
        data: data.filter(item => item['id'] == query['id'])[0]
    }
})

Mock.mock(RegExp(`/doc/product/submit`), 'post', (args) => {
    let body = JSON.parse(args.body)
    let detail = data.filter(item => item['id'] == body['id'])[0];
    Object.assign(detail, body);

    return {
        code: 200,
        message: 'OK',
        data: null
    }
})
Mock.mock(RegExp(`/doc/product/del`), 'post', (args) => {
    let query = JSON.parse(args.body);
    query.forEach(id => {
        data.forEach((item, index) =>
            item.id == id ? data.splice(index, 1) : null);
    })
    return {
        code: 200,
        message: 'OK',
        data: null
    }
})
