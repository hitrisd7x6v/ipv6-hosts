/* 每个子页面都需要用到的对象 */
import '@/utils' // 导入基础类库
import Vue from 'vue'
import moment from 'moment'
import VueRouter from 'vue-router'
import Http from '@/utils/http.utils'
import Utils from '@/utils/basic.utils'

Vue.use(VueRouter);
// 获取父框架的缓存api对象
let cacheApi = window.parent.CacheApi;

/**
 * 重写路由的push方法
 */
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push (location) {
    let url = location;
    if(location instanceof Object) {
        url = location['path'];
    }
    // 以/IvzSys开头的路径属于页级路由路径, 将使用vue-router的push行为
    if(url.startsWith("/IvzSys")) { // 系统页级路由, 不改变其行为
        return routerPush.call(this, location).catch(error => {
            if(!window.location.href.includes('/IvzSys/void'))
                routerPush.call(this, '/IvzSys/void')
            console.log(error)
        })
    } else { // 其他路径将会重新打开一个页面
        cacheApi.openMenu(location)
    }
}
const router = new VueRouter(
    {
        routes: [// 每个页面的路由配置
            {path: '/IvzSys/view'}, {path: '/IvzSys/add'}, {path: '/IvzSys/edit'}
            , {path: '/IvzSys/cancel'}, {path: '/IvzSys/submit'}, {path: '/IvzSys/detail'}
            , {path: '/IvzSys/void'}
        ]
    }
)

let Metas = {}, SearchMetas = {};
Vue.prototype.$nav = router.push;
Vue.prototype.$cache = cacheApi; // 父页面缓存
Vue.prototype.formSize = 'default'; // 表单尺寸
Vue.prototype.izCtx = cacheApi.izCtx;
Vue.prototype.izColon = cacheApi.izColon; // 是否显示冒号
Vue.prototype.$getMeta = (key) => { return Metas[key]};
Vue.prototype.$getSearchMeta = (key) => { return SearchMetas[key]};
Vue.prototype.$getQueryParams = () => { return cacheApi.currentMenu['IvzQueryParams'] };
Vue.prototype.$getModalContainer = () => { return cacheApi.modalContainer() }; // 模态框插入的位置
Vue.prototype.$getActionMates = (url) => { return cacheApi.getActionMates(url) }; // 当前页面的元数据
Vue.prototype.$getActionMate = (action, options) => { return cacheApi.getActionMeta(action, options) };

export default {
    izField: 'id', // 唯一字段, 默认值
    router: router, // 每個頁面路由
    queryField: 'rows', // 数据列表字段
    pageNumField: 'current', // 页码字段
    pageSizeField: 'size', // 页数字段
    viewFormat: 'YYYY-MM-DD', // 表格显示日期格式
    menu: cacheApi.currentMenu, // 每个页面对应的菜单
    dateFormat: 'YYYY-MM-DD hh:mm:ss', // 表单默认时间格式
    viewType: '', // 显示的组件可选值：table || form
    gutter: {xs: 0, sm: 10, md: 20, lg: 40, xl: 60, xxl: 80},
    labelCol: {span: 8}, // offset: 0, pull: 0, push: 0, order: 0
    wrapperCol: {span: 14}, // offset: 0, pull: 0, push: 0, order: 0
    dateFormatter (val, row, col) {
        let metaConfig = col['config']
        return !val ? '' : moment(val).format(metaConfig['viewFormat'])
    },
    // 模态框默认可选项
    modalOptions: {
        keyboard: true, // 是否支持键盘esc关闭
        centered: true, // 垂直居中展示 Modal
        closable: false, // 是否显示关闭按钮
        maskClosable: false, // 点击蒙层是否允许关闭
        maskStyle: {backgroundColor: 'rgba(0, 0, 0, 0.31)'}, // 遮罩层样式
        bodyStyle: {height: '256px', overflowY: 'auto'} // 内容样式
    },
    quickDate () { // 快捷时间选项
        return {
            今天: [moment(), moment().endOf('day')],
            本周: [moment(), moment().endOf('isoWeek')],
            本月: [moment(), moment().endOf('month')]
        }
    },
    // 文件上传
    upload: {
        beforeUpload (file, fileList) {
            return new Promise((resolve, reject) => { resolve() })
        },
        // 图片上传状态改变
        uploadChange (files) {
            console.log(files)
        }
    },
    validate: {
        message: {
            enum: (name, val) => { return `${name}(必须是某一项：${val})` },
            len: (name, val, arg) => { return `${name}(${arg}必须=${val})` },
            min: (name, val, arg) => { return `${name}(${arg}必须>=${val})` },
            max: (name, val, arg) => { return `${name}(${arg}必须<=${val})` },
            // https://github.com/yiminghe/async-validator#type
            // 参数类型：string、number、boolean、method、regexp、integer、float、array、object、enum、date、url、hex、email
            fieldType: (name, val) => { return `${name}(必须是${val}类型)` },
            pattern: (name, val) => { return `${name}(不匹配规则${val})` },
            required: (name, val) => { return `${name}(必填)` },
            validator: () => { return null }
        },

        whitespace: false // 必选时，空格是否会被视为错误
    },
    registerPageMetas (metas, searchMetas) {
        if(metas) Metas = metas;
        if(searchMetas) SearchMetas = searchMetas;
    },
    registerPosition (type, mate, mates, moreMates) {
        if (type === 'table') { // 表格元数据
            switch (mate.position) {
                case 'T': mates.push(mate); break
                case 'TM': moreMates.push(mate); break
                case 'AM': mates.push(mate); break
                default: break
            }
        } else { // 搜索栏元数据
            switch (mate.position) {
                case 'M': mates.push(mate); break
                case 'MM': moreMates.push(mate); break
                case 'AM': mates.push(mate); break
                default: break
            }
        }
        mates.sort((a, b) => {
            return a.sort - b.sort
        })
        moreMates.sort((a, b) => {
            return a.sort - b.sort
        })
    },
    /**
     * 覆写默认的对象
     *  如果ori的值存在则不覆写
     *  如果ori值不存在则合并target的值
     *  如果是嵌套对象, 则嵌套覆写
     * @param ori
     * @param target
     * @param _this
     */
    mergeDefaultObject (ori, target, _this) {
        if (!ori || !target || !_this) return

        Object.keys(target).forEach((item) => {
            let targetValue = target[item]
            if (ori[item] === undefined) { // 源不存在直接合并
                if (typeof targetValue === 'function') {
                    _this.$set(ori, item, targetValue)
                } else if (Array.isArray(targetValue)) {
                    _this.$set(ori, item, [...targetValue])
                } else if (moment.isMoment(targetValue)) {
                    _this.$set(ori, item, moment(targetValue))
                } else if (Utils.isObject(targetValue)) {
                    _this.$set(ori, item, {})
                    this.mergeDefaultObject(ori[item], targetValue, _this)
                } else {
                    _this.$set(ori, item, targetValue)
                }
            } else { // 源存在, 判断源是否是对象, 是对象则继续合并
                if (ori[item] instanceof Array) {

                } else if (ori[item] instanceof Object) {
                    this.mergeDefaultObject(ori[item], targetValue, _this)
                }
            }
        })
    },
    /**
     *  解析复杂结构的元数据, {key: name, children: [{key: name1}]}
     * @param mates 元数据对象
     * @param callBack 元数据项处理回调
     */
    resolverMetas (oriMetas, vue, callBack) {
        let doResolverMates = (metas, callBack) => {
            if (Utils.isArray(metas)) {
                metas.forEach((meta, index) => {
                    if (Utils.isNotBlank(meta['metas'])) { // 属于组元数据
                        doResolverMates(meta['metas'], callBack)
                    } else if (Utils.isNotBlank(meta['children'])) {
                        doResolverMates(meta['children'], callBack)
                    } else {
                        if (callBack) callBack(meta, metas)
                    }
                })
            } else {
                vue.$log.errorLog('错误的元数据对象', '期待数组类型', oriMetas)
            }
        }
        doResolverMates(oriMetas, callBack)
    },
    /**
     * 解析通用的元数据
     * @param metas
     * @param vue
     */
    resolverCommonMetas (metas, vue) {
        this.resolverMetas(metas, vue, (meta) => {
            if (meta.type !== 'action') {
                this.initCommonMate(meta, vue)
            }
        })
    },
    /**
     * 解析表格的元数据
     * @param metas
     * @param vue
     * @param callBack
     * @returns {Array}
     */
    resolverTableMetas (oriMetas, config, vue, callBack) {
        let returnVal = []
        let doResolverTableMetas = (metas, vue, callBack, type) => {
            if (Utils.isArray(metas)) {
                metas.forEach((meta, index) => {
                    if (meta['isTable'] === false) return

                    if (Utils.isNotBlank(meta['metas'])) { // 属于组元数据
                        doResolverTableMetas(meta['metas'], vue, callBack, 'group') // 组元数据初始化
                    } else if (Utils.isNotBlank(meta['children'])) {
                        // group和children下面的children不需要再解析
                        if (type !== 'group' && type !== 'child') returnVal.push(meta)
                        doResolverTableMetas(meta['children'], vue, callBack, 'child') // 子元数据初始化
                    } else if (!type || type === 'group') { // 没有指定类型的属于mate
                        returnVal.push(meta)
                        this.initTableMate(meta, config, vue)
                        if (callBack) callBack(meta, metas)
                    } else {
                        this.initTableMate(meta, config, vue)
                        if (callBack) callBack(meta, metas)
                    }
                })
            } else {
                vue.$log.errorLog('错误的表格元数据', '期待数组类型', oriMetas)
            }
        }
        doResolverTableMetas(oriMetas, vue, callBack, null)
        return returnVal
    },
    /**
     * 解析元数据之前的默认数据处理
     * @param metas
     * @param formConfig
     * @param vue
     */
    beforeResolverMetasHandle: function (metas, formConfig, vue) {
        // 表单的源编辑模型
        if (!formConfig['oriModel']) vue.$set(formConfig, 'oriModel', {});
        if (formConfig.formType === 'search') { // 说明是搜索表单元数据的解析
            if (formConfig.viewTop === null) { // 没有指定显示的位置, 则根据表单多少来判断, 小于等于3显示在顶栏
                let length = metas.length
                if (!formConfig['column']) {
                    if (length > 3) {
                        formConfig['column'] = 4;
                        formConfig.viewTop = false
                    } else {
                        formConfig['column'] = 3;
                        formConfig.viewTop = true
                    }
                }
            } else if (formConfig.viewTop === false) { // 不放在顶栏, 如果没有指定列, 默认4
                if (!formConfig['column']) formConfig['column'] = 4
            } else { // 放在搜索顶栏上面 如果没有指定 默认3列
                if (!formConfig['column']) formConfig['column'] = 3
            }
        } else { // 编辑表单的解析
            metas.forEach((meta, index) => {
                if (Utils.isNotBlank(meta['metas'])) { // 属于组元数据
                    if (formConfig.type !== 'group') formConfig.type = 'group'
                }
            });

            if (formConfig.type === 'default') { // 表单默认类型为一列
                if (!formConfig['column']) formConfig['column'] = 1
            } else { // 表单为组类型, 默认为3列
                if (!formConfig['column']) formConfig['column'] = 3
            }
            // 编辑的数据源来自于本地表格列表行
            if (formConfig.editSource === 'local') {
                // 没有指定绑定类型, 则本地的默认绑定类型为不绑定
                if (!formConfig.bindType) formConfig.bindType = 'void'
            } else if (formConfig.editSource === 'remote') { // 编辑的数据来自于远程
                // 没有指定绑定类型, 则远程的默认绑定类型为双向绑定
                if (!formConfig.bindType) formConfig.bindType = 'both'
            } else {
                vue.$log.warningLog('错误的数据来源(editSource)', '可选值：local(本地)、remote(远程)', formConfig.editSource)
            }
        }
    },
    /**
     * 解析表单 元数据
     * @param metas
     * @param vue
     * @param callBack
     * @returns {Array}
     */
    resolverFormMetas (oriMetas, formConfig, vue, callBack) {
        let returnVal = []
        // 设置编辑表单配置项
        this.beforeResolverMetasHandle(oriMetas, formConfig, vue);

        let doResolverFormMetas = (metas, vue, callBack, type, group) => {
            if (Utils.isArray(metas)) {
                metas.forEach((meta, index) => {
                    if (meta['metas']) { // 属于组元数据
                        let groupMeta = {name: meta.title, metas: [], style: meta.style}
                        returnVal.push(groupMeta);
                        doResolverFormMetas(meta['metas'], vue, callBack, 'group', groupMeta)
                    } else if (Utils.isNotBlank(meta['children'])) {
                        if (!group) {
                            group = {name: '', metas: []};
                            returnVal.push(group)
                        }
                        doResolverFormMetas(meta['children'], vue, callBack, 'child', group)
                    } else if (!type) {
                        if (!group) {
                            group = {name: '', metas: []};
                            returnVal.push(group)
                        }
                        doResolverFormMetas([meta], vue, callBack, 'mate', group)
                    } else {
                        if (meta.type !== 'action' && meta.type !== 'empty') {
                            group['metas'].push(meta)
                            this.initFormMate(meta, formConfig, vue)
                            if (callBack) callBack(meta, metas)
                        }
                    }
                })
            } else {
                vue.$msg.warningLog('错误的表单元数据', '期待数组类型', oriMetas)
            }
        }
        doResolverFormMetas(oriMetas, vue, callBack, null, null)
        return returnVal
    },
    resolverGroup (group, vue, callBack) {
        if (!group) return null
        group.forEach(item => {
            if (item['metas']) {
                this.resolverMetas(item['metas'], vue, callBack);
            }
        })
    },
    resolverTree (children, callBack) {
        if (Utils.isBlank(children)) return null
        children.forEach((meta) => {
            if (Utils.isNotBlank(meta['children'])) {
                callBack(meta, children)
                this.resolverTree(meta['children'], callBack)
            } else {
                callBack(meta, children)
            }
        })
    },
    /**
     * 设置页(View)组件的默认配置
     * 此配置只能页级别组件才能调用, 以View结尾的为页级别组件
     * @param config
     * @param vue
     */
    initPageDefaultConfig (config, vue) {
        if (!config.form) vue.$set(config, 'form', {})
        if (!config.table) vue.$set(config, 'table', {})
        if (!config.search) vue.$set(config, 'search', {})

        // 合并编辑表单默认配置项
        this.initDefaultFormConfig(config.form, vue)
        // 合并搜索表单默认配置项
        this.initDefaultSearchConfig(config.search, vue)
        // 合并表格默认配置项
        this.initDefaultTableConfig(config.table, vue)
    },
    /**
     * 初始化编辑表单默认配置
     * @param formConfig
     * @param vue
     */
    initDefaultFormConfig (formConfig, vue) {
        if (!formConfig || formConfig.isInit) return
        this.mergeDefaultObject(formConfig, cacheApi.pageDefaultConfig.form, vue)
    },
    /**
     * 初始化搜索表单默认配置
     * @param searchConfig
     * @param vue
     */
    initDefaultSearchConfig (searchConfig, vue) {
        if (!searchConfig || searchConfig.isInit) return
        this.mergeDefaultObject(searchConfig, cacheApi.pageDefaultConfig.search, vue)
    },
    initDefaultTableConfig (tableConfig, vue) {
        if (!tableConfig || tableConfig.isInit) return // 已经初始化直接返回
        this.mergeDefaultObject(tableConfig, cacheApi.pageDefaultConfig.table, vue)
        if (Utils.isObject(tableConfig)) {
            this.mergeDefaultObject(tableConfig, {
                size: 'small', // 表的默认尺寸 default | middle | small
                bordered: true, // 显示边框
                indentSize: 16, // 树形表格子行缩进的长度
                pagination: false, // 默认不显示
                position: 'bottom', // 分页器显示的位置 'top' | 'bottom' | 'both'
                queryField: 'rows', // 查询字段
                scroll: {x: 0, y: 0}, // 表格的宽高
                rowKey: this.izField, // 默认唯一标识
                expandedRowKeys: null, // 可控制的展开行的key
                expandRowByClick: false, // 是否点击展开行
                defaultExpandAllRows: true, // 默认展开所有行,
                defaultExpandedRowKeys: null, // 要展开行的数组
                childrenColumnName: 'children', // 树形表格的列名
                rowClassName: () => 'iz-table-row', // 表格行列名
                locale: {filterConfirm: '确定', filterReset: '重置', emptyText: '暂无数据'} //
            }, vue)

            this.mergeDefaultPage(tableConfig['pagination'], vue)
            this.izDefaultTableSelection(tableConfig, vue)
        } else {
            vue.$log.errorLog('合并表格配置项失败', '传入的配置必须是对象类型', tableConfig)
        }
    },
    /**
     * 设置表格全选列的配置到默认
     * @param selection
     * @param _this
     */
    izDefaultTableSelection (config, _this) {
        let selection = config['selection']
        if (Utils.isObject(selection)) {
            this.mergeDefaultObject(selection, {
                type: 'checkbox', // checkbox or radio
                fixed: false,
                // 选中项发生变化时的回调
                onChange: (selectedRowKeys, selectedRows) => {
                    selection.selectedRows = selectedRows
                    selection.selectedRowKeys = selectedRowKeys
                },
                // 用户手动选择/取消选择某列的回调
                onSelect: (record, selected, selectedRows, nativeEvent) => {

                },
                // 用户手动选择/取消选择所有列的回调
                onSelectAll: (selected, selectedRows, changeRows) => {

                },
                selections: false, // 下拉框boolean | array, e.g [key: 'even', text: '选择偶数行', onSelect: ()=>{}]
                selectedRows: [], // 选中行的集合
                columnWidth: 38, // 全选列的宽度
                columnTitle: '', // 全选框的标题
                selectedRowKeys: [] // 选中行的key集合
            }, _this)
            // 如果表格可以多选, 必须加上多选列的宽度
            config.scroll.x += selection.columnWidth
        }
    },
    izDefaultTreeOptions (option, _this) {
        if (Utils.isObject(option)) {
            this.mergeDefaultObject(option, {
                showLine: true, // 连接线
                checkable: true, // 有复选框
                showIcon: false, // 是否显示图标
                draggable: false, // 是否可拖拽
                disabled: false, // 禁用
                expandedKeys: null,
                selectedKeys: null,
                checkStrictly: false, // 父子节点不关联
                autoExpandParent: false, // 自动展开父节点
                defaultExpandAll: false, // 默认展开所有节点
                defaultExpandedKeys: [], // 默认展开指定的树节点
                defaultSelectedKeys: [], // 默认展开选中的树节点
                defaultCheckedKeys: [] // 默认选中复选框的树节点
            }, _this)
        }
    },
    izDefaultTabOptions (tab, _this) {
        if (Utils.isObject(tab)) {
            this.mergeDefaultObject(tab, {
                column: 1,
                layout: 'horizontal',
                gutter: this.gutter,
                hideRequiredMark: false
            }, _this)
        }
    },
    /**
     * 树组件节点可选配置
     * @param mate
     * @returns {any}
     */
    izDefaultTreeNode (data, mate) {
        return Object.assign({
            class: 'iz-tree-node',
            style: {},
            data: data, // 节点数据
            isLeaf: null,
            disabled: false, // 禁掉响应
            selectable: true, // 是否可被选中
            disableCheckbox: false, // 禁用checkbox
            scopedSlots: {title: 'title'}, // 使用columns时，可以通过该属性配置支持slot-scope的属性，如 scopedSlots: { title: 'XXX'}
            icon: '' // 自定义图标
        }, mate)
    },
    /**
     * 返回默认分页对象
     * @param page 覆写分页器配置的对象
     * @returns 分页器需要的对象
     */
    mergeDefaultPage (page, _this) {
        if (Utils.isObject(page)) {
            this.mergeDefaultObject(page, { // 默认分页器配置
                simple: false, // 是否显示为简单的分页器
                size: 'small', // 分页器布局
                total: 0, //
                pageSize: 20, // 每页条数
                defaultCurrent: 1, // 默认当前
                // 页码改变时的回调
                change: (args) => {
                    let model = args['model']
                    model[this.pageNumField] = args['page'].current
                    model[this.pageSizeField] = args['page'].pageSize
                    args.query()
                },
                hideOnSinglePage: false, // 只有一页时是否隐藏分页器
                defaultPageSize: 20, // 默认的每页条数
                showQuickJumper: false, // 是否可以快速跳转至某页
                showSizeChanger: true, // 显示
                showTotal: (total, range) => `共 ${total} 条(${range})`,
                pageSizeOptions: ['20', '30', '50', '100'] // 指定每页可以显示多少条
            }, _this)
        }
    },
    getStore (key) { // 获取存储值
        let storeCache = cacheApi.StoreCache
        return storeCache.getPageStore(this.menu['url'], key)
    },
    putStore (key, value) { // 设置存储值
        let storeCache = cacheApi.StoreCache
        storeCache.putPageStore(this.menu['url'], key, value)
    },
    izOptionType (type) {
        return type === 'select' || type === 'radio' || type === 'checkbox' || type === 'stree'
    },
    initFormMate (mate, config, _this) {
        // 已经解析过, 无需再次解析
        if (Utils.isResolveForm(mate)) return

        // 先解析通用信息, 如果之前没有解析
        this.initCommonMate(mate, _this)
        let metaConfig = mate['config'];

        if (mate.type === 'action') {
            _this.$set(mate, 'isForm', false)
            return
        }

        if (!mate.type) _this.$set(mate, 'type', 'text') // 默认类型为：text
        if (mate.isForm === undefined)_this.$set(mate, 'isForm', true)

        let decorate = mate['decorate']
        let metaDefault = mate['default']
        // 日期类型的默认值, 必须转成moment格式
        if (metaDefault && Utils.isDate(mate['type'])) {
            metaDefault = moment(metaDefault)
        }
        if (decorate) {
            _this.$set(decorate, 'initialValue', metaDefault)
            if (!decorate['rules']) _this.$set(decorate, 'rules', [])
        } else {
            _this.$set(mate, 'decorate', {
                initialValue: metaDefault,
                validateFirst: true,
                rules: []
            }) // 初始化：decorate
        }

        let formSpan = mate['span'];
        let spanNum = parseInt((24 / config.column)+'');
        if (!formSpan) {
            _this.$set(metaConfig, 'span', spanNum);
            if(!metaConfig.labelCol) _this.$set(metaConfig, 'labelCol', this.labelCol);
            if(!metaConfig.wrapperCol) _this.$set(metaConfig, 'wrapperCol', this.wrapperCol);
        } else {
            let labelSpan = 0, wrapperSpan = 0, span = 0;
            if(typeof formSpan === 'number') {
                labelSpan = formSpan; wrapperSpan = 24 - formSpan; span = spanNum;
            } else {
                labelSpan = formSpan[0]; wrapperSpan = formSpan[1]; span = formSpan[2] || spanNum;
            }
            if(labelSpan) {
                _this.$set(metaConfig, 'labelCol', {span: labelSpan})
                if(wrapperSpan) _this.$set(metaConfig, 'wrapperCol', {span: wrapperSpan});
                else _this.$set(metaConfig, 'wrapperCol', {span: 24 - labelSpan});
            } else {
                _this.$set(metaConfig, 'labelCol', this.labelCol);
                _this.$set(metaConfig, 'wrapperCol', this.wrapperCol);
            }
            _this.$set(metaConfig, 'span', span)
        }

        let validate = this.validate
        let message = validate['message']
        Object.keys(message).forEach(item => {
            let ruleName = mate[item]
            if (ruleName) { // 动态生成校验规则
                let type = mate['type']
                let fieldType = mate['fieldType']
                let arg = type === 'number' ? '值' : '长度'
                let rule = {message: message[item](mate['title'], mate[item], arg)}
                if (item === 'len' || item === 'min' || item === 'max') {
                    if (type === 'number') { // 不同的表单类型的处理
                        fieldType = 'number'
                    } else if (type === 'checkbox') {
                        fieldType = 'array'
                    } else if (type === 'select' && mate['config']['mode'] === 'multiple') {
                        fieldType = 'array'
                    } else if (type === 'stree' && (mate['config']['multiple'] || mate['config']['treeCheckable'])) {
                        fieldType = 'array'
                    }
                    _this.$set(rule, 'type', fieldType)
                }
                if (config['hasFeedback']) { // 全局开启了校验回馈图标
                    _this.$set(mate['config'], 'hasFeedback', true)
                }
                _this.$set(rule, item, mate[item])
                mate['decorate'].rules.push(rule)
            }
        })
        mate['resolveType'] = mate['resolveType'] ? mate['resolveType'] + '2' : '2' // 说明此字段已经完成form解析
    },
    initCommonMate (mate, _this) {
        // 已经解析过, 无需再次解析
        if (Utils.isResolveCommon(mate)) return

        // 合并默认配置
        if (!mate.config) _this.$set(mate, 'config', {})
        this.mergeDefaultObject(mate.config, cacheApi.izMetaDefaultConfig(mate.type), _this) // 何必默认配置

        // 合并默认事件
        if (!mate.event) _this.$set(mate, 'event', {})
        this.mergeDefaultObject(mate.event, cacheApi.izMetaDefaultEvent(mate.type), _this)

        let metaConfig = mate['config']
        if (this.izOptionType(mate.type)) {
            let valueField = metaConfig['valueField']
            let labelField = metaConfig['labelField']
            let queryField = metaConfig['queryField'] ? metaConfig['queryField'] : 'rows'
            if (Utils.isNotBlank(mate.data)) { // 自带的options
                let izValueLabelMap = {}
                if (mate.type === 'stree') {
                    this.resolverTree(mate.data, (item) => {
                        izValueLabelMap[item['value']] = item['label']
                    })
                } else {
                    mate.data.forEach(option => {
                        izValueLabelMap[option['value']] = option['label']
                    })
                }
                if (mate['formatter']) {
                    let oriFormatter = mate['formatter']
                    _this.$set(mate, 'formatter', (val, row, col) => {
                        return oriFormatter(val, row, col, izValueLabelMap[val])
                    })
                } else {
                    _this.$set(mate, 'formatter', (val, row, col) => {
                        if (!val) return ''
                        return izValueLabelMap[val]
                    })
                }
            } else if (mate.dictType) { // 字典数据
                let options = cacheApi.izGetOptions(mate.dictType)
                _this.$set(mate, 'data', options)
                if (!mate.formatter) {
                    _this.$set(mate, 'formatter', cacheApi.izGetDictDataLabel)
                } else {
                    let oriFormatter = mate['formatter']
                    _this.$set(mate, 'formatter', (val, row, col) => {
                        return oriFormatter(val, row, col
                            , cacheApi.izGetDictDataLabel(mate.dictType, val))
                    })
                }
            } else if (mate.type === 'stree') {
                if (Utils.isBlank(mate.url)) {
                    _this.$set(mate, 'data', [])
                    return _this.$log.warningLog(`字段(${mate.field})解析警告`, '设置stree类型的数据源Url或data', mate)
                }
                let TreeMap = {}
                let options = []
                _this.$set(mate, 'data', options)
                Http.get(mate.url).then(resp => {
                    let data = resp[queryField]
                    if (_this.$utils.isNotBlank(data)) {
                        this.resolverTree(data, (obj) => {
                            TreeMap[obj[valueField]] = obj[labelField]
                            _this.$set(obj, 'value', obj[valueField])
                            _this.$set(obj, 'label', obj[labelField])
                            _this.$set(obj, 'selectable', true)
                        })
                        data.forEach(item => {
                            options.push(item)
                        })
                    }

                    // 数据加载完成之后, 触发完成事件
                    let onLoadFinished = mate.event['loadFinished']
                    if (typeof onLoadFinished === 'function') onLoadFinished(mate, options, _this)
                })
                if (!mate.formatter) {
                    _this.$set(mate, 'formatter', (val, row, col) => {
                        return TreeMap[val]
                    })
                } else {
                    let oriFormatter = mate['formatter']
                    _this.$set(mate, 'formatter', (val, row, col) => {
                        return oriFormatter(val, row, col, TreeMap[val])
                    })
                }
            } else if (mate.url) { // 是url
                let SelectMap = {}
                if (Utils.isBlank(mate.url)) {
                    _this.$set(mate, 'data', [])
                    return _this.$log.warningLog(`字段(${mate.field})解析警告`, `设置${mate.type}类型的数据源Url或者data`, mate)
                }
                let selectOptions = []
                _this.$set(mate, 'data', selectOptions)
                Http.get(mate.url).then(resp => {
                    let rows = resp[queryField]
                    if (Utils.isNotBlank(rows)) {
                        rows.forEach(item => {
                            SelectMap[item[valueField]] = item[labelField]
                            selectOptions.push({disabled: false, label: item[labelField], value: item[valueField]})
                        })
                    }
                    // 数据加载完成之后, 触发完成事件
                    let onLoadFinished = mate.event['loadFinished']
                    if (typeof onLoadFinished === 'function') {
                        onLoadFinished(mate, selectOptions, _this)
                    }
                })
                if (!mate.formatter) {
                    _this.$set(mate, 'formatter', (val, row, col) => {
                        return SelectMap[val]
                    })
                } else {
                    let oriFormatter = mate['formatter']
                    _this.$set(mate, 'formatter', (val, row, col) => {
                        return oriFormatter(val, row, col, SelectMap[val])
                    })
                }
            }
        }
        // 日期类型
        // 初始化默认日期配置
        // usable 是可以选择的时间范围[min, max] | [min, null] | [null, max]
        // quick是快捷时间选项 可以是boolean类型和对象, 如果是Boolean类型则使用默认快捷选项
        if (mate.type === 'date' || mate.type === 'month' || mate.type === 'time' || mate.type === 'week' || mate.type === 'dateRange') {
            if (mate['quick']) { // 如果指定选择的时间范围, 则不添加快捷选择项
                _this.$set(mate, 'ranges', this.quickDate())
            }
            if (mate.usable && mate.usable instanceof Array) {
                this.$set(mate, 'disabledDate', (current) => {
                    if (!current) return true
                    if (mate.usable[0] && mate.usable[1]) {
                        return !(current >= mate.usable[0] && current < mate.usable[1])
                    } else if (mate.usable[0]) {
                        return !(current >= mate.usable[0])
                    } else if (mate.usable[1]) {
                        return !(current < mate.usable[1])
                    } else {
                        return true
                    }
                })
            }

            if (!mate['format']) _this.$set(metaConfig, 'format', this.dateFormat) // 日期表单显示格式
            if (!mate.formatter) _this.$set(mate, 'formatter', this.dateFormatter)
            if (!mate['viewFormat']) _this.$set(metaConfig, 'viewFormat', this.viewFormat) // 日期文本显示格式
        } else if (mate['afterMeta']) {
            this.initCommonMate(mate['afterMeta'], _this)
        }
        mate['resolveType'] = mate['resolveType'] ? mate['resolveType'] + '1' : '1' // 说明此字段已经完成common解析
    },
    initTableMate (item, config, _this) {
        // 已经解析过, 无需再次解析
        if (Utils.isResolveTable(item)) return

        if (item['isTable'] === false) return
        else _this.$set(item, 'isTable', true)

        // 先解析通用信息, 如果之前没有解析的话
        this.initCommonMate(item, _this)

        _this.$set(item, 'key', item.field)
        _this.$set(item, 'dataIndex', item.field)

        // 表格操作元数据
        if (item['type'] === 'action') { // action列的宽度必须手动指定, 否则不指定
            _this.$set(item, 'scopedSlots', {customRender: item.field})
        } else {
            if (!item.width) _this.$set(item, 'width', 136) // 默认宽度为136px
        }
        if (item['formatter']) { // 只要是存在需要重新格式化数据的字段, 在表里面全部使用slot
            _this.$set(item, 'scopedSlots', {customRender: item.field})
        }
        // 默认的字段值
        if (item.width) config.scroll.x += parseInt(item.width)
        if (!item.align) _this.$set(item, 'align', 'center') // 默认居中对齐
        item['resolveType'] = item['resolveType'] ? item['resolveType'] + '3' : '3' // 说明此字段已经完成table解析
    },
    isSearchForm(formConfig) {
        return formConfig.formType == 'search';
    },
    isEditForm(formConfig) {
        return formConfig.formType == 'edit';
    }
}
