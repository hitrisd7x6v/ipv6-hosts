import Utils from '@/utils/SysUtils'
import Mock from 'mockjs'
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
            },{
                id: 20, pid: 1,
                name: '扩展组件', url: '#2',
                children: [
                    {id: 200, pid: 20, name: '增删改查', url: '200', type: 'V'},
                    {id: 205, pid: 20, name: '表格组件', url: '205', type: 'V'},
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
// 模拟字典数据
Mock.mock(RegExp('/core/dictData/listByType'), 'get', args => {
    return {
        code: 200,
        message: 'OK',
        data: [{label: '男', value: 'man'},{label: '女', value: 'woman'}]
    }
})
// 用户接口信息
let userMock = {
    "id|+1": 1,
    "phone": '@phone',
    "realName": '@cname',
}
let userData = Mock.mock({"data|8-18": [userMock]});
Mock.mock(RegExp('/core/user/view'), 'get', args => {
    let {size, current} = Utils.resolverQueryOfUrl(args.url);
    return {
        code: 200, message: 'OK', data: {size: size, records: userData.data, total: userData.data.length}
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
