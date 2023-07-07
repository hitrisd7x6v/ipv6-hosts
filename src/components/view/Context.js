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
let env = import.meta.env;
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
    this.openForAdd = function ({eid, data, context}) {
        let linkContext = context.getLinkContext();
        let editContext = linkContext.getChildrenContext(eid);
        if(editContext == null) {
            return console.warn(`未找到对应uid的可编辑组件[${eid}]`)
        }

        try {
            editContext.openType = 'add';
            editContext.asyncVisible(data, true).then((edit) => {
                let formContext = editContext.getFormContext();
                let initModel = formContext.getInitModel();

                formContext.setEditModel(initModel);
                edit.$emit('edit', initModel);
            })
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * 删除主表格记录
     * @param param {Config}
     * @return void
     */
    this.del = function ({url, data, func, sid, tid
         , config: {method, confirmTitle, confirmContext}, context}) {

        let linkContext = context.getLinkContext();
        let tableContext = linkContext.getChildrenContext(tid);
        // 删除按钮在搜索组件上面
        if(context instanceof SearchContext && tableContext) {
            let selectedRows = tableContext.getSelectedRows();
            if(selectedRows != null) {
                data = selectedRows.map(row => row[this.getRowKey()]);
            }
        } else if(typeof data == 'object') {
            data = [data[this.getRowKey()]];
        }

        if(!data || data.length == 0) {
            return msgWarn("请选择要删除的记录");
        }
        let title = confirmTitle || CoreConsts.DelConfirmTitle;
        let content = confirmContext || CoreConsts.DelConfirmContent;

        confirm({title, content, onOk: () => {
            this.getRequestMethod({func, method})(url, data).then(({code, message, data}) => {
                if (code == CoreConsts.SuccessCode) {
                    msgSuccess(message || CoreConsts.DelSuccessMsg);
                    let searchContext = linkContext.getChildrenContext(sid);
                    if(searchContext && tableContext) {
                        this.queryByFunc(linkContext.uid, sid); // 删除成功, 重新刷新列表
                    }
                } else {
                    msgError(message);
                }
            }).catch(reason => console.error(reason))
            }, onCancel: () => null
        })
    }

    /**
     * 打开编辑框
     * @param param {Config}
     */
    this.openForEdit = function ({eid, url, data
         , func, config: {method}, context}) {
        let linkContext = context.getLinkContext();
        let editContext = linkContext.getChildrenContext(eid);
        if(editContext == null) {
            return console.warn(`未找到对应uid的可编辑组件[${linkContext.uid}:${eid}]`)
        }

        editContext.openType = 'edit';
        editContext.asyncVisible(data, false).then((edit) => {
            editContext.setLoading(true, CoreConsts.FormSpinLoadingTip);
            let params = this.getEditUrl(data, editContext);
            this.getRequestMethod({func, method})(url, params)
                .then(({code, message, data}) => {
                    if(code == CoreConsts.SuccessCode) {
                        editContext.getFormContext().setEditModel(data);
                        edit.$emit('edit', data);
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
     * @param param {Config}
     */
    this.openForChild = function ({eid, data
        , config: {pid, id}, context}) {
        if(!pid) {
            return console.error(`child子功能必须在[config]指定属性pid`)
        }

        let linkContext = context.getLinkContext();
        let editContext = linkContext.getChildrenContext(eid);
        if(editContext == null) {
            return console.warn(`未找到对应uid的可编辑组件[${linkContext.uid}:${eid}]`)
        }

        // 打开编辑框并且复制pid字段
        editContext.asyncVisible(data, true).then(edit => {
            let initModel = editContext.getFormContext().getInitModel();
            // 设置pid
            initModel[pid] = data[id || this.getRowKey()];
            editContext.getFormContext().setEditModel(initModel)
            edit.$emit('edit', initModel);
        })
    }

    /**
     * 设置其他功能 比如：设置密码
     * @param param {Config}
     */
    this.openForSet = function ({eid, data
        , config: {copy}, context}) {

        if(eid == CoreConsts.DefaultEditUid && env.DEV) {
            console.warn(`set子功能的eid[${eid}]和默认eid[${CoreConsts.DefaultEditUid}]一致, 请确认是否使用默认编辑组件`)
        }

        if(copy == null) {
            return console.error(`set子功能必须在[config]指定属性copy: ['id', 'name', ...]}; copy指定要复制哪些字段到编辑对象`)
        }

        if(copy instanceof String) {
            copy = [copy];
        }

        let linkContext = context.getLinkContext();
        let editContext = linkContext.getChildrenContext(eid);
        if(editContext == null) {
            return console.warn(`未找到对应uid的可编辑组件[${linkContext.uid}:${eid}]`)
        }

        // 打开编辑框后复制对应的字段到新的model
        editContext.asyncVisible(data, true).then(edit => {
            let initModel = editContext.getFormContext().getInitModel();
            // 复制属性
            copy.forEach(field => {
                initModel[field] = data[field];
                if(env.DEV && data[field] === undefined) {
                    console.warn(`要copy的字段[${field}]在data里面不存在`)
                }
            })
            editContext.getFormContext().setEditModel(initModel)
            edit.$emit('edit', initModel);
        })
    }

    /**
     * 更具查询功能点查询
     * @param prefix ULinkView uid
     * @param uid 指定uid下的func
     */
    this.queryByFunc = function (prefix, uid) {
        if(!prefix || !uid) {
            return console.error(`请指定查询参数[prefix, uid]`);
        }

        let linkContext = this.getViewContext().getLinkContextByUid(prefix);
        if(linkContext != null) {
            let queryFunc = linkContext.getFuncByUid(uid, CoreConsts.FuncNameMeta.QUERY)
            if(queryFunc != null) {
                queryFunc.trigger()
            }
        }
    }

    /**
     * 查询主表格数据
     * @param config {Config}配置信息
     */
    this.query = function ({sid, tid, url, context
                               , func, config: {method}}) {
        let linkContext = context.getLinkContext();
        let searchContext = linkContext.getChildrenContext(sid);
        if(searchContext == null) {
            return console.warn(`未找到对应uid的搜索组件[${linkContext.uid}:${sid}]`)
        }

        let tableContext = linkContext.getChildrenContext(tid);
        if(tableContext == null) {
            return console.warn(`未找到对应uid的表组件[${linkContext.uid}:${tid}]`)
        }

        let model = searchContext.getModel();
        if(tableContext.pageSize && tableContext.currentPage) {
            model[CoreConsts.PageSize] = tableContext.pageSize;
            model[CoreConsts.PageCurrent] = tableContext.currentPage;
        }

        tableContext.setLoading(true);
        this.getRequestMethod({func, method})(url, model).then(({code, message, data}) => {
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
    this.cancel = function ({eid, context}) {
        let linkContext = context.getLinkContext();
        let editContext = linkContext.getChildrenContext(eid);
        if(!(editContext instanceof EditContext)) {
            return console.warn(`未找到对应的uid可编辑组件[${linkContext.uid}:${eid}]`)
        }

        // 关闭编辑框
        editContext.setVisible(false);
        this.initEditComponent(editContext);
    }
    /**
     * 展开树形的表格
     * @param config {Config}
     * @param expandedRowKeys 要展开的行的key列表 不指定则展开所有
     */
    this.expanded = function ({tid, context}, expandedRowKeys) {
        let linkContext = context.getLinkContext();
        let tableContext = linkContext.getChildrenContext(tid);
        if(tableContext == null) {
            return console.warn(`未找到对应uid的表组件[${linkContext.uid}:${tid}]`)
        }

        tableContext.expanded(expandedRowKeys);
    }
    /**
     * 提交主编辑表单
     * @param config {Config}
     * @return void
     */
    this.submit = function ({eid, sid, url
        , func, config: {method}, context}) {
        let linkContext = context.getLinkContext();
        let editContext = linkContext.getChildrenContext(eid);
        if(!(editContext instanceof EditContext)) {
            return console.warn(`未找到对应的uid可编辑组件[${linkContext.uid}:${eid}]`)
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
            this.getRequestMethod({method, func})(url, model).then(({code, message, data}) => {
                if (code == CoreConsts.SuccessCode) {
                    msgSuccess(CoreConsts.SubmitSuccessMsg);
                    editContext.setVisible(false);
                    if(sid != null) {// 提交数据之后重新刷新列表
                        this.queryByFunc(linkContext.uid, sid);
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
    this.resetEditModel = function ({eid, context}) {
        let linkContext = context.getLinkContext();
        let editContext = linkContext.getChildrenContext(eid);
        if(!(editContext instanceof EditContext)) {
            return console.warn(`未找到对应的uid可编辑组件[${linkContext.uid}:${eid}]`)
        }

        this.initEditComponent(editContext);
        let editModel = editContext.getFormContext().getEditModel();
        // 编辑时需要重新获取详情
        if(this.isEdit(editModel)) {
            let editFunc = linkContext.getFunc(FuncNameMeta.EDIT);
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
    }

    /**
     * 重置搜索表单
     * @param config {Config}
     */
    this.resetSearchModel = function ({sid, tid, context}) {
        let linkContext = context.getLinkContext();
        let searchContext = linkContext.getChildrenContext(sid);
        if(!(searchContext instanceof SearchContext)) {
            return console.warn(`未找到对应uid的搜索组件[${linkContext.uid}:${sid}]`)
        }

        searchContext.getFormContext().resetFields();
        // 如果表组件存在则重新刷新列表
        let tableContext = linkContext.getChildrenContext(tid);
        if(tableContext != null) {
            this.queryByFunc(linkContext.uid, sid);
        }
    }

    /**
     * 需要确认的请求操作
     * @param params {Config}
     */
    this.confirm = function ({url, sid, data, context
         , func, config: {confirmTitle, confirmContent, method}}) {
        let linkContext = context.getLinkContext();
        let title = confirmTitle || CoreConsts.DefaultConfirmTitle;
        let content = confirmContent || CoreConsts.DefaultConfirmContent;

        confirm({title, content, onOk: () => {
                this.getRequestMethod({func, method})(url, data).then(({code, message, data}) => {
                    if (code == CoreConsts.SuccessCode) {
                        msgSuccess(message || CoreConsts.DefaultExecSuccess);
                        let searchContext = linkContext.getChildrenContext(sid);
                        if(searchContext) {
                            this.queryByFunc(linkContext.uid, sid); // 删除成功, 重新刷新列表
                        }
                    } else {
                        msgError(message);
                    }
                }).catch(reason => console.error(reason))
            }, onCancel: () => null
        })
    }

    /**
     * excel导出
     * @param params {Config}
     */
    this.excelExport = function ({sid, url, func
         , config: {fileName}, context}) {
        let linkContext = context.getLinkContext();
        let searchContext = linkContext.getChildrenContext(sid);
        if(searchContext == null) {
            return console.warn(`未找到对应uid的可搜索组件[${linkContext.uid}:${sid}]`)
        }

        let model = searchContext.getModel();
        this.getRequestMethod({func, method})(url, model, {responseType: 'blob'}).then(resp => {
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
     * 其他功能的执行操作
     * 如果需要确认请用：func='confirm'
     * @param config {Config}
     */
    this.otherFuncExec = function ({func, data, url
               , sid, config: {method}, context}) {
        let linkContext = context.getLinkContext();
        this.getRequestMethod({func, method})(url, data).then(({code, message, data}) => {
            if (code == CoreConsts.SuccessCode) {
                msgSuccess(message || CoreConsts.DefaultExecSuccess);
                let searchContext = linkContext.getChildrenContext(sid);
                if(searchContext) {
                    this.queryByFunc(linkContext.uid, sid); // 执行成功, 重新刷新列表
                }
            } else {
                msgError(message);
            }
        }).catch(reason => console.error(reason))
    }

    /**
     *  重置编辑组件[FormModal、FormDrawer]
     * @param editContext {EditContext}
     */
    this.initEditComponent = function (editContext) {
        let submit = editContext.getFunc(FuncNameMeta.SUBMIT);
        if(submit) {
            submit.setLoading(false);
        }

        editContext.setLoading(false)
        // 移除所有的校验
        editContext.getFormContext().clearValidate();
    }

    /**
     * @param config {{method: (Config.method|String), func: (Config.func|String)}}
     * @return {Promise<AxiosResponse<any>>|*}
     */
    this.getRequestMethod = function (config) {
        if(config.method) {
            let method = config.method.toUpperCase();
            if(method == 'GET') return GET;
            else if(method == 'POST') return POST;
            else {
                console.warn(`请求方法目前只支持[GET、POST], 默认POST`)
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
     * @param prefix ULinkView uid
     * @return {null | SearchContext}
     */
    this.getSearchContextByUid = function (prefix, uid) {
        let context = this.getViewContext().getContextByPrefixAndUid(prefix, uid);
        if(context == null) {
            return context;
        } else if(!(context instanceof SearchContext)) {
            console.error(`此uid[${uid}]不是搜索组件`)
            return null;
        } else {
            return context;
        }
    }

    /**
     * @param uid
     * @return {null|TableContext}
     */
    this.getTableContextByUid = function (uid) {
        let context = this.getViewContext().getContextByUid(uid);
        if(context == null) {
            return context;
        } else if(!(context instanceof TableContext)) {
            console.error(`此uid[${uid}]不是表组件`)
            return null;
        } else {
            return context;
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
        let contextByUid = this.context.getContextByUid(uid);
        if(contextByUid == null) {
            return contextByUid;
        } else if(!(contextByUid instanceof DetailContext)) {
            console.warn(`此uid[${uid}不是DetailContext对象]`);
        } else {
            return contextByUid;
        }
    }
}

/**
 * 功能元数据对象
 * @constructor
 */
export function FuncMetaContext(editFunMetas, tableFunMetas, searchFunMetas) {

    this.queryFunc = [];
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
 * @param linkContext {LinkContext}
 * @constructor
 */
export function SearchContext(linkContext) {
    // 用于关联各个组件(表格、编辑、详情)
    this.uid = '';
    // 存储UFuncBtn和UFuncTag组件的信息
    this.funcMetas = {};

    /**
     * @param func
     * @return {FuncConfig | null}
     */
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
        linkContext.registerFunc(config);
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
    /**
     * @return {FormContext}
     */
    this.getFormContext = () => new FormContext();
    /**
     * @return {LinkContext}
     */
    this.getLinkContext = () => linkContext;

    this.get$View = function () {
        // viewContext['__$View'] 不可能为空, 为空说明异常
        return this.getLinkContext().getViewContext()['__$View'] || new $View(null);
    }

}


/**
 * 编辑
 * @param linkContext {LinkContext} 属于哪个容器
 * @constructor
 */
export function EditContext(linkContext) {
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
        linkContext.registerFunc(config);
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
     * @return {LinkContext}
     */
    this.getLinkContext = () => linkContext;
    /**
     * @returns {$View}
     */
    this.get$View = function () {
        // viewContext['__$View'] 不可能为空, 为空说明异常
        return this.getLinkContext().getViewContext()['__$View'] || new $View(null);
    }
}

/**
 * 表格组件{UTable | UEditTable}上下文对象
 * @param linkContext ULinkView组件上下文对象
 * @constructor
 */
export function TableContext(linkContext) {
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

    /**
     * @return {Array | null}
     */
    this.getColumns = () => null;

    this.regFunc = function (func, config) {
        this.funcMetas[func] = config;
        linkContext.registerFunc(config);
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
     * @return {LinkContext}
     */
    this.getLinkContext = () => linkContext;

    /**
     * 获取当前页面视图
     * @returns {$View}
     */
    this.get$View = function () {
        // viewContext['__$View'] 不可能为空, 为空说明异常
        return this.getLinkContext().getViewContext()['__$View'] || new $View(null);
    }

    /**
     * 粘表头
     * @param status {Boolean}
     */
    this.setSticky = (status) => {}

    /**
     * 设置表格的加载状态
     * @param tip {String}
     * @param status {Boolean}
     */
    this.setLoading = (status, tip) => {};

    /**
     * 设置数据源
     * @param dataSource {Boolean}
     */
    this.setDataSource = (dataSource) => {};
}

/**
 * 详情
 * @param linkContext {LinkContext}
 * @constructor
 */
export function DetailContext(linkContext) {
    // 用于关联各个组件(搜索、编辑、表格)
    this.uid = '';

    // 存储UFuncBtn和UFuncTag组件的信息
    this.funcMetas = {};

    // 获取功能组件配置
    this.getFunc = function (func) {
        return this.funcMetas[func.toUpperCase()];
    }
    this.regFunc = function (func, config) {
        this.funcMetas[func] = config;
        linkContext.registerFunc(config);
    }
    /**
     * @return {LinkContext}
     */
    this.getLinkContext = () => linkContext;

    this.get$View = function () {
        // viewContext['__$View'] 不可能为空, 为空说明异常
        return linkContext.getViewContext()['__$View'] || new $View(null);
    }
}
/**
 * 视图上下文
 * @constructor
 */
export function ViewContext(props) {

    /**
     * @type {{String: EditContext | DetailContext | SearchContext | TableContext}}
     */
    this.uidContextMaps = {} // 声明fullUid的上下文对象
    /**
     * 组合容器组件上下文对象列表
     * @type {{'prefix:uid': LinkContext}}
     */
    this.linkContextMaps = {}

    this.funMetasContext = new FuncMetaContext();

    /**
     * 获取指定功能
     * @param func {String}
     */
    this.getFunc = function (func) {
        let values = Object.values(this.uidContextMaps);
        for (let item of values) {
            let funcValue = item.getFunc(func);
            if(funcValue != null) {
                return funcValue;
            }
        }

        return null;
    }

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
     * @param fullUid ${prefix}:${uid}
     * @return {EditContext | TableContext | SearchContext | DetailContext}
     */
    this.getContextByUid = function (fullUid) {
        return this.uidContextMaps[fullUid];
    }

    /**
     *
     * @param prefix ULinkView组件uid
     * @param uid 其他组件uid
     * @return {EditContext|TableContext|SearchContext|DetailContext}
     */
    this.getContextByPrefixAndUid = function (prefix, uid) {
        return this.getContextByUid(prefix + ":" + uid);
    }

    /**
     * 增加上下文
     * @param fullUid = prefix:uid
     * @param context {EditContext|TableContext|SearchContext|DetailContext}
     */
    this.addContextByUid = function (fullUid, context) {
        if(fullUid && context) {
            context.getLinkContext();
            if(!this.uidContextMaps[fullUid]) {
                this.uidContextMaps[fullUid] = context;
            } else {
                console.warn(`已经存在同名的组件[${fullUid}]`)
            }
        } else {
            console.error(`新增Context失败, 错误的参数[fullUid or context]`)
        }
    }

    /**
     * @param uid {String}
     * @param context {LinkContext}
     */
    this.addLinkContextByUid = function (uid, context) {
        if(!(context instanceof LinkContext)) {
            throw new Error(`参数错误[context]`)
        }

        if(this.linkContextMaps[uid]) {
            throw new Error(`uid为[${uid}]的ULinkView组件已经存在`)
        }

        this.linkContextMaps[uid] = context;
    }

    /**
     * @param uid ULinkView#uid
     * @return LinkContext
     */
    this.getLinkContextByUid = function (uid) {
        return this.linkContextMaps[uid];
    }
}

/**
 * 联动容器上下文
 * @param uid {String}
 * @param viewContext {ViewContext}
 * @constructor
 */
export function LinkContext(uid, viewContext) {
    /**
     * 容器标识前缀, 此uid将作为子组件的前缀
     * @type {String}
     */
    this.uid = uid;

    /**
     *  子组件的上下文对象
     * @type {{String: EditContext | TableContext | DetailContext | SearchContext}}
     */
    this.childContextMaps = {};

    /**
     * @type {Array<FuncConfig>}
     */
    this.queryFuncs = [];

    /**
     * @type {{string: FuncConfig}}
     */
    this.funcs = {};

    /**
     * 注册搜索功能
     * @param config {FuncConfig}
     */
    this.registerFunc = function (config) {
        let func = config.getFunc();
        let context = config.getContext();
        if(func == FuncNameMeta.QUERY) {
            this.queryFuncs.push(config);
        }

        this.funcs[context.uid+":"+func] = config;
    }

    /**
     * @param func
     * @return {FuncConfig}
     */
    this.getFunc = function (func) {
        return this.getFuncs(func)[0];
    }

    /**
     * @param uid
     * @param func
     * @return {FuncConfig}
     */
    this.getFuncByUid = function(uid, func) {
        return this.getFuncs(func).filter(item => item.getContext().uid = uid)[0];
    }

    /**
     * @param func
     * @return {FuncConfig[]}
     */
    this.getFuncs = function (func) {
        return Object.values(this.funcs).filter(item => item.getFunc() == func);
    }

    /**
     * @return {Array<FuncConfig>}
     */
    this.getQueryFunc = function () {
        return this.queryFuncs;
    }

    /**
     * 获取子组件的上下文对象
     * @param uid 子组件的uid
     * @return {EditContext | SearchContext | DetailContext | TableContext}
     */
    this.getChildrenContext = function (uid) {
        return this.childContextMaps[this.uid+":"+uid];
    }

    /**
     * 增加子组件上下文对象
     * @param childContext {EditContext | SearchContext | DetailContext | TableContext}
     */
    this.addChildrenContext = function (childContext) {
        if(!childContext.uid) {
            throw new Error(`组件不存在uid属性`)
        }

        let fullUid = this.uid + ":" + childContext.uid;
        if(!this.childContextMaps[fullUid]) {
            this.childContextMaps[fullUid] = childContext;
            this.getViewContext().addContextByUid(fullUid, childContext);
        } else {
            console.warn(`已经存在同名的组件[${fullUid}]`)
        }
    }

    /**
     * @return {ViewContext}
     */
    this.getViewContext = () => viewContext;

    viewContext.addLinkContextByUid(uid, this);
}
export function FuncConfig() {
    /**
     * @type {Function}
     * @return {String}
     */
    this.getUrl = null;

    /**
     * @return {String}
     */
    this.getFunc = () => null

    /**
     * @param key
     * @return {Object}
     */
    this.getProp = (key) => null;

    /**
     * @return {string}
     */
    this.getMethod = () => "";
    /**
     * @return {EditContext | DetailContext | SearchContext | TableContext}
     */
    this.getContext = () => null;
    /**
     * @return {null}
     */
    this.trigger = () => null

    /**
     * @param status {Boolean}
     */
    this.setLoading = status => null;
}
export function ChildConfig() {
    /**
     * @type {String}
     */
    this.method = null;
    /**
     * @type {String | Array}
     */
    this.copy = null;
    /**
     * @type {String | Number | *}
     */
    this.pid = null;

    /**
     * 确认标题
     * @type {String}
     */
    this.confirmTitle = null;

    /**
     * 确认内容
     * @type {String}
     */
    this.confirmContent = null;
}

export function Config() {
    /**
     * @see EditContext#uid
     * @type {String}
     */
    this.eid = null;
    /**
     * @see SearchContext#uid
     * @type {String}
     */
    this.sid = null;
    /**
     * @see TableContext#uid
     * @type {String}
     */
    this.tid = null;
    /**
     * @see DetailContext#uid
     * @type {String}
     */
    this.did = null;
    /**
     * @see LinkContext#uid
     * @type {SearchContext | DetailContext | TableContext | TableContext}
     */
    this.context = null;
    /**
     * 功能地址
     * @type {String}
     */
    this.url = null;
    /**
     * 功能参数
     * @type {ChildConfig}
     */
    this.config = null;

    /**
     * 要操作的功能
     * @type {String}
     */
    this.func = null;

    /**
     * 要操作的数据
     * @type {Object}
     */
    this.data = null;
}