import {FormContext} from "@/components/form/basic/FormContext";
import {confirm, msgError, msgSuccess, msgWarn} from "@/utils/message";
import {FuncNameMeta, TypeMethodMaps} from "@/utils/MetaUtils";
import SysUtils from "@/utils/SysUtils";
import CoreConsts from "@/components/CoreConsts";
import {GET, POST} from "@/utils/request";

function Unmount() {
    console.warn("此方法只能在组件挂载时才能使用");
}
function unUFuncTag() {
    console.warn("需使用[UFuncTag]作为表格按钮")
}

/**
 * 视图组件提供的操作接口
 * @see UView
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

    /**
     * 功能的唯一代表字段 - 比如：id
     * @see CoreConsts#DefaultRowKey
     * @return {String|Number}
     */
    this.getRowKey = function () {
        return this.context.getRowKey();
    }

    /**
     * 当前视图(功能)页的上下文对象
     * @see ViewContext
     * @return {ViewContext}
     */
    this.getViewContext = function () {
        return this.context;
    }

    /**
     * 获取功能元上下文, 只能用于以下两种组件
     * @see IvzFuncView
     * @set IvzMenuView
     * @return {void|FuncMetaContext}
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
     * @return {void|Object}
     */
    this.getEditMeta = function (field) {
        return this.getMetaContext().getEditMeta(field);
    }

    /**
     * 获取表格功能元数据
     * @param field
     * @return {void|Object}
     */
    this.getTableMeta = function (field) {
        return this.getMetaContext().getTableMeta(field);
    }

    /**
     * 获取搜索功能元数据
     * @param field
     * @return {void|Object}
     */
    this.getSearchMeta = function (field) {
        return this.getMetaContext().getSearchMeta(field);
    }

    this.getEditFunc = function (func) {
        let editContext = this.getPrimaryEditContext();
        return editContext ? editContext.getFunc(func) : null;
    }

    this.getSearchFunc = function (func) {
        let searchContext = this.getPrimarySearchContext();
        return searchContext ? searchContext.getFunc(func) : null;
    }

    this.getTableFunc = function (func) {
        let tableContext = this.getPrimaryTableContext();
        return tableContext ? tableContext.getFunc(func) : null;
    }

    this.getDetailFunc = function (func) {
        return this.getPrimaryDetailContext().getFunc(func)
    }
    /**
     * 获取当前视图页的名称 eg: 用户管理、部门管理等
     * 需要在视图组件设置属性：name
     * @return {String}
     */
    this.getFuncName = function () {
        return this.context.name;
    }

    /**
     * 获取主编辑组件的model对象
     * @return {*}
     */
    this.getEditModel = function () {
        return this.getPrimaryEditContext().getModel();
    }

    /**
     * 获取主搜索组件的model对象
     * @return {*}
     */
    this.getSearchModel = function () {
        return this.getPrimarySearchContext().getModel();
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
     * @return {Object}
     */
    this.getEditUrl = function (data, editContext) {
        let rowKey = this.getRowKey();
        let params = {}; params[rowKey] = data[rowKey];
        return params
    }

    /**
     * 打开编辑框
     * @param config {Config}
     */
    this.openForAdd = function (config) {
        let editContext = this.getViewContext().getContextByUid(config.toUid);
        if(editContext == null) {
            return console.warn(`未找到对应uid的可编辑组件[${config.toUid}]`)
        } else {
            if(editContext.uid.startsWith("Primary")) {
                editContext = this.getPrimaryEditContext();
            } else if(!(editContext instanceof EditContext)) {
                return console.warn(`未找到对应uid的可编辑组件[${config.toUid}]`)
            }
        }

        editContext.openType = 'add';
        editContext.asyncVisible(config.data, true).then((model) => {
            let formContext = editContext.getFormContext();
            formContext.setEditModel(model);
        })
    }

    /**
     * 删除主表格记录
     * @param config {Config}
     * @return void
     */
    this.del = function (config) {
        let {url, data, confirmTitle, confirmContext} = config

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
            this.getRequestMethod(config)(url, data).then(({code, message, data}) => {
                if (code == CoreConsts.SuccessCode) {
                    msgSuccess(message || CoreConsts.DelSuccessMsg);
                    this.queryByFunc(CoreConsts.PrimarySearchRef); // 删除成功, 重新刷新列表
                } else {
                    msgError(message);
                }
            }).catch(reason => console.error(reason))
            }, onCancel: () => null
        })

    }

    /**
     * 批量删除主表格选中的数据
     * @param config {Config}
     */
    this.batchDel = function (config) {
        let tableContext = this.getPrimaryTableContext();
        if(!tableContext.isPrimary) {
            return;
        }
        let selectedRowKeys = tableContext.getSelectedRowKeys();
        this.del(config);
    }

    /**
     * 打开编辑框
     * @param config {Config}
     */
    this.openForEdit = function (config) {
        let editContext = this.getViewContext().getContextByUid(config.toUid);
        if(editContext == null) {
            return console.warn(`未找到对应uid的可编辑组件[${config.toUid}]`)
        } else {
            if(editContext.uid.startsWith("Primary")) {
                editContext = this.getPrimaryEditContext();
            } else if(!(editContext instanceof EditContext)) {
                return console.warn(`未找到对应uid的可编辑组件[${config.toUid}]`)
            }
        }

        let {url, data} = config;
        editContext.openType = 'edit';
        editContext.asyncVisible(data, false).then(() => {
            editContext.setLoading(true, CoreConsts.FormSpinLoadingTip);
            let params = this.getEditUrl(data, editContext);
            this.getRequestMethod(config)(url, params)
                .then(({code, message, data}) => {
                    if(code == CoreConsts.SuccessCode) {
                        editContext.getFormContext().setEditModel(data);
                    } else {
                        msgError(message);
                    }
                }).finally(() => editContext.setLoading(false))
        })
    }

    /**
     * 新增子记录
     * 支持格式：func='add:child'
     * 设置参数：:params="{pid: 'pid'}"
     * @param config {Config}
     */
    this.openForChild = function (config) {
        if(!(config.params instanceof Object)) {
            return console.error(`child子功能必须指定参数[params] 支持对象和函数 如：{pid: '父字段名(pid)', [id: '可选(id || rowKey)']}`)
        }

        let {id, pid} = this.getConfigParams(config, config.data);
        let editContext = this.getViewContext().getContextByUid(config.toUid);
        if(editContext == null) {
            return console.warn(`未找到对应uid的可编辑组件[${config.toUid}]`)
        } else {
            if(editContext.uid.startsWith("Primary")) {
                editContext = this.getPrimaryEditContext();
            } else if(!(editContext instanceof EditContext)) {
                return console.warn(`未找到对应uid的可编辑组件[${config.toUid}]`)
            }
        }

        // 打开编辑框并且是指pid
        editContext.asyncVisible(config.data, true).then(model => {
            let rowKey = id || this.getRowKey();
            // 设置pid
            model[pid] = config.data[rowKey];
        })
    }

    /**
     * 设置其他功能 比如：设置密码
     * @param config {Config}
     */
    this.openForSet = function (config) {
        if(!(config.params instanceof Object)) {
            return console.error(`set子功能必须指定参数[params] 支持对象和函数 返回：{copy: ['id', 'name', ...]}; copy指定要复制哪些字段到编辑对象`)
        }

        let {copy} = this.getConfigParams(config);
        if(copy instanceof String) {
            copy = [copy];
        }

        let editContext = this.getViewContext().getContextByUid(config.toUid);
        if(editContext == null) {
            return console.warn(`未找到对应uid的可编辑组件[${config.toUid}]`)
        } else {
            if(editContext.uid.startsWith("Primary")) {
                editContext = this.getPrimaryEditContext();
            } else if(!(editContext instanceof EditContext)) {
                return console.warn(`未找到对应uid的可编辑组件[${config.toUid}]`)
            }
        }

        // 打开编辑框后复制对应的字段到新的model
        editContext.asyncVisible(config.data, true).then(model => {
            // 复制属性
            copy.forEach(field => {
                model[field] = config.data[field];
            })
        })
    }

    /**
     * 更具查询功能点查询
     * @param uid 指定uid下的func
     */
    this.queryByFunc = function (uid) {
        if(!uid) {
            return console.error(`请指定查询参数uid`);
        }

        let contextByUid = this.getViewContext().getContextByUid(uid);
        if(contextByUid != null) {
            let queryFunc = contextByUid.getFunc(CoreConsts.FuncNameMeta.QUERY)
            if(queryFunc != null) {
                queryFunc.trigger()
            }
        }
    }

    /**
     * 查询主表格数据
     * @param config 配置信息
     */
    this.query = function (config) {
        let searchContext = this.getPrimarySearchContext();
        if(searchContext == null) return;

        let queryUrl = config.url

        let tableContext = this.getPrimaryTableContext();
        if(tableContext == null) return;

        let model = searchContext.getModel();
        if(tableContext.pageSize && tableContext.currentPage) {
            model[CoreConsts.PageSize] = tableContext.pageSize;
            model[CoreConsts.PageCurrent] = tableContext.currentPage;
        }

        tableContext.setLoading(true);
        this.getRequestMethod(config)(queryUrl, model).then(({code, message, data}) => {
            if(code == CoreConsts.SuccessCode) {
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

    /**
     * 获取详情(暂时未实现此功能)
     * @param config {Config}
     */
    this.detail = function (config) {

    }

    /**
     * 隐藏主编辑框
     * @param config {Config}
     */
    this.cancel = function (config) {
        let editContext = this.getViewContext().getContextByUid(config.toUid);
        if(!(editContext instanceof EditContext)) {
            return console.warn(`未找到对应的uid可编辑组件[${config.toUid}]`)
        }

        // 关闭编辑框的加载状态
        editContext.setLoading(false);
        // 关闭编辑框
        editContext.setVisible(false);
        // 移除所有的校验
        editContext.getFormContext().clearValidate();
    }
    /**
     * 展开树形的表格
     * @param config {Config}
     * @param expandedRowKeys 要展开的行的key列表 不指定则展开所有
     */
    this.expanded = function (config, expandedRowKeys) {
        let tableContext = this.getViewContext().getContextByUid(config.toUid);
        if(tableContext == null) {
            return console.warn(`未找到对应uid的表组件[${config.toUid}]`)
        } else {
            if(tableContext.uid.startsWith("Primary")) {
                tableContext = this.getPrimaryTableContext();
            } else if(!(tableContext instanceof TableContext)) {
                return console.warn(`未找到对应uid的表组件s[${config.toUid}]`)
            }
        }

        tableContext.expanded(expandedRowKeys);
    }
    /**
     * 提交主编辑表单
     * @param config {Config}
     * @return void
     */
    this.submit = function (config) {
        let editContext = this.getViewContext().getContextByUid(config.toUid);
        let isPrimary = config.toUid == CoreConsts.PrimaryEditRef;

        if(!(editContext instanceof EditContext)) {
            return console.warn(`未找到对应的uid可编辑组件[${config.toUid}]`)
        }

        editContext.getFormContext().validate().then(() => {
            let model = editContext.getModel();

            function setLoading(status, tip) {
                let submit = editContext.getFunc(FuncNameMeta.SUBMIT);
                if(submit) {
                    submit.setLoading(status);
                }

                editContext.setLoading(status, tip)
            }

            setLoading(true, CoreConsts.FormSpinSubmitTip);
            this.getRequestMethod(config)(config.url, model).then(({code, message, data}) => {
                if (code == CoreConsts.SuccessCode) {
                    msgSuccess(CoreConsts.SubmitSuccessMsg);
                    editContext.setVisible(false);
                    if(isPrimary) { // 提交数据之后重新刷新列表
                        this.queryByFunc(CoreConsts.PrimarySearchRef);
                    }
                } else {
                    msgError(message);
                }
            }).catch(reason => msgError(reason))
                .finally(() => setLoading(false))
        }).catch(reason => null)
    }

    /**
     * 重置主编辑表单
     * @param config {Config}
     */
    this.resetEditModel = function (config) {
        let editContext = this.getViewContext().getContextByUid(config.toUid);
        if(!(editContext instanceof EditContext)) {
            return console.warn(`未找到对应的uid可编辑组件[${config.toUid}]`)
        }

        if(config.toUid == CoreConsts.PrimaryEditRef) {
            let editModel = editContext.getFormContext().getEditModel();
            // 编辑时需要重新获取详情
            if(editModel && this.isEdit(editModel)) {
                let editFunc = this.getTableFunc(FuncNameMeta.EDIT);
                let method = editFunc.getMethod();
                let params = this.getEditUrl(editModel, editContext);
                editContext.setLoading(true, CoreConsts.FormSpinResetTip);
                this.getRequestMethod({method, func: 'edit'})(editFunc.getUrl(), params)
                    .then(({code, message, data}) => {
                        if(code == CoreConsts.SuccessCode) {
                            editContext.getFormContext().setEditModel(data);
                        } else {
                            msgError(message);
                        }
                }).finally(() => editContext.setLoading(false))
            } else { // 新增的重置只需要重置字段
                editContext.getFormContext().resetFields();
            }
        } else {
            editContext.getFormContext().resetFields();
        }
    }

    /**
     * 重置搜索表单
     * @param config {Config}
     */
    this.resetSearchModel = function (config) {
        let searchContext = this.getViewContext().getContextByUid(config.toUid);
        if(!(searchContext instanceof SearchContext)) {
            return console.warn(`未找到对应的uid搜索组件[${config.toUid}]`)
        }

        searchContext.getFormContext().resetFields();
        if(config.toUid == CoreConsts.PrimarySearchRef) {
            this.queryByFunc(); // 重置之后, 重新刷新列表
        }
    }

    /**
     * excel导出
     * @param config {Config}
     */
    this.excelExport = function (config) {
        let searchContext = this.getViewContext().getContextByUid(config.toUid);
        if(searchContext == null) {
            return console.warn(`未找到对应uid的可搜索组件[${config.toUid}]`)
        } else {
            if(searchContext.uid.startsWith("Primary")) {
                searchContext = this.getPrimarySearchContext();
            } else if(!(searchContext instanceof SearchContext)) {
                return console.warn(`未找到对应uid的可编辑组件[${config.toUid}]`)
            }
        }

        let model = searchContext.getModel();
        let {fileName} = this.getConfigParams(config, model);
        this.getRequestMethod(config)(config.url, model, {responseType: 'blob'}).then(resp => {
            let blob = new Blob([resp.data], {
                type: "application/vnd.ms-excel;charset=utf-8"
            });

            let downloadElement = document.createElement("a");
            let href = window.URL.createObjectURL(blob); //创建下载的链接
            downloadElement.href = href;
            downloadElement.download = fileName || decodeURI(resp
                .headers["content-disposition"].split("filename=")[1]); //下载后文件名

            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象
        })
    }

    /**
     * excel excel导入
     * @param config {Config}
     */
    this.excelImport = function (config) {

    }

    /**
     * 其他功能的操作
     * @param config {Config}
     */
    this.otherFuncExec = function (config) { }

    /**
     * @param config
     * @return {Object}
     */
    this.getConfigParams = function (config, model) {
        if(config.params) {
            if(config.params instanceof Function) {
                return config.params(model);
            } else {
                return config.params;
            }
        } else {
            return {};
        }
    }

    /**
     * @param config {Config}
     * @return {Promise<AxiosResponse<any>>|*}
     */
    this.getRequestMethod = function (config) {
        if(config.method) {
            let method = config.method.toUpperCase();
            if(method == 'GET') return GET;
            else if(method == 'POST') return POST;
            else {
                console.warn(`请求方法目前只支持[GET、POST]`)
            }
        } else {
            return TypeMethodMaps.getInstance(config.func);
        }

        return POST;
    }

    /**
     * @return {SearchContext|*}
     */
    this.getPrimarySearchContext = function () {
        return this.getViewContext().getContextByUid(CoreConsts.PrimarySearchRef)
    }

    /**
     * 通过前缀获取搜索上下文
     * @param uid
     * @return {SearchContext}
     */
    this.getSearchContextByUid = function (uid) {
        let context = this.context.getContextByUid(uid);
        if(context instanceof SearchContext) {
            return context;
        } else {
            return console.warn(`未声明前缀为[${uid}]的搜索组件`)
        }
    }

    /**
     * @return {EditContext|*}
     */
    this.getPrimaryEditContext = function () {
        return this.getEditContextByUid(CoreConsts.PrimaryEditRef);
    }

    /**
     * 通过前缀获取编辑上下文
     * @param uid
     * @return {EditContext}
     */
    this.getEditContextByUid = function (uid) {
        return this.getViewContext().getContextByUid(uid);
    }

    /**
     * @return {TableContext|*}
     */
    this.getPrimaryTableContext = function () {
        return this.getViewContext().getContextByUid(CoreConsts.PrimaryTableRef);
    }

    /**
     * @param uid 元素的唯一id 如果空将返回主详情上下文对象
     * @return {DetailContext|*}
     */
    this.getPrimaryDetailContext = function (uid) {
        let contextById = this.context.getContextByUid(uid);
        if(contextById) {
            return contextById;
        } else {
            return console.warn(`查找不到id=${uid}的编辑上下文`)
        }

        if(!this.context.primaryDetailContext.isPrimary && import.meta.env.DEV) {
            console.warn("未声明标记为[primary]的详情组件")
        }

        return this.context.primaryDetailContext;
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
    this.uid = '';
    // 是否是主上下文
    this.isPrimary = false;
    // 查询地址
    this.queryUrl = null;
    // 存储UFuncBtn和UFuncTag组件的信息
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

        return funcMeta;
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
 * @param viewContext {ViewContext} 视图上下文
 * @constructor
 */
export function EditContext(viewContext) {
    // 用于关联各个组件(搜索、表格、详情)
    this.uid = null;
    // 当前打开类型(add or edit)
    this.openType = null;
    // 存储UFuncBtn和UFuncTag组件的信息
    this.funcMetas = {};

    // 获取功能组件配置
    this.getFunc = function (func) {
        return this.funcMetas[func.toUpperCase()];
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
                this.setLoading(true, CoreConsts.FormSpinSubmitTip);
                let $View = this.get$View();
                $View.getRequestMethod({func: 'submit'})(url, model).then(resp => {
                    let {code, message, data} = resp;
                    if(code == CoreConsts.SuccessCode) {
                        resolve(resp);
                        this.setVisible(false);
                        msgSuccess(message || CoreConsts.SubmitSuccessMsg);
                    } else {
                        msgError(message);
                        reject(message);
                    }
                }).catch(reason => reject(reason))
                    .finally(() => this.setLoading(false))
            }).catch(reason => {})
        })
    }

    // 修改加载状态
    this.setLoading = (status, tip) => {Unmount()};
    // 修改弹框状态(模态框或者抽屉框)
    this.setVisible = (status) => {Unmount()};
    // 异步打开弹框(模态框或者抽屉框) 等表单初始化完成
    this.asyncVisible = (row, isResetToInit) => Promise.reject("未挂载");

    /**
     * @return {FormContext | null}
     */
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
    this.uid = null;

    // 是否是主上下文
    this.isPrimary = false;
    // 在使用UFuncTag#data组件时, 将可以获取该值
    this.CurrentRow = null;

    this.pageSize = null;
    this.currentPage = null;
    // 存储UFuncBtn和UFuncTag组件的信息
    this.funcMetas = {};

    // 获取功能组件配置
    this.getFunc = function (func) {
        return this.funcMetas[func.toUpperCase()];
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
     * @see UFuncTag 必须设置data属性
     */
    this.getCurrentRow = function () {
        return this.CurrentRow || unUFuncTag();
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
    this.uid = '';
    // 是否是主上下文
    this.isPrimary = false;
    // 存储UFuncBtn和UFuncTag组件的信息
    this.funcMetas = {};

    // 获取功能组件配置
    this.getFunc = function (func) {
        return this.funcMetas[func.toUpperCase()];
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
    this.uidContextMaps = {} // 声明uid的上下文对象
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
     * 返回功能的唯一key
     * @return {String}
     */
    this.getRowKey = function () {
        return props.rowKey;
    }

    /**
     * 获取元数的id获取对应上下文
     * @param uid
     * @return {EditContext | TableContext | SearchContext | DetailContext}
     */
    this.getContextByUid = function (uid) {
        return this.uidContextMaps[uid];
    }

    /**
     * 增加上下文
     * @param uid
     * @param context
     */
    this.addContextByUid = function (uid, context) {
        if(uid && context) {
            if(!this.uidContextMaps[uid]) {
                this.uidContextMaps[uid] = context;
            } else {
                console.warn(`存在相同的uid[${uid}]`)
            }
        } else {

        }
    }
}


export function Config() {
    /**
     * 功能地址
     * @type {String}
     */
    this.url = null;
    /**
     * 功能参数
     * @type {Object | Function}
     */
    this.params = null;
    /**
     * 请求方法{get or post}
     * @type {String}
     */
    this.method = null;
    /**
     * 要操作的功能
     * @type {String}
     */
    this.func = null;
    /**
     * 要操作的uid组件
     * @type {String}
     */
    this.toUid = null;
    /**
     * 要操作的数据
     * @type {Object}
     */
    this.data = null;
}