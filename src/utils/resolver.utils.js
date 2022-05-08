/* 每个子页面都需要用到的对象 */
import '@/utils' // 导入基础类库
import moment from 'moment'
import Http from '@/utils/http.utils'
import Utils from '@/utils/basic.utils'
import Validate from '@/utils/validate.utils'
import Logger from "@/utils/logger.utils";
import Global from '@/components/global.config'

// 获取父框架的缓存api对象
let cacheApi = window.parent.CacheApi;

export default {
    izField: 'id', // 唯一字段, 默认值
    queryField: 'data', // 数据列表字段
    viewFormat: 'YYYY-MM-DD', // 表格显示日期格式
    dateFormat: 'YYYY-MM-DD HH:mm:ss', // 表单默认时间格式
    gutter: {xs: 0, sm: 10, md: 20, lg: 40, xl: 60, xxl: 80},
    labelCol: {span: 6}, // offset: 0, pull: 0, push: 0, order: 0
    wrapperCol: {span: 14}, // offset: 0, pull: 0, push: 0, order: 0
    dateFormatter (val, row, col) {
        let metaConfig = col['config'];
        return !val ? '' : moment(val).format(metaConfig['viewFormat'])
    },
    switchFormatter(val, row, col) {
        if(val == undefined) return '';
        return val == true ? col.config.checkedChildren : col.config.unCheckedChildren;
    },
    // 模态框默认可选项
    modalOptions: {
        keyboard: true, // 是否支持键盘esc关闭
        centered: true, // 垂直居中展示 Modal
        closable: false, // 是否显示关闭按钮
        maskClosable: false, // 点击蒙层是否允许关闭
        maskStyle: {backgroundColor: 'rgba(0, 0, 0, 0.31)'}, // 遮罩层样式
        bodyStyle: {height: '320px', overflowY: 'auto'} // 内容样式
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
            enum: (mate) => { return `${mate.title}(必须是某一项：${mate['enum']})` },
            len: (mate, arg) => { return `${mate.title}(${arg}必须=${mate['len']})` },
            min: (mate, arg) => { return `${mate.title}(${arg}必须>=${mate['min']})` },
            max: (mate, arg) => { return `${mate.title}(${arg}必须<=${mate['max']})` },
            Url: (mate, arg) => { return `请输入正确的Url地址` },
            date: (mate, arg) => { return `日期格式有误` },
            email: (mate, arg) => { return `请输入正确的邮箱地址` },
            range: (meta, arg) => {return `输入的范围必须在${meta.range}`},
            boolean: (mate, arg) => { return `${mate.title}(必须是布尔类型)` },
            // https://github.com/yiminghe/async-validator#type
            // 参数类型：string、number、boolean、method、regexp、integer、float、array、object、enum、date、url、hex、email
            fieldType: (mate) => { return `${mate.title}(必须是${mate['fieldType']}类型)` },
            regexp: (mate) => { return `${mate.title}(请输入正确的格式)` },
            required: (mate) => { return `${mate.title}(必填)` },
            validator: (mate) => {
                return function (rule, value, callback) {

                }
            },
            idCard: (mate) => {
                return function (rule, value, callback) {
                    if(!Validate.isIdCard(value)) {
                        callback(new Error("请输入正确省份证号"));
                    } else {
                        callback()
                    }
                }
            },
            bank: (mate) => {
                return function (rule, value, callback) {
                    if(!Validate.isBank(value)) {
                        callback(new Error("请输入正确的银行卡号"));
                    } else {
                        callback()
                    }
                }
            },
            ip: (mate) => {
                return function (rule, value, callback) {
                    if(!Validate.isIp(value)) {
                        callback(new Error("请输入正确的ip地址"));
                    } else {
                        callback()
                    }
                }
            },
            phone: (mate) => {
                return function (rule, value, callback) {
                    if(!Validate.isPhone(value)) {
                        callback(new Error("请输入正确手机号码"));
                    } else {
                        callback()
                    }
                }
            },
            chinese: (mate) => {
                return function (rule, value, callback) {
                    if(!Validate.isChinese(value)) {
                        callback(new Error(`${mate.title}(必须为汉字)`));
                    } else {
                        callback()
                    }
                }
            },
        },

        whitespace: false // 必选时，空格是否会被视为错误
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
        };
        doResolverMates(oriMetas, callBack)
    },
    /**
     * 解析通用的元数据
     * @param metas
     * @param vue
     */
    resolverCommonMetas (metas, vue) {
        this.resolverMetas(metas, vue, (meta) => {
            this.initCommonMate(meta, vue)
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
    resolverMetaDefaultValue (meta, model) {
        Utils.deepSetValue(meta.field, meta['default'], model);
    },
    /**
     * 解析表单 元数据
     * @param metas
     * @param vue
     * @param callBack
     * @returns {Array}
     */
    resolverFormMetas (oriMetas, formConfig, vue, callBack) {
        let returnVal = [];
        let trueView = () => {return true};
        if(!callBack) callBack = ()=>{};
        let doResolverFormMetas = (metas, vue, callBack, type, group) => {
            if (Utils.isArray(metas)) {
                metas.forEach((meta, index) => {
                    if (meta['metas']) { // 属于组元数据
                        let groupMeta = {name: meta.title, metas: [], style: meta.style, view: meta.view || trueView};
                        returnVal.push(groupMeta);
                        doResolverFormMetas(meta['metas'], vue, callBack, 'group', groupMeta)
                    } else if (Utils.isNotBlank(meta['children'])) {
                        if (!group) {
                            group = {name: meta.title, metas: [], style: meta.style, view: meta.view || trueView};
                            returnVal.push(group)
                        }
                        doResolverFormMetas(meta['children'], vue, callBack, 'child', group)
                        group = null; // 进入下一个组
                    } else if (!type && meta.type !== 'action') {
                        if (!group) {
                            group = {name: '', metas: [], view: meta.view || trueView};
                            returnVal.push(group)
                        }
                        doResolverFormMetas([meta], vue, callBack, 'mate', group)
                    } else {
                        if (meta.type !== 'action') {
                            group['metas'].push(meta);
                            this.initFormMate(meta, formConfig, vue)
                            this.initDetailMeta(meta, vue);
                            callBack(meta)
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
    resolverGroup (group, callBack) {
        if (!group) return null;
        group.forEach(item => {
            if (item['metas']) {
                this.resolverGroup(item['metas'], callBack);
            } else {
                callBack(item);
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
     * 初始化编辑表单默认配置
     * @param formConfig
     * @param vue
     */
    initDefaultFormConfig (formConfig, vue) {
        if (!formConfig || formConfig.isInit) return
        this.mergeDefaultObject(formConfig, cacheApi.pageDefaultConfig.form, vue)
    },

    initDefaultTableConfig (tableConfig, vue) {
        if (!tableConfig || tableConfig.isInit) return // 已经初始化直接返回
        if (Utils.isObject(tableConfig)) {
            this.mergeDefaultObject(tableConfig, cacheApi.pageDefaultConfig.table, vue)
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
            }, _this);
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
                change: (args) => { args.query(); },
                hideOnSinglePage: false, // 只有一页时是否隐藏分页器
                defaultPageSize: 20, // 默认的每页条数
                showQuickJumper: false, // 是否可以快速跳转至某页
                showSizeChanger: true, // 显示
                showTotal: (total, range) => `共${total}条 (${range})`,
                pageSizeOptions: ['20', '30', '50', '100'], // 指定每页可以显示多少条
                onChange: null,
                onShowSizeChange: null
            }, _this)
        }
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
    setHasFeedback(type, metaConfig, config) {
        if(type == 'text' || type == 'number' || type == 'select' || type == 'stree' || type == 'cascade' || Utils.isDate(type))
            metaConfig['hasFeedback'] = metaConfig.hasFeedback != undefined || config['hasFeedback'];
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

        if (!mate.type) _this.$set(mate, 'type', 'text'); // 默认类型为：text
        if (mate.isForm === undefined)_this.$set(mate, 'isForm', true);



        let metaDefault = mate['default'];
        // 日期类型的默认值, 必须转成moment格式
        // antdv 1.5.4版本后支持日期字符串绑定
        if (metaDefault && Utils.isDate(mate['type'])) {
            // 时间范围的日期必须是数组格式
            if(mate['type'] == 'dateRange' && typeof metaDefault == 'string') {
                metaDefault = [metaDefault];
            }
        }

        let decorate = mate['decorate'];
        if (decorate) {
            _this.$set(decorate, 'initialValue', metaDefault);
        } else {
            _this.$set(mate, 'decorate', {
                initialValue: metaDefault, validateFirst: true
            }); // 初始化：decorate
            decorate = mate['decorate'];
        }

        if (!decorate['rules']) {
            _this.$set(decorate, 'rules', []);
            let validate = this.validate;
            let message = validate['message'];
            Object.keys(message).forEach(item => {
                let ruleValue = mate[item];
                if (ruleValue != undefined) { // 动态生成校验规则
                    let type = mate['type'];
                    let arg = type === 'number' ? '值' : '长度';
                    let msgVal = message[item](mate, arg);
                    // 自定义校验
                    if(typeof msgVal == 'function') {
                        return mate['decorate'].rules.push({validator: msgVal});
                    }

                    let rule = {message: msgVal};
                    if (item === 'len') {
                        _this.$set(rule, 'type', 'number')
                    } else if(item == 'boolean' || item == 'Url' || item == 'date' || item == 'email') {
                        _this.$set(rule, 'type', item.toLowerCase());
                    } else if(item == 'regexp') {
                        _this.$set(rule, 'pattern', ruleValue)
                    } else if(item == 'range') {
                        ruleValue = JSON.parse(ruleValue);
                        if(ruleValue[0] != undefined) {
                            mate['decorate'].rules.push({min: ruleValue[0], message: `${mate['title']}(${arg}不能小于${ruleValue[0]})`});
                        }
                        if(ruleValue[1] != undefined) {
                            mate['decorate'].rules.push({max: ruleValue[1], message: `${mate['title']}(${arg}不能大于${ruleValue[1]})`});
                        }
                        return;
                    } else {
                        _this.$set(rule, item, ruleValue);
                    }

                    this.setHasFeedback(type, metaConfig, config);
                    mate['decorate'].rules.push(rule)
                }
            });
        }
        // 初始化每個表单需要占据几个span
        let spanNum = 24 / config.column;
        if(!metaConfig.span) metaConfig.span = spanNum;

        if(config.layout == 'horizontal') {
            if(!metaConfig.labelCol && !config.labelCol) {
                _this.$set(metaConfig, 'labelCol', this.labelCol);
            }
            if(!metaConfig.wrapperCol && !config.wrapperCol) {
                _this.$set(metaConfig, 'wrapperCol', this.wrapperCol);
            }
        } else {
            config.labelCol = metaConfig.labelCol = null;
            config.wrapperCol = metaConfig.wrapperCol = null;
        }

        // 说明此字段已经完成form解析
        mate['resolveType'] = mate['resolveType'] ? mate['resolveType'] + '2' : '2'
    },
    initDetailMeta(meta, vue) {
        if(meta['isDetail'] == null) {
            meta['isDetail'] = true;
        }
    },
    switchLabelFormatter(val, model, meta) {
        return val ? meta['checkedChildren'] : meta['unCheckedChildren'];
    },
    optionsLabelFormatter(val, model, meta) {
        if(val == null) return '';

        if(Utils.isArray(val)) {
            return val.map(value=>{
                let option = meta.DataMap[value];
                return option != null ? option['label'] : '';
            });
        } else {

            let option = meta.DataMap[val];
            return option != null ? option['label'] : '';
        }
    },
    initCommonMate (mate, _this) {
        // 已经解析过, 无需再次解析
        if (Utils.isResolveCommon(mate)) return;

        if (mate.type == 'action') return;

        // 合并默认配置
        if (!mate.config) _this.$set(mate, 'config', {});
        this.mergeDefaultObject(mate.config, cacheApi.izMetaDefaultConfig(mate.type), _this) // 何必默认配置

        // 合并默认事件
        if (!mate.event) _this.$set(mate, 'event', {});
        this.mergeDefaultObject(mate.event, cacheApi.izMetaDefaultEvent(mate.type), _this)

        let metaConfig = mate['config'];
        if (Utils.isOptionType(mate.type)) {
            let valueField = metaConfig['valueField'];
            let labelField = metaConfig['labelField'];

            mate['DataMap'] = {};
            if (Utils.isNotBlank(mate.data)) { // 自带的options
                if (mate.type === 'stree' || mate.type === 'tree' || mate.type == 'cascade') {
                    this.resolverTree(mate.data, (item) => {
                        mate['DataMap'][item['value']] = item
                    })
                } else {
                    mate.data.forEach(option => {
                        mate['DataMap'][option['value']] = option
                    })
                }

                if (!mate['formatter']) {
                    _this.$set(mate, 'formatter', this.optionsLabelFormatter)
                }
            } else if (mate.dictType) { // 字典数据
                let options = [];
                labelField = Global.dictLabelField;
                valueField = Global.dictValueField;
                cacheApi.izGetOptions(mate.dictType).then(data=>{
                    data.forEach(item => {
                        let option = {label: item[labelField], dataRef: item
                            , value: item[valueField], disabled: false};
                        options.push(option);
                        mate.DataMap[option.value] = option;
                    })
                });
                _this.$set(mate, 'data', options);
                if (!mate.formatter) {
                    _this.$set(mate, 'formatter', (val, row, col)=>{
                        return cacheApi.izGetDictDataLabel(col.dictType, val)
                    })
                }
            } else if (mate.type === 'stree' || mate.type === 'tree') {
                if (Utils.isBlank(mate.url)) {
                    _this.$set(mate, 'data', [])
                    return _this.$log.warningLog(`字段(${mate.field})解析警告`
                        , '设置stree或tree类型的数据源Url或data', mate)
                } else {
                    let options = []
                    _this.$set(mate, 'data', options)
                    Http.get(mate.url).then(resp => {
                        let data = resp['data'];
                        if (_this.$utils.isNotBlank(data)) {
                            this.resolverTree(data, (obj) => {
                                _this.$set(obj, 'label', obj[labelField]);
                                _this.$set(obj, 'value', obj[valueField]);
                                mate.DataMap[obj.value] = obj;
                            });

                            data.forEach(item=>options.push(item));
                        } else {
                            _this.$log.warningLog(`解析字段(${mate.field})获取url:(${mate.url})数据失败`
                                , `请检查服务端`, mate)
                        }

                        // 数据加载完成之后, 触发完成事件
                        let onLoadFinished = mate.event['loadFinished']
                        if (typeof onLoadFinished === 'function') onLoadFinished(options, mate)
                    });
                }

                if (!mate.formatter) {
                    _this.$set(mate, 'formatter', this.optionsLabelFormatter)
                }
            } else if (mate.url) { // 是url
                if (Utils.isBlank(mate.url)) {
                    _this.$set(mate, 'data', []);
                    return _this.$log.warningLog(`字段(${mate.field})解析警告`, `设置${mate.type}类型的数据源Url或者data`, mate)
                }

                let selectOptions = [];
                _this.$set(mate, 'data', selectOptions)
                Http.get(mate.url).then(resp => {
                    let rows = resp['data'];
                    if (rows) {
                        rows.forEach(item => {
                            let option = {disabled: false, dataRef: item
                                , label: item[labelField], value: item[valueField]};
                            selectOptions.push(option);
                            mate.DataMap[option.value] = option;
                        });

                        // 数据加载完成之后, 触发完成事件
                        let onLoadFinished = mate.event['loadFinished']
                        if (typeof onLoadFinished === 'function') {
                            onLoadFinished(selectOptions, mate)
                        }
                    } else {
                        _this.$log.warningLog(`解析字段(${mate.field})获取url:(${mate.url})数据失败`
                            , `请检查服务端`, mate)
                    }
                });

                if (!mate.formatter) {
                    _this.$set(mate, 'formatter', this.optionsLabelFormatter)
                }
            }
        }
        if (mate.type == 'switch') {
            if (!mate.formatter) {
                _this.$set(mate, 'formatter', this.switchLabelFormatter)
            }
        }
        // 日期类型
        // 初始化默认日期配置
        // usable 是可以选择的时间范围[min, max] | [min, null] | [null, max]
        // quick是快捷时间选项 可以是boolean类型和对象, 如果是Boolean类型则使用默认快捷选项
        if (_this.$utils.isDate(mate.type)) {
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

            if (!mate.formatter) _this.$set(mate, 'formatter', this.dateFormatter);
            if (!metaConfig['format']) _this.$set(metaConfig, 'format', this.dateFormat); // 日期 表单显示格式
            if (!metaConfig['viewFormat']) _this.$set(metaConfig, 'viewFormat', this.viewFormat) // 日期 表格显示格式
        }
        if(mate.type == 'switch' && !mate.formatter) {
            _this.$set(mate, 'formatter', this.switchFormatter)
        }
        mate['resolveType'] = mate['resolveType'] ? mate['resolveType'] + '1' : '1' // 说明此字段已经完成common解析
    },
    initTableMate (item, config, _this) {
        // 已经解析过, 无需再次解析
        if (Utils.isResolveTable(item)) return;

        if (item['isTable'] === false) return;
        else _this.$set(item, 'isTable', true);

        // 先解析通用信息, 如果之前没有解析的话
        this.initCommonMate(item, _this);

        _this.$set(item, 'key', item.field);
        _this.$set(item, 'dataIndex', item.field);

        //设置 column.ellipsis 可以让单元格内容根据宽度自动省略。
        item['ellipsis'] = item.ellipsis !== false && config['ellipsis'] !==false;

        // 表格操作元数据
        if (item['type'] === 'action') { // action列的宽度必须手动指定, 否则不指定
            _this.$set(item, 'scopedSlots', {customRender: item.field + '_t'})
        } else {
            if(item.width == -1) delete item.width;
            else if (!item.width) _this.$set(item, 'width', 136) // 默认宽度为136px
        }
        if (item['formatter']) { // 只要是存在需要重新格式化数据的字段, 在表里面全部使用slot
            item['tableSlot'] = item.field + '_t';
            _this.$set(item, 'scopedSlots', {customRender: item.tableSlot})
        } else if(item['editable']) { // 如果是可编辑的也需要重新格式化
            _this.$set(item, 'formatter', (val) => val);
            item['tableSlot'] = item.field+'_t';
            _this.$set(item, 'scopedSlots', {customRender: item.tableSlot})
        }

        // 默认的字段值
        if (item.width) config.scroll.x += parseInt(item.width);
        if (!item.align) _this.$set(item, 'align', 'center'); // 默认居中对齐
        item['resolveType'] = item['resolveType'] ? item['resolveType'] + '3' : '3' // 说明此字段已经完成table解析
    },
    resolverFormSlots(fieldMetaMap, scopedSlots) {
        let noMatcher = false;
        let formSlots = [];
        let formatter = (val, row, meta) => val;
        Object.keys(scopedSlots).forEach(name => {
            if (name.startsWith("$")) return;
            let field = Utils.toHump(name.substring(0, name.length - 2));
            let meta = fieldMetaMap[field];
            if (!meta) {
                Logger.warningLog(`slot ${name} 找不到匹配的Meta`
                    , "slot名称必须遵循：如果是驼峰式的字段则必须用'_'隔开，且以_f结尾");
                return;
            }
            if (name.endsWith('_f')) {
                meta['formSlot'] = name;
                formSlots.push(meta);
            } else {
                noMatcher = true;
                Logger.warningLog(`slot ${name}名称不规范, 将舍弃`, 'slot名称必须以：_f结尾');
            }
        });

        if (noMatcher) {
            Logger.warningLog(`解析slot时名称不规范：`
                , "slot名称遵循以下规范：\r\n 1. 字段名称+表单(_f)结尾\r\n 2.驼峰式的字段名要转成a_b形式" +
                "\r\n 3.如：字段userName分别写成user_name_f")
        }

        return formSlots;
    }
}
