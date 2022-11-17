// 用户数据模拟接口
import Mock from "mockjs";
import Utils from "@/utils/SysUtils";

let dataSource = [
    {id: 1, url: '#', pid: 0, type: 'M', name: '系统设置', permType: null, icon: 'iz-icon-xitong', children: [
            {id: 11, url: '#', pid: 1, name: '系统管理', type: 'M', permType: null, children: [
                    {id: 158, name: '菜单管理', url: '/core/menu', pid: 11, permType: null, type: 'V', children: [
                            {id: 1581, pid: 158, name: '新增', permType: 'Add', type: 'A', sort: 30, position: 'M', url: '/core/menu/add'},
                            {id: 1582, pid: 158, name: '搜索', permType: 'View', type: 'A', sort: 10, position: 'M', url: '/core/menu/view'},
                            {id: 1583, pid: 158, name: '编辑', permType: 'Edit', type: 'A', sort: 50, position: 'T', url: '/core/menu/edit'},
                            {id: 1584, pid: 158, name: '删除', permType: 'Del', type: 'A', sort: 80, position: 'T', url: '/core/menu/del'},
                        ]
                    },
                    {id: 111, name: '用户管理', url: '/core/user', pid: 11, permType: null, type: 'V', children: [
                            {id: 1111,pid: 111, name: '新增', permType: 'Add', type: 'A', sort: 30, position: 'M', url: '/core/user/add'},
                            {id: 1112,pid: 111, name: '搜索', permType: 'View', type: 'A', sort: 10, position: 'M', url: '/core/user/view'},
                            {id: 1113,pid: 111, name: '编辑', permType: 'Edit', type: 'A', sort: 10, position: 'T', url: '/core/user/edit'},
                            {id: 1114,pid: 111, name: '删除', permType: 'Del', type: 'A', sort: 80, position: 'T', url: '/core/user/del'},
                        ]
                    },
                    {id: 120, name: '部门管理', url: '/core/dept', pid: 11, permType: null,  type: 'V', children: [
                            {id: 1200,pid: 120, name: '新增', permType: 'Add', type: 'A', url: '/core/dept/add', position: 'M'},
                            {id: 1210,pid: 120, name: '搜索', permType: 'View', type: 'A', sort: 10, position: 'M', url: '/core/dept/view'},
                            {id: 1220,pid: 120, name: '编辑', permType: 'Edit', type: 'A', sort: 10, position: 'T', url: '/core/dept/edit'},
                            {id: 1230,pid: 120, name: '删除', permType: 'Del', type: 'A', sort: 80, position: 'T', url: '/core/dept/del'},
                        ]
                    },
                    {id: 125, name: '字典管理', url: '/core/dict', pid: 11, permType: null,  type: 'V', children: [
                            {id: 1250,pid: 125, name: '新增', permType: 'Add', type: 'A', url: '/core/dict/add', position: 'M'},
                            {id: 1251,pid: 125, name: '搜索', permType: 'View', type: 'A', sort: 10, position: 'M', url: '/core/dict/view'},
                            {id: 1252,pid: 125, name: '编辑', permType: 'Edit', type: 'A', sort: 10, position: 'T', url: '/core/dict/edit'},
                            {id: 1253,pid: 125, name: '删除', permType: 'Del', type: 'A', sort: 80, position: 'T', url: '/core/dict/del'},
                        ]
                    },
                    {id: 128, name: '系统配置', url: '/core/config', pid: 11, permType: null, type: 'V', children: [
                            {id: 1280,pid: 128, name: '新增', permType: 'Add', type: 'A', sort: 30, position: 'M', url: '/core/config/add'},
                            {id: 1281,pid: 128, name: '搜索', permType: 'View', type: 'A', sort: 10, position: 'M', url: '/core/config/view'},
                            {id: 1282,pid: 128, name: '编辑', permType: 'Edit', type: 'A', sort: 10, position: 'T', url: '/core/config/edit'},
                            {id: 1283,pid: 128, name: '删除', permType: 'Del', type: 'A', sort: 80, position: 'T', url: '/core/config/del'},
                        ]
                    },
                    {id: 138, name: '角色管理', url: '/core/role', pid: 11, permType: null, type: 'V', children: [
                            {id: 1380,pid: 138, name: '新增', permType: 'Add', type: 'A', sort: 30, position: 'M', url: '/core/role/add'},
                            {id: 1381,pid: 138,name: '搜索', permType: 'View', type: 'A', sort: 10, position: 'M', url: '/core/role/view'},
                            {id: 1382,pid: 138,name: '编辑', permType: 'Edit', type: 'A', sort: 10, position: 'T', url: '/core/role/edit'},
                            {id: 1383,pid: 138,name: '删除', permType: 'Del', type: 'A', sort: 80, position: 'T', url: '/core/role/del'},
                        ]
                    },
                ]
            }
        ]
    }
]

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

Mock.mock(RegExp('/core/menu/view'), 'get', args => {
    return {
        code: 200, message: 'OK', data: dataSource
    }
})

Mock.mock(RegExp('/core/menu/parent'), 'get', args => {
    return {
        code: 200, message: 'OK', data: dataSource
    }
})
Mock.mock(RegExp(`/core/menu/edit`), 'get', (args) => {
    let query = Utils.resolverQueryOfUrl(args.url);
    let detail = getDetail(query.id, dataSource);
    return {
        code: 200,
        message: 'OK',
        data: detail
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
Mock.mock(RegExp(`/core/menu/add`), 'post', (args) => {
    let body = args.body
    let parse = JSON.parse(body);
    parse['id'] = dataSource.length + 1
    dataSource.push(parse);
    return {
        code: 200,
        message: '',
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
