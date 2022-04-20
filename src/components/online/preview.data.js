import Vue from 'vue'
import Mock from 'mockjs'
import Http from "@/utils/http.utils";
import Utils from "@/utils/basic.utils";
import Logger from "@/utils/logger.utils";
import Global from "@/components/global.config"

let DictTypeList = null;
let DictTypeDataMap = {};
let ParentMenus = Global['menus'];

window.CacheApi = require("@/utils/cache.utils").default;
window.CacheApi.currentMenu = { // 模拟当前菜单
    id: 'preview', name: '', type: 'V',
    children: [
        {id: 1000, name:'删除', permType: 'Del', url: '/ovt/del', position: 'AM'},
        {id: 1001, name:'编辑', permType: 'Edit', url: '/ovt/edit', position: 'T'},
        {id: 1002, name:'取消', permType: 'Cancel', url: '/ovt/cancel', position: 'T'},
        {id: 1003, name:'查询', permType: 'View', url: '/ovt/view', position: 'M'},
        {id: 1004, name:'保存', permType: 'Save', url: ''},
        {id: 1005, name:'新增', permType: 'Add', url: '/ovt/add', position: 'M'},
        {id: 1006, name:'详情', permType: 'Detail', url: '', position: 'T'},
    ]
};

let DemoDictType = [
    {label: '性别', value: 'sex'},
    {label: '状态', value: 'status'},
    {label: '开关', value: 'switch'},
    {label: '树格式', value: 'tree'},
];
let DemoDictDataMap = {
    sex: [
        {label: '男', value: 'man'},
        {label: '女', value: 'woman'},
        {label: '未知', value: 'unknown'},
    ],
    status: [
        {label: '成功', value: 'success'},
        {label: '失败', value: 'fail'},
    ],
    switch: [
        {label: '开', value: 'open'},
        {label: '关', value: 'close'},
    ],
    tree: [
        {label: '水果', value: 'apple', children: [
                {label: '梨', value: 'li'},
                {label: '桃子', value: 'taozi'},
            ]
        },
        {label: '茶叶', value: 'tea', children: [
                {label: '铁观音', value: 'tgy'},
                {label: '龙井', value: 'lj'},
            ]
        }
    ]
};
let DemoParentMenus = [
    {label: '系统管理', value: 1, children: [
            {label: '用户管理', value: 2},
            {label: '角色管理', value: 3},
        ]
    },
    {label: '开发管理', value: 11, children: [
            {label: '在线生成', value: 12}
        ]
    }
];

let keyField = 'id';
let dataSource = [];
let dataSourceMap = {};
if (process.env.NODE_ENV === 'development') {
    Global.dictUrl = "/ovt/listByType";
    Global.dictListUrl = "/ovt/dictList";
}
/* 获取字典数据 */
Mock.mock(RegExp('/ovt/dictList.*'), 'get', (options) => {
    Logger.infoLog('mock查询字典类型列表', '', options.url)
    return Mock.mock({
        code: 200,
        message: '获取成功',
        data: {
            rows: DemoDictType
        }
    })
});
/* 获取字典数据 */
Mock.mock(RegExp('/ovt/listByType.*'), 'get', (options) => {
    let query = Utils.getUrlParam(options.url)
    let dictData = DemoDictDataMap[query.type];
    Logger.infoLog('mock查询字典类型列表', '', options.url)
    return Mock.mock({
        code: 200,
        message: '获取成功',
        data: {
            rows: dictData
        }
    })
});
/* 查询方法模拟 */
Mock.mock(RegExp('/ovt/view.*'), 'get', (options) => {
    let query = Utils.getUrlParam(options.url);
    let startNum = (parseInt(query['current']) - 1) * parseInt(query['size'])
    let endNum = startNum + parseInt(query['size'])
    startNum = isNaN(startNum) ? 0 : startNum
    endNum = isNaN(endNum) ? 8 : endNum
    Logger.infoLog('mock查询列表数据', '', options.url)
    return Mock.mock({
        code: 200,
        message: '获取成功',
        data: {
            total: dataSource.length,
            rows: dataSource.slice(startNum, endNum)
        }
    })
});
/* 新增数据方法模拟 */
Mock.mock(RegExp('/ovt/add.*'), 'post', (options) => {
    let body = JSON.parse(options['body']);
    let lastId = dataSource[dataSource.length - 1][keyField];
    body[keyField] = lastId + 1;
    dataSourceMap[lastId] = body;
    Logger.infoLog('mock新增数据', '', options);
    dataSource = Object.values(dataSourceMap);
    return Mock.mock({
        code: 200,
        message: '新增成功',
        data: {}
    })
})
/* 删除数据方法模拟 */
Mock.mock(RegExp('/ovt/del.*'), 'post', (options) => {
    let ids = options['body'];
    try {
        ids = JSON.parse(ids)
        if(ids instanceof Array) {
            ids.forEach(id => delete dataSourceMap[id]);
        } else {
            delete dataSourceMap[ids]
        }
    } catch (e) {
        delete dataSourceMap[ids]
    }

    Logger.infoLog('mock删除数据', '', options)
    dataSource = Object.values(dataSourceMap)
    return Mock.mock({
        code: 200,
        message: '删除成功',
        data: {}
    })
});
/* 数据详情方法模拟 */
Mock.mock(RegExp('/ovt/edit.*'), 'get', (options) => {
    let query = Utils.getUrlParam(options.url)
    let id = isNaN(query[keyField]) ?
        query[keyField] : parseInt(query[keyField]);

    return Mock.mock({
        code: 200,
        message: '获取成功',
        data: {
            detail: dataSourceMap[id]
        }
    })
})
/* 保存编辑方法模拟 */
Mock.mock(RegExp('/ovt/edit.*'), 'post', (options) => {
    Logger.infoLog('mock编辑数据', '', options)
    return Mock.mock({
        code: 200,
        message: '提交成功',
        data: {}
    })
});

Vue.prototype.$page = require("@/components/page.config").default;

export default {

    resolverMockMeta(metas, model) {
        let mockMeta = {};
        keyField = model['keyField'];
        let isUuid = model['keyType'] == 'uuid';
        let keyMeta = isUuid ? `${keyField}` : `${keyField}|+1`;

        mockMeta[keyMeta] = isUuid ? '@guid' : 1;
        metas.forEach((meta)=>{
            let model = meta.model;
            if(meta.type == 'modal') return;

            let type = model.fieldType;
            if(meta.type == 'number' || meta.type == 'slider') {
                mockMeta[`${model.name}|${model.min}-${model.max}`] = 1
            } else if(Utils.isOptionType(meta.type)) {
                let options = model['options'];
                if(options) {
                    let map = options.map(option => option.value);
                    if (meta.type == 'checkbox' ||
                        (meta.type == 'select' && model['mode'] == "multiple")) {
                        mockMeta[`${model.name}`] = (val) => {
                            let number = parseInt(Math.random() * map.length, 10);
                            return [map[number]];
                        };
                    } else {
                        mockMeta[`${model.name}|1`] = map;
                    }
                }
            } else if(type == 'TEXT' || type == 'MEDIUMTEXT') {
                mockMeta[`${model.name}`] = `@ctitle(6)`;
            } else if(type == 'VARCHAR' || type == 'CHAR') {
                mockMeta[`${model.name}`] = `@ctitle(6)`;
            } else if(type == 'INT' || type == 'BIGINT') {
                mockMeta[`${model.name}`] = '@integer';
            } else if(type == 'FLOAT' || type == 'DOUBLE') {
                mockMeta[`${model.name}`] = '@float';
            } else if(type == 'DATE' || type == 'DATETIME' || type == 'TIME') {
                mockMeta[`${model.name}`] = '@'+type.toLowerCase();
            } else {
                mockMeta[`${model.name}`] = '@ctitle(1)';
            }
        });
        return mockMeta;
    },
    createMockData(metas, model) {
        keyField = model['keyField'];
        let mockDataMeta = this.resolverMockMeta(metas, model);

        dataSource = Mock.mock({
            'rows|25': [mockDataMeta]
        })['rows'];

        dataSourceMap = {};
        dataSource.forEach(item => {
            dataSourceMap[item[model['keyField']]] = item
        });
    },

    getDictTypeList() {
        if(DictTypeList) return DictTypeList;
        DictTypeList = [];
        // 使用者自定义了字典类型列表
        Http.get(Global.dictListUrl).then(resp=>{
            resp.rows.forEach(item => {
                DictTypeList.push({label: item[Global.dictLabelField], value: item[Global.dictValueField]});
            })
        });
        return DictTypeList;
    },

    getDictData(dictType) {
        if(DictTypeDataMap[dictType]) {
            return DictTypeDataMap[dictType];
        }

        let dictData = [];
        // 使用者自定义了字典类型列表
        Http.get(Global.dictUrl, {params: {type: dictType}}).then(resp=>{
            if(resp.rows) {
                resp.rows.forEach(item => {
                    dictData.push({label: item[Global.dictLabelField], value: item[Global.dictValueField]});
                });
            } else {
                console.log("查询不到字典数据: " + dictType);
            }

            DictTypeDataMap[dictType] = dictData;
        });
        return dictData;
    },
    getParentMenus() {
        return ParentMenus ? ParentMenus : DemoParentMenus;
    }
}
