import {FormContext} from "@/components/form/basic/FormContext";
import {confirm, msgError, msgSuccess, msgWarn} from "@/utils/message";
import {FuncNameMeta, MetaConst, TypeMethodMaps} from "@/utils/MetaUtils";
import SysUtils from "@/utils/SysUtils";
import CoreConsts from "@/components/CoreConsts";

function Unmount() {
    console.warn("此方法只能在组件挂载时才能使用");
}
function unIvzFuncTag() {
    console.warn("需使用[IvzFuncTag]作为表格按钮")
}

/**
 * 视图组件提供的操作接口
 * @see IvzBasicView
 * @see IvzFuncView
 * @see IvzMenuView
 * @param context 视图组件的上下文对象{@link ViewContext}
 */
export function $View(context) {

    this.context = context;

    if(!context) {
        return console.error("未传入视图上下文对象[ViewContext]")
    }

    this.context['__$View'] = this;

    this.getRowKey = function () {
        return this.context.getRowKey();
    }

    this.getViewContext = function () {
        return this.context;
    }

    /**
     * 获取功能元上下文, 只能用于以下两种组件
     * @see IvzFuncView
     * @set IvzMenuView
     * @return {void|FuncMetaContext|*}
     */
    this.getMetaContext = function () {
        if(!this.context.funMetasContext) {
            return console.warn("此方法只能在组件[IvzFuncView or IvzMenuView]中使用")
        }

        return this.context.funMetasContext;
    }

    /**
     * 获取编辑功能元数据
     * @param field
     * @return {*}
     */
    this.getEditMeta = function (field) {
        return this.getMetaContext().getEditMeta(field);
    }

    /**
     * 获取表格功能元数据
     * @param field
     * @return {*}
     */
    this.getTableMeta = function (field) {
        return this.getMetaContext().getTableMeta(field);
    }

    /**
     * 获取搜索功能元数据
     * @param field
     * @return {*}
     */
    this.getSearchMeta = function (field) {
        return this.getMetaContext().getSearchMeta(field);
    }

    this.getEditFunc = function (func) {
        return this.getEditContext().getFunc(func)
    }

    this.getSearchFunc = function (func) {
        return this.getSearchContext().getFunc(func);
    }

    this.getTableFunc = function (func) {
        return this.getTableContext().getFunc(func)
    }

    this.getDetailFunc = function (func) {
        return this.getDetailContext().getFunc(func)
    }
    /**
     * 获取当前视图页的名称 eg: 用户管理、部门管理等
     * 需要在视图组件设置属性：name
     */
    this.getFuncName = function () {
        return this.context.name;
    }

    /**
     * 获取主编辑组件的model对象
     * @return {*}
     */
    this.getEditModel = function () {
        return this.getEditContext().getModel();
    }

    /**
     * 获取主搜索组件的model对象
     * @return {*}
     */
    this.getSearchModel = function () {
        return this.getSearchContext().getModel();
    }

    /**
     * 校验一个model是编辑还是新增
     * 默认根据 rowKey判断
     * @param model
     * @return {boolean}
     */
    this.isEdit = function (model) {
        let rowKey = this.getRowKey();
        let rowKeyValue = model[rowKey];
        return rowKeyValue != null;
    }

    /**
     * 返回编辑框获取数据需要的地址
     * 注：可根据情况自行替换和修改
     * @param model
     * @return {String}
     */
    this.getEditUrl = function (model, editContext) {
        let rowKey = this.getRowKey();
        let editFunc = this.getTableFunc(FuncNameMeta.EDIT);
        if(editFunc && model) {
            let url = editFunc.getUrl();
            if(url) {
                return `${url}?${rowKey}=${model[rowKey]}`;
            } else {
                console.warn('未指定编辑功能详情地址[url]')
                return null;
            }
        } else {
            console.warn('未指定编辑功能[IvzFuncTag]')
            return null;
        }
    }

    /**
     * 打开编辑框
     * @param callback 用来对数据进行处理
     */
    this.openForAdd = function (callback) {
        let editContext = this.getEditContext();

        if(editContext.isPrimary) {
            editContext.asyncVisible().then((model) => {
                let initModel = editContext.getFormContext().getInitModel();
                if(callback instanceof Function) {
                    callback(initModel);
                }

                editContext.getFormContext().setEditModel(initModel);
            })
        }
    }

    /**
     * 删除主表格记录
     * @param url 删除地址 必填
     * @param data 删除的数据 必填
     * @param confirmTitle 确认标题 非必填
     * @param confirmContext 确认内容 非必填
     * @return void
     */
    this.del = function (url, data, confirmTitle, confirmContext) {
        if(!url) {
            return console.warn("未指定删除的地址[url]")
        }

        let query = SysUtils.resolverQueryOfUrl(url);
        if(!data && Object.keys(query).length == 0) {
            msgWarn("请选择要删除的记录"); return;
        }

        // 删除的默认参数是数组
        if(typeof data == 'object') {
            data = [data[this.getRowKey()]];
        }

        let title = confirmTitle || CoreConsts.DelConfirmTitle;
        let content = confirmContext || CoreConsts.DelConfirmContent;

        confirm({title, content, onOk: () => {
                TypeMethodMaps.Del(url, data).then(({code, message, data}) => {
                    if (code == MetaConst.SuccessCode) {
                        msgSuccess(message || CoreConsts.DelSuccessMsg);
                        this.query(); // 删除成功, 重新刷新列表
                    } else {
                        msgError(message);
                    }
                }).catch(reason => msgError(reason))
            }, onCancel: () => null
        })

    }

    /**
     * 批量删除主表格选中的数据
     * @param url 删除地址
     * @param confirmTitle 删除的确认标题
     * @param confirmContext 删除的确认内容
     */
    this.batchDel = function (url, confirmTitle, confirmContext) {
        let tableContext = this.getTableContext();
        if(!tableContext.isPrimary) {
            return;
        }

        let selectedRowKeys = tableContext.getSelectedRowKeys();
        this.del(url, selectedRowKeys, confirmTitle, confirmContext);
    }

    /**
     * 打开主编辑框
     * url > data
     * @param url 编辑数据地址
     * @param data 编辑数据
     */
    this.openForEdit = function (url, data) {
        let editContext = this.getEditContext();

        if(editContext.isPrimary) {
            url = url ? url : this.getEditUrl(data, editContext);
            if(url) {
                editContext.asyncVisible().then(() => {
                    editContext.setLoading(true);
                    TypeMethodMaps.Edit(url).then(({code, message, data}) => {
                        if(code == MetaConst.SuccessCode) {
                            editContext.getFormContext().setEditModel(data);
                        } else {
                            msgError(message);
                        }
                    }).finally(() => editContext.setLoading(false))
                })
            }
        }
    }

    /**
     * 打开编辑框
     * 注：必须使用{@link IvzFuncTag}组件单击打开
     * @param url
     * @param data 默认使用 rowKey值
     */
    this.openForEditByFuncTag = function (url) {
        let rowKey = this.getRowKey(), data = {};
        let currentRow = this.getTableContext().getCurrentRow();
        data[rowKey] = currentRow[rowKey]

        this.openForEdit(url, data);
    }

    /**
     * 查询主表格数据
     * @param url 查询地址
     */
    this.query = function (url) {
        let searchContext = this.getSearchContext();
        if(!searchContext.isPrimary) return;

        let queryUrl = url
        // 没有指定查询地址, 尝试从IvzFuncBtn获取地址
        if(!queryUrl) {
            // 获取功能元[IvzFuncBtn or IvzFuncTag]地址
            let searchFunc = this.getSearchFunc(FuncNameMeta.QUERY);
            if(searchFunc) {
                queryUrl = searchFunc.getUrl();
            } else {
                queryUrl = searchContext.queryUrl;
            }
        } else {
            searchContext.queryUrl = queryUrl;
        }

        if(!queryUrl) {
            return console.error("未指定查询地址[url]")
        }

        let tableContext = this.getTableContext();
        if(!tableContext.isPrimary) return;

        let model = searchContext.getModel();
        if(tableContext.pageSize && tableContext.currentPage) {
            model[MetaConst.PageSize] = tableContext.pageSize;
            model[MetaConst.PageCurrent] = tableContext.currentPage;
        }

        tableContext.setLoading(true);
        TypeMethodMaps.View(queryUrl, model).then(({code, message, data}) => {
            if(code == MetaConst.SuccessCode) {
                if(data instanceof Array){
                    tableContext.setDataSource(data)
                } else if(data instanceof Object) { // 需要分页
                    let {records, total} = data;

                    tableContext.setTotalRows(total);
                    tableContext.setDataSource(records)
                }
            } else {
                msgError(message)
            }
        }).finally(() => {
            tableContext.setLoading(false);
        })
    }

    this.detail = function (url) {

    }

    /**
     * 隐藏主编辑框
     */
    this.cancel = function () {
        let editContext = this.getEditContext();
        if(!editContext.isPrimary) return;

        // 关闭编辑框的加载状态
        editContext.setLoading(false);
        // 关闭编辑框
        editContext.setVisible(false);
        // 移除所有的校验
        editContext.getFormContext().clearValidate();
    }
    /**
     * 展开树形的表格
     * @param expandedRowKeys 要展开的行的key列表 不指定则展开所有
     */
    this.expanded = function (expandedRowKeys) {
        let tableContext = this.getTableContext();
        if(tableContext.isPrimary) {
            tableContext.expanded(expandedRowKeys);
        }
    }
    /**
     * 提交主编辑表单
     * @param url 编辑地址
     * @return void
     */
    this.submit = function (url) {
        if(!url) {
            return console.warn("未指定提交地址[url]");
        }

        let editContext = this.getEditContext();
        if(!editContext.isPrimary) {
            return;
        }

        editContext.getFormContext().validate().then(() => {
            let model = editContext.getModel();
            editContext.setLoading(true);
            TypeMethodMaps.Submit(url, model).then(({code, message, data}) => {
                if (code == MetaConst.SuccessCode) {
                    msgSuccess(CoreConsts.SubmitSuccessMsg);
                    editContext.setVisible(false);
                    this.query(); // 提交数据之后重新刷新列表
                } else {
                    msgError(message);
                }
            }).catch(reason => msgError(reason))
                .finally(() => editContext.setLoading(false))
        }).catch(reason => null)
    }

    /**
     * 重置主编辑表单
     */
    this.resetEditModel = function () {
        let editContext = this.getEditContext();
        if(!editContext.isPrimary) return;

        let editModel = editContext.getFormContext().getEditModel();
        if(editModel && this.isEdit(editModel)) {
            editContext.setLoading(true);
            let url = this.getEditUrl(editModel, editContext);
            if(!url) return;

            TypeMethodMaps.Edit(url).then(({code, message, data}) => {
                if(code == MetaConst.SuccessCode) {
                    editContext.getFormContext().setEditModel(data);
                } else {
                    msgError(message);
                }
            }).finally(() => editContext.setLoading(false))
        } else {
            editContext.getFormContext().resetFields();
        }
    }

    /**
     * 重置主搜索表单
     */
    this.resetSearchModel = function () {
        let searchContext = this.getSearchContext();
        if(!searchContext.isPrimary) return;

        searchContext.getFormContext().resetFields();
        this.query(); // 重置之后, 重新刷新列表
    }

    /**
     * @param id 元素的唯一id 如果空将返回主搜索上下文对象
     * @return {SearchContext|*}
     */
    this.getSearchContext = function (id) {
        if(id) {
            let context = this.context.getContextById(id)
            if(context) {
                return context;
            } else {
                return console.warn(`查找不到id=${id}的编辑上下文`)
            }
        }

        if(!this.context.primarySearchContext.isPrimary && import.meta.env.DEV) {
            console.warn("未声明标记为[primary]的搜索组件")
        }

        return this.context.primarySearchContext;
    }

    /**
     * 通过前缀获取搜索上下文
     * @param prefix
     * @return {SearchContext}
     */
    this.getSearchContextByPrefix = function (prefix) {
        let context = this.context.getContextByPrefix(prefix);
        if(context instanceof SearchContext) {
            return context;
        } else {
            return console.warn(`未声明前缀为[${prefix}]的搜索组件`)
        }
    }

    /**
     * @param id 元素的唯一id 如果空将返回主编辑上下文对象
     * @return {EditContext|*}
     */
    this.getEditContext = function (id) {
        if(id) {
            let contextById = this.context.getContextById(id);
            if(contextById) {
                return contextById;
            } else {
                return console.warn(`查找不到id=${id}的编辑上下文`)
            }
        }

        if(!this.context.primaryEditContext.isPrimary && import.meta.env.DEV) {
            console.warn("未声明标记为[primary]的编辑组件")
        }

        return this.context.primaryEditContext;
    }

    /**
     * 通过前缀获取编辑上下文
     * @param prefix
     * @return {EditContext}
     */
    this.getEditContextByPrefix = function (prefix) {
        let context = this.context.getContextByPrefix(prefix);
        if(context instanceof EditContext) {
            return context;
        } else {
            return console.warn(`未声明前缀为[${prefix}]的编辑组件`)
        }
    }

    /**
     * @param id 元素的唯一id 如果空将返回主表格上下文对象
     * @return {TableContext|*}
     */
    this.getTableContext = function (id) {
        if(id) {
            let contextById = this.context.getContextById(id);
            if(contextById) {
                return contextById;
            } else {
                return console.warn(`查找不到id=${id}的编辑上下文`)
            }
        }

        if(!this.context.primaryTableContext.isPrimary && import.meta.env.DEV) {
            console.warn("未声明标记为[primary]的表组件")
        }

        return this.context.primaryTableContext;
    }

    /**
     * 通过前缀获取表上下文
     * @param prefix
     * @return {TableContext}
     */
    this.getTableContextByPrefix = function (prefix) {
        let context = this.context.getContextByPrefix(prefix);
        if(context instanceof TableContext) {
            return context;
        } else {
            return console.warn(`未声明前缀为[${prefix}]的表组件`)
        }
    }

    /**
     * @param id 元素的唯一id 如果空将返回主详情上下文对象
     * @return {DetailContext|*}
     */
    this.getDetailContext = function (id) {
        if(id) {
            let contextById = this.context.getContextById(id);
            if(contextById) {
                return contextById;
            } else {
                return console.warn(`查找不到id=${id}的编辑上下文`)
            }
        }

        if(!this.context.primaryDetailContext.isPrimary && import.meta.env.DEV) {
            console.warn("未声明标记为[primary]的详情组件")
        }

        return this.context.primaryDetailContext;
    }

    /**
     * 通过前缀获取详情上下文
     * @param prefix
     * @return {DetailContext}
     */
    this.getDetailContextByPrefix = function (prefix) {
        let context = this.context.getContextByPrefix(prefix);
        if(context instanceof DetailContext) {
            return context;
        } else {
            return console.warn(`未声明前缀为[${prefix}]的详情组件`)
        }
    }
}

/**
 * 功能元数据对象
 * @constructor
 */
export function FuncMetaContext(editFunMetas, tableFunMetas, searchFunMetas) {

    this.editFunMetas = editFunMetas || [];
    this.tableFunMetas = tableFunMetas || [];
    this.searchFunMetas = searchFunMetas || [];

    this.getEditMeta = function (field) {
        return this.editFunMetas.find(item => item.field == field)
    }

    this.getTableMeta = function (field) {
        return this.tableFunMetas.find(item => item.field == field)
    }

    this.getSearchMeta = function (field) {
        return this.searchFunMetas.find(item => item.field == field)
    }
}

/**
 * 搜索栏
 * @param context 视图上下文
 * @constructor
 */
export function SearchContext(viewContext) {
    // 用于关联各个组件(表格、编辑、详情)
    this.prefix = '';
    // 是否是主上下文
    this.isPrimary = false;
    // 查询地址
    this.queryUrl = null;
    // 存储IvzFuncBtn和IvzFuncTag组件的信息
    this.funcMetas = {};

    // 获取功能组件配置
    this.getFunc = function (func) {
        func = func.toUpperCase();
        let funcMeta = this.funcMetas[func];

        // 遗留问题, query和view都代表查询
        let isQuery = func == 'QUERY' || func == 'VIEW';
        if(isQuery) {
            funcMeta = this.funcMetas['QUERY'] || this.funcMetas['VIEW'];
        }

        if(funcMeta) {
            return funcMeta;
        } else {
            return console.warn(`搜索组件不包含功能[${func}]`);
        }
    }
    this.regFunc = function (func, config) {
        this.funcMetas[func] = config;
    }

    this.getModel = function () {
        return this.getFormContext().getEditModel();
    }

    /**
     * 重置当前表单
     */
    this.reset = function () {
        this.getFormContext().resetFields();
    }

    this.getFormContext = () => new FormContext();

    this.get$View = function () {
        // viewContext['__$View'] 不可能为空, 为空说明异常
        return viewContext['__$View'] || new $View(null);
    }

}


/**
 * 编辑
 * @param viewContext 视图上下文
 * @constructor
 */
export function EditContext(viewContext) {
    // 用于关联各个组件(搜索、表格、详情)
    this.prefix = '';
    // 是否是主上下文
    this.isPrimary = false;
    // 存储IvzFuncBtn和IvzFuncTag组件的信息
    this.funcMetas = {};

    // 获取功能组件配置
    this.getFunc = function (func) {
        let funcMeta = this.funcMetas[func.toUpperCase()];
        if(funcMeta) {
            return funcMeta;
        } else {
            return console.warn(`搜索组件不包含功能[${func}]`);
        }
    }
    this.regFunc = function (func, config) {
        this.funcMetas[func] = config;
    }
    this.getModel = function () {
        return this.getFormContext().getEditModel();
    }

    this.setModel = function (model) {
        this.getFormContext().setEditModel(model);
    }

    /**
     * 重置当前表单
     */
    this.reset = function () {
        this.getFormContext().resetFields();
    }

    /**
     * 关闭当前弹框
     */
    this.cancel = function () {
        this.setVisible(false);
    }

    /**
     * 提交表单
     * @param url 提交地址
     * @return {Promise<unknown>}
     */
    this.submit = function (url) {
        return new Promise((resolve, reject) => {
            this.getFormContext().validate().then(() => {
                let model = this.getModel();
                this.setLoading(true);
                TypeMethodMaps.Submit(url, model).then(resp => {
                    let {code, message, data} = resp;
                    if(code == MetaConst.SuccessCode) {
                        resolve(resp);
                        this.setVisible(false);
                        msgSuccess(message || "提交成功");
                    } else {
                        msgError(message);
                        reject(message);
                    }
                }).catch(reason => reject(reason)).finally(() => this.setLoading(false))
            }).catch(reason => {})
        })
    }

    // 修改加载状态
    this.setLoading = (status) => {};
    // 设置加载文本
    this.setLoadingTip = (tip) => {};
    // 修改弹框状态(模态框或者抽屉框)
    this.setVisible = (status) => {Unmount()};
    // 异步打开弹框(模态框或者抽屉框) 等表单初始化完成
    this.asyncVisible = () => Promise.reject("未挂载");

    // 必须在相应的地方重新初始化
    // 表单上下文对象
    this.getFormContext = () => new FormContext();

    /**
     * @returns {$View}
     */
    this.get$View = function () {
        // viewContext['__$View'] 不可能为空, 为空说明异常
        return viewContext['__$View'] || new $View(null);
    }
}

/**
 * 表格
 * @param viewContext 视图上下文
 * @constructor
 */
export function TableContext(viewContext) {
    // 用于关联各个组件(搜索、编辑、详情)
    this.prefix = '';

    // 是否是主上下文
    this.isPrimary = false;
    // 在使用IvzFuncTag#data组件时, 将可以获取该值
    this.CurrentRow = null;

    this.pageSize = null;
    this.currentPage = null;
    // 存储IvzFuncBtn和IvzFuncTag组件的信息
    this.funcMetas = {};

    // 获取功能组件配置
    this.getFunc = function (func) {
        let funcMeta = this.funcMetas[func.toUpperCase()];
        if(funcMeta) {
            return funcMeta;
        } else {
            return console.warn(`搜索组件不包含功能[${func}]`);
        }
    }
    this.regFunc = function (func, config) {
        this.funcMetas[func] = config;
    }

    this.del = function (url, data) {}

    /**
     * 展开行
     * @param expandedRowKeys 要展开的行key, 不传则展开所有行
     */
    this.expanded = (expandedRowKeys) => {};

    /**
     * 获取当前页码
     */
    this.getCurrentPage = function () {
        return this.currentPage;
    }

    /**
     * 获取每页条数
     */
    this.getPageSize = function () {
        return this.pageSize;
    }

    /**
     * 获取当前点击的行
     * 使用此方法必须在表格的操作栏里面使用以下组件作为功能按钮
     * @see IvzFuncTag 必须设置data属性
     */
    this.getCurrentRow = function () {
        return this.CurrentRow || unIvzFuncTag();
    }

    /**
     * 页码改变
     * @param current 当前页
     * @param pageSize 每页条数
     */
    this.pageChange = function (current, pageSize) {
        this.pageSize = pageSize;
        this.currentPage = current;

        if(this.isPrimary) {
            this.get$View().query();
        }
    }

    /**
     * 每页条数改变事件
     * @param current 当前页
     * @param pageSize 每页条数
     */
    this.sizeChange = function (current, pageSize) {
        this.pageSize = pageSize;
        this.currentPage = current;

        if(this.isPrimary) {
            this.get$View().query();
        }
    }

    /**
     * 获取当前选中的行key列表
     * @returns {*[]}
     */
    this.getSelectedRowKeys = () => [];

    /**
     * 获取当前选中的行列表
     * @returns {*[]}
     */
    this.getSelectedRows = () => [];

    /**
     * 获取当前页面视图
     * @returns {*}
     */
    this.get$View = function () {
        // viewContext['__$View'] 不可能为空, 为空说明异常
        return viewContext['__$View'] || new $View(null);
    }

    // 设置表格的加载状态
    this.setLoading = (status) => {};

    // 设置数据源
    this.setDataSource = (dataSource) => {};
}

/**
 * 详情
 * @param viewContext
 * @constructor
 */
export function DetailContext(viewContext) {
    // 用于关联各个组件(搜索、编辑、表格)
    this.prefix = '';
    // 是否是主上下文
    this.isPrimary = false;
    // 存储IvzFuncBtn和IvzFuncTag组件的信息
    this.funcMetas = {};

    // 获取功能组件配置
    this.getFunc = function (func) {
        let funcMeta = this.funcMetas[func.toUpperCase()];
        if(funcMeta) {
            return funcMeta;
        } else {
            return console.warn(`搜索组件不包含功能[${func}]`);
        }
    }
    this.regFunc = function (func, config) {
        this.funcMetas[func] = config;
    }
    this.get$View = function () {
        // viewContext['__$View'] 不可能为空, 为空说明异常
        return viewContext['__$View'] || new $View(null);
    }
}
/**
 * 视图上下文
 * @constructor
 */
export function ViewContext (props) {
    this.IdContextMaps = {} // 声明id的上下文对象
    this.funMetasContext = new FuncMetaContext();

    this.primaryEditContext = new EditContext(this);
    this.primaryTableContext = new TableContext(this);
    this.primaryDetailContext = new DetailContext(this);
    this.primarySearchContext = new SearchContext(this);

    /**
     * 功能点权限校验
     * @return {{default: boolean, type: BooleanConstructor}}
     */
    this.isAuth = function () {
        return props.auth;
    }

    /**
     * 获取视图名称
     * @return {String}
     */
    this.getName = function () {
        return props.name;
    }

    /**
     * 返回此功能的唯一key
     * @return {String}
     */
    this.getRowKey = function () {
        return props.rowKey;
    }

    /**
     * 获取元数的id获取对应上下文
     * @param id
     * @return {*}
     */
    this.getContextById = function (id) {
        return this.IdContextMaps[id];
    }

    /**
     * 获取上下文通过指定的前缀
     * @param prefix
     * @return {EditContext | TableContext | SearchContext | DetailContext}
     */
    this.getContextByPrefix = function (prefix) {
        return Object.values(this.IdContextMaps).find(item => item.prefix == prefix);
    }

    /**
     * 增加上下文
     * @param id
     * @param context
     */
    this.addContextById = function (id, context) {
        if(id && context) {
            if(!this.IdContextMaps[id]) {
                this.IdContextMaps[id] = context;
                let idSplit = id.split(":"); // demo:table 将demo作为上下文对象的前缀
                if(idSplit.length == 2) {
                    context.prefix = idSplit[0];
                }
            } else {

            }
        } else {

        }
    }
}
