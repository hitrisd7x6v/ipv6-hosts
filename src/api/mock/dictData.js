import Mock from "mockjs";
import Utils from "@/utils/SysUtils";

let dataSource = {
    "switch.status": [
        {id: 1, label: '开', value: 'on', type: 'switch.status', sort: 1, remark: '开状态', status: 'enabled'},
        {id: 2, label: '关', value: 'off', type: 'switch.status', sort: 2, remark: "关状态", status: 'enabled'},
    ],
    "type.tea": [
        {id: 3, label: '清香', value: 'qing', type: 'type.tea', sort: 1, remark: '清香', status: 'enabled'},
        {id: 4, label: '浓香', value: 'nong', type: 'type.tea', sort: 2, remark: "浓香", status: 'enabled'},
        {id: 5, label: '鲜香', value: 'xian', type: 'type.tea', sort: 3, remark: "鲜香", status: 'enabled'},
    ],
    "type.sex": [
        {id: 6, label: '男', value: 'man', type: 'type.sex', sort: 1, remark: '男', status: 'enabled'},
        {id: 7, label: '女', value: 'woman', type: 'type.sex', sort: 2, remark: "女", status: 'enabled'},
        {id: 8, label: '未知', value: 'unknown', type: 'type.sex', sort: 3, remark: "未知", status: 'disabled'},
    ]
}
let Values = Object.values(dataSource).reduce((p, v) => {
    p.push(...v); return p;
}, [])
Mock.mock(RegExp('/core/dictData/view'), 'get', args => {
    let {type} = Utils.resolverQueryOfUrl(args.url);
    return {
        code: 200, message: 'OK', data: dataSource[type]
    }
})

Mock.mock(RegExp(`/core/dictData/edit`), 'get', (args) => {
    let query = Utils.resolverQueryOfUrl(args.url);
    return {
        code: 200,
        message: 'OK',
        data: Values.filter(item => item['id'] == query['id'])[0]
    }
})
Mock.mock(RegExp(`/core/dictData/edit`), 'post', (args) => {
    let body = args.body
    let dept = dataSource.filter(item => item['id'] == body['id'])[0];
    Object.assign(dept, body);

    return {
        code: 200,
        message: 'OK',
        data: null
    }
})
Mock.mock(RegExp(`/core/dictData/del`), 'post', (args) => {
    let query = args.body;
    dataSource.forEach((item, index) =>
        item.id == query ? dataSource.splice(index, 1) : null);
    return {
        code: 200,
        message: 'OK',
        data: []
    }
})
