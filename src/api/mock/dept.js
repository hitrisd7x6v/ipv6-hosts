import Mock from "mockjs";
import Utils from "@/utils/SysUtils";

let deptData = [
    {id: 1, name: '由创源科技集团', pid: 0, leader: 'iteaj', email: 'iteaj@outlook.com', phone: '18013123546'
        , children: [
            {id: 2, name: '厦门由创源科技', pid: 1, leader: 'iteaj', email: 'iteaj@outlook.com', phone: '18059123546'
                , children: [
                    {id: 3, name: '技术部', pid: 2, leader: 'iteaj', email: 'iteaj@outlook.com', phone: '18059123654'},
                    {id: 4, name: '财务部', pid: 2, leader: '乘影峰', email: 'iteaj@outlook.com', phone: '18059123655'},
                    {id: 5, name: '产品部', pid: 2, leader: 'tiyan', email: 'iteaj@outlook.com', phone: '18059123656'},
                ]
            }
    ]
}]

function getDetail(id, children) {
    for (let item of children) {
        if(item.id == id) {
            return item;
        }

        if(item.children instanceof Array) {
            return getDetail(id, item.children);
        }
    }
}

Mock.mock(RegExp('/core/org/view'), 'get', args => {
    return {
        code: 200, message: 'OK', data: deptData
    }
})

Mock.mock(RegExp('/core/org/parent'), 'get', args => {
    return {
        code: 200, message: 'OK', data: deptData
    }
})
Mock.mock(RegExp(`/core/org/edit`), 'get', (args) => {
    let query = Utils.resolverQueryOfUrl(args.url);
    let detail = getDetail(query.id, deptData);
    return {
        code: 200,
        message: 'OK',
        data: detail
    }
})
Mock.mock(RegExp(`/core/org/edit`), 'post', (args) => {
    let body = args.body
    let dept = deptData.filter(item => item['id'] == body['id'])[0];
    Object.assign(dept, body);

    return {
        code: 200,
        message: 'OK',
        data: null
    }
})
Mock.mock(RegExp(`/core/org/del`), 'post', (args) => {
    let query = args.body;
    deptData.forEach((item, index) =>
        item.id == query ? deptData.splice(index, 1) : null);
    return {
        code: 200,
        message: 'OK',
        data: deptData.filter(item => item['id'] == query['id'])[0]
    }
})
