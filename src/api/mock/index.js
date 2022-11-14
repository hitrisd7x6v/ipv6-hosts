import Mock from 'mockjs'
import '@/api/mock/user'
import '@/api/mock/dept'
import '@/api/mock/menu'
import '@/api/mock/dict'
import '@/api/mock/role'
import '@/api/mock/config'
import '@/api/mock/dictData'
import '@/api/mock/userCenter'
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
                    {id: 111, name: '用户管理', url: '/core/admin', pid: 11, type: 'V', children: [
                            {name: '新增', permType: 'Add', type: 'A', sort: 30, position: 'M', url: '/core/admin/add'},
                            {name: '搜索', permType: 'View', type: 'A', sort: 10, position: 'M', url: '/core/admin/view'},
                            {name: '编辑', permType: 'Edit', type: 'A', sort: 10, position: 'T', url: '/core/admin/edit'},
                            {name: '删除', permType: 'Del', type: 'A', sort: 80, position: 'T', url: '/core/admin/del'},
                            {name: '修改密码', permType: 'Pwd', type: 'A', sort: 80, position: 'T', url: '/core/admin/del'},
                        ]
                    },
                    {id: 120, name: '部门管理', url: '/core/org', pid: 11,  type: 'V', children: [
                            {id: 1200, name: '新增', permType: 'Add', type: 'A', url: '/core/org/add', position: 'AM'},
                            {id: 1210, name: '搜索', permType: 'View', type: 'A', sort: 10, position: 'M', url: '/core/org/view'},
                            {id: 1220, name: '编辑', permType: 'Edit', type: 'A', sort: 10, position: 'T', url: '/core/org/edit'},
                            {id: 1230, name: '删除', permType: 'Del', type: 'A', sort: 80, position: 'T', url: '/core/org/del'},
                        ]
                    },
                    {id: 125, name: '字典管理', url: '/core/dict', pid: 11,  type: 'V', children: [
                            {id: 1250, name: '新增', permType: 'Add', type: 'A', url: '/core/dictType/add', position: 'M'},
                            {id: 1251, name: '搜索', permType: 'View', type: 'A', sort: 10, position: 'M', url: '/core/dictType/view'},
                            {id: 1252, name: '编辑', permType: 'Edit', type: 'A', sort: 10, position: 'T', url: '/core/dictType/edit'},
                            {id: 1253, name: '删除', permType: 'Del', type: 'A', sort: 80, position: 'T', url: '/core/dictType/del'},
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
Mock.mock(RegExp(`/core/center/detail.*`), 'get', () => {
    return {
        code: 200, message: '成功',
        data: {name:'iteaj', phone: '13123456028', email: 'iteaj@outlook.com', account: 'admin',
            deptName: '技术部 > 技术总监', roleNames: '超级管理员', remark: '希望努力之后活的更像自己',
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
