/* 注册到window的全局对象, iframe页面可以通过window.parent.CacheApi获取 */
import Http from './http.utils'
import Utils from './basic.utils'
import Logger from './logger.utils'
import Global from '../components/global.config'

function getActionPromise (model) {
    return new Promise((resolve, reject) => {
        return resolve({model: model, success: null, fail: null})
    })
}
const VoidEventHandle = (e) => {} // 空事件处理
const DisabledHandle = (row) => { return false } // 默认不禁用
/**
 * 页面操作按钮元数据(默认, 会根据数据库的数据动态增减)
 * 其中编辑和新增的url指的是编辑保存和新增保存的链接
 * access: false, 说明没有权限, 默认为false
 * @type {{Add: {icon: string, callBack: (function(*): Promise<any>), label: string}, Import: {icon: string, callBack: (function(*): Promise<any>), label: string}, Query: {icon: string, callBack: (function(*): Promise<any>), label: string}, Export: {icon: string, callBack: (function(*): Promise<any>), label: string}, Del: {icon: string, callBack: (function(*): Promise<any>), label: string}, Edit: {icon: string, callBack: (function(*): Promise<any>), label: string}}}
 */
const operaMates = {
    View: {id: 'view', icon: 'iz-icon-chaxun', color: 'primary', position: 'M', sort: 1,
        url: null, disabled: DisabledHandle, access: false, label: '查询', callBack: (model, page) => getActionPromise(model)},
    Add: {id: 'add', icon: 'iz-icon-add', url: null, color: '#108ee9', position: 'M', sort: 5,
         disabled: DisabledHandle, access: false, label: '新增', callBack: (model) => getActionPromise(model)},
    Edit: {id: 'edit', icon: 'iz-icon-edit', url: null, color: '#2db7f5', position: 'T', sort: 10,
         disabled: DisabledHandle, access: false, label: '编辑', callBack: (model) => getActionPromise(model)},
    Cancel: {id: 'cancel', icon: 'iz-icon-cancel', color: 'orange', position: '', sort: 15,
        url: null, disabled: DisabledHandle, access: false, label: '取消', callBack: (model) => getActionPromise(model)},
    Save: {id: 'save', icon: 'iz-icon-tijiao', color: '#87d068', position: '', sort: 20,
        url: null, disabled: DisabledHandle, access: false, label: '提交', callBack: (model) => getActionPromise(model)},
    Status: {id: 'status', icon: 'iz-icon-status', color: '#9dd7ff', position: '', sort: 25,
        url: null, disabled: DisabledHandle, access: false, label: '状态', callBack: (model) => getActionPromise(model)},
    Detail: {id: 'detail', icon: 'iz-icon-detail', color: 'blue', position: 'T', sort: 30,
        url: null, disabled: DisabledHandle, access: false, label: '详情', callBack: (model) => getActionPromise(model)},
    Import: {id: 'import', icon: 'iz-icon-import', color: 'blue', position: 'M', sort: 50,
        url: null, disabled: DisabledHandle, access: false, label: '导入', callBack: (model) => getActionPromise(model)},
    Export: {id: 'export', icon: 'iz-icon-export', color: 'blue', position: 'M', sort: 55,
        url: null, disabled: DisabledHandle, access: false, label: '导出', callBack: (model) => getActionPromise(model)},
    Default: {id: 'default', icon: 'iz-icon-default', color: 'blue', position: 'T', sort: 60,
        url: null, disabled: DisabledHandle, access: false, label: '默认', callBack: (model) => getActionPromise(model)},
    Reset: {id: 'reset', icon: 'iz-icon-reset', color: '#ffc609', position: 'M', sort: 85,
        url: null, disabled: DisabledHandle, access: false, label: '重置', callBack: (model) => getActionPromise(model)},
    Del: {id: 'del', icon: 'iz-icon-delete', url: null, color: '#f50', position: 'T', sort: 90,
        disabled: DisabledHandle, access: false, label: '删除', callBack: (model) => getActionPromise(model)}
}
export default {
    env: null, // 环境配置
    izCtx: '', // http请求上下文路径
    izStx: '',
    izColon: true, // 是否显示表单label后面的冒号 ':'
    rootKeys: [], // 所有有子菜单的菜单key
    urlMenuMap: {}, // 地址url和菜单对象的映射
    taskBarData: [], // 任务栏上已经打开的菜单项
    DictMapCache: {}, // {dictType-> [dictData]}
    currentMenu: {}, // 当前激活的菜单, 子iframe需要用到
    pageActionMates: {}, // 所有页面的动作功能点缓存 菜单id和与之对应的功能点
    DictDataMapCache: {}, // {dictType -> dictValue -> dictLabel}
    MetaConfigCache: { // 其他的配置参考antd-vue https://www.antdv.com/docs/vue/introduce-cn/
        stree: {valueField: 'id', labelField: 'name', queryField: 'rows',
            treeNodeFilterProp: 'label',
            treeExpandedKeys: [],
            dropdownStyle: {maxHeight: '320px'},
                filterTreeNode: (value, node) => {
                    return node['data']['props']['title'].includes(value)
                }
            },
        select: {valueField: 'id', labelField: 'name', queryField: 'rows',
            maxTagCount: 2, // 在tags或者multiple 模式下最大能选择多少个
            tokenSeparators: [','] // 自动分词分隔符
        },
        radio: {valueField: 'id', labelField: 'name', queryField: 'rows'},
        checkbox: {valueField: 'id', labelField: 'name', queryField: 'rows'},
        text: {
            enterSearch: true // 搜索框text表单, 按下enter键是否搜索
        },
        upload: {
            limit: 1, // 图片限制, 默认五张
            FileList: [], // 文件列表
            respField: 'url', // 服务端响应的字段
            listType: 'picture-card',
        },
        tree: {checkable: true, checkedKeys: [], expandedKeys: [], selectedKeys: []
            , valueField: 'id', labelField: 'name', queryField: 'rows'
            , replaceFields: {title: 'label', key: 'value', children: 'children'}},
        switch: {},
        number: {},
        slider: {},
        cascade: {},
        date: {},
        rate: {}
    },
    StoreCache: { // 子页面的数据缓存
        urlMap: {}, // url对应的数据
        getPageCache (url) {
            return this.urlMap[Utils.getUrlNotParam(url)]
        },
        removePageCache (url) {
            this.urlMap[Utils.getUrlNotParam(url)] = null
        },
        getPageStore (url, key) {
            let pageCache = this.getPageCache(Utils.getUrlNotParam(url))
            return pageCache ? pageCache[key] : null
        },
        putPageStore (url, key, val) {
            let urlKey = Utils.getUrlNotParam(url)
            let pageCache = this.getPageCache(urlKey)
            if (pageCache) {
                pageCache[key] = val
            } else {
                this.urlMap[urlKey] = {}
                this.urlMap[urlKey][key] = val
            }
        }
    },
    MetaDefaultEvent: {
        text: {click: VoidEventHandle, change: VoidEventHandle},
        date: {click: VoidEventHandle, change: VoidEventHandle, openChange: VoidEventHandle,
                    panelChange: VoidEventHandle, ok: VoidEventHandle},
        month: {click: VoidEventHandle, change: VoidEventHandle, openChange: VoidEventHandle,
                    panelChange: VoidEventHandle, ok: VoidEventHandle},
        week: {click: VoidEventHandle, change: VoidEventHandle, openChange: VoidEventHandle,
                    panelChange: VoidEventHandle, ok: VoidEventHandle},
        dateRange: {click: VoidEventHandle, change: VoidEventHandle, openChange: VoidEventHandle,
                    panelChange: VoidEventHandle, ok: VoidEventHandle},
        radio: {click: VoidEventHandle, change: VoidEventHandle},
        number: {click: VoidEventHandle, change: VoidEventHandle},
        slider: {click: VoidEventHandle, change: VoidEventHandle, afterChange: VoidEventHandle},
        cascade: {click: VoidEventHandle, change: VoidEventHandle},
        switch: {click: VoidEventHandle, change: VoidEventHandle},
        tree: {dragend: VoidEventHandle, dragenter: VoidEventHandle, dragleave: VoidEventHandle
            , dragstart: VoidEventHandle, drop: VoidEventHandle, dragover: VoidEventHandle
            , expand: (expandKeys, model, meta, node)=>{meta.config.expandedKeys = expandKeys;}
            , check: (checkedKeys, model, meta, node)=>{meta.config.checkedKeys=checkedKeys}
            , load: VoidEventHandle, rightClick: VoidEventHandle, select: VoidEventHandle},
        rate: {click: VoidEventHandle, change: VoidEventHandle, keydown: VoidEventHandle, hoverChange: VoidEventHandle},
        stree: {click: VoidEventHandle, change: VoidEventHandle, search: VoidEventHandle, select: VoidEventHandle
            , treeExpand: (expandedKeys, model, meta)=>{meta.config.treeExpandedKeys = expandedKeys}},
        select: {click: VoidEventHandle, change: VoidEventHandle, select: VoidEventHandle, search: VoidEventHandle, deselect: VoidEventHandle, inputKeydown: VoidEventHandle}
    },
    pageDefaultConfig: {
        form: {
            gutter: 2,
            isInit: true, // 是否已经初始化
            column: null, // 编辑表单列, 如果type是default则为1 group则为3
            addTitle: '', // 新增标题
            editTitle: '', // 编辑标题
            type: 'default', // 表单布局类型 default || group
            align: 'middle', // 垂直对齐方式
            justify: 'start', // 水平对齐方式
            formType: 'edit', // 编辑类型
            bindType: null, // 数据绑定类型, both(双向绑定), void(不绑定)
            editSource: 'local', // 编辑时的数据来源, local(本地) || remote(远程)
            layout: 'horizontal',
            hasFeedback: true, // 校验图标, 只有再需要有校验规则的时候才有
            hideRequiredMark: false, // 是否隐藏必填标志
            submitTip: '数据提交中...',
            mountedFinished: (formVue) => {} // 表组件更新完成
        }, // 编辑表单配置
        search: { // 搜索表单配置
            gutter: 2,
            column: 4, // 搜索栏表单列
            viewTop: null, // 搜索框显示在顶栏
            align: 'middle', // 垂直对齐方式
            justify: 'start', // 水平对齐方式
            formType: 'search', // 搜索框
            layout: 'horizontal'
        },
        table: { // 表格配置
            rowKey: "id", // 默认唯一标识
            isInit: true, // 是否已经初始化
            size: 'small', // 表的默认尺寸 default | middle | small
            bordered: true, // 显示边框
            indentSize: 16, // 树形表格子行缩进的长度
            pagination: false, // 默认不显示
            position: 'bottom', // 分页器显示的位置 'top' | 'bottom' | 'both'
            delField: 'id', // 声明使用哪个字段作为删除字段
            queryField: 'rows', // 查询字段
            scroll: {x: 0, y: 0}, // 表格的宽高
            expandedRowKeys: null, // 可控制的展开行的key
            expandRowByClick: false, // 是否点击展开行
            defaultExpandAllRows: true, // 默认展开所有行,
            defaultExpandedRowKeys: null, // 要展开行的数组
            childrenColumnName: 'children', // 树形表格的列名
            rowClassName: () => 'iz-table-row', // 表格行列名
            mountedFinished: (tableVue) => {}, // 表格组件更新完成
            locale: {filterConfirm: '确定', filterReset: '重置', emptyText: '暂无数据'} //
        },
        detail: {
            mask: true,
            isInit: true, // 是否已经初始化
            height: '256px',
            title: '详情',
            zIndex: 1000,
            width: null,
            closable: true,
            detailField: 'id',
            placement: 'right', //'top' | 'right' | 'bottom' | 'left'
            maskClosable: true,
            destroyOnClose: false,
        }
    },
    defaultConfig: {
        table: {
            isInit: true, // 是否已经初始化
            size: 'small', // 表的默认尺寸 default | middle | small
            bordered: true, // 显示边框
            indentSize: 16, // 树形表格子行缩进的长度
            pagination: false, // 默认不显示
            position: 'bottom', // 分页器显示的位置 'top' | 'bottom' | 'both'
            queryField: 'rows', // 查询字段
            scroll: {x: 0, y: 0}, // 表格的宽高
            rowKey: "id", // 默认唯一标识
            expandedRowKeys: null, // 可控制的展开行的key
            expandRowByClick: false, // 是否点击展开行
            defaultExpandAllRows: true, // 默认展开所有行,
            defaultExpandedRowKeys: null, // 要展开行的数组
            childrenColumnName: 'children', // 树形表格的列名
            rowClassName: () => 'iz-table-row', // 表格行列名
            mountedFinished: (tableVue) => {}, // 表格组件更新完成
            locale: {filterConfirm: '确定', filterReset: '重置', emptyText: '暂无数据'} //
        },
        form: {
            gutter: 2,
            isInit: true, // 是否已经初始化
            column: 1, // 编辑表单列, 如果type是default则为1 group则为3
            type: 'default', // 表单布局类型 default || group
            align: 'middle', // 垂直对齐方式
            justify: 'start', // 水平对齐方式
            formType: 'edit', // 编辑类型
            bindType: null, // 数据绑定类型, both(双向绑定), void(不绑定)
            editSource: 'local', // 编辑时的数据来源, local(本地) || remote(远程)
            layout: 'horizontal',
            hasFeedback: true, // 校验图标, 只有再需要有校验规则的时候才有
            hideRequiredMark: false, // 是否隐藏必填标志
            submitTip: '数据提交中...',
            mountedFinished: (formVue) => {} // 表组件更新完成
        }, // 编辑表单配置
    },
    /* 获取菜单 */
    getResources () {
        return Http.get(Global.resourcesUrl).then((resp) => {
            this.resolverMenuMap(resp['resources'])
            return resp['resources']
        }).catch(reason => {
            return reason
        })
    },
    getConfig () {
        return Http.get(Global.envUrl).then(resp => {
            return resp['env']
        }).catch(reason => {
            Logger.warningLog('获取项目环境配置失败：', reason, Global.envUrl)
            return {user: {avatar: '#'}, config: {
                    work_name: {name: '主页名称', value: '工作台'},
                    expand_mode: {name: '菜单模式', value: 'single'},
                    sys_name: {name: '系统名称', value: '厦门由创源科技'}
                }, profiles: ['dev']}
        })
    },
    resolverMenuMap (menus) {
        menus.forEach(menu => {
            if (menu['type'] === 'V') {
                let {uri} = Utils.resolverUrl(menu['url']);
                menu['url'] = uri;
                this.urlMenuMap[menu.url] = menu;
            } else if (menu['children']) {
                this.rootKeys.push(menu['id']);
                this.resolverMenuMap(menu['children'])
            }
        })
    },
    getCurrentMenu() {
        return Utils.clone(this.currentMenu);
    },
    getActionMeta (action, option) {
        let upperCase = Utils.firstUpperCase(action);
        let actionMate = operaMates[upperCase];
        if (!actionMate) {
            return Object.assign({id: action, color: 'blue'
                , icon: '', callBack: (model) => getActionPromise(model)}, option)
        }
        return Object.assign({}, actionMate, option)
    },
    getActionMates () {
        let pageActionMate = {};
        let points = this.currentMenu['children']; // 返回当前菜单的功能点
        if (Utils.isBlank(points)) {
            Logger.warningLog('当前视图功能点不存在', '新增要操作的功能点', this.currentMenu);
            return {}
        }

        points.forEach(item => {
            let action = item['permType'];
            if (!action) {
                return Logger.warningLog('此功能不存在权限类型', '请设置permType的值到Add、Edit...', item)
            }

            if (pageActionMate[action]) return;

            // 如果有新增和编辑的权限 则添加保存和取消的动作
            if (action === 'Add' || action === 'Edit') {
                pageActionMate['Save'] = this.getActionMeta('Save', {});
                pageActionMate['Cancel'] = this.getActionMeta('Cancel', {})
            }

            let operaMate = this.getActionMeta(action, {
                url: item['url'], label: item['name'], position: item['position']
            });

            if (Utils.isNotBlank(operaMate)) {
                pageActionMate[action] = operaMate
            }
        });
        return pageActionMate;
    },
    activityMenuRegister(activityMenu) {},
    /**
     * 再任务栏里面打开一个新菜单
     * @param location {url: '/article', name: '文章管理', params: {id: 1}}<br>
     *     url: 要跳转的url
     *     name: 任务栏名称
     *     params: 跳转时的url参数
     *     children: 动作权限列表 eg. [{url: '', access: true, position: 'T'
     *              , label: '编辑', icon: '图标', callBack:(model)=>new Promise(((resolve, reject) => resolve()}]
     */
    openMenu (location) {
        if (!location) throw new Error('未指定路由配置');

        let menu, query = {}, urlParams;
        let target = '_blank', {uri} = Utils.resolverUrl(window.location.href);
        if (Utils.isObject(location)) {
            target = location.target || target;
            let path = location.url || location.path;
            query = location.query || location.params || {};
            // 传入完整的url地址, 说明不是打开本系统页面
            if(path.startsWith("http")) {
                menu = this.urlMenuMap[path];
                if(!menu) {
                    menu = {url: path, name: location.name};
                    this.urlMenuMap[path] = menu;
                }
            } else { // 打开本系统页面
                let {uri, params} = Utils.resolverUrl(path);
                urlParams = params;
                menu = this.urlMenuMap[uri]
                if (!menu) throw new Error(`不存在此功能或无权限：${uri}`)
            }
        } else { // 如果location是字符串, 说明是系统菜单
            let {uri, params} = Utils.resolverUrl(location);
            urlParams = params;
            menu = this.urlMenuMap[uri];
            if (!menu) throw new Error(`不存在此功能或无权限：${uri}`)
        }

        switch (target) {
            case "_self":
                // eslint-disable-next-line no-case-declarations
                let current = this.urlMenuMap[uri]; // 获取当前的菜单
                // 当前任务栏并没有包含即将要打开的菜单, 直接替换当前菜单
                if (!this.taskBarData.includes(menu)) {
                    this.taskBarData.forEach((item, index) => {
                        if (current == item) this.taskBarData.splice(index, 1, menu);
                    })
                } else { // 任务栏已经包含要打开的菜单, 则直接删除激活当前菜单
                    /*激活菜单*/
                }

                break;
            case '_blank':
                if (!this.taskBarData.includes(menu)) {
                    this.taskBarData.push(menu)
                } else {

                }
                break;
            default: console.log(`不支持：${target}`);
        }

        Utils.assignProperty(query, urlParams);
        this.currentMenu = Utils.assignProperty({IvzQueryParams: query}, menu);
        this.activityMenuRegister(menu); // 此方法由首页实现
    },
    /* 模态框插入的位置 */
    modalContainer () {
        return document.body
    },
    izGetDict (dictType) { // 根据字典类型获取
        let dictMapElement = this.DictMapCache[dictType]
        if (Utils.isNotBlank(dictMapElement)) {
            return new Promise((resolve, reject) => {
                resolve(dictMapElement)
            })
        } else {
            return Http.get(Global.dictUrl, {params: {type: dictType}})
                .then(resp => {
                    dictMapElement = this.DictMapCache[dictType]
                    if (Utils.isNotBlank(dictMapElement)) {
                        return dictMapElement
                    }

                    dictMapElement = []
                    resp['rows'].forEach(item => {
                        dictMapElement.push(item)
                        let dictDataMap = this.DictDataMapCache[dictType]
                        if (dictDataMap) {
                            dictDataMap[item.value] = item
                        } else {
                            this.DictDataMapCache[dictType] = {}
                            this.DictDataMapCache[dictType][item.value] = item
                        }
                    })

                    this.DictMapCache[dictType] = dictMapElement
                    return this.DictMapCache[dictType]
            })
        }
    },
    // 返回字典数据的options {label: 'xx', value: 'xx', disabled: false}
    izGetOptions (dictType) {
        return this.izGetDict(dictType).catch(reason => {
            Logger.errorLog('获取字典数据失败' + reason, '--', dictType)
        });
    },
    /**
     * 根据字典类型和字典值获取完整的字典数据
     * @param dictType
     * @param dictValue
     * @returns {{}|*}
     */
    izGetDictData (dictType, dictValue) {
        let element = this.DictDataMapCache[dictType]
        return element ? element[dictValue] : null;
    },
    /**
     * 根据字典类型和字典值, 获取对应的label
     * @param id
     * @returns {*}
     */
    izGetDictDataLabel (dictType, value) {
        if (!value || !dictType) return '';
        if(Utils.isArray(value)) {
            return value.map(item => {
                let element = this.izGetDictData(dictType, item);
                return element ? element['label'] : ''
            })
        } else {
            let element = this.izGetDictData(dictType, value);
            return element ? element['label'] : ''
        }
    },
    izMetaDefaultConfig (type) {
        let metaConfig = this.MetaConfigCache[type]
        if (metaConfig) return metaConfig
        else return this.MetaConfigCache['text'] // 找不到的默认为text类型
    },
    izMetaDefaultEvent (type) {
        let metaEvent = this.MetaDefaultEvent[type]
        if (metaEvent) return metaEvent
        else return this.MetaDefaultEvent['text']
    }
}
