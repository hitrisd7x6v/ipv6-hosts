import Utils from '@/utils/SysUtils'
import Mock from 'mockjs'
import {menuUri} from "@/api/index";

Mock.setup({
    timeout: '20-800'
})

const menus = [
    {
        "id|+1": 1,
        "pid": 0,
        "url": "#1", // 访问地址
        "type": "M", // 菜单类型
        "name": "系统设置", // 菜单名称
        "icon": "iz-icon-xitong",
        "status": "view",
        "remark": "显示位置",
        "children": [
            {
                id: 11,
                name: '系统管理',
                url: '#1',
                children: [
                    {id: 111, name: '用户管理', url: '/core/user', pid: 11, type: 'V', children: [
                            {name: '新增', permType: 'Add', type: 'A', sort: 30, position: 'M', url: '/core/user/add'},
                            {name: '搜索', permType: 'View', type: 'A', sort: 10, position: 'M', url: '/core/user/view'},
                            {name: '编辑', permType: 'Edit', type: 'A', sort: 10, position: 'T', url: '/core/user/edit'},
                            {name: '删除', permType: 'Del', type: 'A', sort: 80, position: 'T', url: '/core/user/del'},
                            {name: '导入', permType: 'Import', type: 'A', sort: 100, position: 'M', url: '/core/user/import'}
                        ]
                    },
                    {id: 115, name: '角色管理', url: '/core/role', pid: 11,  type: 'V', children: [
                            {id: 1151, name: '新增', url: '/core/role/add'}
                        ]
                    },
                    {id: 120, name: '部门管理', url: '/core/dept', pid: 11,  type: 'V', children: [
                            {id: 1200, name: '新增', url: '/core/dept/add'}
                        ]
                    },
                ]
            }
        ],
    }
]

// 模拟菜单数据
Mock.mock(RegExp(`${menuUri}.*`), 'get', (args) => {
    return {
        code: 200,
        message: '成功',
        data: Mock.mock(menus)
    }
})
// 模拟字典数据
Mock.mock(RegExp('/core/dict'), 'get', args => {

})
// 用户接口信息
let userMock = {

}
let userData = [
    {id: 1, phone: '18059222381', sex: 'man', realName: '汪XX', userName: 'iteaj', account: null},
    {id: 2, phone: '18059222382', sex: 'woman', realName: '汪XX', userName: 'iteaj', account: null}
];
Mock.mock(RegExp('/core/user/view'), 'get', args => {
    return {
        code: 200, message: 'OK', data: userData
    }
})

Mock.mock(RegExp(`/core/user/edit`), 'get', (args) => {
    let query = Utils.resolverQueryOfUrl(args.url);
    return {
        code: 200,
        message: 'OK',
        data: userData.filter(item => item['id'] == query['id'])[0]
    }
})
Mock.mock(RegExp(`/core/user/edit`), 'post', (args) => {
    let query = args.body

    return {
        code: 200,
        message: 'OK',
        data: userData.filter(item => item['id'] == query['id'])[0]
    }
})
Mock.mock(RegExp(`/core/user/del`), 'post', (args) => {
    let query = args.body;
    userData.forEach((item, index) =>
        item.id == query ? userData.splice(index, 1) : null);
    return {
        code: 200,
        message: 'OK',
        data: userData.filter(item => item['id'] == query['id'])[0]
    }
})
