// 用户数据模拟接口
import Mock from "mockjs";
import Utils from "@/utils/SysUtils";

let dataSource = [
    {id: 1, url: '#', pid: 0, type: 'M', name: '系统设置', icon: 'iz-icon-xitong', children: [
            {id: 11, url: '#', pid: 1, name: '系统管理', type: 'M', children: [
                    {id: 158, name: '菜单管理', url: '/core/menu', pid: 11, type: 'V', children: [
                            {id: 1581, name: '新增', permType: 'Add', type: 'A', sort: 30, position: 'M', url: '/core/menu/add'},
                            {id: 1582, name: '搜索', permType: 'View', type: 'A', sort: 10, position: 'M', url: '/core/menu/view'},
                            {id: 1583, name: '编辑', permType: 'Edit', type: 'A', sort: 50, position: 'T', url: '/core/menu/edit'},
                            {id: 1584, name: '删除', permType: 'Del', type: 'A', sort: 80, position: 'T', url: '/core/menu/del'},
                        ]
                    },
                    {id: 111, name: '用户管理', url: '/core/user', pid: 11, type: 'V', children: [
                            {id: 1111, name: '新增', permType: 'Add', type: 'A', sort: 30, position: 'M', url: '/core/user/add'},
                            {id: 1112, name: '搜索', permType: 'View', type: 'A', sort: 10, position: 'M', url: '/core/user/view'},
                            {id: 1113, name: '编辑', permType: 'Edit', type: 'A', sort: 10, position: 'T', url: '/core/user/edit'},
                            {id: 1114, name: '删除', permType: 'Del', type: 'A', sort: 80, position: 'T', url: '/core/user/del'},
                        ]
                    },
                    {id: 120, name: '部门管理', url: '/core/dept', pid: 11,  type: 'V', children: [
                            {id: 1200, name: '新增', permType: 'Add', type: 'A', url: '/core/dept/add', position: 'M'},
                            {id: 1210, name: '搜索', permType: 'View', type: 'A', sort: 10, position: 'M', url: '/core/dept/view'},
                            {id: 1220, name: '编辑', permType: 'Edit', type: 'A', sort: 10, position: 'T', url: '/core/dept/edit'},
                            {id: 1230, name: '删除', permType: 'Del', type: 'A', sort: 80, position: 'T', url: '/core/dept/del'},
                        ]
                    },
                    {id: 125, name: '字典管理', url: '/core/dict', pid: 11,  type: 'V', children: [
                            {id: 1250, name: '新增', permType: 'Add', type: 'A', url: '/core/dict/add', position: 'M'},
                            {id: 1251, name: '搜索', permType: 'View', type: 'A', sort: 10, position: 'M', url: '/core/dict/view'},
                            {id: 1252, name: '编辑', permType: 'Edit', type: 'A', sort: 10, position: 'T', url: '/core/dict/edit'},
                            {id: 1253, name: '删除', permType: 'Del', type: 'A', sort: 80, position: 'T', url: '/core/dict/del'},
                        ]
                    },
                    {id: 128, name: '系统配置', url: '/core/config', pid: 11, type: 'V', children: [
                            {id: 1280, name: '新增', permType: 'Add', type: 'A', sort: 30, position: 'M', url: '/core/config/add'},
                            {id: 1281, name: '搜索', permType: 'View', type: 'A', sort: 10, position: 'M', url: '/core/config/view'},
                            {id: 1282, name: '编辑', permType: 'Edit', type: 'A', sort: 10, position: 'T', url: '/core/config/edit'},
                            {id: 1283, name: '删除', permType: 'Del', type: 'A', sort: 80, position: 'T', url: '/core/config/del'},
                        ]
                    },
                    {id: 138, name: '角色管理', url: '/core/role', pid: 11, type: 'V', children: [
                            {id: 1380, name: '新增', permType: 'Add', type: 'A', sort: 30, position: 'M', url: '/core/role/add'},
                            {id: 1381,name: '搜索', permType: 'View', type: 'A', sort: 10, position: 'M', url: '/core/role/view'},
                            {id: 1382,name: '编辑', permType: 'Edit', type: 'A', sort: 10, position: 'T', url: '/core/role/edit'},
                            {id: 1383,name: '删除', permType: 'Del', type: 'A', sort: 80, position: 'T', url: '/core/role/del'},
                        ]
                    },
                ]
            }
        ]
    }
]
Mock.mock(RegExp('/core/menu/view'), 'get', args => {
    let {size, current} = Utils.resolverQueryOfUrl(args.url);
    return {
        code: 200, message: 'OK', data: {size: size, records: dataSource, total: dataSource.length}
    }
})

let parentData = [];
let parentHandle = (data, children) => {
    data.forEach(item => {
        if(item.type == 'A') return;

        if(item.children) {
            let dataItem = {label: item.name, value: item.id, children: []};
            children.push(dataItem);
            parentHandle(item.children, dataItem.children);
        } else {
            children.push({label: item.name, value: item.id});
        }
    })
}
parentHandle(dataSource, parentData);
Mock.mock(RegExp('/core/menu/parent'), 'get', args => {
    let {size, current} = Utils.resolverQueryOfUrl(args.url);
    return {
        code: 200, message: 'OK', data: parentData
    }
})
Mock.mock(RegExp(`/core/menu/edit`), 'get', (args) => {
    let query = Utils.resolverQueryOfUrl(args.url);
    return {
        code: 200,
        message: 'OK',
        data: dataSource.filter(item => item['id'] == query['id'])[0]
    }
})
Mock.mock(RegExp(`/core/menu/edit`), 'post', (args) => {
    let query = args.body

    return {
        code: 200,
        message: 'OK',
        data: null
    }
})
Mock.mock(RegExp(`/core/menu/del`), 'post', (args) => {
    let query = args.body;
    dataSource.forEach((item, index) =>
        item.id == query ? dataSource.splice(index, 1) : null);
    return {
        code: 200,
        message: 'OK',
        data: null
    }
})
