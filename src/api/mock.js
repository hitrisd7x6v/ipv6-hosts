import Mock from 'mockjs'
import {menuUri} from "@/api/index";

Mock.setup({
    timeout: '100-500'
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
                    {id: 111, name: '用户管理', url: '/core/user', type: 'V', children: [
                            {name: '編輯', permType: 'Edit', type: 'A', position: 'T', url: '/core/user/edit'}
                        ]
                    },
                    {id: 115, name: '角色管理', url: '/core/role', type: 'V', children: [
                            {id: 1151, name: '新增', url: '/core/role/add'}
                        ]
                    },
                ]
            }
        ],
    }
]
let userMock = {}

// 模拟菜单数据
Mock.mock(RegExp(`${menuUri}.*`), 'get', (args) => {
    return {
        code: 200,
        message: '成功',
        data: Mock.mock(menus)
    }
})
Mock.mock(RegExp(`/core/user/edit`), 'get', (args) => {
    return {
        code: 200,
        message: '成功',
        data: {}
    }
})
