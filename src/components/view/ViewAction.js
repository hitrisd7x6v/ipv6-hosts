import {FormContext} from "@/components/form/basic/FormContext";
import {confirm, msgError, msgSuccess, msgWarn} from "@/utils/message";
import {TypeMethodMaps} from "@/utils/MetaUtils";

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

    /**
     * 用来做表格的唯一标识, 编辑框的唯一id 等 一般用表的自增主键或者唯一键
     * @param rowKey 默认 id
     */
    this.setRowKey = function (rowKey) {
        this.context.rowKey = rowKey;
    }

    this.getRowKey = function () {
        return this.context.rowKey
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
     * 打开编辑框
     * @param callback 用来对数据进行处理
     */
    this.openForAdd = function (callback) {
        let editContext = this.getEditContext();

        if(editContext['isPrimary']) {
            editContext.asyncVisible().then((model) => {
                let initModel = editContext.getFormContext().getInitModel();
                if(callback instanceof Function) {
                    callback(initModel);
                }

                editContext.getFormContext().setEditModel(initModel);
            })
        } else {
            console.warn('未声明标记为[primary]的编辑组件')
        }
    }

    /**
     * 删除主表格记录
     * @param url 删除地址 必填
     * @param data 删除的数据 必填
     * @param confirmTitle 确认标题 非必填
     * @param confirmContext 确认内容 非必填
     * @return Promise
     */
    this.del = function (url, data, confirmTitle, confirmContext) {
        if(!url) {
            return Promise.reject("未指定删除的地址[url]或者删除的记录[data]")
        }

        if(!data) {
            msgWarn("未选择要删除的记录")
            return Promise.reject("未选择要删除的记录");
        }

        let title = confirmTitle || "删除确认";
        let context = confirmContext || "确定删除数据吗？"
        return new Promise((resolve, reject) => {
            try {
                confirm({
                    title, context, onOk: () => {
                        TypeMethodMaps.Del(url, data).then(({code, message, data}) => {
                            if (code == 200) {
                                resolve(data);
                                msgSuccess(message || "删除成功");
                            } else {
                                reject(message)
                                msgError(message);
                            }
                        }).catch(reason => {
                            reject(reason);
                        })
                    }, onCancel: () => reject("取消")
                })
            } catch (e) {
                reject(e);
            }
        })

    }

    /**
     *  通过{@link IvzFuncTag}删除按钮点击删除, 默认提交rowKey的数组
     * @param url 删除地址 必填
     * @param confirmTitle 确认标题 非必填
     * @param confirmContext 确认内容 非必填
     */
    this.delByFuncTag = function (url, confirmTitle, confirmContext) {
        let rowKey = this.getRowKey(), data = {};
        let currentRow = this.getTableContext().getCurrentRow();
        data[rowKey] = currentRow[rowKey]

        return this.del(url, data, confirmTitle, confirmContext);
    }

    /**
     * 批量删除主表格选中的数据
     * @param url 删除地址
     * @param confirmTitle 删除的确认标题
     * @param confirmContext 删除的确认内容
     */
    this.batchDel = function (url, confirmTitle, confirmContext) {
        let tableContext = this.getTableContext();
        if(tableContext == null) {
            return Promise.reject("未声明标记为[primary]的表组件");
        }

        let selectedRowKeys = tableContext.getSelectedRowKeys();
        return this.del(url, selectedRowKeys, confirmTitle, confirmContext);
    }

    /**
     * 打开主编辑框
     * url > data
     * @param url 编辑数据地址
     * @param data 编辑数据
     */
    this.openForEdit = function (url, data) {
        if(!data && !url) {
            return console.error("未指定要编辑数据的[url or data]")
        }

        let editContext = this.getEditContext();

        if(editContext['isPrimary']) {
            if(url) {
                editContext.asyncVisible().then(() => {
                    editContext.setLoading(true);
                    TypeMethodMaps.Edit(url, data).then(({code, message, data}) => {
                        if(code == 200) {
                            editContext.getFormContext().setEditModel(data);
                        } else {
                            msgError(message);
                        }
                    }).finally(() => editContext.setLoading(false))
                })
            } else {
                editContext.asyncVisible().then(() => {
                    editContext.getFormContext().setEditModel(data);
                })
            }
        } else {
            console.warn('没有声明[primary]的编辑组件')
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
        if(!searchContext.isPrimary) {
            return console.warn("未声明标记为[primary]的搜索组件");
        }

        if(!url) {
            return console.error("未指定查询地址[url]")
        }

        let tableContext = this.getTableContext();
        if(!tableContext.isPrimary) {
            return console.warn("未声明标记为[primary]的表组件")
        }

        let model = searchContext.getModel();
        tableContext.setLoading(true);
        TypeMethodMaps.View(url, model).then(({code, message, data}) => {
            if(code == 200) {
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
     * 隐藏主编辑框
     */
    this.cancel = function () {
        let editContext = this.getEditContext();
        if(!editContext.isPrimary) {
            return console.warn("未声明标记为[primary]的编辑组件")
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
     * @param expandedRowKeys 要展开的行的key列表 不指定则展开所有
     */
    this.expanded = function (expandedRowKeys) {
        let tableContext = this.getTableContext();
        if(!tableContext.isPrimary) {
            return console.warn("未声明标记为[primary]的表组件")
        }

        tableContext.expanded(expandedRowKeys);
    }
    /**
     * 提交主编辑表单
     * @param url 编辑地址
     * @return Promise
     */
    this.submit = function (url) {
        if(!url) {
            return Promise.reject("未指定提交地址[url]");
        }

        let editContext = this.getEditContext();
        if(!editContext.isPrimary) {
            return Promise.reject("未声明标记为[primary]的编辑组件");
        }

        return new Promise((resolve, reject) => {
            try {
                editContext.getFormContext().validate().then(() => {
                    let model = editContext.getModel();
                    editContext.setLoading(true);
                    TypeMethodMaps.Submit(url, model).then(({code, message, data}) => {
                        if (code == 200) {
                            msgSuccess("数据提交成功");
                            editContext.setVisible(false);
                            resolve(data);
                        } else {
                            msgError(message);
                            reject(message);
                        }
                    }).catch(reason => {
                        reject(reason)
                    }).finally(() => editContext.setLoading(false))
                }).catch(reason => {
                    reject(reason)
                })
            } catch (e) {
                reject(e);
            }
        })
    }

    /**
     * 重置主编辑表单
     */
    this.resetEditModel = function () {
        let editContext = this.getEditContext();
        if(!editContext.isPrimary) {
            return console.warn("未声明标记为[primary]的编辑组件")
        }

        editContext.getFormContext().resetFields();
    }

    /**
     * 重置主搜索表单
     */
    this.resetSearchModel = function () {
        let searchContext = this.getSearchContext();
        if(!searchContext.isPrimary) {
            return console.warn("未声明标记为[primary]的搜索组件")
        }

        searchContext.getFormContext().resetFields();
    }

    // this.import = importAction;
    // this.export = exportAction;

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

        return this.context.primarySearchContext;
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

        return this.context.primaryEditContext;
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

        return this.context.primaryTableContext;
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
    // 是否是主上下文
    this.isPrimary = false;

    this.getModel = function () {
        return this.getFormContext().getEditModel();
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
    // 是否是主上下文
    this.isPrimary = false;

    this.getModel = function () {
        return this.getFormContext().getEditModel();
    }

    this.setModel = function (model) {
        this.getFormContext().setEditModel(model);
    }

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
                TypeMethodMaps.Submit(url, model).then(({code, message, data}) => {
                    if(code == 200) {
                        this.setVisible(false);
                        msgSuccess(message || "提交成功");
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
    this.setLoading = (status) => {};
    // 设置加载文本
    this.setLoadingTip = (tip) => {};
    // 修改弹框状态(模态框或者抽屉框)
    this.setVisible = (status) => {};
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
    // 是否是主上下文
    this.isPrimary = false;
    // 在使用IvzFuncTag#data组件时, 将可以获取该值
    this.CurrentRow = null;

    this.del = function (url, data) {}

    /**
     * 展开行
     * @param expandedRowKeys 要展开的行key, 不传则展开所有行
     */
    this.expanded = (expandedRowKeys) => {};

    /**
     * 获取当前点击的行
     * 使用此方法必须在表格的操作栏里面使用以下组件作为功能按钮
     * @see IvzFuncTag 必须设置data属性
     */
    this.getCurrentRow = function () {
        return this.CurrentRow || unIvzFuncTag();
    }

    /**
     * 获取当前选中的行的key列表
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
    // 是否是主上下文
    this.isPrimary = false;

    this.get$View = function () {
        // viewContext['__$View'] 不可能为空, 为空说明异常
        return viewContext['__$View'] || new $View(null);
    }
}
/**
 * 视图上下文
 * @constructor
 */
export function ViewContext () {
    this.rowKey = "id";
    this.name = ""; // 视图名称
    this.IdContextMaps = {}

    this.funMetasContext = new FuncMetaContext(this);

    this.primaryEditContext = new EditContext(this);
    this.primaryTableContext = new TableContext(this);
    this.primaryDetailContext = new DetailContext(this);
    this.primarySearchContext = new SearchContext(this);



    /**
     * 获取元数的id获取对应上下文
     * @param id
     * @return {*}
     */
    this.getContextById = function (id) {
        return this.IdContextMaps[id];
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
            } else {

            }
        } else {

        }
    }
}
