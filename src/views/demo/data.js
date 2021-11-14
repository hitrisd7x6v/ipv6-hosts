import Vue from 'vue'
import Mock from 'mockjs'
import '@/components/ivzone.css'
import Ivzone from '@/components/ivzone'
import Utils from '@/utils/basic.utils'
import Logger from '@/utils/logger.utils' // 缓存

Vue.use(Ivzone);

const productCat = [
    {label: '果汁', value: 1}, {label: '茶', value: 3},
     {label: '母婴产品', value: 4}, {label: '电子产品', value: 5},
     {label: '护肤产品', value: 6}
]
const productType = [
    {label: '生活用品', value: 1, children: [
            {label: '毛巾', value: '3'},
            {label: '牙刷', value: '4'},
        ]}, {label: '体育用品', value: 2, children: [
            {label: '篮球', value: '5'},
            {label: '台球', value: '6'},
        ]}
]
const spec = [
    {label: '颜色', value: '0'}, {label: '重量', value: '1'}
]
const config = {
    form: {
        addTitle: '新增产品',
        editSource: 'local'
    },
    table: {
        pagination: {}
    },
    search: {}
}
const groupConfig = {
    form: {
        type: 'group',
        addTitle: '新增产品',
        editSource: 'local'
    },
    table: {
        selection: {},
        pagination: {}
    },
    search: { }
}
const topSearchMetas = [
    {field: 'name', title: '产品名称', type: 'text', span: 8, ls: 6, fs: 16},
    {field: 'spec', title: '规格', type: 'checkbox', span: 8, fs: 16, data: spec},
    {field: 'type', title: '产品类型', type: 'radio', span: 8, ls: 6, fs: 18, data: productType}
];
const searchMetas = [
    {field: 'name', title: '产品名称', type: 'text', event: {}, default: '茶叶'},
    {field: 'spec', title: '规格', type: 'checkbox', data: spec},
    {field: 'cat', title: '产品类别', type: 'select', data: productCat},
    // {field: 'type', title: '产品类型', type: 'radio', data: productType, span: [6, 18]},
    {field: 'createTime', title: '上架时间', type: 'dateRange', default: '2019-12-10 09:02'}
];
const Menus = [
    {label: '系统管理', value: 1, children: [
            {label: '菜单管理', value: 11},
            {label: '系统设置', value: 12, disabled: true},
            {label: '字典管理', value: 13},
        ]},
    {label: '组织架构', value: 2, children: [
            {label: '用户管理', value: 22, children: [
                    {label: '代理商', value: 221},
                    {label: '合作商', value: 222},
                ]}
        ]},
]
Mock.setup({ timeout: '200-1800' });
let dataSource = Mock.mock({
    'rows|53': [
        {
            'rate|1-5': 3,
            'id|+1': 1,
            'spec': ['0'],
            'obj': {desc: '格式a.b'},
            'list': [{desc: '格式list[0].desc', gg: '格式list[0].gg'}],
            'range|1-100': 3,
            'cat|1-6': 3, // 随机生成1-6的数字
            'markSale|1-800': 800, // 随机生成1-800的数字
            'price|1-1000': 100, // 随机生成1-100的数字
            'name': '@cname', // 随机生成中文名字,
            'createTime': '@datetime' // 随机生成日期时间
        }
    ]
})['rows'];
let dataSourceMap = {};
dataSource.forEach(item => {
    dataSourceMap[item['id']] = item
});
function getChildrenMenus() {
    return [
        {id: 1000, name:'删除', permType: 'Del', url: '/test/del', position: 'M'},
        {id: 1001, name:'编辑', permType: 'Edit', url: '/test/edit', position: 'T'},
        {id: 1002, name:'取消', permType: 'Cancel', url: '/test/cancel', position: 'T'},
        {id: 1003, name:'查询', permType: 'View', url: '/test/view', position: 'M'},
        {id: 1004, name:'保存', permType: 'Save', url: ''},
        {id: 1005, name:'新增', permType: 'Add', url: '/test/add', position: 'M'},
        {id: 1006, name:'详情', permType: 'Detail', url: '', position: 'T'},
    ];
}

Mock.setup({ timeout: '100-300' });
/* 获取字典数据 */
Mock.mock(RegExp('/core/dictData/listByType.*'), 'get', (options) => {
    // let query = Utils.getUrlParam(options.url)
    return Mock.mock({
        code: 200,
        message: '获取成功',
        data: {
            rows: spec
        }
    })
})
/* 注销登录 */
Mock.mock(RegExp('/logout.*'), 'get', (options) => {
    // let query = Utils.getUrlParam(options.url)
    return Mock.mock({
        code: 200,
        message: '注销成功',
        data: { }
    })
})
/* 获取系统配置 */
Mock.mock(RegExp('/env'), 'get', (options) => {
    return Mock.mock({
        code: 200,
        message: '获取成功',
        data: {
            env: {
                user: {avatar: '#'},
                config: {
                    main_url: {name: '主页名称', value: '/main'},
                    main_name: {name: '主页名称', value: '主页'},
                    work_name: {name: '首页名称', value: '工作台'},
                    sys_name: {name: '系统名称', value: '厦门由创源科技'}
                },
                profiles: ['dev']}
        }
    })
})
/* 获取菜单 */
Mock.mock(RegExp('/resources'), 'get', (options) => {
    // let query = Utils.getUrlParam(options.url)
    return Mock.mock({
        code: 200,
        message: '获取成功',
        data: {
            resources: [
                {id: 1, name: '组件管理', type: 'M', children: [
                        {id: 11, name: '页级组件', type: 'M', icon: 'iz-icon-page', children: [
                                {id: 111, name: '基础视图页', icon: 'iz-icon-default', type: 'V'
                                    , url: '/demo/basicView.html?id=3', children: getChildrenMenus()},
                                {id: 112, name: '抽屉视图页', icon: 'iz-icon-drawer', type: 'V'
                                    , url: '/demo/drawerView.html?type=aa', children: getChildrenMenus()},
                                // {id: 113, name: 'ModalView', icon: '', type: 'V', url: '/demo/modalView.html'},
                                {id: 114, name: '可编辑表页', icon: 'iz-icon-page-edit', type: 'V'
                                    , url: '/demo/editView.html', children: getChildrenMenus()},
                                {id: 116, name: 'diy视图页', type: 'V', url: '/demo/diyView.html'
                                    , children: getChildrenMenus(), status: 'hide'},
                                // {id: 117, name: 'slot表单视图页', type: 'V', url: '/demo/diyFormView.html'},
                                // {id: 118, name: 'slot表格视图页', type: 'V', url: '/demo/diyTableView.html'},
                            ]
                        },
                        {id: 22, name: '功能组件', type: 'M', icon: '', children: [
                                {id: 221, name: 'ModalView组件', icon: '', type: 'V', url: '/demo/modalView.html'},
                                // {id: 222, name: 'SlotFormView组件', type: 'V', url: '/demo/slotFormView.html'}
                            ]},
                    ]
                }
            ]
        }
    })
})
/* 新增数据方法模拟 */
Mock.mock(RegExp('/test/add.*'), 'post', (options) => {
    let body = JSON.parse(options['body'])
    let lastId = dataSource[dataSource.length - 1]['id']
    body['id'] = lastId + 1
    dataSourceMap[lastId] = body
    Logger.infoLog('新增保存数据', '', body)
    dataSource = Object.values(dataSourceMap)
    return Mock.mock({
        code: 200,
        message: '新增成功',
        data: {}
    })
})
/* 删除数据方法模拟 */
Mock.mock(RegExp('/test/del.*'), 'post', (options) => {
    let body = JSON.parse(options['body'])
    delete dataSourceMap[body[0]]
    Logger.infoLog('删除数据', '', body)
    dataSource = Object.values(dataSourceMap)
    return Mock.mock({
        code: 200,
        message: '删除成功',
        data: {}
    })
})
/* 查询方法模拟 */
Mock.mock(RegExp('/test/view.*'), 'get', (options) => {
    let query = Utils.getUrlParam(options.url)
    let startNum = (parseInt(query['current']) - 1) * parseInt(query['size'])
    let endNum = startNum + parseInt(query['size'])
    startNum = isNaN(startNum) ? 0 : startNum
    endNum = isNaN(endNum) ? 8 : endNum
    Logger.infoLog('查询数据', '', options.url)
    return Mock.mock({
        code: 200,
        message: '获取成功',
        data: {
            total: 53,
            rows: dataSource.slice(startNum, endNum)
        }
    })
})
/* 数据详情方法模拟 */
Mock.mock(RegExp('/test/edit.*'), 'get', (options) => {
    let query = Utils.getUrlParam(options.url)
    let id = parseInt(query['id'])
    return Mock.mock({
        code: 200,
        message: '获取成功',
        data: {
            detail: dataSourceMap[id]
        }
    })
})
/* 保存编辑方法模拟 */
Mock.mock(RegExp('/test/edit.*'), 'post', (options) => {
    let body = options['body']
    if (body) {
        body = JSON.parse(body)
        let oriData = dataSourceMap[body.id]
        Utils.assignProperty(oriData, body)
    }
    Logger.infoLog('编辑保存数据', '', body)
    return Mock.mock({
        code: 200,
        message: '提交成功',
        data: {}
    })
})
/* stree类型数据获取模拟 */
Mock.mock(RegExp('/test/stree.*'), 'get', (options) => {
    // let query = Utils.getUrlParam(options.url)
    return Mock.mock({
        code: 200,
        message: '获取成功',
        data: {
            rows: [
                {id: 1, name: '福建', children: [
                        {id: 11, name: '厦门市'},
                        {id: 12, name: '泉州市'}
                    ]
                }
            ]
        }
    })
})
/* 测试数据 */
export default {
    mates: [
        {field: 'name', title: '产品名称', type: 'text', required: true, align: 'left'},
        {field: 'price', title: '产品价格', type: 'text', editable: true},
        {field: 'spec', title: '规格', type: 'checkbox', data: spec, editable: true, width: 150},
        {field: 'cat', title: '类别', type: 'select', data: productCat, editable: true
            , config: {showSearch: true}},
        {field: 'type', title: '类型', type: 'radio', data: productType},
        {field: 'range', title: '下单数量', type: 'slider'},
        {field: 'markSale', title: '市场价', type: 'number', editable: true},
        {field: 'ext.desc', title: '说明'},
        {field: 'createTime', title: '上架时间', type: 'date'},
        {field: 'action', title: '操作', type: 'action', width: 260, fixed: 'right'}
    ],
    data: dataSource,
    config: config,
    groupConfig: groupConfig,
    childrenMetas: [
        {title: '基础信息', children: [
                {field: 'name', title: 'text', required: true, align: 'left'},
                {field: 'spec', title: 'checkbox', type: 'checkbox', dictType: 'spec'},
                {field: 'radio', title: 'radio', type: 'radio', dictType: 'spec'},
                {field: 'price', title: 'number', type: 'number', validator: (rule, val, call) => {
                        call()
                    }, sorter: function (a, b) {
                        return a.price - b.price
                    }},
                {field: 'createTime', title: 'date', type: 'date', default: '2019-12-10 09:02'}
            ]
        },
        {title: '下拉框组件', children: [
                {field: 'cat', title: 'select', type: 'select', data: productCat, required: true, min: 2,
                    config: {mode: 'multiple'}},
                {field: 'type', title: 'cascade', type: 'cascade', data: productType, formatter: (val, row, col, text) => {
                        return '<a href="/editView.html">' + text + '</a>'
                    }, disabled: false},
                {field: 'area', title: 'stree', type: 'stree', url: '/test/stree', min: 2, editable: true,
                    config: {
                        showSearch: true,
                        treeCheckable: true
                    },
                    event: {
                        select: (val, model) => {
                            console.log(val)
                        },
                        change: (val, model) => {
                            console.log(val)
                        }
                    }
                },
                {field: 'tree', title: 'tree', type: 'tree', url: '/test/stree', config: {
                        defaultExpandAll: true, checkedKeys: [1], showLine: true, expandedAll: true
                    }, event: {change: (val, model, meta)=>{

                        }}}
            ]
        },
        {title: '其他组件', children: [
                {field: 'obj.desc', title: '对象'},
                {field: 'list[0].gg', title: '数组', isTable: false, default: 3},
                {field: 'markSale', title: '表单slot', type: 'number', max: 4, config: {extra: '注：市场价不能小于0'}},
                {field: 'rate', title: 'rate', type: 'rate', config: {count: 8, tootips: ['低评分']}},
                {field: 'range', title: 'slider', type: 'slider', config: {step: 3, max: 120}},
                {field: 'productPic', title: 'upload', type: 'upload'
                    , config: {action: 'http://loacalhost:8088/pay/upload/vsp'}},
            ]},
        {field: 'editor', title: 'editor', type: 'editor', span: [3, 21, 23], default: '这是富文本编辑器', isTable: false},
        {field: 'action', title: '操作', type: 'action', width: 260, fixed: 'right'}
    ],
    groupMetas: [
        {title: '基础信息', metas: [
                {field: 'name', title: 'text', required: true, align: 'left'},
                {field: 'spec', title: 'checkbox', type: 'checkbox', dictType: 'spec'},
                {field: 'radio', title: 'radio', type: 'radio', dictType: 'spec'},
                {field: 'rate', title: 'rate', type: 'rate', config: {count: 8, tootips: ['低评分']}},
                {field: 'range', title: 'slider', type: 'slider', config: {step: 3, max: 120}},
                {field: 'createTime', title: 'date', type: 'date', default: '2019-12-10 09:02'}
            ]
        },
        {field: 'editor', title: 'editor', type: 'editor', width: -1, span: [3, 21, 23], default: '这是富文本编辑器'},
        {field: 'action', title: '操作', type: 'action', width: 260, fixed: 'right'}
    ],
    searchMates: searchMetas,
    topSearchMetas: topSearchMetas,
}
