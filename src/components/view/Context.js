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
    this.openForAdd = function ({eid, data}) {
        let editContext = this.getViewContext().getContextByUid(eid);
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
         , config: {method, confirmTitle, confirmContext}}) {

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
            this.getRequestMethod({func, method})(url, data).then(({code, message, data}) => {
                if (code == CoreConsts.SuccessCode) {
                    msgSuccess(message || CoreConsts.DelSuccessMsg);
                    let tableContext = this.getTableContextByUid(tid);
                    let searchContext = this.getSearchContextByUid(sid);
                    if(searchContext && tableContext) {
                        this.queryByFunc(sid); // 删除成功, 重新刷新列表
                    }
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
        let tableContext = this.getTableContextByUid(config.tid);
        if(tableContext == null) {
            return console.error(`未找到对应uid的表组件[${config.tid}]`)
        }

        config.data = tableContext.getSelectedRowKeys();
        this.del(config);
    }

    /**
     * 打开编辑框
     * @param param {Config}
     */
    this.openForEdit = function ({eid, url, data
         , func, config: {method}}) {
        let editContext = this.getViewContext().getContextByUid(eid);
        if(editContext == null) {
            return console.warn(`未找到对应uid的可编辑组件[${eid}]`)
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
        , config: {pid, id}}) {
        if(!pid) {
            return console.error(`child子功能必须在[config]指定属性pid`)
        }

        let editContext = this.getViewContext().getContextByUid(eid);
        if(editContext == null) {
            return console.warn(`未找到对应uid的可编辑组件[${eid}]`)
        }

        // 打开编辑框并且是指pid
        editContext.asyncVisible(data, true).then(edit => {
            let initModel = editContext.getFormContext().getInitModel();
            // 设置pid
            initModel[pid] = data[id || this.getRowKey()];
            editContext.getFormContext().setEditModel(initModel)
            edit.$emit(initModel);
        })
    }

    /**
     * 设置其他功能 比如：设置密码
     * @param param {Config}
     */
    this.openForSet = function ({eid, data
        , config: {copy}}) {
        if(copy == null) {
            return console.error(`set子功能必须在[config]指定属性copy: ['id', 'name', ...]}; copy指定要复制哪些字段到编辑对象`)
        }

        if(copy instanceof String) {
            copy = [copy];
        }

        let editContext = this.getViewContext().getContextByUid(eid);
        if(editContext == null) {
            return console.warn(`未找到对应uid的可编辑组件[${eid}]`)
        }

        // 打开编辑框后复制对应的字段到新的model
        editContext.asyncVisible(data, true).then(edit => {
            let initModel = editContext.getFormContext().getInitModel();
            // 复制属性
            copy.forEach(field => {
                initModel[field] = data[field];
            })
            editContext.getFormContext().setEditModel(initModel)
            edit.$emit(initModel);
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

        let contextByUid = this.getSearchContextByUid(uid);
        if(contextByUid != null) {
            let queryFunc = contextByUid.getFunc(CoreConsts.FuncNameMeta.QUERY)
            if(queryFunc != null) {
                queryFunc.trigger()
            }
        }
    }

    /**
     * 查询主表格数据
     * @param config {Config}配置信息
     */
    this.query = function ({sid, tid, url, func
           , config: {method}}) {
        let searchContext = this.getViewContext().getContextByUid(sid);
        if(searchContext == null) {
            return console.warn(`未找到对应uid的搜索组件[${sid}]`)
        }

        let tableContext = this.getViewContext().getContextByUid(tid);
        if(tableContext == null) {
            return console.warn(`未找到对应uid的表组件[${tid}]`)
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
    this.cancel = function ({eid}) {
        let editContext = this.getViewContext().getContextByUid(eid);
        if(!(editContext instanceof EditContext)) {
            return console.warn(`未找到对应的uid可编辑组件[${eid}]`)
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
    this.expanded = function ({tid}, expandedRowKeys) {
        let tableContext = this.getTableContextByUid(tid);
        if(tableContext == null) {
            return console.warn(`未找到对应uid的表组件[${tid}]`)
        }

        tableContext.expanded(expandedRowKeys);
    }
    /**
     * 提交主编辑表单
     * @param config {Config}
     * @return void
     */
    this.submit = function ({eid, sid, url
        , func, config: {method}}) {
        let editContext = this.getViewContext().getContextByUid(eid);
        if(!(editContext instanceof EditContext)) {
            return console.warn(`未找到对应的uid可编辑组件[${eid}]`)
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
                        this.queryByFunc(sid);
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
    this.resetEditModel = function ({eid}) {
        let editContext = this.getViewContext().getContextByUid(eid);
        if(!(editContext instanceof EditContext)) {
            return console.warn(`未找到对应的uid可编辑组件[${eid}]`)
        }

        this.initEditComponent(editContext);
        let editModel = editContext.getFormContext().getEditModel();
        // 编辑时需要重新获取详情
        if(this.isEdit(editModel)) {
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
    }

    /**
     * 重置搜索表单
     * @param config {Config}
     */
    this.resetSearchModel = function ({sid, tid}) {
        let searchContext = this.getViewContext().getContextByUid(sid);
        if(!(searchContext instanceof SearchContext)) {
            return console.warn(`未找到对应uid的搜索组件[${sid}]`)
        }

        searchContext.getFormContext().resetFields();
        // 如果表组件存在则重新刷新列表
        let tableContextByUid = this.getTableContextByUid(tid);
        if(tableContextByUid != null) {
            this.queryByFunc(sid);
        }
    }

    /**
     * excel导出
     * @param params {Config}
     */
    this.excelExport = function ({sid, url, func
         , config: {fileName}}) {
        let searchContext = this.getViewContext().getContextByUid(sid);
        if(searchContext == null) {
            return console.warn(`未找到对应uid的可搜索组件[${sid}]`)
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
     * 其他功能的操作
     * @param config {Config}
     */
    this.otherFuncExec = function (config) { }

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
     * @return {null | SearchContext}
     */
    this.getSearchContextByUid = function (uid) {
        let context = this.getViewContext().getContextByUid(uid);
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

    /**
     * @type {{String: EditContext | DetailContext | SearchContext | TableContext}}
     */
    this.uidContextMaps = {} // 声明uid的上下文对象
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
                console.warn(`已经存在同名的uid[${uid}]`)
            }
        } else {
            console.error(`新增Context失败, 错误的参数[uid or context]`)
        }
    }
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