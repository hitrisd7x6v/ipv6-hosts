import Mock from 'mockjs'
import '@/api/mock/user'
import '@/api/mock/dept'
import '@/api/mock/menu'
import {menuUri} from "@/api/index";

Mock.setup({
    timeout: '20-800'
})

Mock.Random.extend({
    phone: function () {
        let phonePrefix = ['132', '135', '189', '180', '158']
        return this.pick(phonePrefix) + Mock.mock(/\d{8}/) //Number()
    }
})

const menus = [
    {
        id: 1, pid: 0,
        url: "#1", // 访问地址
        type: "M", // 菜单类型
        name: "系统设置", // 菜单名称
        icon: "iz-icon-xitong",
        children: [
            {
                id: 11, pid: 1,
                name: '系统管理',
                type: 'M',
                url: '#1',
                children: [
                    {id: 158, name: '菜单管理', url: '/core/menu', pid: 11, type: 'V', children: [
                            {name: '新增', permType: 'Add', type: 'A', sort: 30, position: 'AM', url: '/core/menu/add'},
                            {name: '搜索', permType: 'View', type: 'A', sort: 10, position: 'M', url: '/core/menu/view'},
                            {name: '编辑', permType: 'Edit', type: 'A', sort: 50, position: 'T', url: '/core/menu/edit'},
                            {name: '删除', permType: 'Del', type: 'A', sort: 80, position: 'T', url: '/core/menu/del'},
                        ]
                    },
                    {id: 111, name: '用户管理', url: '/core/user', pid: 11, type: 'V', children: [
                            {name: '新增', permType: 'Add', type: 'A', sort: 30, position: 'M', url: '/core/user/add'},
                            {name: '搜索', permType: 'View', type: 'A', sort: 10, position: 'M', url: '/core/user/view'},
                            {name: '编辑', permType: 'Edit', type: 'A', sort: 10, position: 'T', url: '/core/user/edit'},
                            {name: '删除', permType: 'Del', type: 'A', sort: 80, position: 'AM', url: '/core/user/del'},
                            {name: '导入', permType: 'Import', type: 'A', sort: 100, position: 'M', url: '/core/user/import'}
                        ]
                    },
                    {id: 115, name: '角色管理', url: '/core/role', pid: 11,  type: 'V', children: [
                            {id: 1151, name: '新增', type: 'A', url: '/core/role/add'}
                        ]
                    },
                    {id: 120, name: '部门管理', url: '/core/dept', pid: 11,  type: 'V', children: [
                            {id: 1200, name: '新增', permType: 'Add', type: 'A', url: '/core/dept/add', position: 'M'},
                            {id: 1210, name: '搜索', permType: 'View', type: 'A', sort: 10, position: 'M', url: '/core/dept/view'},
                            {id: 1220, name: '编辑', permType: 'Edit', type: 'A', sort: 10, position: 'T', url: '/core/dept/edit'},
                            {id: 1230, name: '删除', permType: 'Del', type: 'A', sort: 80, position: 'T', url: '/core/dept/del'},
                        ]
                    },
                ]
            },
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

// 模拟用户中心详情
Mock.mock(RegExp(`/core/user/detail.*`), 'get', () => {
    return {
        code: 200, message: '成功',
        data: {nickName:'iteaj', phone: '13123456028', email: 'iteaj@outlook.com', account: 'admin',
            deptName: '技术部 > 技术总监', roleName: '超级管理员', profile: '希望努力之后活的更像自己',
            avatar: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'}
    }
})

// 模拟通知列表
Mock.mock(RegExp(`/core/notify/view.*`), 'get', (args) => {
    return {
        code: 200,
        message: '成功',
        data: [
            {msg: 'klsdfjksdf', title: '测试'}
        ]
    }
})

// 模拟数据字典
Mock.mock(RegExp('/core/dictData/listByType'), 'get', args => {
    return {
        code: 200,
        message: 'OK',
        data: [{label: '男', value: 'man'},{label: '女', value: 'woman'}]
    }
})
