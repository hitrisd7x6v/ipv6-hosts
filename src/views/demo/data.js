import Vue from 'vue'
import Mock from 'mockjs'
import '@/components/ivzone.css'
import Ivzone from '@/components/ivzone'
import Cache from '@/utils/cache.utils'
import Utils from '@/utils/basic.utils'
import Logger from '@/utils/logger.utils' // 缓存

Vue.use(Ivzone)

const add = Cache.getActionMeta('Add', {url: '/test/add', callBack: (row) => {
        return new Promise((resolve, reject) => {
            console.log(row)
            return resolve()
        })
    }});
const del = Cache.getActionMeta('Del', {url: '/test/del'})
const edit = Cache.getActionMeta('Edit', {url: '/test/edit'})
const cancel = Cache.getActionMeta('Cancel', {})
const query = Cache.getActionMeta('View', {url: '/test/view'})
const save = Cache.getActionMeta('Save', {})
const actionMetas = {Add: add, Edit: edit, View: query, Del: del, Save: save, Cancel: cancel}
Cache.pageActionMates = actionMetas

const productCat = [
    {label: '果汁', value: 1}, {label: '茶', value: 3},
     {label: '母婴产品', value: 4}, {label: '电子产品', value: 5},
     {label: '护肤产品', value: 6}
]
const productType = [
    {label: '生活用品', value: 1}, {label: '体育用品', value: 2}
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
        pagination: {}
    },
    search: { }
}
const topSearchMetas = [
    {field: 'name', title: '产品名称', type: 'text', span: 8, ls: 6, fs: 16},
    {field: 'spec', title: '规格', type: 'checkbox', span: 8, fs: 16, data: spec},
    {field: 'type', title: '产品类型', type: 'radio', span: 8, ls: 6, fs: 18, data: productType}
]
const searchMetas = [
    {field: 'name', title: '产品名称', type: 'text', event: {}},
    {field: 'spec', title: '规格', type: 'checkbox', data: spec},
    {field: 'cat', title: '产品类别', type: 'select', data: productCat},
    // {field: 'type', title: '产品类型', type: 'radio', data: productType, span: [6, 18]},
    // {field: 'createTime', title: '上架时间', type: 'date', default: '2019-12-10 09:02'}
]
Mock.setup({ timeout: '200-1800' })
let dataSource = Mock.mock({
    'rows|53': [
        {
            'rate|1-5': 3,
            'id|+1': 1,
            'spec': [],
            'range|1-100': 3,
            'cat|1-6': 3, // 随机生成日期时间
            'markSale|1-800': 800, // 随机生成1-800的数字
            'price|1-1000': 100, // 随机生成1-100的数字
            'name': '@cname', // 随机生成中文名字,
            'createTime': '@datetime' // 随机生成1-5的数字
        }
    ]
})['rows']
let dataSourceMap = {}
dataSource.forEach(item => {
    dataSourceMap[item['id']] = item
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
        {field: 'spec', title: '规格', type: 'checkbox', data: spec},
        {field: 'cat', title: '产品类别', type: 'select', data: productCat},
        {field: 'type', title: '产品类型', type: 'radio', data: productType, config: {extra: 'lksdf'}},
        {field: 'range', title: '下单数量', type: 'slider'},
        {field: 'markSale', title: '市场价', type: 'number', editable: true},
        {field: 'ext.desc', title: '说明'},
        {field: 'createTime', title: '上架时间', type: 'date'},
        {field: 'action', title: '操作', type: 'action', width: 240}
    ],
    data: dataSource,
    config: config,
    groupConfig: groupConfig,
    groupMetas: [
        {title: '基础信息', metas: [
                {field: 'name', title: '产品名称', tableSlot: 'name', formSlot: 'fname', required: true, align: 'left'},
                {field: 'area', title: '产地', type: 'stree', url: '/test/stree', min: 2, editable: true,
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
                }
            ]
        },
        {title: '产品属性', metas: [
                {field: 'spec', title: '规格', type: 'checkbox', dictType: 'spec'},
                {field: 'cat', title: '产品类别', type: 'select', data: productCat, required: true, min: 2,
                     config: {mode: 'multiple'}},
                {field: 'type', title: '产品类型', type: 'cascade', data: productType, formatter: (val, row, col, text) => {
                        return '<a href="/editView.html">' + text + '</a>'
                    }, disabled: false}
            ]},
        {title: '价格信息', metas: [
                {field: 'price', title: '产品价格', type: 'text', validator: (rule, val, call) => {
                        call()
                    }, event: {
                        change(val, {form, bind}) {
                            bind({markSale: val - 1.2, 'ext.desc': `产品价格是${val}`})
                        }
                    }},
                {field: 'markSale', title: '市场价', type: 'number', max: 4, config: {extra: '注：市场价不能小于0'}}
            ]},
        {title: '其他信息', metas: [
                {field: 'createTime', title: '上架时间', type: 'date', default: '2019-12-10 09:02'},
                {field: 'rate', title: '评分', type: 'rate', config: {count: 8, tootips: ['低评分']}},
                {field: 'ext.desc', title: '说明', event: {
                        change: (val, {form, bind}) => {
                            console.log(val)
                        }
                    }},
                {field: 'range', title: '下单数量', type: 'slider', config: {step: 3, max: 120}}
            ]},
        {field: 'action', title: '操作', type: 'action', width: 260, fixed: 'right'}
    ],
    searchMates: searchMetas,
    actionMetas: actionMetas,
    topSearchMetas: topSearchMetas
}
